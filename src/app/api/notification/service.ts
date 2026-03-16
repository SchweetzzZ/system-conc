import prisma from "@/lib/prisma";
import { createNotification as createLibNotification } from "@/lib/notification";

export class NotificationService {
  static async getAll(userId: string) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async markAsRead(id: string) {
    return await prisma.notification.update({
      where: { id },
      data: { read: true }
    });
  }

  static async create(data: { userId: string, title: string, message: string, sendEmail?: boolean }) {
    return await createLibNotification({
      userId: data.userId,
      title: data.title,
      message: data.message,
      sendEmailNotification: data.sendEmail ?? true
    });
  }

  static async delete(id: string) {
    return await prisma.notification.delete({
      where: { id }
    });
  }
}
