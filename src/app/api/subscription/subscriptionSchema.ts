import { z } from "zod"

export const baseSchema = z.object({
    userId: z.string().uuid(),
    contestId: z.string().uuid(),
    positionId: z.string().uuid(),
    status: z.enum(["PENDING", "APPROVED", "ABSENT", "REJECTED"]),
    createdAt: z.date().optional(),
})


export const updateSubscriptionSchema = z.object({
    status: z.enum(["PENDING", "APPROVED", "ABSENT", "REJECTED"]),
})

export type CreateSubscriptionInput = z.infer<typeof baseSchema>

export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>