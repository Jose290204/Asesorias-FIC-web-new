import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import { useCallback, useEffect, useState } from "react";
import { asesoriasService } from "../../../../Services/asesoriasService";
import InputBuscar from "../../../../components/ui/InputBuscar";
import ToastNotification from "../../../../components/ui/ToastNotification";
import { ModalCrearAsesoria } from "../components/ModalesAsesoriasEnCurso";
import TarjetaAsesoriasEnCurso from "../components/TajetaAsesoriasEnCurso";
import { ASESORIAS_EN_CURSO_PRUEBA, USAR_DATOS_PRUEBA } from "../datosPrueba";

export default function AsesoriasEnCurso() {

    const [busqueda, setBusqueda] = useState("");

    // se llena con datos reales en el useEffect de abajo
    const [asesoriasEnCurso, setAsesoriasEnCurso] = useState([]);

    // estado de carga y de error, mientras llega la respuesta del backend
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [modalCrearOpen, setModalCrearOpen] = useState(false);

    const [toast, setToast] = useState({
        open: false,
        message: '',
        type: 'info'
    });

    const showToast = useCallback((message, type = 'info') => {
        setToast({ open: true, message, type });
    }, []);

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    // Trae las asesorías reales del asesor logueado
    // silencioso = recarga sin quitar la lista (se usa después de crear)
    const cargarAsesorias = useCallback(async ({ silencioso = false } = {}) => {

         if (USAR_DATOS_PRUEBA) {
            setAsesoriasEnCurso(ASESORIAS_EN_CURSO_PRUEBA);
            setError(false);
            setLoading(false);
            return;
        }

        try {
            if (!silencioso) setLoading(true);
            setError(false);
            const filas = await asesoriasService.obtenerAsesoriasAsesor();
            setAsesoriasEnCurso(filas);
        } catch (err) {
            console.error('Error al cargar asesorías', err);
            if (!silencioso) setError(true);
            showToast('No se pudieron cargar las asesorías', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        cargarAsesorias();
    }, [cargarAsesorias]);

    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    const handleOpenCrear = (event) => {
        clearFocus(event);
        setModalCrearOpen(true);
    };

    // Tras crear, recarga la lista completa desde el backend para tener datos reales
    const handleCrearAsesoria = async (nuevaAsesoria) => {
        console.log('Asesoría creada:', nuevaAsesoria);
        await cargarAsesorias({ silencioso: true });
    };

    // filtro de asesorias
    const asesoriasFiltradas = asesoriasEnCurso.filter((asesoria) => {
        const textoBusqueda = busqueda.toLowerCase();
        return (
            asesoria.materia.toLowerCase().includes(textoBusqueda) ||
            asesoria.estudiante.toLowerCase().includes(textoBusqueda)
        );
    });

    const total = asesoriasEnCurso.length;

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-gray-100 px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <p className="text-2xl font-bold">Asesorias en curso</p>

            <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-6">
                <div className="w-full min-w-0 sm:flex-1">
                    <InputBuscar
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por materia o alumno..."
                    />
                </div>

                <Button
                    variant="contained"
                    sx={{
                        borderRadius: '5px',
                        textTransform: 'none',
                        backgroundColor: '#2E7D32',
                        flexShrink: 0,
                        // Botón normal: solo tablet y escritorio
                        display: { xs: 'none', sm: 'inline-flex' }
                    }}
                    size="medium"
                    startIcon={<AddOutlinedIcon />}
                    onClick={handleOpenCrear}
                >
                    Crear Asesoria
                </Button>
            </div>

            {/* Botón flotante: solo celular */}
            <Fab
                variant="extended"
                color="success"
                aria-label="Crear asesoría"
                onClick={handleOpenCrear}
                sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 10, textTransform: 'none', display: { xs: 'inline-flex', sm: 'none' } }}
            >
                <AddOutlinedIcon sx={{ mr: 1 }} />
                Crear asesoría
            </Fab>

            {/* Leyenda de resultados */}
            {!loading && !error && (
                <p className="-mt-3 text-sm text-gray-600 md:-mt-4">
                    Mostrando {asesoriasFiltradas.length} de {total} {total === 1 ? 'asesoría' : 'asesorías'}
                </p>
            )}

            {/* Contenido: título y filtros quedan visibles, el estado va al centro del área */}
            <div className="w-full flex flex-1 flex-col pb-24 sm:pb-5">
                {loading ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <CircularProgress sx={{ color: '#244B91' }} />
                        <p className="text-sm text-gray-600">Cargando asesorías...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <p className="text-sm text-gray-600">No se pudieron cargar las asesorías.</p>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => cargarAsesorias()}
                            sx={{ textTransform: 'none', borderRadius: '5px', backgroundColor: '#244B91' }}
                        >
                            Reintentar
                        </Button>
                    </div>
                ) : total === 0 ? (
                    <p className="py-10 text-center text-sm text-gray-600">
                        No tienes asesorías en curso.
                    </p>
                ) : (
                    <TarjetaAsesoriasEnCurso asesorias={asesoriasFiltradas} />
                )}
            </div>

            <ModalCrearAsesoria
                open={modalCrearOpen}
                onClose={() => setModalCrearOpen(false)}
                onSave={handleCrearAsesoria}
                showToast={showToast}
            />

            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}