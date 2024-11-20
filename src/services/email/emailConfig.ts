import nodemailer from 'nodemailer';
import { useSettingsStore } from '../../stores/settingsStore';

export const createTransporter = () => {
  const { settings } = useSettingsStore.getState();
  
  return nodemailer.createTransport({
    host: settings.smtp?.host || process.env.SMTP_HOST,
    port: settings.smtp?.port || Number(process.env.SMTP_PORT),
    secure: settings.smtp?.secure || process.env.SMTP_SECURE === 'true',
    auth: {
      user: settings.smtp?.user || process.env.SMTP_USER,
      pass: settings.smtp?.password || process.env.SMTP_PASS,
    },
  });
};