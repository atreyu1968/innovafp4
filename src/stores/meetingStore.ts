import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Meeting, MeetingInvitation, MeetingRecurrence } from '../types/meeting';
import { useAuthStore } from './authStore';
import { useSettingsStore } from './settingsStore';
import { sendMeetingInvitation, sendMeetingReminder, sendMeetingUpdate, sendMeetingCancellation } from '../services/notifications/meetingNotifications';
import { useUserStore } from './userStore';

interface MeetingState {
  meetings: Meeting[];
  invitations: MeetingInvitation[];
  addMeeting: (meeting: Omit<Meeting, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Meeting>;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  scheduleMeeting: (meeting: Omit<Meeting, 'id'>, recurrence?: MeetingRecurrence) => Promise<void>;
  sendInvitations: (meetingId: string, userIds: string[]) => void;
  respondToInvitation: (invitationId: string, accept: boolean, message?: string) => void;
  startMeeting: (id: string) => Promise<string>;
  endMeeting: (id: string) => void;
  getMeetingsByUser: (userId: string) => Meeting[];
  getPendingInvitations: (userId: string) => MeetingInvitation[];
  getUpcomingMeetings: () => Meeting[];
}

export const useMeetingStore = create<MeetingState>()(
  persist(
    (set, get) => ({
      meetings: [],
      invitations: [],

      addMeeting: async (meetingData) => {
        const { user } = useAuthStore.getState();
        if (!user) throw new Error('Usuario no autenticado');

        const meeting: Meeting = {
          id: crypto.randomUUID(),
          ...meetingData,
          status: 'scheduled',
          organizer: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set(state => ({
          meetings: [...state.meetings, meeting]
        }));

        return meeting;
      },

      updateMeeting: (id, updates) => {
        const { users } = useUserStore.getState();
        const oldMeeting = get().meetings.find(m => m.id === id);
        
        if (!oldMeeting) return;

        const changes: string[] = [];
        if (updates.startTime && updates.startTime !== oldMeeting.startTime) {
          changes.push('Fecha/hora actualizada');
        }
        if (updates.title && updates.title !== oldMeeting.title) {
          changes.push('Título actualizado');
        }
        if (updates.description && updates.description !== oldMeeting.description) {
          changes.push('Descripción actualizada');
        }

        set(state => ({
          meetings: state.meetings.map(meeting =>
            meeting.id === id
              ? { ...meeting, ...updates, updatedAt: new Date().toISOString() }
              : meeting
          )
        }));

        // Notificar a los participantes si hay cambios
        if (changes.length > 0) {
          const updatedMeeting = get().meetings.find(m => m.id === id);
          if (updatedMeeting) {
            updatedMeeting.participants.forEach(participantId => {
              const participant = users.find(u => u.id === participantId);
              if (participant) {
                sendMeetingUpdate(updatedMeeting, participant, changes);
              }
            });
          }
        }
      },

      deleteMeeting: (id) => {
        const { users } = useUserStore.getState();
        const meeting = get().meetings.find(m => m.id === id);
        
        if (meeting) {
          // Notificar a los participantes
          meeting.participants.forEach(participantId => {
            const participant = users.find(u => u.id === participantId);
            if (participant) {
              sendMeetingCancellation(meeting, participant);
            }
          });
        }

        set(state => ({
          meetings: state.meetings.filter(m => m.id !== id),
          invitations: state.invitations.filter(i => i.meetingId !== id)
        }));
      },

      scheduleMeeting: async (meetingData, recurrence) => {
        const meeting = await get().addMeeting(meetingData);

        if (recurrence) {
          // Generar reuniones recurrentes
          const generateRecurringMeetings = () => {
            const startDate = new Date(meetingData.startTime);
            const endDate = recurrence.endDate 
              ? new Date(recurrence.endDate)
              : new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 días por defecto

            const meetings: Omit<Meeting, 'id' | 'status' | 'createdAt' | 'updatedAt'>[] = [];
            let currentDate = new Date(startDate);

            while (currentDate <= endDate) {
              if (recurrence.type === 'daily') {
                currentDate.setDate(currentDate.getDate() + recurrence.interval);
              } else if (recurrence.type === 'weekly' && recurrence.daysOfWeek) {
                // Implementar lógica semanal
              } else if (recurrence.type === 'monthly' && recurrence.dayOfMonth) {
                // Implementar lógica mensual
              }

              if (currentDate <= endDate) {
                meetings.push({
                  ...meetingData,
                  startTime: new Date(currentDate).toISOString(),
                  endTime: new Date(
                    currentDate.getTime() + 
                    (new Date(meetingData.endTime).getTime() - new Date(meetingData.startTime).getTime())
                  ).toISOString()
                });
              }
            }

            return meetings;
          };

          const recurringMeetings = generateRecurringMeetings();
          for (const meeting of recurringMeetings) {
            await get().addMeeting(meeting);
          }
        }

        // Enviar invitaciones
        get().sendInvitations(meeting.id, meeting.participants);
      },

      sendInvitations: (meetingId, userIds) => {
        const { users } = useUserStore.getState();
        const meeting = get().meetings.find(m => m.id === meetingId);
        const organizer = meeting ? users.find(u => u.id === meeting.organizer) : null;
        
        if (!meeting || !organizer) return;

        const newInvitations = userIds.map(userId => {
          const invitee = users.find(u => u.id === userId);
          if (invitee) {
            sendMeetingInvitation(meeting, invitee, organizer);
          }

          return {
            id: crypto.randomUUID(),
            meetingId,
            userId,
            status: 'pending' as const,
            sentAt: new Date().toISOString(),
          };
        });

        set(state => ({
          invitations: [...state.invitations, ...newInvitations]
        }));
      },

      respondToInvitation: (invitationId, accept, message) => {
        set(state => ({
          invitations: state.invitations.map(invitation =>
            invitation.id === invitationId
              ? {
                  ...invitation,
                  status: accept ? 'accepted' : 'declined',
                  responseMessage: message,
                  respondedAt: new Date().toISOString()
                }
              : invitation
          )
        }));
      },

      startMeeting: async (id) => {
        const { settings } = useSettingsStore.getState();
        
        // Aquí integrarías con el servicio de videoconferencia configurado
        const meetingUrl = String("https://meet.jit.si/") + id; // Ejemplo con Jitsi

        set(state => ({
          meetings: state.meetings.map(meeting =>
            meeting.id === id
              ? {
                  ...meeting,
                  status: 'in_progress',
                  meetingUrl,
                  updatedAt: new Date().toISOString()
                }
              : meeting
          )
        }));

        return meetingUrl;
      },

      endMeeting: (id) => {
        set(state => ({
          meetings: state.meetings.map(meeting =>
            meeting.id === id
              ? {
                  ...meeting,
                  status: 'completed',
                  updatedAt: new Date().toISOString()
                }
              : meeting
          )
        }));
      },

      getMeetingsByUser: (userId) => {
        const { meetings, invitations } = get();
        return meetings.filter(meeting =>
          meeting.organizer === userId ||
          meeting.participants.includes(userId) ||
          invitations.some(i => 
            i.meetingId === meeting.id && 
            i.userId === userId && 
            i.status === 'accepted'
          )
        );
      },

      getPendingInvitations: (userId) => {
        return get().invitations.filter(i => 
          i.userId === userId && 
          i.status === 'pending'
        );
      },

      getUpcomingMeetings: () => {
        const now = new Date();
        return get().meetings
          .filter(meeting => 
            meeting.status === 'scheduled' && 
            new Date(meeting.startTime) > now
          )
          .sort((a, b) => 
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
      },
    }),
    {
      name: 'meeting-storage',
    }
  )
);