import { z } from "zod"

export const registerSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    cpf: z.string().min(11, "CPF deve ter pelo menos 11 caracteres"),
})

export type RegisterSchema = z.infer<typeof registerSchema>