import React, { useState } from 'react';
import { Eye, ExternalLink, Check, X } from 'lucide-react';
import { useObservatoryStore } from '../../stores/observatoryStore';
import { useAuthStore } from '../../stores/authStore';
import { useNetworkStore } from '../../stores/networkStore';
import { ObservationType } from '../../types/observatory';
import ObservationDetail from './ObservationDetail';

const ObservationList = () => {
  const { user, activeRole } = useAuthStore();
  const { entries, publishEntry, rejectEntry } = useObservatoryStore();
  const { subnets } = useNetworkStore();
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    type?: ObservationType;
    subnetId?: string;
    status?: string;
  }>({});

  const isAdmin = user?.role === 'coordinador_general' && activeRole === 'admin';

  const filteredEntries = entries.filter(entry => {
    if (filter.type && entry.type !== filter.type) return false;
    if (filter.subnetId && entry.subnetId !== filter.subnetId) return false;
    if (filter.status && entry.status !== filter.status) return false;
    return true;
  });

  const handlePublish = async (id: string) => {
    await publishEntry(id);
  };

  const handleReject = (id: string) => {
    const notes = window.prompt('Motivo del rechazo:');
    if (notes) {
      rejectEntry(id, notes);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <select
          value={filter.type || ''}
          onChange={(e) => setFilter({ ...filter, type: e.target.value as ObservationType || undefined })}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Todos los tipos</option>
          <option value="methodology">Metodología</option>
          <option value="technology">Tecnología</option>
          <option value="pedagogy">Pedagogía</option>
          <option value="business">Relación FP-Empresas</option>
        </select>

        <select
          value={filter.subnetId || ''}
          onChange={(e) => setFilter({ ...filter, subnetId: e.target.value || undefined })}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Todas las subredes</option>
          {subnets.map((subnet) => (
            <option key={subnet.id} value={subnet.id}>
              {subnet.name}
            </option>
          ))}
        </select>

        {isAdmin && (
          <select
            value={filter.status || ''}
            onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="published">Publicados</option>
            <option value="rejected">Rechazados</option>
          </select>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredEntries.map((entry) => {
            const subnet = subnets.find(s => s.id === entry.subnetId);
            
            return (
              <li key={entry.id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-medium text-gray-900 truncate">
                      {entry.title}
                    </h4>
                    <div className="mt-1 flex items-center">
                      <span className="text-sm text-gray-500">{subnet?.name}</span>
                      <span className="mx-2 text-gray-300">·</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        entry.status === 'published' ? 'bg-green-100 text-green-800' :
                        entry.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entry.status === 'published' ? 'Publicado' :
                         entry.status === 'rejected' ? 'Rechazado' :
                         'Pendiente'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedEntry(entry.id)}
                      className="p-2 text-gray-400 hover:text-gray-500"
                      title="Ver detalles"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-500"
                      title="Abrir enlace"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                    {isAdmin && entry.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handlePublish(entry.id)}
                          className="p-2 text-green-400 hover:text-green-500"
                          title="Publicar"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleReject(entry.id)}
                          className="p-2 text-red-400 hover:text-red-500"
                          title="Rechazar"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
          {filteredEntries.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No se encontraron observaciones
            </li>
          )}
        </ul>
      </div>

      {selectedEntry && (
        <ObservationDetail
          entryId={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
};

export default ObservationList;