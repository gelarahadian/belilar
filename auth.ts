import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth";
import bcrypt from "bcryptjs";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid email or password";
}

declare module "next-auth" {
  interface Session {
    user: {
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
      authorize: async ({ email, password }) => {
        let user = null;

        user = await prisma.user.findUnique({
          where: {
            email: email as string,
          },
          cacheStrategy: { ttl: 60 },
        });

        if (!user) {
          throw new InvalidLoginError();
        }

        if (typeof user.password !== "string") {
          throw new InvalidLoginError();
        }

        const valid = await bcrypt.compare(password as string, user.password);

        if (!valid) {
          throw new InvalidLoginError();
        }

        return {
          id: user.id,
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
      }
      return token;
    },
    session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
  },
  secret: process.env.AUTH_SECRET,
  // pages: { signIn: "/login" },
});
