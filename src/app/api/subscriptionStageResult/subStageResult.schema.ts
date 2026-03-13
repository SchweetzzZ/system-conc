import { z } from "zod"

export const baseSchema = z.object({
    subscriptionId: z.string().uuid(),
    stageId: z.string().uuid(),
    result: z.enum(["PENDING", "APPROVED", "ABSENT", "REJECTED"]),
    score: z.number(),
})

export const updateSubscriptionStageResultSchema = z.object({
    result: z.enum(["PENDING", "APPROVED", "ABSENT", "REJECTED"]),
    score: z.number().optional(),
})

export type CreateSubscriptionStageResultInput = z.infer<typeof baseSchema>

export type UpdateSubscriptionStageResultInput = z.infer<typeof updateSubscriptionStageResultSchema>