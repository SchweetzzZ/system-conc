import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailProps) {
  try {
    // In development/testing, Resend only allows sending to the registered email
    const finalTo = process.env.NODE_ENV === 'production' ? to : 'casac2978@gmail.com';

    console.log(`[EMAIL] Tentando enviar para: ${finalTo} (Original: ${to})`);

    const { data, error } = await resend.emails.send({
      from: from || 'onboarding@resend.dev',
      to: finalTo,
      subject: `${process.env.NODE_ENV !== 'production' ? '[TESTE] ' : ''}${subject}`,
      html,
    });

    if (error) {
      console.error('[EMAIL] Erro do Resend:', error);
      return { success: false, error };
    }

    console.log('[EMAIL] Sucesso:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error sending email:', err);
    return { success: false, error: err };
  }
}
