import React, { useState, useEffect } from 'react';
import { Key } from 'lucide-react';
import { useRegistrationStore } from '../../stores/registrationStore';
import { useNotifications } from '../notifications/NotificationProvider';
import RegistrationCodeModal from './RegistrationCodeModal';

const RegistrationSettings = () => {
  const { settings, updateSettings, getActiveCodes } = useRegistrationStore();
  const { showNotification } = useNotifications();
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activeCodes, setActiveCodes] = useState([]);

  // Use useEffect to fetch active codes and set up interval
  useEffect(() => {
    const updateActiveCodes = () => {
      const codes = getActiveCodes();
      setActiveCodes(codes);
    };

    // Initial fetch
    updateActiveCodes();

    // Set up interval for periodic updates
    const interval = setInterval(updateActiveCodes, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [getActiveCodes]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Activar Registro</label>
          <p className="text-sm text-gray-500">
            Permite que los usuarios se registren en la plataforma
          </p>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => updateSettings({ enabled: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
      </div>

      {settings.enabled && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Requerir Código</label>
              <p className="text-sm text-gray-500">
                Los usuarios necesitarán un código para registrarse
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.requireCode}
                onChange={(e) => updateSettings({ requireCode: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Aprobación Automática</label>
              <p className="text-sm text-gray-500">
                Activar usuarios automáticamente al registrarse
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoApprove}
                onChange={(e) => updateSettings({ autoApprove: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>

          {settings.requireCode && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Códigos de Registro Activos
                </h4>
                <button
                  onClick={() => setShowCodeModal(true)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Generar Código
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                {activeCodes.length > 0 ? (
                  <ul className="space-y-3">
                    {activeCodes.map((code) => (
                      <li key={code.id} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {code.code}
                          </p>
                          <p className="text-xs text-gray-500">
                            Usos: {code.usedCount}/{code.maxUses} · 
                            Expira: {new Date(code.expiresAt).toLocaleString()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 text-center">
                    No hay códigos activos
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {showCodeModal && (
        <RegistrationCodeModal onClose={() => setShowCodeModal(false)} />
      )}
    </div>
  );
};

export default RegistrationSettings;