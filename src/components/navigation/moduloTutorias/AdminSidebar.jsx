import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logoFic from '../../../assets/fic_logo.png';
import logoUas from '../../../assets/logo_uas.png';

// Ruta base del grupo desplegable de reportes
const RUTA_REPORTES = '/admin/reportes';

// Opciones que salen al desplegar "Reportes"
const SUBMENU_REPORTES = [
   { path: `${RUTA_REPORTES}/asesor`, label: 'Por asesor' },
  { path: `${RUTA_REPORTES}/materia`, label: 'Por materia' },
  { path: `${RUTA_REPORTES}/estudiante`, label: 'Por estudiante' },
  { path: `${RUTA_REPORTES}/grupo`, label: 'Por grupo' },
  { path: `${RUTA_REPORTES}/licenciatura`, label: 'Por licenciatura' }
];

export default function AdminSidebar({ mobile = false }) {
  const { pathname } = useLocation();

  const [collapsedState, setCollapsed] = useState(false);
  // En el drawer móvil el menú siempre va expandido
  const collapsed = mobile ? false : collapsedState;

  // El grupo de reportes empieza abierto si ya se está dentro de alguno de sus reportes
  const enReportes = pathname.startsWith(RUTA_REPORTES);
  const [reportesAbierto, setReportesAbierto] = useState(enReportes);

  // Al entrar a un reporte (por ejemplo con un enlace directo) el grupo se abre solo
  useEffect(() => {
    if (enReportes) setReportesAbierto(true);
  }, [enReportes]);

  // Con el menú colapsado solo se ven íconos: al tocar Reportes se expande el menú para mostrar las opciones
  const handleToggleReportes = () => {
    if (collapsed) {
      setCollapsed(false);
      setReportesAbierto(true);
      return;
    }
    setReportesAbierto((prev) => !prev);
  };

  const iconoReportes = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  // Elementos del menú sin submenú
  const navItemsAntes = [
    {
      path: '/admin/asesorias',
      label: 'Asesorías',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      path: '/admin/solicitudes',
      label: 'Solicitudes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    }
  ];

  const navItemsDespues = [
    {
      path: '/admin/asesores-disciplinares',
      label: 'Asesores Disciplinares',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      path: '/admin/asesores-par',
      label: 'Asesores Par',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      path: '/admin/estudiantes',
      label: 'Estudiantes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      )
    },
    {
      path: '/admin/usuarios-en-linea',
      label: 'Usuarios en línea',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M8.464 15.536a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072M12 12h.01" />
        </svg>
      )
    }
  ];

  // Enlace normal del menú
  const renderItem = (item) => (
    <NavLink
      key={item.path}
      to={item.path}
      replace
      className={({ isActive }) =>
        `w-full flex items-center gap-3 px-3 py-3 rounded-[5px] font-medium text-sm transition-all duration-200 ${isActive
          ? 'bg-white text-[#122a88] shadow-md font-semibold'
          : 'text-blue-100 hover:bg-blue-900/50 hover:text-white'
        }`
      }
    >
      <span className="shrink-0">{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );

  return (
    <aside
      className={`bg-[#244B91] text-white flex flex-col justify-between min-h-dvh shrink-0 transition-all duration-300 relative shadow-xl ${collapsed ? 'w-20' : 'w-70'
        }`}
    >
      {/* Botón para colapsar/expandir la barra (solo escritorio) */}
      {!mobile && (
        <button
          onClick={() => setCollapsed(!collapsedState)}
          className="absolute -right-3 top-8 bg-white text-[#122a88] p-1 rounded-full shadow-md hover:scale-110 transition-transform z-10"
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          <svg className={`w-4 h-4 transform transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div>
        <div className="py-6 flex justify-center items-center">
          <div className={`rounded-full bg-white p-1 border-0 border-white flex items-center justify-center overflow-hidden transition-all ${collapsed ? 'w-12 h-12' : 'w-30 h-30'
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

        <nav className="mt-2 px-3 space-y-1.5">
          {navItemsAntes.map(renderItem)}

          {/* Reportes: botón con flechita que despliega los reportes */}
          <div>
            <button
              type="button"
              onClick={handleToggleReportes}
              aria-expanded={reportesAbierto}
              title={collapsed ? 'Reportes' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-[5px] font-medium text-sm transition-all duration-200 cursor-pointer ${enReportes
                ? 'bg-blue-900/50 text-white font-semibold'
                : 'text-blue-100 hover:bg-blue-900/50 hover:text-white'
                }`}
            >
              <span className="shrink-0">{iconoReportes}</span>
              {!collapsed && (
                <>
                  <span className="truncate flex-1 text-left">Reportes</span>
                  <svg
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${reportesAbierto ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>

            {!collapsed && reportesAbierto && (
              <div className="mt-1 ml-5 pl-3 border-l border-blue-300/40 space-y-1">
                {SUBMENU_REPORTES.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    replace
                    className={({ isActive }) =>
                      `w-full flex items-center px-3 py-2 rounded-[5px] text-sm transition-all duration-200 ${isActive
                        ? 'bg-white text-[#122a88] shadow-md font-semibold'
                        : 'text-blue-100 hover:bg-blue-900/50 hover:text-white'
                      }`
                    }
                  >
                    <span className="truncate">{sub.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {navItemsDespues.map(renderItem)}
        </nav>
      </div>
    </aside>
  );
}