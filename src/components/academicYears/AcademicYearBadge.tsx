import React from 'react';
import { Calendar, CheckCircle, Clock, Lock, Eye } from 'lucide-react';
import { AcademicYearStatus } from '../../types/academicYear';

interface AcademicYearBadgeProps {
  status: AcademicYearStatus;
  isTransitioning?: boolean;
  consultationRoles?: string[];
}

const statusConfig: Record<AcademicYearStatus, {
  icon: typeof CheckCircle;
  text: string;
  className: string;
}> = {
  preparation: {
    icon: Clock,
    text: 'En Preparación',
    className: 'bg-yellow-100 text-yellow-800',
  },
  active: {
    icon: CheckCircle,
    text: 'Activo',
    className: 'bg-green-100 text-green-800',
  },
  closed: {
    icon: Lock,
    text: 'Cerrado',
    className: 'bg-gray-100 text-gray-800',
  },
  consultation: {
    icon: Eye,
    text: 'Consulta',
    className: 'bg-blue-100 text-blue-800',
  },
};

const AcademicYearBadge: React.FC<AcademicYearBadgeProps> = ({ 
  status, 
  isTransitioning,
  consultationRoles 
}) => {
  const config = statusConfig[status];
  
  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <div className="flex items-center space-x-2">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${
        isTransitioning ? 'animate-pulse' : ''
      }`}>
        <Icon className="h-4 w-4 mr-1" />
        {isTransitioning ? 'Cambiando estado...' : config.text}
      </span>
      {status === 'consultation' && consultationRoles && consultationRoles.length > 0 && (
        <span className="text-xs text-gray-500">
          ({consultationRoles.map(role => 
            role === 'coordinador_general' ? 'Admin' :
            role === 'coordinador_subred' ? 'Coord.' :
            'Gestor'
          ).join(', ')})
        </span>
      )}
    </div>
  );
};

export default AcademicYearBadge;