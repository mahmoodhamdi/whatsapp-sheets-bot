import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  checkAccountLocked,
  recordFailedAttempt,
  resetFailedAttempts,
} from "@/lib/security/lockout";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;

        // Check if account is locked
        const { isLocked } = await checkAccountLocked(email);
        if (isLocked) {
          throw new Error("ACCOUNT_LOCKED");
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          // Record failed attempt
          const { locked } = await recordFailedAttempt(email);
          if (locked) {
            throw new Error("ACCOUNT_LOCKED");
          }
          return null;
        }

        // Reset failed attempts on successful login
        await resetFailedAttempts(email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.emailVerified = user.emailVerified as boolean;
      }
      // Refresh emailVerified on session update
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { emailVerified: true },
        });
        if (dbUser) {
          token.emailVerified = dbUser.emailVerified;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).emailVerified = token.emailVerified as boolean;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
