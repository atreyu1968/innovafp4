import React, { useState } from 'react';
import { Eye, X, Clock } from 'lucide-react';
import { AcademicYear } from '../../types/academicYear';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { useNotifications } from '../notifications/NotificationProvider';

interface AcademicYearStateMenuProps {
  year: AcademicYear;
  onClose: () => void;
}

const AcademicYearStateMenu: React.FC<AcademicYearStateMenuProps> = ({ year, onClose }) => {
  const { setConsultationMode, forceSetStatus } = useAcademicYearStore();
  const { showNotification } = useNotifications();
  const [selectedRoles, setSelectedRoles] = useState<string[]>(year.consultationRoles || []);
  const [selectedState, setSelectedState] = useState<'consultation' | 'preparation'>(
    year.status === 'consultation' ? 'consultation' : 'preparation'
  );

  const handleSetState = async () => {
    try {
      if (selectedState === 'consultation') {
        if (selectedRoles.length === 0) {
          showNotification('error', 'Selecciona al menos un rol para el modo consulta');
          return;
        }
        await setConsultationMode(year.id, selectedRoles);
        showNotification('success', 'Modo consulta configurado correctamente');
      } else {
        await forceSetStatus(year.id, 'preparation');
        showNotification('success', 'Estado cambiado a preparación correctamente');
      }
      onClose();
    } catch (error) {
      showNotification('error', (error as Error).message);
    }
  };

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium">Cambiar Estado del Curso</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Selecciona el nuevo estado
            </label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={selectedState === 'consultation'}
                  onChange={() => setSelectedState('consultation')}
                  className="form-radio"
                />
                <span className="ml-2 text-sm text-gray-700">Modo Consulta</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={selectedState === 'preparation'}
                  onChange={() => setSelectedState('preparation')}
                  className="form-radio"
                />
                <span className="ml-2 text-sm text-gray-700">En Preparación</span>
              </label>
            </div>
          </div>

          {selectedState === 'consultation' && (
            <>
              <p className="text-sm text-gray-500 mb-4">
                Selecciona los roles que podrán consultar los datos de este curso académico.
                Los usuarios con estos roles podrán ver la información pero no modificarla.
              </p>

              <div className="space-y-3">
                {['coordinador_general', 'coordinador_subred', 'gestor'].map(role => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {role === 'coordinador_general' ? 'Coordinador General' :
                       role === 'coordinador_subred' ? 'Coordinador de Subred' :
                       'Gestor'}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSetState}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Cambiar Estado
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcademicYearStateMenu;