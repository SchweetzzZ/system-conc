import { z } from "zod"

export const baseSchema = z.object({
    constestId: z.string(),
    name: z.string(),
    order: z.number(),
    description: z.string(),
    date: z.coerce.date(),
})

export const updateSchema = baseSchema.partial()