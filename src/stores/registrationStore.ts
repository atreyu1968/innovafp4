import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RegistrationCode, RegistrationSettings } from '../types/auth';
import { useAuthStore } from './authStore';
import { useSettingsStore } from './settingsStore';
import { useAcademicYearStore } from './academicYearStore';

interface RegistrationState {
  codes: RegistrationCode[];
  settings: RegistrationSettings;
  generateCode: (maxUses: number, expiresIn: number) => string;
  validateCode: (code: string) => boolean;
  useCode: (code: string) => void;
  updateSettings: (settings: Partial<RegistrationSettings>) => void;
  getActiveCodes: () => RegistrationCode[];
  cleanExpiredCodes: () => void;
}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, get) => ({
      codes: [],
      settings: {
        enabled: false,
        requireCode: true,
        defaultRole: 'gestor',
        allowedRoles: ['gestor'],
        autoApprove: false,
        notifyAdmin: true,
      },

      generateCode: (maxUses = 1, expiresIn = 24) => {
        const { user } = useAuthStore.getState();
        const { activeYear } = useAcademicYearStore.getState();
        
        if (!user || !activeYear) throw new Error('No hay usuario o curso activo');

        // Generate a random 8-character code
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        
        const newCode: RegistrationCode = {
          id: crypto.randomUUID(),
          code,
          maxUses,
          usedCount: 0,
          expiresAt: new Date(Date.now() + expiresIn * 3600000).toISOString(),
          createdBy: user.id,
          createdAt: new Date().toISOString(),
          academicYearId: activeYear.id,
          active: true,
        };

        set(state => ({
          codes: [...state.codes, newCode]
        }));

        return code;
      },

      validateCode: (code: string) => {
        const validCode = get().codes.find(c => 
          c.code === code &&
          c.active &&
          new Date(c.expiresAt) > new Date() &&
          c.usedCount < c.maxUses
        );
        return !!validCode;
      },

      useCode: (code: string) => {
        set(state => ({
          codes: state.codes.map(c =>
            c.code === code
              ? { ...c, usedCount: c.usedCount + 1 }
              : c
          )
        }));
      },

      updateSettings: (updates) => {
        set(state => ({
          settings: {
            ...state.settings,
            ...updates,
          }
        }));
      },

      getActiveCodes: () => {
        const now = new Date();
        return get().codes.filter(code => 
          code.active && 
          new Date(code.expiresAt) > now &&
          code.usedCount < code.maxUses
        );
      },

      cleanExpiredCodes: () => {
        const now = new Date();
        set(state => ({
          codes: state.codes.filter(code => 
            new Date(code.expiresAt) > now && 
            code.usedCount < code.maxUses
          )
        }));
      },
    }),
    {
      name: 'registration-storage',
    }
  )
);