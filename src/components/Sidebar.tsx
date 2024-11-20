import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';

interface MenuItem {
  icon: LucideIcon;
  text: string;
  path: string;
  isObservatory?: boolean;
  isAI?: boolean;
}

interface SidebarProps {
  menuItems: MenuItem[];
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, className = '' }) => {
  const location = useLocation();
  const { settings } = useSettingsStore();

  // Separate menu items by type
  const regularItems = menuItems.filter(item => !item.isObservatory && !item.isAI);
  const observatoryItems = menuItems.filter(item => item.isObservatory);
  const aiItems = menuItems.filter(item => item.isAI);

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    
    return (
      <Link
        key={item.text}
        to={item.path}
        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive
            ? 'text-white'
            : 'text-gray-600 hover:bg-opacity-75 hover:text-gray-900'
        }`}
        style={{
          backgroundColor: isActive ? settings.colors.primary : 'transparent',
        }}
      >
        <Icon
          className={`mr-3 h-5 w-5 ${
            isActive
              ? 'text-white'
              : 'text-gray-400 group-hover:text-gray-500'
          }`}
        />
        {item.text}
      </Link>
    );
  };

  return (
    <aside className={className} style={{ backgroundColor: settings.colors.sidebar }}>
      <nav className="h-full flex flex-col">
        <div className="px-2 py-4 space-y-1 flex-1">
          {regularItems.map(renderMenuItem)}
        </div>

        {observatoryItems.length > 0 && (
          <>
            <div className="px-2 py-2">
              <div className="border-t border-gray-200"></div>
            </div>
            <div className="px-2 pb-4 space-y-1">
              {observatoryItems.map(renderMenuItem)}
            </div>
          </>
        )}

        {aiItems.length > 0 && (
          <>
            <div className="px-2 py-2">
              <div className="border-t border-gray-200"></div>
            </div>
            <div className="px-2 pb-4 space-y-1">
              {aiItems.map(renderMenuItem)}
            </div>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;