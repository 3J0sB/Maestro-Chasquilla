import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";


declare module "next-auth" {
    interface Session {
        user: {
            lastName?: string | undefined;
            role?: string | undefined;
        } & DefaultSession["user"]
    }

    interface User {
        lastName?: string;
        role?: string;
    }

}

declare module "next-auth/jwt" {
    interface JWT {
        lastName?: string;
        role?: string;
    }
}



