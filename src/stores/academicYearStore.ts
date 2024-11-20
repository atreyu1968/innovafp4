import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AcademicYear, AcademicYearStatus, AcademicYearValidation } from '../types/academicYear';

interface AcademicYearState {
  years: AcademicYear[];
  activeYear: AcademicYear | null;
  setYears: (years: AcademicYear[]) => void;
  addYear: (year: Partial<AcademicYear>) => void;
  updateYear: (id: string, updates: Partial<AcademicYear>) => void;
  deleteYear: (id: string) => void;
  activateYear: (id: string) => Promise<void>;
  closeYear: (id: string) => Promise<void>;
  setConsultationMode: (id: string, roles: string[]) => Promise<void>;
  validateYearTransition: (fromId: string, toStatus: AcademicYearStatus) => AcademicYearValidation;
  getYearsByStatus: (status: AcademicYearStatus) => AcademicYear[];
  canAccessYear: (yearId: string, userRole: string) => boolean;
  forceSetStatus: (id: string, status: AcademicYearStatus) => Promise<void>;
}

export const useAcademicYearStore = create<AcademicYearState>()(
  persist(
    (set, get) => ({
      years: [],
      activeYear: null,

      setYears: (years) => set({ 
        years,
        activeYear: years.find(y => y.status === 'active') || null
      }),

      addYear: (yearData) => {
        const now = new Date().toISOString();
        const newYear: AcademicYear = {
          id: crypto.randomUUID(),
          year: yearData.year || '',
          startDate: yearData.startDate || '',
          endDate: yearData.endDate || '',
          status: 'preparation',
          description: yearData.description,
          createdAt: now,
          updatedAt: now,
        };

        set(state => ({
          years: [...state.years, newYear]
        }));
      },

      updateYear: (id, updates) => {
        const { years } = get();
        const yearToUpdate = years.find(y => y.id === id);
        if (!yearToUpdate) throw new Error('Curso académico no encontrado');

        set(state => ({
          years: state.years.map(year => 
            year.id === id 
              ? { 
                  ...year, 
                  ...updates,
                  updatedAt: new Date().toISOString()
                }
              : year
          )
        }));
      },

      deleteYear: (id) => {
        const { activeYear } = get();
        if (activeYear?.id === id) {
          throw new Error('No se puede eliminar el curso académico activo');
        }
        set(state => ({
          years: state.years.filter(y => y.id !== id)
        }));
      },

      activateYear: async (id) => {
        const { years } = get();
        const yearToActivate = years.find(y => y.id === id);
        
        if (!yearToActivate) {
          throw new Error('Curso académico no encontrado');
        }

        const now = new Date().toISOString();

        // Start transition
        set(state => ({
          years: state.years.map(y => ({
            ...y,
            isTransitioning: y.id === id || y.status === 'active'
          }))
        }));

        try {
          // Simulate some transition work
          await new Promise(resolve => setTimeout(resolve, 1000));

          set(state => ({
            years: state.years.map(y => {
              if (y.id === id) {
                return {
                  ...y,
                  status: 'active',
                  activatedAt: now,
                  isTransitioning: false,
                  updatedAt: now
                };
              }
              if (y.status === 'active') {
                return {
                  ...y,
                  status: 'closed',
                  closedAt: now,
                  isTransitioning: false,
                  updatedAt: now
                };
              }
              return {
                ...y,
                isTransitioning: false
              };
            }),
            activeYear: yearToActivate
          }));
        } catch (error) {
          set(state => ({
            years: state.years.map(y => ({
              ...y,
              isTransitioning: false
            }))
          }));
          throw error;
        }
      },

      closeYear: async (id) => {
        const { years } = get();
        const yearToClose = years.find(y => y.id === id);
        
        if (!yearToClose) {
          throw new Error('Curso académico no encontrado');
        }

        const now = new Date().toISOString();

        set(state => ({
          years: state.years.map(y => 
            y.id === id 
              ? {
                  ...y,
                  status: 'closed',
                  closedAt: now,
                  updatedAt: now
                }
              : y
          ),
          activeYear: state.activeYear?.id === id ? null : state.activeYear
        }));
      },

      setConsultationMode: async (id, roles) => {
        const { years } = get();
        const year = years.find(y => y.id === id);
        
        if (!year) {
          throw new Error('Curso académico no encontrado');
        }

        if (year.status !== 'closed') {
          throw new Error('Solo los cursos cerrados pueden ponerse en modo consulta');
        }

        set(state => ({
          years: state.years.map(y => 
            y.id === id 
              ? {
                  ...y,
                  status: 'consultation',
                  consultationRoles: roles,
                  updatedAt: new Date().toISOString()
                }
              : y
          )
        }));
      },

      validateYearTransition: (fromId, toStatus) => {
        const { years } = get();
        const year = years.find(y => y.id === fromId);
        if (!year) {
          return { isValid: false, error: 'Curso académico no encontrado' };
        }

        if (toStatus === 'consultation' && year.status !== 'closed') {
          return { isValid: false, error: 'Solo los cursos cerrados pueden pasar a modo consulta' };
        }

        return { isValid: true };
      },

      getYearsByStatus: (status) => {
        return get().years.filter(y => y.status === status);
      },

      canAccessYear: (yearId, userRole) => {
        const { years } = get();
        const year = years.find(y => y.id === yearId);
        if (!year) return false;

        if (year.status === 'consultation') {
          return year.consultationRoles?.includes(userRole) || false;
        }

        return year.status === 'active';
      },

      forceSetStatus: async (id, status) => {
        const { years } = get();
        const year = years.find(y => y.id === id);
        
        if (!year) {
          throw new Error('Curso académico no encontrado');
        }

        const now = new Date().toISOString();

        set(state => ({
          years: state.years.map(y => 
            y.id === id 
              ? {
                  ...y,
                  status,
                  updatedAt: now,
                  ...(status === 'active' ? { activatedAt: now } : {}),
                  ...(status === 'closed' ? { closedAt: now } : {})
                }
              : y
          ),
          activeYear: status === 'active' ? year : (state.activeYear?.id === id ? null : state.activeYear)
        }));
      },
    }),
    {
      name: 'academic-year-storage',
      version: 1,
    }
  )
);