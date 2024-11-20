import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useObservatoryStore } from '../../stores/observatoryStore';
import { useNetworkStore } from '../../stores/networkStore';
import { useAuthStore } from '../../stores/authStore';
import { ObservationType } from '../../types/observatory';

interface ObservationFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const OBSERVATION_TYPES: { value: ObservationType; label: string }[] = [
  { value: 'methodology', label: 'Observación sobre la metodología de innovación' },
  { value: 'technology', label: 'Innovación tecnológica' },
  { value: 'pedagogy', label: 'Innovación pedagógica' },
  { value: 'business', label: 'Innovación relación centros FP-Empresas' },
];

const ObservationForm: React.FC<ObservationFormProps> = ({ onSubmit, onCancel }) => {
  const { user } = useAuthStore();
  const { subnets } = useNetworkStore();
  const { addEntry } = useObservatoryStore();
  const [formData, setFormData] = useState({
    subnetId: user?.subred || '',
    type: '' as ObservationType,
    title: '',
    description: '',
    url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    await addEntry({
      ...formData,
      createdBy: user.id,
    });

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow sm:rounded-lg p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Subred
        </label>
        <select
          value={formData.subnetId}
          onChange={(e) => setFormData({ ...formData, subnetId: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccionar subred...</option>
          {subnets.map((subnet) => (
            <option key={subnet.id} value={subnet.id}>
              {subnet.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de observación
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as ObservationType })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccionar tipo...</option>
          {OBSERVATION_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Breve descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          URL
        </label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar
        </button>
      </div>
    </form>
  );
};

export default ObservationForm;