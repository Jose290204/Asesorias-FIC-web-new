import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import { useCallback, useEffect, useState } from 'react';

import InputBuscar from '../../../../components/ui/InputBuscar';
import ToastNotification from '../../../../components/ui/ToastNotification';
import TituloVista from '../../../../components/ui/TituloVista';
import { traerAsesorias } from '../../../../Services/asesoriasAsesorService';
import { mensajesDeError } from '../../../../Services/errores';
import TablaHistorialAsesorias from '../components/historial/TablaHistorialAsesorias';

export default function HistorialAsesorias() {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Lo que se escribe en el buscador, y el texto que ya se mandó a la API (con una pausa al escribir)
    const [busqueda, setBusqueda] = useState('');
    const [buscar, setBuscar] = useState('');

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

    // Al dejar de escribir 400 ms se busca en la API y se vuelve a la página 1
    useEffect(() => {
        const temporizador = setTimeout(() => {
            setBuscar(busqueda.trim());
            setPagina(1);
        }, 400);

        return () => clearTimeout(temporizador);
    }, [busqueda]);

    // El historial son las asesorías ya cerradas: completadas y canceladas
    const cargarHistorial = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const { asesorias, meta: metaNueva } = await traerAsesorias({ estatus: 'historial', buscar, page: pagina });
            setHistorial(asesorias);
            setMeta(metaNueva);
        } catch (err) {
            console.error('Error al cargar el historial', err);
            setError(true);
            showToast(mensajesDeError(err)[0], 'error');
        } finally {
            setLoading(false);
        }
    }, [buscar, pagina, showToast]);

    useEffect(() => {
        cargarHistorial();
    }, [cargarHistorial]);

    const total = meta?.total ?? historial.length;

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-transparent px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <TituloVista
                titulo="Historial de asesorías"
                subtitulo={!loading && !error ? `${total} ${total === 1 ? 'resultado' : 'resultados'}` : null}
            />

            <div className="w-full">
                <InputBuscar
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por materia o alumno..."
                />
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
                    <>
                        <TablaHistorialAsesorias historial={historial} />

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
