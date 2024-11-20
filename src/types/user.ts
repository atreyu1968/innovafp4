export interface User {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  roles: UserRole[];
  centro?: string;
  subred?: string;
  familiaProfesional?: string;
  academicYearId: string;
  active: boolean;
  password?: string;
  mustChangePassword?: boolean;
  twoFactorEnabled?: boolean;
  lastPasswordChange?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'gestor' | 'coordinador_subred' | 'coordinador_general' | 'admin';

export interface ImportResult {
  success: boolean;
  message: string;
  totalProcessed: number;
  successful: number;
  failed: number;
  errors?: string[];
}