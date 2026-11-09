import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Avatar, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { traerPerfilAdmin } from '../../../../Services/perfilAdminService';

// Un número con su etiqueta, para la fila de estadísticas
function Estadistica({ valor, etiqueta }) {
    return (
        <div className="flex flex-col items-center justify-center gap-0.5 px-2 py-4">
            <span className="text-2xl font-bold text-[#244B91]">{valor ?? 0}</span>
            <span className="text-center text-xs font-medium text-gray-600">{etiqueta}</span>
        </div>
    );
}

// Una fila de datos: ícono, etiqueta chica y valor
function FilaDato({ icono, label, value }) {
    return (
        <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8EEF9] text-[#244B91]">
                {icono}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className="break-words text-sm font-semibold text-gray-900">{value || '—'}</p>
            </div>
        </div>
    );
}

export default function PerfilAdministrador() {
    const { usuario } = useAuth();
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        traerPerfilAdmin()
            .then(setPerfil)
            .catch((err) => {
                // Si falla la consulta se muestran los datos de la sesión, sin contadores
                console.error('Error al cargar el perfil', err);
                setPerfil({});
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-[#F4F7FC] flex items-center justify-center">
                <p className="text-gray-500">Cargando perfil...</p>
            </div>
        );
    }

    // El back puede mandar el nombre completo o separado; si no manda nada, se usa la sesión
    const nombreCompleto =
        perfil.nombre_completo ??
        ([perfil.nombre, perfil.apellido_paterno, perfil.apellido_materno].filter(Boolean).join(' ') ||
        usuario?.nombre);

    const numeroCuenta = perfil.numero_cuenta ?? usuario?.numero_cuenta;
    const correo = perfil.correo ?? usuario?.correo;

    const facultadBruta = perfil.facultad ?? usuario?.facultad;
    const facultad = typeof facultadBruta === 'object' ? facultadBruta?.nombre : facultadBruta;

    const estadisticas = perfil.estadisticas;

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-[#F4F7FC] px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <p className="text-2xl font-bold">Perfil</p>

            <div className="w-full flex flex-col items-center gap-5">

                {/* Tarjeta principal: franja azul, avatar y nombre */}
                <div className="w-full max-w-xl overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm">
                    <div className="h-20 bg-[#244B91]" />

                    <div className="-mt-12 flex flex-col items-center gap-1 px-5 pb-6 text-center md:px-8">
                        <Avatar
                            sx={{
                                width: 96,
                                height: 96,
                                bgcolor: '#EBD9B4',
                                color: '#8A6D2B',
                                fontSize: 40,
                                fontWeight: 'bold',
                                border: '4px solid #ffffff'
                            }}
                        >
                            {nombreCompleto ? nombreCompleto.charAt(0).toUpperCase() : ''}
                        </Avatar>

                        <p className="mt-2 break-words text-xl font-bold text-gray-900">{nombreCompleto || '—'}</p>

                        <Chip
                            label="Administrador"
                            size="small"
                            sx={{ backgroundColor: '#E8EEF9', color: '#08338F', fontWeight: 600 }}
                        />
                    </div>

                    {/* Contadores de la facultad: solo si el backend los manda */}
                    {estadisticas && (
                        <div className="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200">
                            <Estadistica valor={estadisticas.asesorias_en_curso} etiqueta="Asesorías en curso" />
                            <Estadistica valor={estadisticas.solicitudes_pendientes} etiqueta="Solicitudes pendientes" />
                            <Estadistica valor={estadisticas.usuarios_activos} etiqueta="Usuarios activos" />
                        </div>
                    )}
                </div>

                {/* Datos personales */}
                <div className="w-full max-w-xl rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm md:p-8">
                    <p className="mb-5 text-base font-bold text-gray-900">Información personal</p>

                    <div className="flex flex-col divide-y divide-gray-100">
                        <FilaDato icono={<PersonOutlinedIcon fontSize="small" />} label="Nombre completo" value={nombreCompleto} />
                        <FilaDato icono={<BadgeOutlinedIcon fontSize="small" />} label="Número de cuenta" value={numeroCuenta} />
                        <FilaDato icono={<EmailOutlinedIcon fontSize="small" />} label="Correo institucional" value={correo} />
                        <FilaDato icono={<AccountBalanceOutlinedIcon fontSize="small" />} label="Facultad" value={facultad} />
                    </div>
                </div>
            </div>
        </div>
    );
}