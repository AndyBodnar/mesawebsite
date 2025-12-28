import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";

// Role configuration
const GUILD_ID = process.env.DISCORD_GUILD_ID || "";
const OWNER_ROLE_IDS = (process.env.DISCORD_OWNER_ROLE_IDS || "").split(",").filter(Boolean);
const ADMIN_ROLE_IDS = (process.env.DISCORD_ADMIN_ROLE_IDS || "").split(",").filter(Boolean);
const STAFF_ROLE_IDS = (process.env.DISCORD_STAFF_ROLE_IDS || "").split(",").filter(Boolean);

export type StaffRole = "owner" | "admin" | "staff" | "user";

// Fetch Discord guild member roles
async function getDiscordRoles(accessToken: string, userId: string): Promise<string[]> {
  if (!GUILD_ID) return [];

  try {
    // Fetch user's guild member data
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
  adapter: PrismaAdapter(db) as NextAuthOptions["adapter"],
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
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${profile.avatar.startsWith("a_") ? "gif" : "png"}`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(profile.discriminator) % 5}.png`,
          discordId: profile.id,
          role: 'MEMBER' as const,
          staffRole: 'user' as const,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // Check if user is in the guild and get their roles
      if (account?.access_token && GUILD_ID) {
        const roles = await getDiscordRoles(account.access_token, ((profile as any)?.id || ""));
        const staffRole = determineStaffRole(roles);

        // Store role in account for later use
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
      // Update user's staff role in database on each login
      if (account && user.id) {
        try {
          await db.user.update({
            where: { id: user.id },
            data: {
              staffRole: account.staffRole || "user",
            },
          });
        } catch (error) {
          // User might not exist yet or field might not exist
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
