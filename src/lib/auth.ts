import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { Adapter, AdapterUser, AdapterAccount, AdapterSession } from "next-auth/adapters";
import { db } from "./db";

// Custom adapter - PrismaAdapter uses lowercase relation names but our schema uses PascalCase
function CustomPrismaAdapter(): Adapter {
  return {
    createUser: async (data: Omit<AdapterUser, "id">) => {
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
      return user as AdapterUser;
    },
    getUser: async (id: string) => {
      const user = await db.user.findUnique({ where: { id } });
      return user as AdapterUser | null;
    },
    getUserByEmail: async (email: string) => {
      const user = await db.user.findUnique({ where: { email } });
      return user as AdapterUser | null;
    },
    getUserByAccount: async ({ providerAccountId, provider }) => {
      const account = await db.account.findUnique({
        where: {
          provider_providerAccountId: { provider, providerAccountId },
        },
        include: { User: true },
      });
      return (account?.User as AdapterUser) ?? null;
    },
    updateUser: async (data) => {
      const user = await db.user.update({
        where: { id: data.id },
        data: { ...data, updatedAt: new Date() },
      });
      return user as AdapterUser;
    },
    deleteUser: async (userId: string) => {
      await db.user.delete({ where: { id: userId } });
    },
    linkAccount: async (data: AdapterAccount) => {
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
      return data;
    },
    unlinkAccount: async ({ providerAccountId, provider }) => {
      await db.account.delete({
        where: { provider_providerAccountId: { provider, providerAccountId } },
      });
    },
    createSession: async (data: { sessionToken: string; userId: string; expires: Date }) => {
      const session = await db.session.create({
        data: {
          id: crypto.randomUUID(),
          sessionToken: data.sessionToken,
          userId: data.userId,
          expires: data.expires,
        },
      });
      return session as AdapterSession;
    },
    getSessionAndUser: async (sessionToken: string) => {
      const session = await db.session.findUnique({
        where: { sessionToken },
        include: { User: true },
      });
      if (!session) return null;
      const { User, ...sessionData } = session;
      return { session: sessionData as AdapterSession, user: User as AdapterUser };
    },
    updateSession: async (data) => {
      const session = await db.session.update({
        where: { sessionToken: data.sessionToken },
        data,
      });
      return session as AdapterSession;
    },
    deleteSession: async (sessionToken: string) => {
      await db.session.delete({ where: { sessionToken } });
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
      if (account && user.id) {
        try {
          await db.user.update({
            where: { id: user.id },
            data: { staffRole: account.staffRole || "user" },
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
