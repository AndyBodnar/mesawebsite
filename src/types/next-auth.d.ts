import { User_role } from "@prisma/client";
import { DefaultSession } from "next-auth";

export type StaffRole = "owner" | "admin" | "staff" | "user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: User_role;
      discordId: string;
      staffRole: StaffRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: User_role;
    discordId: string;
    staffRole: StaffRole;
  }
}
