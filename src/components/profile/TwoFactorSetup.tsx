import React, { useState, useEffect } from 'react';
import { Shield, Copy, Check } from 'lucide-react';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { useAuthStore } from '../../stores/authStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../notifications/NotificationProvider';

interface TwoFactorSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

// Generate a random string for the secret
const generateSecret = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  const randomValues = new Uint8Array(20);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 20; i++) {
    secret += chars[randomValues[i] % chars.length];
  }
  return secret;
};

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onComplete, onCancel }) => {
  const { user, updateUserProfile } = useAuthStore();
  const { settings } = useSettingsStore();
  const { showNotification } = useNotifications();
  const [secret] = useState(generateSecret());
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      const otpauth = authenticator.keyuri(
        user.email,
        settings.name,
        secret
      );
      
      QRCode.toDataURL(otpauth)
        .then(url => setQrCode(url))
        .catch(err => {
          console.error('Error generando QR:', err);
          showNotification('error', 'Error al generar el código QR');
        });
    }
  }, [user, settings.name, secret, showNotification]);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    try {
      const isValid = authenticator.verify({
        token: verificationCode,
        secret
      });

      if (isValid) {
        await updateUserProfile({
          twoFactorEnabled: true,
          twoFactorSecret: secret
        });
        showNotification('success', 'Autenticación de dos factores activada correctamente');
        onComplete();
      } else {
        showNotification('error', 'Código de verificación incorrecto');
      }
    } catch (error) {
      showNotification('error', 'Error al verificar el código');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <div className="flex space-x-8">
        {/* Left column - QR Code */}
        <div className="w-1/2 flex flex-col items-center justify-center border-r border-gray-200 pr-8">
          <Shield className="h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-medium text-center mb-4">
            Configurar Autenticación de Dos Factores
          </h3>
          {qrCode && (
            <div className="mb-4">
              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
          )}
        </div>

        {/* Right column - Instructions and verification */}
        <div className="w-1/2 pl-8 space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              1. Escanea el código QR con tu aplicación de autenticación
            </p>
            <p className="text-sm text-gray-500">
              Usa Google Authenticator, Authy u otra aplicación similar
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">
              2. O ingresa manualmente este código:
            </p>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <code className="text-sm font-mono">{secret}</code>
              <button
                onClick={handleCopySecret}
                className="p-2 text-gray-400 hover:text-gray-500"
                title="Copiar código"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">
              3. Ingresa el código de verificación:
            </p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              placeholder="000000"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleVerify}
              disabled={verificationCode.length !== 6}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Verificar y Activar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetup;