import { object, string, boolean } from "zod";
import { validate } from "rut.js"

export const loginSchema = object({
    email: string({ required_error: "El correo es requerido" })
        .email("El correo no es válido")
        .min(1, "El correo es requerido"),
    password: string({ required_error: "La contraseña es requerida" })
        .min(1, "La contraseña es requerida")
        .min(4, "La contraseña debe tener al menos 6 caracteres")
        .max(20, "La contraseña no puede tener más de 20 caracteres"),
})

interface RegisterProviderSchema {
    email: string;
    name: string;
    lastName: string;
    lastName2?: string;
    rut: string;
    password: string;
    confirmPassword: string;
}

export const registerProviderSchema = object({
    email: string()
        .email('Ingresa un correo electrónico válido')
        .min(1, 'El correo es requerido'),
    name: string()
        .min(1, 'El nombre es requerido')
        .max(50, 'El nombre no puede exceder los 50 caracteres'),
    lastName: string()
        .min(1, 'El apellido paterno es requerido')
        .max(50, 'El apellido no puede exceder los 50 caracteres'),
    lastName2: string()
        .optional(),
    rut: string()
        .min(1, 'El RUT es requerido')
    // .regex(/^[0-9]{1,2}(\.[0-9]{3}){2}-[0-9kK]{1}$/, 'Formato de RUT inválido (ej: 12.345.678-9)')
    // .refine((val) => validate(val), {
    //     message: "El RUT no es válido"
    // })
    ,
    password: string(),
    // .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    //         .max(50, 'La contraseña no puede exceder los 50 caracteres')
    //         .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
    //         .regex(/[a-z]/, 'Debe incluir al menos una letra minúscula')
    //         .regex(/[0-9]/, 'Debe incluir al menos un número'),
    confirmPassword: string()
    //         .min(1, 'La confirmación es requerida'),
    // }).refine((data: RegisterProviderSchema) => data.password === data.confirmPassword, {
    //     message: "Las contraseñas no coinciden",
    //     path: ["confirmPassword"],
});

export const addServiceSchema = object({
    serviceName: string()
        .min(1, 'El nombre del servicio es requerido')
        .max(100, 'El nombre no puede exceder los 100 caracteres'),
    description: string()
        .min(1, 'La descripción es requerida')
        .max(500, 'La descripción no puede exceder los 500 caracteres'),
    smallDescription: string()
        .min(1, 'La descripción es requerida')
        .max(500, 'La descripción no puede exceder los 500 caracteres'),
    price: string()
        .min(1, 'El precio es requerido')
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
            message: "El precio debe ser un número positivo"
        }),
    category: string()
        .min(1, 'La categoría es requerida'),
});

