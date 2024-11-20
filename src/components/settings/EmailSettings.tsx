import React from 'react';
import { Mail, Save, TestTube } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../notifications/NotificationProvider';
import { sendEmail } from '../../services/email';

const EmailSettings = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { showNotification } = useNotifications();

  // Ensure smtp settings exist with default values
  const smtp = settings.smtp || {
    host: '',
    port: 587,
    secure: false,
    user: '',
    password: '',
    from: '',
  };

  const handleSave = () => {
    updateSettings({
      smtp: {
        ...smtp,
        port: Number(smtp.port),
      },
    });
    showNotification('success', 'Configuración de correo actualizada');
  };

  const handleTest = async () => {
    try {
      await sendEmail({
        to: smtp.user,
        subject: 'Prueba de configuración de correo',
        html: `
          <h1>Prueba de configuración de correo</h1>
          <p>Este es un correo de prueba para verificar la configuración del servidor SMTP.</p>
          <p>Si has recibido este correo, la configuración es correcta.</p>
        `,
      });
      showNotification('success', 'Correo de prueba enviado correctamente');
    } catch (error) {
      showNotification('error', 'Error al enviar el correo de prueba');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Mail className="h-5 w-5 mr-2 text-blue-500" />
          Configuración de Correo
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Configura el servidor SMTP para el envío de correos
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Servidor SMTP
          </label>
          <input
            type="text"
            value={smtp.host}
            onChange={(e) => updateSettings({
              smtp: { ...smtp, host: e.target.value }
            })}
            placeholder="smtp.gmail.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Puerto
          </label>
          <input
            type="number"
            value={smtp.port}
            onChange={(e) => updateSettings({
              smtp: { ...smtp, port: Number(e.target.value) }
            })}
            placeholder="587"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Usuario
          </label>
          <input
            type="email"
            value={smtp.user}
            onChange={(e) => updateSettings({
              smtp: { ...smtp, user: e.target.value }
            })}
            placeholder="correo@ejemplo.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            value={smtp.password}
            onChange={(e) => updateSettings({
              smtp: { ...smtp, password: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Remitente
          </label>
          <input
            type="text"
            value={smtp.from}
            onChange={(e) => updateSettings({
              smtp: { ...smtp, from: e.target.value }
            })}
            placeholder="Red de Innovación FP <correo@ejemplo.com>"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={smtp.secure}
            onChange={(e) => updateSettings({
              smtp: { ...smtp, secure: e.target.checked }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Usar conexión segura (SSL/TLS)
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleTest}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <TestTube className="h-4 w-4 mr-2" />
          Probar Configuración
        </button>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default EmailSettings;