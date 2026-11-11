import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import { useCallback, useEffect, useState } from 'react';
import InputBuscar from '../../../../components/ui/InputBuscar';
import TituloVista from '../../../../components/ui/TituloVista';
import ToastNotification from '../../../../components/ui/ToastNotification';
import { traerMaterias } from '../../../../Services/asesoriasAsesorService';
import {
    crearDisciplinarAdmin,
    darDeBajaDisciplinarAdmin,
    editarDisciplinarAdmin,
    guardarDisponibilidadAsesorAdmin,
    traerDisciplinaresAdmin
} from '../../../../Services/asesoresAdminService';
import { mensajesDeError } from '../../../../Services/errores';
import ModalAsesorDisciplinar from '../components/asesoresDisciplinares/modales/ModalAsesorDisciplinar';
import TablaAsesoresDisciplinares from '../components/asesoresDisciplinares/TablaAsesoresDisciplinares';
import ModalCargaExcel from '../components/ModalCargaExel';

// Color de los botones de crear (distinto al verde de la carga masiva)
const AZUL = '#244B91';
const AZUL_OSCURO = '#1B3A73';

// Menú de la lista de materias: con scroll y del mismo ancho que el campo, para que no se desborde ni tape el menú lateral
const MENU_LISTA = { slotProps: { paper: { sx: { maxHeight: 280, maxWidth: 'min(320px, 90vw)' } } } };

// Estilo de la lista de filtro de materia
const ESTILO_FILTRO = { width: { xs: 230, sm: 320 }, maxWidth: '100%', flexShrink: 0, backgroundColor: '#FFFFFF' };

export default function AsesoresDisciplinares() {
    // Lo que se escribe en el buscador, y el texto que ya se mandó a la API (con una pausa al escribir)
    const [busqueda, setBusqueda] = useState('');
    const [buscar, setBuscar] = useState('');

    // Filtro por materia ('' = todas): deja a los asesores que imparten esa materia
    const [materiaId, setMateriaId] = useState('');
    const [materias, setMaterias] = useState([]);

    // La API pagina de 10 en 10: "meta" trae la última página y el total
    const [pagina, setPagina] = useState(1);
    const [meta, setMeta] = useState(null);

    const [asesores, setAsesores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    const [modalExcelOpen, setModalExcelOpen] = useState(false);
    const [modalCrearOpen, setModalCrearOpen] = useState(false);

    // Estado para el toast global de la vista
    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    const showToast = useCallback((message, type = 'info') => {
        setToast({ open: true, message, type });
    }, []);

    // Las materias de la facultad solo sirven para el filtro; si fallan, el filtro queda vacío y la vista sigue funcionando
    useEffect(() => {
        traerMaterias()
            .then(setMaterias)
            .catch((err) => console.error('Error al cargar las materias del filtro:', err));
    }, []);

    // Al dejar de escribir 400 ms se busca en la API y se vuelve a la página 1
    useEffect(() => {
        const temporizador = setTimeout(() => {
            setBuscar(busqueda.trim());
            setPagina(1);
        }, 400);

        return () => clearTimeout(temporizador);
    }, [busqueda]);

    // silencioso = recarga sin quitar la lista (se usa después de crear, editar, dar de baja o guardar disponibilidad)
    const cargarAsesores = useCallback(async ({ silencioso = false } = {}) => {
        try {
            if (!silencioso) setCargando(true);
            setError(false);

            const { asesores: lista, meta: metaNueva } = await traerDisciplinaresAdmin({
                buscar,
                page: pagina,
                materiaId
            });

            // Si se dio de baja al último de esta página, la página queda vacía:
            // se regresa a la anterior (el efecto de abajo vuelve a cargar solo)
            if (lista.length === 0 && pagina > 1) {
                setPagina(pagina - 1);
                return;
            }

            setAsesores(lista);
            setMeta(metaNueva);
        } catch (err) {
            console.error('Error al obtener los asesores disciplinares:', err);
            if (!silencioso) {
                setError(true);
                showToast(mensajesDeError(err)[0], 'error');
            }
        } finally {
            setCargando(false);
        }
    }, [buscar, pagina, materiaId, showToast]);

    useEffect(() => {
        cargarAsesores();
    }, [cargarAsesores]);

    // Las acciones regresan true si salió bien (el modal se cierra) y false si falló (el modal sigue abierto).
    // Aquí caen los errores de la API, por ejemplo 422 (correo o cuenta repetidos) o 409 (asesorías en curso).
    const ejecutar = async (accion, mensajeExito) => {
        try {
            await accion();
            showToast(mensajeExito, 'success');
            cargarAsesores({ silencioso: true });
            return true;
        } catch (err) {
            showToast(mensajesDeError(err)[0], 'error');
            return false;
        }
    };

    const handleCrearAsesor = (formulario) =>
        ejecutar(() => crearDisciplinarAdmin(formulario), 'Asesor creado correctamente. Falta armar su disponibilidad.');

    const handleUpdateAsesor = (asesor, formulario) =>
        ejecutar(() => editarDisciplinarAdmin(asesor.id, formulario), 'Información del asesor actualizada');

    const handleDeleteAsesor = (asesor) =>
        ejecutar(() => darDeBajaDisciplinarAdmin(asesor.id), 'Asesor dado de baja');

    const handleGuardarDisponibilidad = (asesor, cuerpo) =>
        ejecutar(() => guardarDisponibilidadAsesorAdmin(asesor.id, cuerpo), 'Disponibilidad actualizada');

    // TODO (etapa 2.7): conectar la carga masiva con el backend
    const handleExcelData = (data) => {
        console.log('Asesores disciplinares cargados desde Excel:', data);
    };

    const handleCambiarMateria = (e) => {
        setMateriaId(e.target.value);
        setPagina(1);
    };

    // Quita el foco del elemento activo antes de abrir un modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    const handleOpenModalExcel = (event) => {
        clearFocus(event);
        setModalExcelOpen(true);
    };

    const handleOpenModalCrear = (event) => {
        clearFocus(event);
        setModalCrearOpen(true);
    };

    const total = meta?.total ?? asesores.length;

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-transparent px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <TituloVista
                titulo="Asesores Disciplinares"
                subtitulo={!cargando && !error ? `${total} ${total === 1 ? 'asesor disciplinar' : 'asesores disciplinares'}${buscar || materiaId ? ' encontrados' : ''}` : null}
            />

            {/* Filtro por materia */}
            <div className="w-full flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <TextField
                    select
                    size="small"
                    label="Materia"
                    value={materiaId}
                    onChange={handleCambiarMateria}
                    sx={ESTILO_FILTRO}
                    slotProps={{ select: {
                            displayEmpty: true,
                            MenuProps: MENU_LISTA,
                            // En el campo solo va el nombre; la licenciatura se ve en la lista
                            renderValue: (valor) => (valor === '' ? <em>Todas</em> : materias.find((m) => m.id === valor)?.nombre ?? '')
                        }, inputLabel: { shrink: true } }}
                >
                    <MenuItem value="">
                        <em>Todas</em>
                    </MenuItem>
                    {materias.map((m) => (
                        <MenuItem key={m.id} value={m.id} sx={{ whiteSpace: 'normal' }}>
                            {/* Hay materias con el mismo nombre en varias licenciaturas: se distinguen con la carrera */}
                            <div className="flex flex-col">
                                <span>{m.nombre}</span>
                                {m.licenciatura && <span className="text-xs text-gray-500">{m.licenciatura}</span>}
                            </div>
                        </MenuItem>
                    ))}
                </TextField>
            </div>

            {/* Barra de herramientas: en celular el buscador va arriba y "Cargar Asesores" debajo (a la mitad del ancho) */}
            <div className="-mt-3 w-full flex flex-col items-start gap-3 sm:-mt-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="w-full min-w-0 sm:flex-1">
                    <InputBuscar
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre, correo o número de cuenta..."
                    />
                </div>

                <button
                    onClick={handleOpenModalExcel}
                    className="w-1/2 sm:w-auto shrink-0 justify-center bg-[#2e7d32] hover:bg-[#1b5e20] text-sm text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1.8 14.8l-1.4 1.4L12 15.8l-2.4 2.4-1.4-1.4 2.4-2.4-2.4-2.4 1.4-1.4 2.4 2.4 2.4-2.4 1.4 1.4-2.4 2.4 2.4 2.4zM13 9V3.5L18.5 9H13z" />
                    </svg>
                    Cargar Asesores
                </button>

                {/* Botón normal: solo tablet y escritorio */}
                <Button
                    variant="contained"
                    size="medium"
                    startIcon={<AddOutlinedIcon />}
                    onClick={handleOpenModalCrear}
                    sx={{
                        borderRadius: '5px',
                        textTransform: 'none',
                        backgroundColor: AZUL,
                        '&:hover': { backgroundColor: AZUL_OSCURO },
                        flexShrink: 0,
                        display: { xs: 'none', sm: 'inline-flex' }
                    }}
                >
                    Crear Asesor
                </Button>
            </div>

            {/* Botón flotante: solo celular */}
            <Fab
                variant="extended"
                aria-label="Crear asesor"
                onClick={handleOpenModalCrear}
                sx={{
                    position: 'fixed',
                    right: 16,
                    bottom: 16,
                    zIndex: 10,
                    textTransform: 'none',
                    color: '#ffffff',
                    backgroundColor: AZUL,
                    '&:hover': { backgroundColor: AZUL_OSCURO },
                    display: { xs: 'inline-flex', sm: 'none' }
                }}
            >
                <AddOutlinedIcon sx={{ mr: 1 }} />
                Crear asesor
            </Fab>

            <ModalCargaExcel
                open={modalExcelOpen}
                onClose={() => setModalExcelOpen(false)}
                onDataLoaded={handleExcelData}
            />

            <ModalAsesorDisciplinar
                modo="crear"
                open={modalCrearOpen}
                onClose={() => setModalCrearOpen(false)}
                onSave={handleCrearAsesor}
            />


            {/* Contenido: en celular se deja espacio abajo para que el botón flotante no tape la paginación */}
            <div className="w-full flex flex-1 flex-col pb-24 sm:pb-5">
                {cargando ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <CircularProgress sx={{ color: AZUL }} />
                        <p className="text-sm text-gray-600">Cargando asesores disciplinares...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <p className="text-sm text-gray-600">No se pudieron cargar los asesores disciplinares.</p>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => cargarAsesores()}
                            sx={{ textTransform: 'none', borderRadius: '5px', backgroundColor: AZUL }}
                        >
                            Reintentar
                        </Button>
                    </div>
                ) : (
                    <>
                        <TablaAsesoresDisciplinares
                            rows={asesores}
                            onUpdate={handleUpdateAsesor}
                            onDelete={handleDeleteAsesor}
                            onGuardarDisponibilidad={handleGuardarDisponibilidad}
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
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}
