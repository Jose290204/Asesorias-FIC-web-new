import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';

// Ajusta estas rutas según dónde esté ubicado este archivo en tu proyecto
import ToastNotification from '../../../../components/ui/ToastNotification';
import { solicitudesService } from '../../../../Services/solicitudesService';
import TarjetaSolicitudesPendientes from "../components/TarjetaSolicitudesPendientes";

export default function SolicitudesPendientes() {
    const { usuario } = useAuth();
    const id_asesor = usuario?.id_usuario;

    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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
        if (!id_asesor) return;

        try {
            if (!silencioso) setLoading(true);
            setError(false);
            const response = await solicitudesService.obtenerTodas({ id_asesor });
            setSolicitudes(response.data);
        } catch (err) {
            console.error('Error al cargar solicitudes', err);
            if (!silencioso) setError(true);
            showToast('No se pudieron cargar las solicitudes', 'error');
        } finally {
            setLoading(false);
        }
    }, [id_asesor, showToast]);

    useEffect(() => {
        cargarSolicitudes();
    }, [cargarSolicitudes]);

    // Regresan true si salió bien (la tarjeta cierra el modal) y false si falló
    const handleRechazar = async (id_solicitud, razon) => {
        try {
            const response = await solicitudesService.rechazar(id_solicitud, razon);
            showToast(response.message, 'success');
            cargarSolicitudes({ silencioso: true });
            return true;
        } catch (err) {
            const message = err.response?.data?.message || 'No se pudo rechazar la solicitud';
            showToast(message, 'error');
            return false;
        }
    };

    const handleAceptar = async (solicitud) => {
        try {
            const response = await solicitudesService.aceptar(solicitud);
            showToast(response.message, 'success');
            cargarSolicitudes({ silencioso: true });
            return true;
        } catch (err) {
            const message = err.response?.data?.message || 'No se pudo aceptar la solicitud';
            showToast(message, 'error');
            return false;
        }
    };

    const total = solicitudes.length;

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
                    <TarjetaSolicitudesPendientes
                        solicitudes={solicitudes}
                        onAceptar={handleAceptar}
                        onRechazar={handleRechazar}
                        showToast={showToast}
                    />
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