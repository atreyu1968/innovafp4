import React from 'react';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { Meeting } from '../../types/meeting';
import { useUserStore } from '../../stores/userStore';

interface MeetingListProps {
  meetings: Meeting[];
  onMeetingClick: (meeting: Meeting) => void;
}

const MeetingList: React.FC<MeetingListProps> = ({ meetings, onMeetingClick }) => {
  const { users } = useUserStore();

  if (meetings.length === 0) {
    return (
      <p className="text-center py-8 text-gray-500">
        No hay reuniones programadas
      </p>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {meetings.map(meeting => {
        const organizer = users.find(u => u.id === meeting.organizer);
        const participantCount = meeting.participants.length;

        return (
          <div
            key={meeting.id}
            className="bg-white border rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
            onClick={() => onMeetingClick(meeting)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                {meeting.description && (
                  <p className="text-sm text-gray-500 mt-1">{meeting.description}</p>
                )}
              </div>
              {meeting.status === 'in_progress' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  En curso
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(meeting.startTime).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {participantCount} participante{participantCount !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center">
                <Video className="h-4 w-4 mr-2" />
                {meeting.type === 'subred' ? 'Subred' :
                 meeting.type === 'coordinacion' ? 'Coordinación' :
                 meeting.type === 'formacion' ? 'Formación' :
                 'Proyecto'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MeetingList;