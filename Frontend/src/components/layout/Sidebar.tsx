// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  Building2,
  Users,
  Wallet,
  Wrench,
  FileText,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  // Links de navegação com ícones
 // Links de navegação com ícones
  const navigation = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'Condomínios', icon: Building2, href: '/condominios' },
    { name: 'Unidades', icon: Users, href: '/unidades' },
    { name: 'Financeiro', icon: Wallet, href: '/financeiro' },
    { name: 'Manutenções', icon: Wrench, href: '/manutencoes' }, // Atualizado aqui também
    { name: 'Relatórios', icon: FileText, href: '/relatorios' },
  ];

  return (
    <div className="flex h-full flex-col bg-gray-800">
      {/* Cabeçalho do Sidebar */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className="text-xl font-bold text-white">
          Condomínios
        </div>
        {onClose && (
          <button
            className="text-gray-400 hover:text-white md:hidden"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Links de navegação */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Rodapé do Sidebar */}
      <div className="border-t border-gray-700 p-4">
        <NavLink
          to="/configuracoes"
          className="flex items-center gap-3 text-sm font-medium text-gray-300 hover:text-white"
        >
          <Settings className="h-5 w-5" />
          Configurações
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;