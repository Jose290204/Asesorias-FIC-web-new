import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InputBuscar from '../../../../components/ui/InputBuscar';
import TituloVista from '../../../../components/ui/TituloVista';
import ToastNotification from '../../../../components/ui/ToastNotification';
import { useCatalogos } from '../../../../context/CatalogosContext';
import {
    crearEstudianteAdmin,
    darDeBajaEstudianteAdmin,
    editarEstudianteAdmin,
    traerEstudiantesAdmin
} from '../../../../Services/estudiantesAdminService';
import { mensajesDeError } from '../../../../Services/errores';
import ModalCrearEstudiante from '../components/estudiantes/modales/ModalCrearEstudiante';
import TablaEstudiantes from '../components/estudiantes/TablaEstudiantes';
import ModalCargaExcel from '../components/ModalCargaExel';
import { uploadEstudiantes } from '../services/estudianteService';

// Color de los botones de crear (distinto al verde de la carga masiva)
const AZUL = '#244B91';
const AZUL_OSCURO = '#1B3A73';

// Estilo de las listas de filtro (licenciatura y grupo)
const ESTILO_FILTRO = { width: { xs: 230, sm: 220 }, maxWidth: '100%', flexShrink: 0, backgroundColor: '#FFFFFF' };

export default function Estudiantes() {
    const { catalogos } = useCatalogos();

    // Lo que se escribe en el buscador, y el texto que ya se mandó a la API (con una pausa al escribir)
    const [busqueda, setBusqueda] = useState('');
    const [buscar, setBuscar] = useState('');

    // Filtros ('' = todas). El grupo depende de la licenciatura elegida
    const [licenciaturaId, setLicenciaturaId] = useState('');
    const [grupoId, setGrupoId] = useState('');

    // La API pagina de 10 en 10: "meta" trae la última página y el total
    const [pagina, setPagina] = useState(1);
    const [meta, setMeta] = useState(null);

    const [estudiantes, setEstudiantes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    const [modalExcelOpen, setModalExcelOpen] = useState(false);
    const [modalCrearOpen, setModalCrearOpen] = useState(false);

    // Estado para el toast global de la vista
    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    const showToast = useCallback((message, type = 'info') => {
        setToast({ open: true, message, type });
    }, []);

    // Grupos que ofrece el filtro: los de la licenciatura elegida, o todos si no hay ninguna
    const gruposFiltro = useMemo(() => {
        const grupos = catalogos?.grupos ?? [];
        return licenciaturaId ? grupos.filter((g) => g.licenciatura_id === licenciaturaId) : grupos;
    }, [catalogos, licenciaturaId]);

    // Al dejar de escribir 400 ms se busca en la API y se vuelve a la página 1
    useEffect(() => {
        const temporizador = setTimeout(() => {
            setBuscar(busqueda.trim());
            setPagina(1);
        }, 400);

        return () => clearTimeout(temporizador);
    }, [busqueda]);

    // silencioso = recarga sin quitar la lista (se usa después de crear, editar o dar de baja)
    const cargarEstudiantes = useCallback(async ({ silencioso = false } = {}) => {
        try {
            if (!silencioso) setCargando(true);
            setError(false);

            const { estudiantes: lista, meta: metaNueva } = await traerEstudiantesAdmin({
                buscar,
                page: pagina,
                licenciaturaId,
                grupoId
            });

            // Si se dio de baja al último de esta página, la página queda vacía:
            // se regresa a la anterior (el efecto de abajo vuelve a cargar solo)
            if (lista.length === 0 && pagina > 1) {
                setPagina(pagina - 1);
                return;
            }

            setEstudiantes(lista);
            setMeta(metaNueva);
        } catch (err) {
            console.error('Error al obtener los estudiantes:', err);
            if (!silencioso) {
                setError(true);
                showToast(mensajesDeError(err)[0], 'error');
            }
        } finally {
            setCargando(false);
        }
    }, [buscar, pagina, licenciaturaId, grupoId, showToast]);

    useEffect(() => {
        cargarEstudiantes();
    }, [cargarEstudiantes]);

    // Las acciones regresan true si salió bien (el modal se cierra) y false si falló (el modal sigue abierto).
    // Aquí caen los errores de la API, por ejemplo 422 (correo o cuenta repetidos) o 409 (asesorías en curso).
    const ejecutar = async (accion, mensajeExito) => {
        try {
            await accion();
            showToast(mensajeExito, 'success');
            cargarEstudiantes({ silencioso: true });
            return true;
        } catch (err) {
            showToast(mensajesDeError(err)[0], 'error');
            return false;
        }
    };

    const handleCrearEstudiante = (formulario) =>
        ejecutar(() => crearEstudianteAdmin(formulario), 'Estudiante creado correctamente');

    const handleUpdateEstudiante = (estudiante, formulario) =>
        ejecutar(() => editarEstudianteAdmin(estudiante.id, formulario), 'Información del estudiante actualizada');

    const handleDeleteEstudiante = (estudiante) =>
        ejecutar(() => darDeBajaEstudianteAdmin(estudiante.id), 'Estudiante dado de baja');

    // TODO (etapa 2.7): conectar la carga masiva con el backend; por ahora el servicio es una simulación
    const handleExcelData = async (data) => {
        try {
            await uploadEstudiantes(data);
            showToast('Estudiantes cargados exitosamente', 'success');
            cargarEstudiantes({ silencioso: true });
        } catch (err) {
            console.error('Error al procesar el archivo de estudiantes:', err);
            showToast('Error al procesar el archivo de estudiantes', 'error');
        }
    };

    // Al cambiar de licenciatura se limpia el grupo; cualquier filtro regresa a la página 1
    const handleCambiarLicenciatura = (e) => {
        setLicenciaturaId(e.target.value);
        setGrupoId('');
        setPagina(1);
    };

    const handleCambiarGrupo = (e) => {
        setGrupoId(e.target.value);
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

    const hayFiltros = Boolean(licenciaturaId || grupoId);
    const total = meta?.total ?? estudiantes.length;

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-transparent px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <TituloVista
                titulo="Estudiantes"
                subtitulo={!cargando && !error ? `${total} ${total === 1 ? 'estudiante' : 'estudiantes'}${buscar || hayFiltros ? ' encontrados' : ''}` : null}
            />

            {/* Filtros: en celular van arriba, uno bajo otro */}
            <div className="w-full flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <TextField
                    select
                    size="small"
                    label="Licenciatura"
                    value={licenciaturaId}
                    onChange={handleCambiarLicenciatura}
                    sx={ESTILO_FILTRO}
                    slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
                >
                    <MenuItem value="">
                        <em>Todas</em>
                    </MenuItem>
                    {(catalogos?.licenciaturas ?? []).map((l) => (
                        <MenuItem key={l.id} value={l.id} sx={{ whiteSpace: 'normal' }}>
                            {l.nombre}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    size="small"
                    label="Grupo"
                    value={grupoId}
                    onChange={handleCambiarGrupo}
                    sx={ESTILO_FILTRO}
                    slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
                >
                    <MenuItem value="">
                        <em>Todos</em>
                    </MenuItem>
                    {gruposFiltro.map((g) => (
                        <MenuItem key={g.id} value={g.id}>
                            {g.modalidad === 'virtual' ? `${g.nombre} (virtual)` : g.nombre}
                        </MenuItem>
                    ))}
                </TextField>
            </div>

            {/* Barra de herramientas: en celular el buscador va arriba y "Cargar Estudiantes" debajo (a la mitad del ancho) */}
            <div className="-mt-3 w-full flex flex-col items-start gap-3 sm:-mt-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="w-full min-w-0 sm:flex-1">
                    <InputBuscar
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre, correo o cuenta..."
                    />
                </div>

                <button
                    onClick={handleOpenModalExcel}
                    className="w-1/2 sm:w-auto shrink-0 justify-center bg-[#2e7d32] hover:bg-[#1b5e20] text-sm text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1.8 14.8l-1.4 1.4L12 15.8l-2.4 2.4-1.4-1.4 2.4-2.4-2.4-2.4 1.4-1.4 2.4 2.4 2.4-2.4 1.4 1.4-2.4 2.4 2.4 2.4zM13 9V3.5L18.5 9H13z" />
                    </svg>
                    Cargar Estudiantes
                </button>

                {/* Botón normal: solo tablet y escritorio */}
                <Button
                    variant="contained"
                    size="medium"
                    startIcon={<PersonAddAlt1OutlinedIcon />}
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
                    Crear Estudiante
                </Button>
            </div>

            {/* Botón flotante: solo celular */}
            <Fab
                variant="extended"
                aria-label="Crear estudiante"
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
                <PersonAddAlt1OutlinedIcon sx={{ mr: 1 }} />
                Crear estudiante
            </Fab>

            <ModalCrearEstudiante
                open={modalCrearOpen}
                onClose={() => setModalCrearOpen(false)}
                onSave={handleCrearEstudiante}
            />

            {/* Modal reutilizable de carga masiva desde Excel */}
            <ModalCargaExcel
                open={modalExcelOpen}
                onClose={() => setModalExcelOpen(false)}
                onDataLoaded={handleExcelData}
            />


            {/* Contenido: en celular se deja espacio abajo para que el botón flotante no tape la paginación */}
            <div className="w-full flex flex-1 flex-col pb-24 sm:pb-5">
                {cargando ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <CircularProgress sx={{ color: AZUL }} />
                        <p className="text-sm text-gray-600">Cargando estudiantes...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <p className="text-sm text-gray-600">No se pudieron cargar los estudiantes.</p>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => cargarEstudiantes()}
                            sx={{ textTransform: 'none', borderRadius: '5px', backgroundColor: AZUL }}
                        >
                            Reintentar
                        </Button>
                    </div>
                ) : (
                    <>
                        <TablaEstudiantes
                            rows={estudiantes}
                            onUpdate={handleUpdateEstudiante}
                            onDelete={handleDeleteEstudiante}
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
