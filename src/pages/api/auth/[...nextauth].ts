import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "../../../env/server.mjs";
import { db } from "../../../server/db/client";
import NextAuth from "next-auth/next";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.userBalance = user.userBalance;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (
        account?.provider === "google" &&
        profile?.email &&
        env.EMAILS.split(", ").includes(profile.email)
      ) {
        return true;
      }
      return false; // Do different verification for other providers that don't have `email_verified`
    },
  },
  // Configure one or more authentication providers
  // eslint-disable-next-line
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions)
