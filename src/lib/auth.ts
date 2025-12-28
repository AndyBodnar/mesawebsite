import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter, AdapterUser, AdapterAccount, AdapterSession } from "next-auth/adapters";
import { db } from "./db";

// Custom adapter wrapper to handle id and updatedAt fields
// Prisma schema has id String @id without auto-generation and updatedAt without default
function CustomPrismaAdapter(): Adapter {
  const prismaAdapter = PrismaAdapter(db) as Adapter;

  return {
    ...prismaAdapter,
    createUser: async (data: Omit<AdapterUser, "id">) => {
      try {
        console.log("[Auth] Creating user with data:", JSON.stringify(data, null, 2));
        const user = await db.user.create({
          data: {
            id: crypto.randomUUID(),
            name: data.name,
            email: data.email,
            emailVerified: data.emailVerified,
            image: data.image,
            discordId: (data as any).discordId || (data as any).id,
            updatedAt: new Date(),
          },
        });
        console.log("[Auth] User created:", user.id);
        return user as AdapterUser;
      } catch (error) {
        console.error("[Auth] Failed to create user:", error);
        throw error;
      }
    },
    linkAccount: async (data: AdapterAccount) => {
      try {
        console.log("[Auth] Linking account for user:", data.userId);
        await db.account.create({
          data: {
            id: crypto.randomUUID(),
            userId: data.userId,
            type: data.type,
            provider: data.provider,
            providerAccountId: data.providerAccountId,
            refresh_token: data.refresh_token,
            access_token: data.access_token,
            expires_at: data.expires_at,
            token_type: data.token_type,
            scope: data.scope,
            id_token: data.id_token,
            session_state: data.session_state as string | null,
          },
        });
        console.log("[Auth] Account linked successfully");
        return data;
      } catch (error) {
        console.error("[Auth] Failed to link account:", error);
        throw error;
      }
    },
    createSession: async (data: { sessionToken: string; userId: string; expires: Date }) => {
      try {
        console.log("[Auth] Creating session for user:", data.userId);
        const session = await db.session.create({
          data: {
            id: crypto.randomUUID(),
            sessionToken: data.sessionToken,
            userId: data.userId,
            expires: data.expires,
          },
        });
        console.log("[Auth] Session created:", session.id);
        return session as AdapterSession;
      } catch (error) {
        console.error("[Auth] Failed to create session:", error);
        throw error;
      }
    },
  };
}

// Role configuration
const GUILD_ID = process.env.DISCORD_GUILD_ID || "";
const OWNER_ROLE_IDS = (process.env.DISCORD_OWNER_ROLE_IDS || "").split(",").filter(Boolean);
const ADMIN_ROLE_IDS = (process.env.DISCORD_ADMIN_ROLE_IDS || "").split(",").filter(Boolean);
const STAFF_ROLE_IDS = (process.env.DISCORD_STAFF_ROLE_IDS || "").split(",").filter(Boolean);

export type StaffRole = "owner" | "admin" | "staff" | "user";

// Fetch Discord guild member roles
async function getDiscordRoles(accessToken: string): Promise<string[]> {
  if (!GUILD_ID) return [];

  try {
    const res = await fetch(
      `https://discord.com/api/v10/users/@me/guilds/${GUILD_ID}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch guild member:", res.status);
      return [];
    }

    const member = await res.json();
    return member.roles || [];
  } catch (error) {
    console.error("Error fetching Discord roles:", error);
    return [];
  }
}

// Determine staff role from Discord roles
function determineStaffRole(discordRoles: string[]): StaffRole {
  if (OWNER_ROLE_IDS.some(id => discordRoles.includes(id))) return "owner";
  if (ADMIN_ROLE_IDS.some(id => discordRoles.includes(id))) return "admin";
  if (STAFF_ROLE_IDS.some(id => discordRoles.includes(id))) return "staff";
  return "user";
}

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(),
  debug: true,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds guilds.members.read",
        },
      },
      profile(profile) {
        console.log("[Auth] Discord profile received:", profile.id, profile.username);
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${profile.avatar.startsWith("a_") ? "gif" : "png"}`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(profile.discriminator || "0") % 5}.png`,
          discordId: profile.id,
          role: 'MEMBER' as const,
          staffRole: 'user' as const,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      console.log("[Auth] signIn callback triggered");
      if (account?.access_token && GUILD_ID) {
        const roles = await getDiscordRoles(account.access_token);
        const staffRole = determineStaffRole(roles);
        account.staffRole = staffRole;
        account.discordRoles = roles;
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role || "user";
        session.user.discordId = user.discordId;
        session.user.staffRole = user.staffRole || "user";
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.staffRole = account.staffRole || "user";
        token.discordRoles = account.discordRoles || [];
      }
      return token;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log("[Auth] signIn event - updating staff role for user:", user.id);
      if (account && user.id) {
        try {
          await db.user.update({
            where: { id: user.id },
            data: {
              staffRole: account.staffRole || "user",
            },
          });
        } catch (error) {
          console.log("Could not update staff role:", error);
        }
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "database",
  },
};

// Helper to check if user has staff access
export function hasStaffAccess(staffRole: StaffRole): boolean {
  return ["owner", "admin", "staff"].includes(staffRole);
}

// Helper to check if user has admin access
export function hasAdminAccess(staffRole: StaffRole): boolean {
  return ["owner", "admin"].includes(staffRole);
}

// Helper to check if user is owner
export function isOwner(staffRole: StaffRole): boolean {
  return staffRole === "owner";
}
