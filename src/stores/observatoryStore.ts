import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ObservationEntry, ObservatoryConfig, ObservationType } from '../types/observatory';
import { useAuthStore } from './authStore';
import { useNetworkStore } from './networkStore';
import OpenAI from 'openai';

interface ObservatoryState {
  entries: ObservationEntry[];
  config: ObservatoryConfig;
  addEntry: (entry: Omit<ObservationEntry, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<ObservationEntry>) => void;
  deleteEntry: (id: string) => void;
  publishEntry: (id: string) => Promise<void>;
  rejectEntry: (id: string, notes: string) => void;
  updateConfig: (updates: Partial<ObservatoryConfig>) => void;
}

// Sample entries for demonstration
const sampleEntries: ObservationEntry[] = [
  {
    id: crypto.randomUUID(),
    subnetId: "subnet-1",
    type: "technology",
    title: "Implementación de Realidad Virtual en FP",
    description: "Experiencia de uso de gafas VR para formación en mantenimiento industrial",
    url: "https://example.com/vr-fp",
    status: "published",
    aiContent: "La implementación de tecnologías de Realidad Virtual (VR) en la Formación Profesional marca un antes y un después en la manera de enseñar habilidades técnicas...",
    aiSummary: "Innovador proyecto que integra la Realidad Virtual en la formación de mantenimiento industrial, mejorando la experiencia práctica de los estudiantes.",
    aiTags: ["Realidad Virtual", "Industria 4.0", "Formación Práctica"],
    createdBy: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    subnetId: "subnet-2",
    type: "methodology",
    title: "Aprendizaje Basado en Retos en Desarrollo Web",
    description: "Metodología innovadora aplicada al ciclo de DAW",
    url: "https://example.com/abr-daw",
    status: "published",
    aiContent: "El Aprendizaje Basado en Retos (ABR) se ha implementado con éxito en el ciclo de Desarrollo de Aplicaciones Web...",
    aiSummary: "Exitosa implementación del Aprendizaje Basado en Retos en DAW, aumentando la motivación y resultados de los estudiantes.",
    aiTags: ["ABR", "Desarrollo Web", "Metodologías Activas"],
    createdBy: "2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const useObservatoryStore = create<ObservatoryState>()(
  persist(
    (set, get) => ({
      entries: sampleEntries,
      config: {
        enabled: true,
        aiEnabled: false,
        autoPublish: false,
        moderators: [],
      },

      addEntry: async (entryData) => {
        const { config } = get();
        const now = new Date().toISOString();
        
        let aiContent, aiSummary, aiTags;
        
        if (config.aiEnabled && config.openaiApiKey) {
          const openai = new OpenAI({
            apiKey: config.openaiApiKey,
          });

          try {
            const completion = await openai.chat.completions.create({
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content: config.promptTemplate || "Analiza la siguiente innovación educativa y genera un resumen y tags relevantes."
                },
                {
                  role: "user",
                  content: `Título: ${entryData.title}\nDescripción: ${entryData.description}\nTipo: ${entryData.type}`
                }
              ]
            });

            const response = completion.choices[0].message.content;
            // Parse AI response (implement parsing logic based on your needs)
            aiContent = response;
            aiSummary = response?.split('\n')[0];
            aiTags = ["IA", "Innovación", "FP"]; // Example tags
          } catch (error) {
            console.error('Error al generar contenido con IA:', error);
          }
        }

        const newEntry: ObservationEntry = {
          id: crypto.randomUUID(),
          status: config.autoPublish ? 'published' : 'pending',
          createdAt: now,
          updatedAt: now,
          publishedAt: config.autoPublish ? now : undefined,
          ...entryData,
          aiContent,
          aiSummary,
          aiTags,
        };

        set(state => ({
          entries: [...state.entries, newEntry]
        }));
      },

      updateEntry: (id, updates) => {
        set(state => ({
          entries: state.entries.map(entry =>
            entry.id === id
              ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
              : entry
          )
        }));
      },

      deleteEntry: (id) => {
        set(state => ({
          entries: state.entries.filter(entry => entry.id !== id)
        }));
      },

      publishEntry: async (id) => {
        const { entries, config } = get();
        const entry = entries.find(e => e.id === id);
        if (!entry) return;

        const now = new Date().toISOString();
        const { user } = useAuthStore.getState();

        set(state => ({
          entries: state.entries.map(e =>
            e.id === id
              ? {
                  ...e,
                  status: 'published',
                  publishedAt: now,
                  updatedAt: now,
                  reviewedBy: user?.id,
                }
              : e
          )
        }));
      },

      rejectEntry: (id, notes) => {
        const { user } = useAuthStore.getState();
        
        set(state => ({
          entries: state.entries.map(entry =>
            entry.id === id
              ? {
                  ...entry,
                  status: 'rejected',
                  reviewedBy: user?.id,
                  reviewNotes: notes,
                  updatedAt: new Date().toISOString(),
                }
              : entry
          )
        }));
      },

      updateConfig: (updates) => {
        set(state => ({
          config: {
            ...state.config,
            ...updates,
          }
        }));
      },
    }),
    {
      name: 'observatory-storage',
    }
  )
);