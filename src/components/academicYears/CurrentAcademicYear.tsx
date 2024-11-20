import React from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const CurrentAcademicYear = () => {
  const { activeYear } = useAcademicYearStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'coordinador_general';

  if (!activeYear) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              No hay un curso académico activo
            </h3>
            {isAdmin && (
              <p className="mt-1 text-sm text-yellow-700">
                Por favor, activa un curso académico para comenzar a trabajar.
              </p>
            )}
          </div>
          {isAdmin && (
            <Link
              to="/cursos"
              className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
            >
              Gestionar cursos
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-blue-500 mr-2" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {activeYear.year}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(activeYear.startDate).toLocaleDateString()} - {' '}
              {new Date(activeYear.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        {isAdmin && (
          <Link
            to="/cursos"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Gestionar
          </Link>
        )}
      </div>
      {activeYear.description && (
        <p className="mt-2 text-sm text-gray-600 border-t border-gray-100 pt-2">
          {activeYear.description}
        </p>
      )}
    </div>
  );
};

export default CurrentAcademicYear;