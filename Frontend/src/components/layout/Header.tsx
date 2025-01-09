// src/components/layout/Header.tsx
import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Botão menu mobile */}
          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-900">
              Sistema de Condomínios
            </span>
          </div>

          {/* Área direita - Notificações e Perfil */}
          <div className="flex items-center gap-4">
            {/* Notificações */}
            <button className="text-gray-500 hover:text-gray-700">
              <Bell className="h-6 w-6" />
            </button>

            {/* Avatar/Perfil */}
            <div className="relative">
              <button className="flex items-center">
                <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    AD
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;