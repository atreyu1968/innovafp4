```typescript
export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type MeetingType = 'subred' | 'coordinacion' | 'formacion' | 'proyecto';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  type: MeetingType;
  organizer: string; // userId
  participants: string[]; // userIds
  startTime: string;
  endTime: string;
  status: MeetingStatus;
  meetingUrl?: string;
  recordingUrl?: string;
  agenda?: string[];
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingInvitation {
  id: string;
  meetingId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'declined';
  responseMessage?: string;
  sentAt: string;
  respondedAt?: string;
}

export interface MeetingRecurrence {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number; // cada cuántos días/semanas/meses
  endDate?: string;
  daysOfWeek?: number[]; // 0-6 para reuniones semanales
  dayOfMonth?: number; // 1-31 para reuniones mensuales
}
```