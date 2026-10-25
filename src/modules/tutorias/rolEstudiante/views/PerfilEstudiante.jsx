import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { Avatar, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { traerPerfilEstudiante } from '../../../../Services/estudiantesService';

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

// Un número con su etiqueta, para la fila de estadísticas
function Estadistica({ valor, etiqueta }) {
    return (
        <div className="flex flex-col items-center justify-center gap-0.5 px-2 py-4">
            <span className="text-2xl font-bold text-[#244B91]">{valor ?? 0}</span>
            <span className="text-center text-xs font-medium text-gray-600">{etiqueta}</span>
        </div>
    );
}

export default function PerfilEstudiante() {
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        traerPerfilEstudiante()
            .then(setPerfil)
            .catch((err) => {
                console.error('Error al cargar el perfil', err);
                setError(true);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Cargando perfil...</p>
            </div>
        );
    }

    if (error || !perfil) {
        return (
            <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">No se pudo cargar el perfil.</p>
            </div>
        );
    }

    // El back manda nombre y apellidos por separado; aquí se arma el nombre completo
    const nombreCompleto = [perfil.nombre, perfil.apellido_paterno, perfil.apellido_materno]
        .filter(Boolean)
        .join(' ');

    const estadisticas = perfil.estadisticas;

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-gray-100 px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <p className="text-2xl font-bold">Perfil</p>

            <div className="w-full flex flex-col items-center gap-5">

                {/* Tarjeta principal: franja azul, avatar, nombre y estadísticas */}
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
                            label="Estudiante"
                            size="small"
                            sx={{ backgroundColor: '#E8EEF9', color: '#08338F', fontWeight: 600 }}
                        />
                    </div>

                    {/* Estadísticas: solo si el backend las manda */}
                    {estadisticas && (
                        <div className="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200">
                            <Estadistica valor={estadisticas.completadas} etiqueta="Completadas" />
                            <Estadistica valor={estadisticas.en_curso} etiqueta="En curso" />
                            <Estadistica valor={estadisticas.solicitudes_en_revision} etiqueta="En revisión" />
                        </div>
                    )}
                </div>

                {/* Datos personales */}
                <div className="w-full max-w-xl rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm md:p-8">
                    <p className="mb-5 text-base font-bold text-gray-900">Información personal</p>

                    <div className="flex flex-col divide-y divide-gray-100">
                        <FilaDato icono={<PersonOutlinedIcon fontSize="small" />} label="Nombre completo" value={nombreCompleto} />
                        <FilaDato icono={<BadgeOutlinedIcon fontSize="small" />} label="Número de cuenta" value={perfil.numero_cuenta} />
                        <FilaDato icono={<EmailOutlinedIcon fontSize="small" />} label="Correo institucional" value={perfil.correo} />
                        <FilaDato icono={<SchoolOutlinedIcon fontSize="small" />} label="Licenciatura" value={perfil.licenciatura} />
                        <FilaDato icono={<GroupsOutlinedIcon fontSize="small" />} label="Grupo" value={perfil.grupo} />
                    </div>
                </div>
            </div>
        </div>
    );
}