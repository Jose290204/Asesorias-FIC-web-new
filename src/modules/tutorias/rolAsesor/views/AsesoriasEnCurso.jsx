import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import Pagination from '@mui/material/Pagination';
import { useCallback, useEffect, useState } from "react";
import InputBuscar from "../../../../components/ui/InputBuscar";
import ToastNotification from "../../../../components/ui/ToastNotification";
import {
    cancelarAsesoria,
    completarAsesoria,
    crearAsesoria,
    editarAsesoria,
    traerAsesorias
} from "../../../../Services/asesoriasAsesorService";
import { mensajesDeError } from "../../../../Services/errores";
import ModalCrearAsesoria from "../components/asesorias/modales/ModalCrearAsesoria";
import TablaAsesoriasEnCurso from "../components/asesorias/TablaAsesoriasEnCurso";
import { ASESORIAS_EN_CURSO_PRUEBA, USAR_DATOS_PRUEBA } from "../datosPrueba";

export default function AsesoriasEnCurso() {

    // Lo que se escribe en el buscador, y el texto que ya se mandó a la API (con una pausa al escribir)
    const [busqueda, setBusqueda] = useState("");
    const [buscar, setBuscar] = useState("");

    // La API pagina de 10 en 10: "meta" trae la última página y el total
    const [pagina, setPagina] = useState(1);
    const [meta, setMeta] = useState(null);

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

    // Al dejar de escribir 400 ms se busca en la API y se vuelve a la página 1
    useEffect(() => {
        const temporizador = setTimeout(() => {
            setBuscar(busqueda.trim());
            setPagina(1);
        }, 400);

        return () => clearTimeout(temporizador);
    }, [busqueda]);

    // Trae las asesorías en curso del asesor logueado
    // silencioso = recarga sin quitar la lista (se usa después de crear, editar, completar o cancelar)
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

            const { asesorias, meta: metaNueva } = await traerAsesorias({ estatus: 'en_curso', buscar, page: pagina });

            // Si se atendió la última asesoría de esta página, la página queda vacía:
            // se regresa a la anterior (el efecto de abajo vuelve a cargar solo)
            if (asesorias.length === 0 && pagina > 1) {
                setPagina(pagina - 1);
                return;
            }

            setAsesoriasEnCurso(asesorias);
            setMeta(metaNueva);
        } catch (err) {
            console.error('Error al cargar asesorías', err);
            if (!silencioso) setError(true);
            showToast(mensajesDeError(err)[0], 'error');
        } finally {
            setLoading(false);
        }
    }, [buscar, pagina, showToast]);

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

    // Las acciones regresan true si salió bien (el modal se cierra) y false si falló (el modal sigue abierto).
    // Aquí caen los errores de la API, por ejemplo 409 horario_ocupado o 422 fuera_de_ciclo.
    const ejecutar = async (accion, mensajeExito) => {
        try {
            await accion();
            showToast(mensajeExito, 'success');
            cargarAsesorias({ silencioso: true });
            return true;
        } catch (err) {
            showToast(mensajesDeError(err)[0], 'error');
            return false;
        }
    };

    const handleCrearAsesoria = (datos) =>
        ejecutar(() => crearAsesoria(datos), 'Asesoría creada correctamente');

    // Solo viaja lo que cambió (el modal arma "cambios")
    const handleGuardarInfo = (id, cambios) =>
        ejecutar(() => editarAsesoria(id, cambios), 'Cambios aplicados correctamente');

    const handleCompletar = (asesoria) =>
        ejecutar(() => completarAsesoria(asesoria.id), 'Asesoría completada con éxito');

    const handleCancelar = (asesoria, motivo) =>
        ejecutar(() => cancelarAsesoria(asesoria.id, motivo), 'Asesoría cancelada correctamente');

    // Registrar o borrar una sesión cambia el conteo que muestra la lista
    const handleSesionesCambio = () => cargarAsesorias({ silencioso: true });

    const total = meta?.total ?? asesoriasEnCurso.length;

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
                    {total} {total === 1 ? 'asesoría' : 'asesorías'}{buscar ? ' encontradas' : ' en curso'}
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
                ) : total === 0 && !buscar ? (
                    <p className="py-10 text-center text-sm text-gray-600">
                        No tienes asesorías en curso.
                    </p>
                ) : (
                    <>
                        <TablaAsesoriasEnCurso
                            asesorias={asesoriasEnCurso}
                            onGuardarInfo={handleGuardarInfo}
                            onCompletar={handleCompletar}
                            onCancelar={handleCancelar}
                            onSesionesCambio={handleSesionesCambio}
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

            <ModalCrearAsesoria
                open={modalCrearOpen}
                onClose={() => setModalCrearOpen(false)}
                onSave={handleCrearAsesoria}
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
