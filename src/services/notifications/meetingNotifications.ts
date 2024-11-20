import { Meeting } from '../../types/meeting';
import { User } from '../../types/user';
import { sendEmail } from '../email';
import { useMessageStore } from '../../stores/messageStore';

export const sendMeetingInvitation = async (meeting: Meeting, invitee: User, organizer: User) => {
  // 1. Enviar notificación interna
  const { sendMessage } = useMessageStore.getState();
  
  sendMessage({
    senderId: 'system',
    recipientId: invitee.id,
    content: `Has sido invitado a la reunión "${meeting.title}" por ${organizer.nombre} ${organizer.apellidos}.\n\nFecha: ${new Date(meeting.startTime).toLocaleString()}\n\nPuedes aceptar o rechazar la invitación desde la sección de reuniones.`,
  });

  // 2. Enviar correo electrónico
  const emailContent = `
    <h2>Invitación a Reunión: ${meeting.title}</h2>
    <p>Has sido invitado por ${organizer.nombre} ${organizer.apellidos} a una reunión.</p>
    
    <h3>Detalles de la Reunión:</h3>
    <ul>
      <li><strong>Fecha:</strong> ${new Date(meeting.startTime).toLocaleDateString()}</li>
      <li><strong>Hora:</strong> ${new Date(meeting.startTime).toLocaleTimeString()} - ${new Date(meeting.endTime).toLocaleTimeString()}</li>
      <li><strong>Tipo:</strong> ${meeting.type === 'subred' ? 'Reunión de Subred' :
                                  meeting.type === 'coordinacion' ? 'Coordinación' :
                                  meeting.type === 'formacion' ? 'Formación' : 'Proyecto'}</li>
    </ul>
    
    ${meeting.description ? `<p><strong>Descripción:</strong> ${meeting.description}</p>` : ''}
    
    ${meeting.agenda?.length ? `
      <h3>Agenda:</h3>
      <ul>
        ${meeting.agenda.map(item => `<li>${item}</li>`).join('')}
      </ul>
    ` : ''}
    
    <p>Puedes aceptar o rechazar esta invitación accediendo a la plataforma.</p>
  `;

  await sendEmail({
    to: invitee.email,
    subject: `Invitación a Reunión: ${meeting.title}`,
    html: emailContent,
  });
};

export const sendMeetingReminder = async (meeting: Meeting, participant: User) => {
  // 1. Enviar notificación interna
  const { sendMessage } = useMessageStore.getState();
  
  sendMessage({
    senderId: 'system',
    recipientId: participant.id,
    content: `Recordatorio: La reunión "${meeting.title}" comenzará en 15 minutos.`,
  });

  // 2. Enviar correo electrónico
  const emailContent = `
    <h2>Recordatorio de Reunión: ${meeting.title}</h2>
    <p>Tu reunión comenzará en 15 minutos.</p>
    
    <h3>Detalles de la Reunión:</h3>
    <ul>
      <li><strong>Fecha:</strong> ${new Date(meeting.startTime).toLocaleDateString()}</li>
      <li><strong>Hora:</strong> ${new Date(meeting.startTime).toLocaleTimeString()}</li>
    </ul>
    
    <p>Cuando sea la hora, podrás unirte a la reunión desde la plataforma.</p>
  `;

  await sendEmail({
    to: participant.email,
    subject: `Recordatorio: ${meeting.title}`,
    html: emailContent,
  });
};

export const sendMeetingUpdate = async (meeting: Meeting, participant: User, changes: string[]) => {
  // 1. Enviar notificación interna
  const { sendMessage } = useMessageStore.getState();
  
  sendMessage({
    senderId: 'system',
    recipientId: participant.id,
    content: `La reunión "${meeting.title}" ha sido actualizada. Cambios: ${changes.join(', ')}.`,
  });

  // 2. Enviar correo electrónico
  const emailContent = `
    <h2>Actualización de Reunión: ${meeting.title}</h2>
    <p>Se han realizado cambios en la reunión:</p>
    
    <ul>
      ${changes.map(change => `<li>${change}</li>`).join('')}
    </ul>
    
    <h3>Detalles Actualizados:</h3>
    <ul>
      <li><strong>Fecha:</strong> ${new Date(meeting.startTime).toLocaleDateString()}</li>
      <li><strong>Hora:</strong> ${new Date(meeting.startTime).toLocaleTimeString()} - ${new Date(meeting.endTime).toLocaleTimeString()}</li>
    </ul>
  `;

  await sendEmail({
    to: participant.email,
    subject: `Actualización de Reunión: ${meeting.title}`,
    html: emailContent,
  });
};

export const sendMeetingCancellation = async (meeting: Meeting, participant: User, reason?: string) => {
  // 1. Enviar notificación interna
  const { sendMessage } = useMessageStore.getState();
  
  sendMessage({
    senderId: 'system',
    recipientId: participant.id,
    content: `La reunión "${meeting.title}" ha sido cancelada.${reason ? ` Motivo: ${reason}` : ''}`,
  });

  // 2. Enviar correo electrónico
  const emailContent = `
    <h2>Cancelación de Reunión: ${meeting.title}</h2>
    <p>La reunión programada para el ${new Date(meeting.startTime).toLocaleString()} ha sido cancelada.</p>
    ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
  `;

  await sendEmail({
    to: participant.email,
    subject: `Cancelación de Reunión: ${meeting.title}`,
    html: emailContent,
  });
};