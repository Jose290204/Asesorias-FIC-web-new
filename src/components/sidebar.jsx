import { useState } from 'react';
import logoUas from '../assets/logo_uas.png';

export default function Sidebar({ currentTab, setCurrentTab, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  // Menú de navegación
  const navItems = [
    {
      id: 'exposiciones',
      label: 'Exposiciones',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'obras',
      label: 'Obras de Arte',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'artistas',
      label: 'Artistas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <aside 
      className={`bg-[#122a88] text-white flex flex-col justify-between min-h-screen transition-all duration-300 border-r-4 border-[#ffe600] relative shadow-xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Botón para colapsar/expandir la barra */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 bg-[#ffe600] text-[#122a88] p-1 rounded-full shadow-md hover:scale-110 transition-transform"
        title={collapsed ? "Expandir menú" : "Colapsar menú"}
      >
        <svg className={`w-4 h-4 transform transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Parte Superior: Encabezado e Identidad */}
      <div>
        <div className="p-4 flex items-center gap-3 border-b border-blue-900/60">
          <img 
            src={logoUas} 
            alt="Logo UAS" 
            className="w-10 h-10 object-contain shrink-0" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/40x40/122a88/FFFFFF?text=UAS';
            }}
          />
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h2 className="font-bold text-sm leading-tight tracking-wide">Gestor EDAV</h2>
              <p className="text-[10px] text-blue-200">Artes Visuales</p>
            </div>
          )}
        </div>

        {/* Navegación Principal */}
        <nav className="mt-6 px-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#ffe600] text-[#122a88] shadow-md font-semibold'
                    : 'text-blue-100 hover:bg-blue-900/50 hover:text-white'
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Parte Inferior: Perfil de usuario y Salir */}
      <div className="p-3 border-t border-blue-900/60">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2 bg-blue-900/40 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-200 text-[#122a88] font-bold flex items-center justify-center text-xs">
              AD
            </div>
            <div className="truncate text-xs">
              <p className="font-semibold text-white">Administrador</p>
              <p className="text-[10px] text-blue-200">admin@uas.edu.mx</p>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-colors"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}