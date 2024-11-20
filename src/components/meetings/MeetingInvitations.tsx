import React from 'react';
import { Check, X, Calendar, Clock } from 'lucide-react';
import { MeetingInvitation } from '../../types/meeting';
import { useMeetingStore } from '../../stores/meetingStore';
import { useUserStore } from '../../stores/userStore';

interface MeetingInvitationsProps {
  invitations: MeetingInvitation[];
}

const MeetingInvitations: React.FC<MeetingInvitationsProps> = ({ invitations }) => {
  const { meetings, respondToInvitation } = useMeetingStore();
  const { users } = useUserStore();

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">
          Invitaciones Pendientes
        </h3>
        <div className="mt-4 space-y-4">
          {invitations.map(invitation => {
            const meeting = meetings.find(m => m.id === invitation.meetingId);
            const organizer = users.find(u => u.id === meeting?.organizer);

            if (!meeting || !organizer) return null;

            return (
              <div
                key={invitation.id}
                className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(meeting.startTime).toLocaleDateString()}
                    <Clock className="h-4 w-4 mx-1" />
                    {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <p className="text-sm text-gray-500">
                    Organiza: {organizer.nombre} {organizer.apellidos}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => respondToInvitation(invitation.id, true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Aceptar
                  </button>
                  <button
                    onClick={() => respondToInvitation(invitation.id, false)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rechazar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MeetingInvitations;