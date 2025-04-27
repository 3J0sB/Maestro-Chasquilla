
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { loginSchema } from "./lib/zod"
import { getUserByEmail } from "../utils/getUserByEmail"
import { compare} from "bcrypt-ts";
import { error } from "console";

export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const {data, success} = loginSchema.safeParse(credentials)

        if (!success) {
          throw new Error("Invalid credentials 1")
        }

        const response = await fetch(`${process.env.NEXTAUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: data.email,
              password: data.password
            }),
          })

        const user = await response.json()
        

        if (!response.ok || !user) {
            throw new Error(user.error || "Invalid credentials 2")
          }

        return user;
        
      },
    }),

  ],
} satisfies NextAuthConfig