import React, { useState } from 'react';
import { Plus, Calendar, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useMeetingStore } from '../stores/meetingStore';
import { Meeting } from '../types/meeting';
import MeetingList from '../components/meetings/MeetingList';
import MeetingForm from '../components/meetings/MeetingForm';
import MeetingInvitations from '../components/meetings/MeetingInvitations';
import { useNotifications } from '../components/notifications/NotificationProvider';

const Meetings = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const { user } = useAuthStore();
  const { settings } = useSettingsStore();
  const { meetings, getMeetingsByUser, getPendingInvitations } = useMeetingStore();
  const { showNotification } = useNotifications();

  if (!user) return null;

  // Verificar si el servicio está activo
  if (!settings.meetings?.enabled) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">
          El servicio de videoconferencias está desactivado temporalmente.
        </p>
      </div>
    );
  }

  // Verificar si el usuario tiene permiso para convocar reuniones
  const canCreateMeetings = settings.meetings.allowedRoles.includes(user.role);

  const userMeetings = getMeetingsByUser(user.id);
  const pendingInvitations = getPendingInvitations(user.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Videoconferencias</h2>
          <p className="mt-1 text-sm text-gray-500">
            Agenda y gestiona tus reuniones virtuales
          </p>
        </div>
        {canCreateMeetings && (
          <button
            onClick={() => {
              setSelectedMeeting(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Reunión
          </button>
        )}
      </div>

      {pendingInvitations.length > 0 && (
        <MeetingInvitations invitations={pendingInvitations} />
      )}

      {showForm ? (
        <MeetingForm
          initialData={selectedMeeting}
          onSubmit={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                Próximas Reuniones
              </h3>
              <MeetingList
                meetings={userMeetings.filter(m => m.status === 'scheduled')}
                onMeetingClick={setSelectedMeeting}
              />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Bell className="h-5 w-5 text-blue-500 mr-2" />
                Reuniones en Curso
              </h3>
              <MeetingList
                meetings={userMeetings.filter(m => m.status === 'in_progress')}
                onMeetingClick={setSelectedMeeting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meetings;