import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { useRegistrationStore } from '../../stores/registrationStore';
import { useNetworkStore } from '../../stores/networkStore';
import { useNotifications } from '../notifications/NotificationProvider';
import { UserRole } from '../../types/auth';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addUser } = useUserStore();
  const { activeYear } = useAcademicYearStore();
  const { settings, useCode } = useRegistrationStore();
  const { subnets, centers } = useNetworkStore();
  const { showNotification } = useNotifications();

  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    role: settings.defaultRole as UserRole,
    centro: '',
    subred: '',
    familiaProfesional: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeYear) {
      showNotification('error', 'No hay un curso académico activo');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showNotification('error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      // Use registration code if provided
      const code = location.state?.code;
      if (settings.requireCode && code) {
        useCode(code);
      }

      // Create user with all required fields
      const newUser = {
        id: crypto.randomUUID(),
        email: formData.email,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        role: formData.role,
        centro: formData.role === 'gestor' ? formData.centro : undefined,
        subred: formData.role === 'coordinador_subred' ? formData.subred : undefined,
        familiaProfesional: formData.familiaProfesional,
        academicYearId: activeYear.id,
        active: settings.autoApprove,
        password: formData.password,
        mustChangePassword: true,
        twoFactorEnabled: false,
        lastPasswordChange: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addUser(newUser);

      showNotification('success', settings.autoApprove 
        ? 'Registro completado correctamente' 
        : 'Registro enviado. Pendiente de aprobación'
      );
      
      navigate('/login');
    } catch (error) {
      showNotification('error', 'Error al registrar el usuario');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registro de Usuario
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Completa tus datos para crear una cuenta
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="nombre" className="sr-only">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="apellidos" className="sr-only">
                Apellidos
              </label>
              <input
                id="apellidos"
                name="apellidos"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Apellidos"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="telefono" className="sr-only">
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>

            {settings.allowedRoles.length > 1 && (
              <div>
                <label htmlFor="role" className="sr-only">
                  Rol
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                >
                  {settings.allowedRoles.map(role => (
                    <option key={role} value={role}>
                      {role === 'gestor' ? 'Gestor' : 'Coordinador de Subred'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.role === 'gestor' && (
              <div>
                <label htmlFor="centro" className="sr-only">
                  Centro
                </label>
                <select
                  id="centro"
                  name="centro"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  value={formData.centro}
                  onChange={(e) => setFormData({ ...formData, centro: e.target.value })}
                >
                  <option value="">Seleccionar centro...</option>
                  {centers.map(center => (
                    <option key={center.id} value={center.name}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.role === 'coordinador_subred' && (
              <div>
                <label htmlFor="subred" className="sr-only">
                  Subred
                </label>
                <select
                  id="subred"
                  name="subred"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  value={formData.subred}
                  onChange={(e) => setFormData({ ...formData, subred: e.target.value })}
                >
                  <option value="">Seleccionar subred...</option>
                  {subnets.map(subnet => (
                    <option key={subnet.id} value={subnet.name}>
                      {subnet.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="familiaProfesional" className="sr-only">
                Familia Profesional
              </label>
              <input
                id="familiaProfesional"
                name="familiaProfesional"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Familia Profesional"
                value={formData.familiaProfesional}
                onChange={(e) => setFormData({ ...formData, familiaProfesional: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Registrarse
            </button>
          </div>

          <div className="text-center">
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Volver al inicio de sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;