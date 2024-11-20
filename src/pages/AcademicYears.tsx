import React, { useState } from 'react';
import { Plus, Calendar, School } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Navigate } from 'react-router-dom';
import { AcademicYear } from '../types/academicYear';
import { useAcademicYearStore } from '../stores/academicYearStore';
import { useNotifications } from '../components/notifications/NotificationProvider';
import AcademicYearForm from '../components/academicYears/AcademicYearForm';
import AcademicYearList from '../components/academicYears/AcademicYearList';
import AcademicYearWizard from '../components/academicYears/AcademicYearWizard';

const AcademicYears = () => {
  const { user } = useAuthStore();
  const { years, addYear, updateYear } = useAcademicYearStore();
  const { showNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);

  // Verificar si el usuario es coordinador general
  if (user?.role !== 'coordinador_general') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (data: Partial<AcademicYear>) => {
    try {
      if (selectedYear) {
        updateYear(selectedYear.id, data);
        showNotification('success', 'Curso académico actualizado correctamente');
      } else {
        addYear(data);
        showNotification('success', 'Curso académico creado correctamente');
      }
      setShowForm(false);
      setSelectedYear(null);
    } catch (error) {
      showNotification('error', 'Error al guardar el curso académico');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cursos Académicos</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de períodos académicos y centros asociados
          </p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Curso Académico
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Períodos Académicos
            </h3>
          </div>
          {showForm ? (
            <AcademicYearForm
              initialData={selectedYear || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setSelectedYear(null);
              }}
            />
          ) : (
            <AcademicYearList
              years={years}
              onEdit={(year) => {
                setSelectedYear(year);
                setShowForm(true);
              }}
            />
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <School className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Resumen de Centros
            </h3>
          </div>
          <div className="space-y-4">
            {years.map((year) => (
              <div
                key={year.id}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <h4 className="font-medium text-gray-900">{year.year}</h4>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">CIFP</p>
                    <p className="text-lg font-semibold text-gray-900">5</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">IES</p>
                    <p className="text-lg font-semibold text-gray-900">12</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showWizard && <AcademicYearWizard onClose={() => setShowWizard(false)} />}
    </div>
  );
};

export default AcademicYears;