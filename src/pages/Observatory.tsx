import React, { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useObservatoryStore } from '../stores/observatoryStore';
import { useNetworkStore } from '../stores/networkStore';
import { ObservationType } from '../types/observatory';
import ObservationForm from '../components/observatory/ObservationForm';
import ObservationList from '../components/observatory/ObservationList';
import ObservatorySettings from '../components/observatory/ObservatorySettings';
import { useNotifications } from '../components/notifications/NotificationProvider';

const Observatory = () => {
  const { user, activeRole } = useAuthStore();
  const { config, entries } = useObservatoryStore();
  const { subnets } = useNetworkStore();
  const { showNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const isAdmin = user?.role === 'coordinador_general' && activeRole === 'admin';

  if (!config.enabled) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Observatorio de Innovación
        </h2>
        <p className="text-gray-500">
          Esta sección está actualmente desactivada.
          {isAdmin && ' Actívala desde la configuración.'}
        </p>
        {isAdmin && (
          <button
            onClick={() => setShowSettings(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurar Observatorio
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Observatorio de Innovación
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Comparte y descubre innovaciones en FP
          </p>
        </div>
        <div className="flex space-x-3">
          {isAdmin && (
            <button
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Observación
          </button>
        </div>
      </div>

      {showForm ? (
        <ObservationForm
          onSubmit={() => {
            setShowForm(false);
            showNotification('success', 'Observación enviada correctamente');
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <ObservationList />
      )}

      {showSettings && (
        <ObservatorySettings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default Observatory;