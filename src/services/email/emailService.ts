import { createTransporter } from './emailConfig';
import { useSettingsStore } from '../../stores/settingsStore';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const { settings } = useSettingsStore.getState();
  const transporter = createTransporter();

  try {
    await transporter.sendMail({
      from: settings.smtp?.from || process.env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error al enviar el correo electrónico');
  }
};