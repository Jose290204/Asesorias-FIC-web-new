import { NavLink } from 'react-router-dom';
import logoAsesorias from '../../../assets/logo_asesorias.png';
import logoUas from '../../../assets/logo_uas.png';
import UsuarioSidebar from './UsuarioSidebar';

const RUTA_PERFIL = '/superadmin/perfil';

const Icono = ({ d }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
  </svg>
);

const NAV_ITEMS = [
  {
    path: '/superadmin/facultades',
    label: 'Facultades',
    icon: <Icono d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
  },
  {
    path: '/superadmin/administradores',
    label: 'Administradores',
    icon: <Icono d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  },
  {
    path: '/superadmin/bitacora',
    label: 'Bitácora',
    icon: <Icono d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
  },
];

// Mismo menú lateral que admin, asesor y estudiante, con las opciones del super admin.
export default function SuperAdminSidebar({ escritorio = false }) {
  return (
    <aside className="bg-[linear-gradient(180deg,#2a529b_0%,#244B91_55%,#162f66_100%)] text-white flex flex-col justify-between min-h-dvh shrink-0 relative shadow-[4px_0_24px_rgba(0,0,0,0.18)] w-64">
      <div>
        <div className="py-6 flex justify-center items-center">
          <div className="rounded-full bg-white p-1 flex items-center justify-center overflow-hidden w-30 h-30">
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
          {NAV_ITEMS.map((item) => (
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
          ))}
        </nav>
      </div>

      {/* Perfil y cerrar sesión: al fondo del menú, solo en escritorio */}
      {escritorio && <UsuarioSidebar rutaPerfil={RUTA_PERFIL} />}
    </aside>
  );
}
