import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import authConfig from "./auth.config"

 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  session: { strategy: "jwt", maxAge:  60 * 60, },
  callbacks: {
    jwt({ token, user }) {
      if (user) { 
        token.name = user.name;
        token.lastName = user.lastName;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
        if(session.user) {
          session.user.name = token.name;
          session.user.lastName = token.lastName;
          session.user.role = token.role;
          session.user.id = token.id as string;
        }
        return session;
    },
  },
})