import {object, string} from "zod";

export const loginSchema = object({
    email: string({required_error: "El correo es requerido"})
    .email("El correo no es válido")
    .min(1, "El correo es requerido"),
    password: string({required_error: "La contraseña es requerida"})
    .min(1, "La contraseña es requerida")
    .min(4, "La contraseña debe tener al menos 6 caracteres")
    .max(20, "La contraseña no puede tener más de 20 caracteres"),
})