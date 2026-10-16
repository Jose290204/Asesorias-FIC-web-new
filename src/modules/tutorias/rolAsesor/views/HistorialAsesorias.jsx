import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useEffect, useState } from 'react';

import ToastNotification from '../../../../components/ui/ToastNotification';
import TarjetaHistorialAsesorias from "../components/TarjetaHistorialAsesorias";

// Datos de prueba. Cuando haya backend, esto viene del servicio.
const HISTORIAL_PRUEBA = [
    { id: 12, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", material_adicional: [{ id_material: 1, nombre_archivo: "Guia_de_ejercicios.pdf", mime_type: "application/pdf", url_archivo: "#" }] },
    { id: 13, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
    { id: 14, alumno: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
    { id: 15, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
    { id: 16, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
    { id: 17, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
    { id: 18, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
    { id: 19, alumno: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
    { id: 20, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
    { id: 21, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" }
];

export default function HistorialAsesorias() {
    const [historial, setHistorial] = useState([]);
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

    // Carga el historial
    const cargarHistorial = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            // TODO: reemplazar por la llamada real al servicio (ej. asesoriasService.obtenerHistorialAsesor())
            await new Promise((resolve) => setTimeout(resolve, 300));
            setHistorial(HISTORIAL_PRUEBA);
        } catch (err) {
            console.error('Error al cargar el historial', err);
            setError(true);
            showToast('No se pudo cargar el historial', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        cargarHistorial();
    }, [cargarHistorial]);

    // La tarjeta avisa cuando se edita una asesoría desde su modal de información
    const handleActualizar = (asesoriaActualizada) => {
        console.log('Información actualizada:', asesoriaActualizada);
        setHistorial((prev) =>
            prev.map((item) =>
                item.id === asesoriaActualizada.id ? { ...item, ...asesoriaActualizada } : item
            )
        );
    };

    const total = historial.length;

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-gray-100 px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <div>
                <p className="text-2xl font-bold">Historial de asesorias</p>
                {!loading && !error && (
                    <p className="mt-1 text-sm text-gray-600">
                        {total} {total === 1 ? 'resultado' : 'resultados'}
                    </p>
                )}
            </div>

            {/* Contenido: el título queda visible y el estado va al centro del área */}
            <div className="w-full flex flex-1 flex-col">
                {loading ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <CircularProgress sx={{ color: '#244B91' }} />
                        <p className="text-sm text-gray-600">Cargando historial...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <p className="text-sm text-gray-600">No se pudo cargar el historial.</p>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={cargarHistorial}
                            sx={{ textTransform: 'none', borderRadius: '5px', backgroundColor: '#244B91' }}
                        >
                            Reintentar
                        </Button>
                    </div>
                ) : (
                    <TarjetaHistorialAsesorias
                        historial={historial}
                        onActualizar={handleActualizar}
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