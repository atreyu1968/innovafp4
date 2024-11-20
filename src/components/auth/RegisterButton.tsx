import React from 'react';
import { UserPlus } from 'lucide-react';
import { useRegistrationStore } from '../../stores/registrationStore';

const RegisterButton = () => {
  const { settings } = useRegistrationStore();

  if (!settings.enabled) return null;

  return (
    <a
      href="/register"
      className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
    >
      <UserPlus className="h-4 w-4 mr-2" />
      Registrarse
    </a>
  );
};

export default RegisterButton;