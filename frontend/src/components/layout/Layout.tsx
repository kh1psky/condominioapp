// src/components/layout/Layout.tsx
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Estado para controlar a visibilidade do sidebar em dispositivos móveis
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="h-screen bg-gray-50">
      {/* Container principal usando grid para layout responsivo */}
      <div className="flex h-full">
        {/* Sidebar - oculto em mobile, visível em desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <Sidebar />
        </div>

        {/* Área principal de conteúdo */}
        <div className="flex flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Área de conteúdo com scroll independente */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {/* Container com largura máxima para melhor leitura */}
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>

        {/* Sidebar móvel - overlay com animação */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Overlay escuro */}
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar móvel */}
            <div className="fixed inset-y-0 left-0 flex w-64 transform flex-col bg-white">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;