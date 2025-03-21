'use client'
import { z } from 'zod'

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

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>