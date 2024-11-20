import React, { useState } from 'react';
import { Edit2, Calendar, Eye, Lock } from 'lucide-react';
import { AcademicYear } from '../../types/academicYear';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { useNotifications } from '../notifications/NotificationProvider';
import AcademicYearBadge from './AcademicYearBadge';
import AcademicYearStateMenu from './AcademicYearStateMenu';

interface AcademicYearListProps {
  years: AcademicYear[];
  onEdit: (year: AcademicYear) => void;
}

const AcademicYearList: React.FC<AcademicYearListProps> = ({ years, onEdit }) => {
  const { activateYear, closeYear } = useAcademicYearStore();
  const { showNotification } = useNotifications();
  const [yearForStateChange, setYearForStateChange] = useState<AcademicYear | null>(null);

  const handleActivate = async (year: AcademicYear, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await activateYear(year.id);
      showNotification('success', `Curso académico ${year.year} activado correctamente`);
    } catch (error) {
      showNotification('error', (error as Error).message);
    }
  };

  const handleClose = async (year: AcademicYear, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await closeYear(year.id);
      showNotification('success', `Curso académico ${year.year} cerrado correctamente`);
    } catch (error) {
      showNotification('error', (error as Error).message);
    }
  };

  const handleStateChange = (year: AcademicYear, e: React.MouseEvent) => {
    e.stopPropagation();
    setYearForStateChange(year);
  };

  const canBeActivated = (year: AcademicYear) => {
    return year.status === 'preparation' && !years.some(y => y.status === 'active');
  };

  return (
    <div className="space-y-4">
      {years.map((year) => (
        <div
          key={year.id}
          className={`block bg-white border rounded-lg p-4 transition-colors duration-150 ${
            year.status === 'active' ? 'border-green-500 shadow-md' : 'hover:border-blue-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className={`h-5 w-5 ${year.status === 'active' ? 'text-green-600' : 'text-blue-600'}`} />
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {year.year}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(year.startDate).toLocaleDateString()} -{' '}
                  {new Date(year.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <AcademicYearBadge 
                status={year.status} 
                isTransitioning={year.isTransitioning}
                consultationRoles={year.consultationRoles}
              />
              <div className="flex space-x-2">
                {canBeActivated(year) && (
                  <button
                    onClick={(e) => handleActivate(year, e)}
                    disabled={year.isTransitioning}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Activar
                  </button>
                )}
                {year.status === 'active' && (
                  <button
                    onClick={(e) => handleClose(year, e)}
                    disabled={year.isTransitioning}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Cerrar
                  </button>
                )}
                {year.status === 'closed' && (
                  <button
                    onClick={(e) => handleStateChange(year, e)}
                    disabled={year.isTransitioning}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Cambiar Estado
                  </button>
                )}
                <button
                  onClick={() => onEdit(year)}
                  disabled={year.isTransitioning}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </button>
              </div>
            </div>
          </div>
          {year.description && (
            <p className="mt-2 text-sm text-gray-600">{year.description}</p>
          )}
          {year.isTransitioning && (
            <div className="mt-2 text-sm text-blue-600">
              Actualizando estado del curso académico...
            </div>
          )}
        </div>
      ))}
      {years.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay cursos académicos configurados
        </div>
      )}

      {yearForStateChange && (
        <AcademicYearStateMenu
          year={yearForStateChange}
          onClose={() => setYearForStateChange(null)}
        />
      )}
    </div>
  );
};

export default AcademicYearList;