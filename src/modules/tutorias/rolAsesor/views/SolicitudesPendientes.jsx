import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import { useCallback, useEffect, useState } from 'react';

import { SOLICITUDES_PRUEBA, USAR_DATOS_PRUEBA } from '../datosPrueba';

// Ajusta estas rutas según dónde esté ubicado este archivo en tu proyecto
import ToastNotification from '../../../../components/ui/ToastNotification';
import { mensajesDeError } from '../../../../Services/errores';
import {
    aceptarSolicitud,
    rechazarSolicitud,
    traerSolicitudesPendientes,
} from '../../../../Services/solicitudesAsesorService';
import TarjetaSolicitudesPendientes from '../components/TarjetaSolicitudesPendientes';

export default function SolicitudesPendientes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // La API pagina de 10 en 10: "meta" trae la última página y el total
    const [pagina, setPagina] = useState(1);
    const [meta, setMeta] = useState(null);

    // Toast global de la vista (también lo usan los modales de la tarjeta)
    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    const showToast = useCallback((message, type = 'info') => {
        setToast({ open: true, message, type });
    }, []);

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    // silencioso = recarga sin quitar la lista (se usa después de aceptar/rechazar)
    const cargarSolicitudes = useCallback(async ({ silencioso = false } = {}) => {

        if (USAR_DATOS_PRUEBA) {
            setSolicitudes(SOLICITUDES_PRUEBA);
            setError(false);
            setLoading(false);
            return;
        }

        try {
            if (!silencioso) setLoading(true);
            setError(false);

            const { solicitudes: lista, meta: metaNueva } = await traerSolicitudesPendientes({ page: pagina });

            // Si se atendió la última solicitud de esta página, la página queda vacía:
            // se regresa a la anterior (el efecto de abajo vuelve a cargar solo)
            if (lista.length === 0 && pagina > 1) {
                setPagina(pagina - 1);
                return;
            }

            setSolicitudes(lista);
            setMeta(metaNueva);
        } catch (err) {
            console.error('Error al cargar solicitudes', err);
            if (!silencioso) setError(true);
            showToast(mensajesDeError(err)[0], 'error');
        } finally {
            setLoading(false);
        }
    }, [pagina, showToast]);

    useEffect(() => {
        cargarSolicitudes();
    }, [cargarSolicitudes]);

    // Regresan true si salió bien (la tarjeta cierra el modal) y false si falló
    const handleRechazar = async (id_solicitud, motivo) => {
        try {
            await rechazarSolicitud(id_solicitud, motivo);
            showToast('Solicitud rechazada correctamente', 'success');
            cargarSolicitudes({ silencioso: true });
            return true;
        } catch (err) {
            showToast(mensajesDeError(err)[0], 'error');
            return false;
        }
    };

    const handleAceptar = async (solicitud) => {
        try {
            await aceptarSolicitud(solicitud.id_solicitud);
            showToast('Solicitud aceptada con éxito', 'success');
            // Al aceptar, otras solicitudes del mismo cupo se rechazan solas: se recarga la lista
            cargarSolicitudes({ silencioso: true });
            return true;
        } catch (err) {
            // Aquí caen, por ejemplo, 409 horario_ocupado y 409 solicitud_no_pendiente
            showToast(mensajesDeError(err)[0], 'error');
            return false;
        }
    };

    const total = meta?.total ?? solicitudes.length;

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-gray-100 px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <div>
                <p className="text-2xl font-bold">Solicitudes Pendientes</p>
                {!loading && !error && (
                    <p className="mt-1 text-sm text-gray-600">
                        {total} {total === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'}
                    </p>
                )}
            </div>

            {/* Contenido: el título queda visible y el estado va al centro del área */}
            <div className="w-full flex flex-1 flex-col">
                {loading ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <CircularProgress sx={{ color: '#244B91' }} />
                        <p className="text-sm text-gray-600">Cargando solicitudes...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <p className="text-sm text-gray-600">No se pudieron cargar las solicitudes.</p>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => cargarSolicitudes()}
                            sx={{ textTransform: 'none', borderRadius: '5px', backgroundColor: '#244B91' }}
                        >
                            Reintentar
                        </Button>
                    </div>
                ) : (
                    <>
                        <TarjetaSolicitudesPendientes
                            solicitudes={solicitudes}
                            onAceptar={handleAceptar}
                            onRechazar={handleRechazar}
                            showToast={showToast}
                        />

                        {/* Paginación: solo aparece si hay más de una página */}
                        {meta && meta.last_page > 1 && (
                            <div className="mt-6 flex w-full justify-center">
                                <Pagination
                                    count={meta.last_page}
                                    page={pagina}
                                    onChange={(_, nueva) => setPagina(nueva)}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}
