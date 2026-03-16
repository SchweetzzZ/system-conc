import { z } from "zod";

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(3).max(100),
  message: z.string().min(5).max(1000),
  sendEmail: z.boolean().optional().default(true),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
