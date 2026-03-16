import { z } from "zod"

export const baseSchema = z.object({
    contestId: z.string(),
    name: z.string().min(0),
    vacancies: z.number().min(0),
    salary: z.number().min(0),
    schooling: z.enum(["MEDIO", "SUPERIOR"])
})

export const updateSchema = baseSchema.partial()