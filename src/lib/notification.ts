import prisma from './prisma';
import { sendEmail } from './email';

interface CreateNotificationProps {
  userId: string;
  title: string;
  message: string;
  sendEmailNotification?: boolean;
}

export async function createNotification({
  userId,
  title,
  message,
  sendEmailNotification = true,
}: CreateNotificationProps) {
  try {
    // 1. Create notification in database
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
      include: {
        user: true,
      },
    });

    // 2. If email notification requested, send it
    console.log(`[NOTIFICATION] Email solicitado: ${sendEmailNotification}, Email do usuário: ${notification.user.email}`);
    if (sendEmailNotification && notification.user.email) {
      await sendEmail({
        to: notification.user.email,
        subject: title,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #2563eb; margin: 0;">Sistema de Concursos</h2>
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #111827;">${title}</h3>
              <p style="color: #374151; line-height: 1.5;">${message}</p>
            </div>
            
            <div style="text-align: center; color: #6b7280; font-size: 14px;">
              <p>Este é um e-mail automático, por favor não responda.</p>
              <p>&copy; ${new Date().getFullYear()} Sistema de Concursos</p>
            </div>
          </div>
        `,
      });
    }

    return { success: true, notification };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error };
  }
}
