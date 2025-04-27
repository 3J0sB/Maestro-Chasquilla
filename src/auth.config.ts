import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
 
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("credentials", credentials)

        if (credentials.email !== "test@test.com") {
            throw new Error("Invalid email")
        }


        return{
            id: "1",
            name: "Test User",
            email: "test@test.com"
        }
      },
    }),

  ],
} satisfies NextAuthConfig