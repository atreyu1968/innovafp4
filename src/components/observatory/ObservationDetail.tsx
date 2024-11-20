import React from 'react';
import { X, Calendar, User, Link as LinkIcon } from 'lucide-react';
import { useObservatoryStore } from '../../stores/observatoryStore';
import { useNetworkStore } from '../../stores/networkStore';
import { useUserStore } from '../../stores/userStore';

interface ObservationDetailProps {
  entryId: string;
  onClose: () => void;
}

const ObservationDetail: React.FC<ObservationDetailProps> = ({ entryId, onClose }) => {
  const { entries } = useObservatoryStore();
  const { subnets } = useNetworkStore();
  const { users } = useUserStore();

  const entry = entries.find(e => e.id === entryId);
  if (!entry) return null;

  const subnet = subnets.find(s => s.id === entry.subnetId);
  const author = users.find(u => u.id === entry.createdBy);
  const reviewer = entry.reviewedBy ? users.find(u => u.id === entry.reviewedBy) : null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{entry.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Left column - Main content */}
            <div className="w-2/3 p-6 overflow-y-auto border-r border-gray-200">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{entry.description}</p>
                </div>

                {entry.aiContent && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Análisis IA
                    </h4>
                    <div className="prose prose-sm max-w-none">
                      {entry.aiContent}
                    </div>
                  </div>
                )}

                {entry.status === 'rejected' && entry.reviewNotes && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-red-800 mb-2">
                      Motivo del rechazo
                    </h4>
                    <p className="text-sm text-red-700">{entry.reviewNotes}</p>
                    {reviewer && (
                      <p className="text-xs text-red-500 mt-2">
                        Por {reviewer.nombre} {reviewer.apellidos}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Metadata */}
            <div className="w-1/3 p-6 bg-gray-50">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Detalles</h4>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm text-gray-500">Autor</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {author?.nombre} {author?.apellidos}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Subred</dt>
                      <dd className="mt-1 text-sm text-gray-900">{subnet?.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Fecha</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">URL</dt>
                      <dd className="mt-1">
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                        >
                          <LinkIcon className="h-4 w-4 mr-1" />
                          Abrir enlace
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>

                {entry.aiTags && entry.aiTags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.aiTags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservationDetail;