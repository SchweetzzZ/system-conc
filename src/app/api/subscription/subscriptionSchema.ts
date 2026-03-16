import { z } from "zod"

export const baseSchema = z.object({
    userId: z.string(),
    contestId: z.string(),
    positionId: z.string(),
    status: z.enum(["PENDING", "APPROVED", "ABSENT", "REJECTED"]).default("PENDING"),
    documents: z.array(z.object({
        type: z.string(),
        fileUrl: z.string(),
        fileKey: z.string(),
    })).optional(),
    createdAt: z.date().optional(),
})


export const updateSubscriptionSchema = z.object({
    status: z.enum(["PENDING", "APPROVED", "ABSENT", "REJECTED"]),
})

export type CreateSubscriptionInput = z.infer<typeof baseSchema>

export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>