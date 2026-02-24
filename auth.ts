import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string | null;
  }
  interface Session {
    user: {
      role: string;
      id: string;
    } & DefaultSession["user"];
  }
}

const prisma = new PrismaClient().$extends(withAccelerate());

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {
          type: "string",
          label: "Email",
        },
        password: {
          type: "string",
          label: "Password",
        },
      },
      authorize: async ({ email }) => {
        if (!email) return null;
        const user = await prisma.user.findUnique({
          where: {
            email: email as string,
          },
        });

        if (!user) return null;

        return {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
        token.role = user?.role;
      }
      return token;
    },
    session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        },
      };
    },
  },
  secret: process.env.AUTH_SECRET,
  // pages: { signIn: "/login" },
});
