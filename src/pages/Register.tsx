import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegistrationCodeForm from '../components/auth/RegistrationCodeForm';
import RegistrationForm from '../components/auth/RegistrationForm';
import { useRegistrationStore } from '../stores/registrationStore';

const Register = () => {
  const { settings } = useRegistrationStore();

  if (!settings.enabled) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          settings.requireCode 
            ? <RegistrationCodeForm /> 
            : <Navigate to="/register/form" replace />
        } 
      />
      <Route path="/form" element={<RegistrationForm />} />
    </Routes>
  );
};

export default Register;