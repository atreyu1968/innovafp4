import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Meeting, MeetingType, MeetingRecurrence } from '../../types/meeting';
import { useUserStore } from '../../stores/userStore';
import { useMeetingStore } from '../../stores/meetingStore';
import { useAuthStore } from '../../stores/authStore';
import { useNotifications } from '../notifications/NotificationProvider';

interface MeetingFormProps {
  initialData?: Meeting | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const MEETING_TYPES = [
  { value: 'subred', label: 'Reunión de Subred' },
  { value: 'coordinacion', label: 'Coordinación' },
  { value: 'formacion', label: 'Formación' },
  { value: 'proyecto', label: 'Proyecto' }
];

const MeetingForm: React.FC<MeetingFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { user } = useAuthStore();
  const { users } = useUserStore();
  const { scheduleMeeting } = useMeetingStore();
  const { showNotification } = useNotifications();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'subred' as MeetingType,
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    participants: initialData?.participants || [],
    agenda: initialData?.agenda || [],
    recurrence: null as MeetingRecurrence | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      await scheduleMeeting({
        ...formData,
        organizer: user.id,
      }, formData.recurrence || undefined);

      showNotification('success', 'Reunión programada correctamente');
      onSubmit();
    } catch (error) {
      showNotification('error', 'Error al programar la reunión');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6">
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
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de reunión
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as MeetingType })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {MEETING_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha y hora de inicio
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha y hora de fin
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
                min={formData.startTime}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Participantes
            </label>
            <div className="mt-2 max-h-48 overflow-y-auto border rounded-md">
              {users
                .filter(u => u.id !== user?.id)
                .map(u => (
                  <label key={u.id} className="flex items-center px-4 py-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.participants.includes(u.id)}
                      onChange={(e) => {
                        const participants = e.target.checked
                          ? [...formData.participants, u.id]
                          : formData.participants.filter(id => id !== u.id);
                        setFormData({ ...formData, participants });
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {u.nombre} {u.apellidos}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {u.centro || u.subred || 'Coordinación General'}
                    </span>
                  </label>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Agenda
            </label>
            <div className="mt-2 space-y-2">
              {formData.agenda.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const agenda = [...formData.agenda];
                      agenda[index] = e.target.value;
                      setFormData({ ...formData, agenda });
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const agenda = formData.agenda.filter((_, i) => i !== index);
                      setFormData({ ...formData, agenda });
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  agenda: [...formData.agenda, '']
                })}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                + Añadir punto
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
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
          Programar Reunión
        </button>
      </div>
    </form>
  );
};

export default MeetingForm;