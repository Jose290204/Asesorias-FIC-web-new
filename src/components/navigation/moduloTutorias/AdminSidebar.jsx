import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logoAsesorias from '../../../assets/logo_asesorias.png';
import logoUas from '../../../assets/logo_uas.png';
import UsuarioSidebar from './UsuarioSidebar';

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

export default function AdminSidebar({ escritorio = false }) {
  const { pathname } = useLocation();

  // El grupo de reportes empieza abierto si ya se está dentro de alguno de sus reportes
  const enReportes = pathname.startsWith(RUTA_REPORTES);
  const [reportesAbierto, setReportesAbierto] = useState(enReportes);

  // Al entrar a un reporte (por ejemplo con un enlace directo) el grupo se abre solo
  useEffect(() => {
    if (enReportes) setReportesAbierto(true);
  }, [enReportes]);

  const handleToggleReportes = () => setReportesAbierto((prev) => !prev);

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
    },
    {
      path: '/admin/bitacora',
      label: 'Bitácora',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
          ? 'border-l-[3px] border-[#d4b03c] bg-[linear-gradient(90deg,rgba(212,176,60,0.25),rgba(255,255,255,0.06))] text-white shadow-[0_0_18px_rgba(212,176,60,0.25),inset_0_0_0_1px_rgba(255,255,255,0.06)] font-semibold'
          : 'border-l-[3px] border-transparent text-blue-100 hover:translate-x-[3px] hover:bg-white/10 hover:text-white'
        }`
      }
    >
      <span className="shrink-0">{item.icon}</span>
      <span className="truncate">{item.label}</span>
    </NavLink>
  );

  return (
    <aside
      className={`bg-[linear-gradient(180deg,#2a529b_0%,#244B91_55%,#162f66_100%)] text-white flex flex-col justify-between min-h-dvh shrink-0 transition-all duration-300 relative shadow-[4px_0_24px_rgba(0,0,0,0.18)] w-64`}
    >
      <div>
        <div className="py-6 flex justify-center items-center">
          <div className={`rounded-full bg-white p-1 border-0 border-white shadow-[0_0_22px_rgba(212,176,60,0.4)] flex items-center justify-center overflow-hidden transition-all w-30 h-30`}>
            <img
              src={logoAsesorias}
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
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-[5px] font-medium text-sm transition-all duration-200 cursor-pointer ${enReportes
                ? 'border-l-[3px] border-transparent bg-white/10 text-white font-semibold'
                : 'border-l-[3px] border-transparent text-blue-100 hover:translate-x-[3px] hover:bg-white/10 hover:text-white'
                }`}
            >
              <span className="shrink-0">{iconoReportes}</span>
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
            </button>

            {reportesAbierto && (
              <div className="mt-1 ml-5 pl-3 border-l border-blue-300/40 space-y-1">
                {SUBMENU_REPORTES.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    replace
                    className={({ isActive }) =>
                      `w-full flex items-center px-3 py-2 rounded-[5px] text-sm transition-all duration-200 ${isActive
                        ? 'border-l-[3px] border-[#d4b03c] bg-[linear-gradient(90deg,rgba(212,176,60,0.25),rgba(255,255,255,0.06))] text-white shadow-[0_0_18px_rgba(212,176,60,0.25),inset_0_0_0_1px_rgba(255,255,255,0.06)] font-semibold'
                        : 'border-l-[3px] border-transparent text-blue-100 hover:translate-x-[3px] hover:bg-white/10 hover:text-white'
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
      {/* Perfil y cerrar sesión: al fondo del menú, solo en escritorio */}
      {escritorio && <UsuarioSidebar rutaPerfil="/admin/perfil-administrador" />}
    </aside>
  );
}