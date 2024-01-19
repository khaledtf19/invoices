import type { Role, UserRole } from "@prisma/client";
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      userBalance: number;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  export interface User {
    role?: UserRole;
    userBalance?: number;
  }
}
