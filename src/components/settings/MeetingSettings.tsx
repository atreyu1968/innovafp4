import React from 'react';
import { Video, Save, Settings, Link as LinkIcon } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNotifications } from '../notifications/NotificationProvider';

const MeetingSettings = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { showNotification } = useNotifications();

  // Ensure meetings settings exist with default values
  const meetings = settings.meetings || {
    enabled: false,
    provider: 'jitsi' as const,
    allowedRoles: ['coordinador_general'],
    maxDuration: 120,
    maxParticipants: 50,
    requireApproval: false,
    autoRecording: false,
    serverUrl: 'https://meet.jit.si',
  };

  const handleSave = () => {
    updateSettings({
      meetings: {
        ...meetings,
      }
    });
    showNotification('success', 'Configuración de videoconferencias actualizada');
  };

  return (
    <div className="space-y-8">
      {/* Sección Principal */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Video className="h-6 w-6 text-blue-500 mr-2" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Servicio de Videoconferencias</h3>
              <p className="text-sm text-gray-500">Gestiona el acceso y configuración de las reuniones virtuales</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              meetings.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {meetings.enabled ? 'Activo' : 'Inactivo'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={meetings.enabled}
                onChange={(e) => updateSettings({
                  meetings: { ...meetings, enabled: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {meetings.enabled && (
          <div className="space-y-6">
            {/* Proveedor y URL */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Proveedor de Videoconferencias
                </label>
                <select
                  value={meetings.provider}
                  onChange={(e) => updateSettings({
                    meetings: { ...meetings, provider: e.target.value as 'jitsi' | 'zoom' | 'meet' }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="jitsi">Jitsi Meet (Gratuito)</option>
                  <option value="zoom">Zoom</option>
                  <option value="meet">Google Meet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  URL del Servidor
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    <LinkIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="url"
                    value={meetings.serverUrl}
                    onChange={(e) => updateSettings({
                      meetings: { ...meetings, serverUrl: e.target.value }
                    })}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="https://meet.jit.si"
                  />
                </div>
              </div>
            </div>

            {/* Permisos */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Permisos de Convocatoria</h4>
              <div className="space-y-3">
                {['gestor', 'coordinador_subred', 'coordinador_general'].map((role) => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={meetings.allowedRoles.includes(role as any)}
                      onChange={(e) => {
                        const roles = e.target.checked
                          ? [...meetings.allowedRoles, role]
                          : meetings.allowedRoles.filter(r => r !== role);
                        updateSettings({
                          meetings: { ...meetings, allowedRoles: roles }
                        });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {role === 'gestor' ? 'Gestores' :
                       role === 'coordinador_subred' ? 'Coordinadores de Subred' :
                       'Coordinadores Generales'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Límites y Restricciones */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Límites y Restricciones</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duración máxima
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="number"
                      min="15"
                      max="480"
                      value={meetings.maxDuration}
                      onChange={(e) => updateSettings({
                        meetings: { ...meetings, maxDuration: Number(e.target.value) }
                      })}
                      className="flex-1 min-w-0 block w-full rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      minutos
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Participantes máximos
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="number"
                      min="2"
                      max="100"
                      value={meetings.maxParticipants}
                      onChange={(e) => updateSettings({
                        meetings: { ...meetings, maxParticipants: Number(e.target.value) }
                      })}
                      className="flex-1 min-w-0 block w-full rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      personas
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones Adicionales */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Opciones Adicionales</h4>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={meetings.requireApproval}
                    onChange={(e) => updateSettings({
                      meetings: { ...meetings, requireApproval: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Requerir aprobación del coordinador para las reuniones
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={meetings.autoRecording}
                    onChange={(e) => updateSettings({
                      meetings: { ...meetings, autoRecording: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Grabar reuniones automáticamente
                  </span>
                </label>
              </div>
            </div>

            {/* Configuración del Proveedor */}
            {meetings.provider !== 'jitsi' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Configuración del Proveedor</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={meetings.apiKey || ''}
                    onChange={(e) => updateSettings({
                      meetings: { ...meetings, apiKey: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Clave API del proveedor"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Necesaria para la integración con {meetings.provider === 'zoom' ? 'Zoom' : 'Google Meet'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botón Guardar */}
      <div className="flex justify-end">
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

export default MeetingSettings;