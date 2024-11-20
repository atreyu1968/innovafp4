import React from 'react';
import { useObservatoryStore } from '../stores/observatoryStore';
import { useNetworkStore } from '../stores/networkStore';
import { useUserStore } from '../stores/userStore';
import { ExternalLink } from 'lucide-react';

const ObservatoryBlog = () => {
  const { entries } = useObservatoryStore();
  const { subnets } = useNetworkStore();
  const { users } = useUserStore();

  // Obtener solo las entradas publicadas
  const publishedEntries = entries
    .filter(entry => entry.status === 'published')
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Blog del Observatorio</h2>
        <p className="mt-1 text-sm text-gray-500">
          Descubre las últimas innovaciones en FP
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {publishedEntries.map((entry) => {
          const subnet = subnets.find(s => s.id === entry.subnetId);
          const author = users.find(u => u.id === entry.createdBy);

          return (
            <article
              key={entry.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    entry.type === 'methodology' ? 'bg-blue-100 text-blue-800' :
                    entry.type === 'technology' ? 'bg-green-100 text-green-800' :
                    entry.type === 'pedagogy' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.type === 'methodology' ? 'Metodología' :
                     entry.type === 'technology' ? 'Tecnología' :
                     entry.type === 'pedagogy' ? 'Pedagogía' :
                     'FP-Empresas'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(entry.publishedAt!).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {entry.title}
                </h3>

                {entry.aiSummary ? (
                  <p className="text-gray-600 mb-4">{entry.aiSummary}</p>
                ) : (
                  <p className="text-gray-600 mb-4">{entry.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{author?.nombre}</span>
                    <span className="mx-2">·</span>
                    <span>{subnet?.name}</span>
                  </div>
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                  >
                    Leer más
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>

                {entry.aiTags && entry.aiTags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.aiTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}

        {publishedEntries.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">
              No hay entradas publicadas en el blog
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObservatoryBlog;