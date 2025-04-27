"use server"

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const loginAction  = async (email: string, password: string) => {
    try {
        await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            const cause = error.cause as any;
            return { error: cause?.err?.message || error.message || "Error de autenticación" };
        }
        return { error: "Error de autenticación" , status: 500};
    }
}
