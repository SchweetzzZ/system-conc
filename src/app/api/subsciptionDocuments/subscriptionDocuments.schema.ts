import { z } from "zod"

export const baseSchema = z.object({
    userId: z.string().uuid(),
    subscriptionId: z.string().uuid(),
    type: z.string(),
    fileUrl: z.string(),
    fileKey: z.string(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
})

export const updateSubscriptionDocumentSchema = z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
})

export type CreateSubscriptionDocumentInput = z.infer<typeof baseSchema>

export type UpdateSubscriptionDocumentInput = z.infer<typeof updateSubscriptionDocumentSchema>