import { useSettingsStore } from '../stores/settingsStore';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const { settings } = useSettingsStore.getState();
  
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        html: options.html,
        config: settings.smtp
      }),
    });

    if (!response.ok) {
      throw new Error('Error al enviar el correo electrónico');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};