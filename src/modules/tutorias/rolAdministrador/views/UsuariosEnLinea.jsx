
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useEffect, useState } from 'react';
import InputBuscar from '../../../../components/ui/InputBuscar';
import ToastNotification from '../../../../components/ui/ToastNotification';
import TablaUsuariosEnLinea from '../components/usuariosEnLinea/TablaUsuariosEnLinea';
import { estaEnLinea } from '../components/usuariosEnLinea/tiempo';
import { sesionesService } from '../services/sesionesService';

// Cada cuánto se vuelve a consultar la lista sin que el administrador haga nada
const INTERVALO_ACTUALIZACION_MS = 30000;

export default function UsuariosEnLinea() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sesiones, setSesiones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => setToast({ open: true, message, type });

    // silencioso: las actualizaciones automáticas no muestran errores ni parpadean
    const fetchSesiones = useCallback(async ({ silencioso = false } = {}) => {
        try {
            if (!silencioso) setActualizando(true);
            const data = await sesionesService.obtenerSesiones();
            setSesiones(data);
        } catch (error) {
            console.error('Error al obtener las sesiones:', error);
            if (!silencioso) showToast('Error al obtener los usuarios en línea', 'error');
        } finally {
            setCargando(false);
            setActualizando(false);
        }
    }, []);

    useEffect(() => {
        fetchSesiones();

        // reemplazar el sondeo por WebSockets cuando se monte Reverb en el backend
        const intervalo = setInterval(() => fetchSesiones({ silencioso: true }), INTERVALO_ACTUALIZACION_MS);
        return () => clearInterval(intervalo);
    }, [fetchSesiones]);

    // Cierra una sesión. Si falla, el error llega a quien lo llamó (la tabla), que avisa con su toast.
    const handleCerrarSesion = async (id) => {
        await sesionesService.cerrarSesion(id);
        setSesiones((prev) => prev.filter((item) => item.id !== id));
    };

    // Filtro por búsqueda en tiempo real (nombre, correo, rol o dispositivo)
    const filtradas = sesiones.filter((item) => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return true;

        return (
            (item.nombre || '').toLowerCase().includes(term) ||
            (item.correo || '').toLowerCase().includes(term) ||
            (item.rol || '').toLowerCase().includes(term) ||
            (item.dispositivo || '').toLowerCase().includes(term)
        );
    });

    const totalEnLinea = sesiones.filter((item) => estaEnLinea(item.ultimaActividad)).length;

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-[#F4F7FC] px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold">Usuarios en línea</p>
                {!cargando && (
                    <p className="text-sm text-gray-600">
                        {totalEnLinea} en línea · {sesiones.length} sesiones activas
                    </p>
                )}
            </div>

            {/* Barra de herramientas: en celular el buscador va arriba y "Actualizar" debajo */}
            <div className="w-full flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="w-full min-w-0 sm:flex-1">
                    <InputBuscar
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre, correo, rol o dispositivo..."
                    />
                </div>

                <Button
                    variant="outlined"
                    startIcon={<RefreshOutlinedIcon />}
                    disabled={actualizando}
                    onClick={() => fetchSesiones()}
                    sx={{
                        borderRadius: '5px',
                        textTransform: 'none',
                        color: '#244B91',
                        borderColor: '#244B91',
                        flexShrink: 0,
                        '&:hover': { borderColor: '#1B3A73', backgroundColor: 'rgba(36, 75, 145, 0.06)' }
                    }}
                >
                    Actualizar
                </Button>
            </div>

            <div className="w-full flex flex-1 flex-col pb-5">
                {cargando ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <CircularProgress sx={{ color: '#244B91' }} />
                        <p className="text-sm text-gray-600">Cargando usuarios en línea...</p>
                    </div>
                ) : (
                    <TablaUsuariosEnLinea rows={filtradas} onCerrarSesion={handleCerrarSesion} />
                )}
            </div>

            <ToastNotification
                open={toast.open}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}