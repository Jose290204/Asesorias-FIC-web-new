import { NavLink } from 'react-router-dom';
import logoAsesorias from '../../../assets/logo_asesorias.png';
import logoUas from '../../../assets/logo_uas.png';
import UsuarioSidebar from './UsuarioSidebar';

export default function AsesorSidebar() {

    const navItems = [
        {
            path: '/asesor/solicitudes-pendientes',
            label: 'Solicitudes Pendientes',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            )
        },
        {
            path: '/asesor/asesorias-en-curso',
            label: 'Asesorias en curso',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
                {
            path: '/asesor/chats',
            label: 'Chats',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            )
        },
        {
            path: '/asesor/disponibilidad',
            label: 'Disponibilidad',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            path: '/asesor/historial-de-asesorias',
            label: 'Historial de asesorias',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
    ];

    return (
        <aside
            className={`bg-[linear-gradient(180deg,#2a529b_0%,#244B91_55%,#162f66_100%)] text-white flex flex-col justify-between min-h-dvh shrink-0 transition-all duration-300 relative shadow-[4px_0_24px_rgba(0,0,0,0.18)] w-64`}
        >
            {/* Parte Superior: Encabezado e Identidad */}
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

                {/* Navegación Principal con NavLink */}
                <nav className="mt-2 px-3 space-y-1.5">
                    {navItems.map((item) => (
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
          <UsuarioSidebar rutaPerfil="/asesor/perfil-asesor" />
        </aside>
    );
}