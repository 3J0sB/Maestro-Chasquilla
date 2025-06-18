
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { loginSchema } from "./lib/zod"



export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { data, success } = loginSchema.safeParse(credentials)

        if (!success) {
          throw new Error("Email o contraseña inválidos")
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

        console.log('[AUTH.CONFIG-->]', user)
        if (!response.ok || !user) {
          throw new Error(user.error || "Invalid credentials 2")
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          lastName: user.lastName, 
          image: user.image
        };

      },
    }),

  ],
} satisfies NextAuthConfig