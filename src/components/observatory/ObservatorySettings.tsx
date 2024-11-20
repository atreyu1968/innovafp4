import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useObservatoryStore } from '../../stores/observatoryStore';
import { useUserStore } from '../../stores/userStore';
import { useNotifications } from '../notifications/NotificationProvider';

interface ObservatorySettingsProps {
  onClose: () => void;
}

const ObservatorySettings: React.FC<ObservatorySettingsProps> = ({ onClose }) => {
  const { config, updateConfig } = useObservatoryStore();
  const { users } = useUserStore();
  const { showNotification } = useNotifications();
  const [formData, setFormData] = useState(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    showNotification('success', 'Configuración actualizada correctamente');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-medium">Configuración del Observatorio</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex">
            {/* Left column - Basic settings */}
            <div className="w-1/2 p-6 border-r border-gray-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Activar Observatorio
                    </label>
                    <p className="text-sm text-gray-500">
                      Habilita o deshabilita el Observatorio de Innovación
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Activar IA
                    </label>
                    <p className="text-sm text-gray-500">
                      Utiliza OpenAI para generar contenido automáticamente
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.aiEnabled}
                      onChange={(e) => setFormData({ ...formData, aiEnabled: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Publicación Automática
                    </label>
                    <p className="text-sm text-gray-500">
                      Publica las observaciones sin necesidad de aprobación
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.autoPublish}
                      onChange={(e) => setFormData({ ...formData, autoPublish: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Advanced settings */}
            <div className="w-1/2 p-6">
              {formData.aiEnabled && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      API Key de OpenAI
                    </label>
                    <input
                      type="password"
                      value={formData.openaiApiKey || ''}
                      onChange={(e) => setFormData({ ...formData, openaiApiKey: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="sk-..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Plantilla de Prompt
                    </label>
                    <textarea
                      value={formData.promptTemplate || ''}
                      onChange={(e) => setFormData({ ...formData, promptTemplate: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Usa {{title}}, {{description}}, {{type}} como variables"
                    />
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Moderadores
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Usuarios que pueden aprobar o rechazar observaciones
                </p>
                <div className="max-h-48 overflow-y-auto border rounded-md">
                  {users
                    .filter(u => u.role === 'coordinador_general')
                    .map((user) => (
                      <label key={user.id} className="flex items-center px-4 py-2 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.moderators.includes(user.id)}
                          onChange={(e) => {
                            const moderators = e.target.checked
                              ? [...formData.moderators, user.id]
                              : formData.moderators.filter(id => id !== user.id);
                            setFormData({ ...formData, moderators });
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {user.nombre} {user.apellidos}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2 inline-block" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ObservatorySettings;