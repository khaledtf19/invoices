import type { Role, UserRole } from "@prisma/client";
import { type DefaultSession } from "next-auth";

// declare module "next-auth" {
//   /**
//    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     user?: {
//       id: string;
//       role: Role;
//       userBalance: number;
//     } & DefaultSession["user"];
//   }

//   interface User {
//     id: string;
//     role: Role;
//     userBalance: number;
//   }
// }
declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: {
      id: string;
      role?: UserRole;
      userBalance?: number;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  export interface User {
    role?: UserRole;
    userBalance?: number;
  }
}
