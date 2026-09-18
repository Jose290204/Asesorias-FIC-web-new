import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoFic from '../../../assets/fic_logo.png';
import logoUas from '../../../assets/logo_uas.png';

export default function AdminSidebar({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  // Elementos principales del menú superior
  const navItems = [
    {
      path: '/tutorias/admin/asesorias',
      label: 'Asesorías',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      path: '/tutorias/admin/solicitudes',
      label: 'Solicitudes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      path: '/tutorias/admin/reportes',
      label: 'Reportes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      path: '/tutorias/admin/asesores-disciplinares',
      label: 'Asesores Disciplinares',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      path: '/tutorias/admin/asesores-par',
      label: 'Asesores Par',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      path: '/tutorias/admin/estudiantes',
      label: 'Estudiantes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      )
    },
    {
      path: '/tutorias/admin/catalogos',
      label: 'Catálogos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  return (
    <aside 
      className={`bg-[#244B91] text-white flex flex-col justify-between min-h-screen transition-all duration-300 border-r-4 border-white relative shadow-xl ${
        collapsed ? 'w-20' : 'w-70'
      }`}
    >
      {/* Botón para colapsar/expandir la barra */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 bg-white text-[#122a88] p-1 rounded-full shadow-md hover:scale-110 transition-transform z-10"
        title={collapsed ? "Expandir menú" : "Colapsar menú"}
      >
        <svg className={`w-4 h-4 transform transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Parte Superior: Encabezado e Identidad */}
      <div>
        <div className="py-6 flex justify-center items-center">
          <div className={`rounded-full bg-white p-1 border-0 border-white flex items-center justify-center overflow-hidden transition-all ${
            collapsed ? 'w-12 h-12' : 'w-30 h-30'
          }`}>
            <img 
              src={logoFic} 
              alt="Logo Tutorías" 
              className="w-full h-full object-contain rounded-full" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = logoUas;
              }}
            />
          </div>
        </div>

        {/* Navegación Principal con NavLink */}
        <nav className="mt-2 px-3 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              replace
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#122a88] shadow-md font-semibold'
                    : 'text-blue-100 hover:bg-blue-900/50 hover:text-white'
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Parte Inferior Perfil  */}
      <div className="p-3 border-t border-blue-900/60 space-y-1.5">
        <NavLink
          to="/tutorias/admin/perfil-administrador"
          replace
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              isActive
                ? 'bg-white text-[#122a88] shadow-md font-semibold'
                : 'text-blue-100 hover:bg-blue-900/50 hover:text-white'
            }`
          }
        >
          <span className="shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          {!collapsed && <span className="truncate">Perfil</span>}
        </NavLink>

        {/* Botón de Cerrar Sesión */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-red-200 hover:bg-red-500/40 hover:text-red-100 transition-colors mb-2 cursor-pointer"
          title="Cerrar Sesión"
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