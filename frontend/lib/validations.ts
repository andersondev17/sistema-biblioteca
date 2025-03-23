'use client'
import { z } from 'zod';

export const loginSchema = z.object({
    userName: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
})

export const registerSchema = z.object({
    userName: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    tipo: z.enum(["ADMINISTRADOR", "EMPLEADO"], {
        required_error: "Debe seleccionar un tipo de usuario"
    })
})
export const libroSchema = z.object({
    isbn: z.string().min(1, "ISBN es requerido"),
    editorial: z.string().min(1, "Editorial es requerida"),
    genero: z.string().min(1, "Género es requerido"),
    anoPublicacion: z.coerce.number().int().min(1000, "Año de publicación válido requerido"),
    autorCedula: z.string().min(1, "Cédula del autor es requerida"),
    cover: z.string().optional(),
});

export const autorSchema = z.object({
    cedula: z.string().min(5, "La cédula debe tener al menos 5 caracteres"),
    nombreCompleto: z.string().min(3, "El nombre completo debe tener al menos 3 caracteres"),
    nacionalidad: z.string().min(3, "La nacionalidad debe tener al menos 3 caracteres")
})

export const userSchema = z.object({
    userName: z.string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .max(50, "El nombre de usuario debe tener máximo 50 caracteres"),
    password: z.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .max(100, "La contraseña es demasiado larga")
        .or(z.string().length(0)) // Permitir contraseña vacía en edición
        .optional(),
    tipo: z.enum(["ADMINISTRADOR", "EMPLEADO"], {
        required_error: "Debe seleccionar un tipo de usuario"
    })
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type BookFormValues = z.infer<typeof libroSchema>
export type AuthorFormValues = z.infer<typeof autorSchema>
export type UserFormValues = z.infer<typeof userSchema>

