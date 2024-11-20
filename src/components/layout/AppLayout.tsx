import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Network, FileText, Users as UsersIcon, BarChart3, Settings as SettingsIcon, HelpCircle, Mail, Building2, Layout, Calendar, Eye, Sparkle, Video } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useSettingsStore } from '../../stores/settingsStore';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import Login from '../../pages/Login';
import Dashboard from '../../pages/Dashboard';
import UsersPage from '../../pages/Users';
import Forms from '../../pages/Forms';
import Reports from '../../pages/Reports';
import SettingsPage from '../../pages/Settings';
import Help from '../../pages/Help';
import NetworkManagement from '../../pages/NetworkManagement';
import ProtectedRoute from '../ProtectedRoute';
import LandingPage from '../../pages/LandingPage';
import Messages from '../../pages/Messages';
import DashboardBuilder from '../../pages/DashboardBuilder';
import DashboardManager from '../../pages/DashboardManager';
import AcademicYears from '../../pages/AcademicYears';
import Observatory from '../../pages/Observatory';
import ObservatoryBlog from '../../pages/ObservatoryBlog';
import AIGenerator from '../../pages/AIGenerator';
import Register from '../../pages/Register';
import Meetings from '../../pages/Meetings';

const AppLayout = () => {
  const { isAuthenticated, user, activeRole } = useAuthStore();
  const { settings } = useSettingsStore();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isLandingPage = location.pathname === '/landing';
  const isRegisterPage = location.pathname.startsWith('/register');

  const getMenuItems = () => {
    const regularItems = [];
    const observatoryItems = [];
    const aiItems = [];

    // Admin menu
    if (user?.role === 'coordinador_general' && activeRole === 'admin') {
      regularItems.push(
        { icon: Network, text: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, text: 'Cursos Académicos', path: '/cursos' },
        { icon: Building2, text: 'Subredes y Centros', path: '/red' },
        { icon: UsersIcon, text: 'Usuarios', path: '/usuarios' },
        { icon: FileText, text: 'Formularios', path: '/formularios' },
        { icon: Layout, text: 'Dashboards', path: '/dashboards' },
        { icon: BarChart3, text: 'Informes', path: '/informes' },
        { icon: Video, text: 'Videoconferencias', path: '/reuniones' },
        { icon: Mail, text: 'Mensajes', path: '/mensajes' },
        { icon: SettingsIcon, text: 'Configuración', path: '/configuracion' },
        { icon: HelpCircle, text: 'Ayuda', path: '/ayuda' }
      );

      observatoryItems.push(
        { icon: Eye, text: 'Observatorio', path: '/observatorio', isObservatory: true },
        { icon: FileText, text: 'Blog', path: '/observatorio/blog', isObservatory: true }
      );

      aiItems.push(
        { icon: Sparkle, text: 'Generador por IA', path: '/ai-generator', isAI: true }
      );
    } else {
      // Menu for other roles
      regularItems.push(
        { icon: Network, text: 'Dashboard', path: '/dashboard' },
        { icon: FileText, text: 'Formularios', path: '/formularios' },
        { icon: Video, text: 'Videoconferencias', path: '/reuniones' },
        { icon: Mail, text: 'Mensajes', path: '/mensajes' },
        { icon: HelpCircle, text: 'Ayuda', path: '/ayuda' }
      );

      if (user?.role === 'coordinador_subred') {
        observatoryItems.push(
          { icon: Eye, text: 'Observatorio', path: '/observatorio', isObservatory: true },
          { icon: FileText, text: 'Blog', path: '/observatorio/blog', isObservatory: true }
        );
      }
    }

    return [...regularItems, ...observatoryItems, ...aiItems];
  };

  if (isLoginPage || isLandingPage || isRegisterPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/register/*" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar className="fixed top-0 left-0 right-0 z-10" />
      <div className="flex flex-1 pt-16">
        {isAuthenticated && (
          <Sidebar 
            menuItems={getMenuItems()} 
            className="w-64 fixed left-0 top-16 bottom-4 overflow-y-auto"
          />
        )}
        <main className={`flex-1 ${isAuthenticated ? 'ml-64 p-8 mb-4' : ''}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/cursos" element={<ProtectedRoute allowedRoles={['coordinador_general']}><AcademicYears /></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute allowedRoles={['coordinador_general']}><UsersPage /></ProtectedRoute>} />
            <Route path="/red" element={<ProtectedRoute allowedRoles={['coordinador_general']}><NetworkManagement /></ProtectedRoute>} />
            <Route path="/formularios" element={<ProtectedRoute><Forms /></ProtectedRoute>} />
            <Route path="/informes" element={<ProtectedRoute allowedRoles={['coordinador_general']}><Reports /></ProtectedRoute>} />
            <Route path="/mensajes" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/reuniones" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
            <Route path="/configuracion" element={<ProtectedRoute allowedRoles={['coordinador_general']}><SettingsPage /></ProtectedRoute>} />
            <Route path="/ayuda" element={<ProtectedRoute><Help /></ProtectedRoute>} />
            <Route path="/dashboards" element={<ProtectedRoute allowedRoles={['coordinador_general']}><DashboardManager /></ProtectedRoute>} />
            <Route path="/dashboard-builder" element={<ProtectedRoute allowedRoles={['coordinador_general']}><DashboardBuilder /></ProtectedRoute>} />
            <Route path="/dashboard-builder/:id" element={<ProtectedRoute allowedRoles={['coordinador_general']}><DashboardBuilder /></ProtectedRoute>} />
            <Route path="/observatorio" element={<ProtectedRoute><Observatory /></ProtectedRoute>} />
            <Route path="/observatorio/blog" element={<ProtectedRoute><ObservatoryBlog /></ProtectedRoute>} />
            <Route path="/ai-generator" element={<ProtectedRoute allowedRoles={['coordinador_general']}><AIGenerator /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
      <footer 
        className="fixed bottom-0 left-0 right-0 h-4 flex items-center justify-center text-[10px] text-white/90 z-20"
        style={{ backgroundColor: settings.colors.navbar.from }}
      >
        <span>v1.0 © 2024 - Desarrollado por Francisco Javier González Rolo</span>
      </footer>
    </div>
  );
};

export default AppLayout;