import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoFic from '../../../assets/fic_logo.png';
import logoUas from '../../../assets/logo_uas.png';

export default function EstudianteSidebar({ onLogout }) {

    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        {
            path: '/tutorias/estudiante/solicitar-asesorias',
            label: 'Solicitar asesorias',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            path: '/tutorias/estudiante/asesorias-estudiante',
            label: 'Asesorias',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            path: '/tutorias/estudiante/solicitudes-en-revision',
            label: 'Solicitudes en revisión',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            )
        },
        {
            path: '/tutorias/estudiante/historial-de-asesorias',
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
            className={`bg-[#244B91] text-white flex flex-col justify-between min-h-screen transition-all duration-300 border-r-4 border-white relative shadow-xl ${collapsed ? 'w-20' : 'w-70'
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

                {/* Navegación Principal con NavLink */}
                <nav className="mt-2 px-3 space-y-1.5">
                    {navItems.map((item) => (
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
                    ))}
                </nav>
            </div>

            {/* Parte Inferior Perfil  */}
            <div className="p-3 border-t border-blue-900/60 space-y-1.5">
                <NavLink
                    to="/tutorias/estudiante/perfil-estudiante"
                    replace
                    className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-3 rounded-[5px] font-medium text-sm transition-all duration-200 ${isActive
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[5px] text-xs font-medium text-red-200 hover:bg-red-500/40 hover:text-red-100 transition-colors mb-2 cursor-pointer"
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