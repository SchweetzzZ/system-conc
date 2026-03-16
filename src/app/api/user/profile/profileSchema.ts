import { z } from "zod"

export const updateProfileSchema = z.object({
    name: z.string().min(3, "Nome muito curto").optional(),
    phone: z.string().min(10, "Telefone inválido").optional(),
    cpf: z.string().length(11, "CPF deve ter 11 dígitos").optional(),
    birthDate: z.union([z.date(), z.string(), z.null()]).optional(),
    schooling: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().length(2, "UF deve ter 2 letras").optional(),
    zipCode: z.string().optional(),
    image: z.string().url().optional().or(z.literal("")).or(z.null())
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
