export type AcademicYearStatus = 'preparation' | 'active' | 'closed' | 'consultation';

export interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  status: AcademicYearStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
  activatedAt?: string;
  closedAt?: string;
  consultationRoles?: string[];
  isTransitioning?: boolean;
}

export interface AcademicYearValidation {
  isValid: boolean;
  error?: string;
}