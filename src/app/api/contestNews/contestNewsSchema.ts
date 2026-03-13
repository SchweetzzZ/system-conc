import z from "zod"

export const createContestNewsSchema = z.object({
    contestId: z.string().uuid(),
    title: z.string().min(1, "Título é obrigatório"),
    content: z.string().min(1, "Conteúdo é obrigatório")
})


export const updateContestNewsSchema = z.object({
    title: z.string().min(1, "Título é obrigatório").optional(),
    content: z.string().min(1, "Conteúdo é obrigatório").optional()
})

export type CreateContestNewsInput = z.infer<typeof createContestNewsSchema>
export type UpdateContestNewsInput = z.infer<typeof updateContestNewsSchema>