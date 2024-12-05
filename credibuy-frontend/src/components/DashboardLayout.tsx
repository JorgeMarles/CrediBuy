import React, { useState } from 'react';
import { Users, Package, CreditCard, Menu, X } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

interface DashboardLayoutType {
  children?: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutType> = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { icon: Users, text: 'Clientes', href: '/clients' },
    { icon: Package, text: 'Productos', href: '/products' },
    { icon: CreditCard, text: 'Créditos', href: '/credits' }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden"> {/* Cambiado a flex y h-screen */}
      {/* Barra superior móvil */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b px-4 py-3 z-30">
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-900">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Overlay para móvil cuando el sidebar está abierto */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static h-full bg-white shadow-lg z-30
        w-64 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header del Sidebar */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <button 
            onClick={toggleSidebar} 
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Links de navegación */}
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.text}
              to={item.href}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.text}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto bg-gray-100 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;