import React, { useState } from 'react';
import { Save, Upload, RefreshCw } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import ColorPicker from '../components/settings/ColorPicker';
import BackupManager from '../components/backup/BackupManager';
import SecuritySettings from '../components/settings/SecuritySettings';
import MaintenanceSettings from '../components/settings/MaintenanceSettings';
import UpdateSettings from '../components/settings/UpdateSettings';
import RegistrationSettings from '../components/settings/RegistrationSettings';
import ObservatorySettings from '../components/observatory/ObservatorySettings';
import EmailSettings from '../components/settings/EmailSettings';
import MeetingSettings from '../components/settings/MeetingSettings';
import { useNotifications } from '../components/notifications/NotificationProvider';

const Settings = () => {
  const { user } = useAuthStore();
  const { settings, updateSettings } = useSettingsStore();
  const { showNotification } = useNotifications();
  const [formData, setFormData] = useState(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'maintenance' | 'updates' | 'backups' | 'registration' | 'observatoryai' | 'email' | 'meetings'>('general');

  if (user?.role !== 'coordinador_general') {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      updateSettings(formData);
      showNotification('success', 'Configuración guardada correctamente');
    } catch (error) {
      showNotification('error', 'Error al guardar la configuración');
    }
  };

  const handleColorChange = (color: string, path: string[]) => {
    setFormData((prev) => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = color;
      return newData;
    });
  };

  const handleReset = () => {
    setFormData(settings);
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Seguridad' },
    { id: 'maintenance', label: 'Mantenimiento' },
    { id: 'updates', label: 'Actualizaciones' },
    { id: 'backups', label: 'Backups' },
    { id: 'registration', label: 'Registro' },
    { id: 'observatoryai', label: 'Observatorio e IA' },
    { id: 'email', label: 'Correo' },
    { id: 'meetings', label: 'Videoconferencias' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
        <p className="mt-1 text-sm text-gray-500">
          Personaliza la apariencia y configuración general de la aplicación
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ... (resto del contenido del formulario general permanece igual) ... */}
            </form>
          )}

          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'maintenance' && <MaintenanceSettings />}
          {activeTab === 'updates' && <UpdateSettings />}
          {activeTab === 'backups' && <BackupManager />}
          {activeTab === 'registration' && <RegistrationSettings />}
          {activeTab === 'observatoryai' && <ObservatorySettings onClose={() => setActiveTab('general')} />}
          {activeTab === 'email' && <EmailSettings />}
          {activeTab === 'meetings' && <MeetingSettings />}
        </div>
      </div>
    </div>
  );
};

export default Settings;