import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useState } from 'react';

import { useCatalogos } from '../../../../../context/CatalogosContext';
import { mensajesDeError } from '../../../../../Services/errores';
import {
    descargarEvidencia,
    eliminarEvidencia as eliminarEvidenciaAsesor,
    subirEvidencias as subirEvidenciasAsesor,
    validarEvidencias
} from '../../../../../Services/evidenciasSesionService';
import { eliminarSesion, registrarSesion, traerSesiones } from '../../../../../Services/sesionesAsesorService';
import CampoSelect from './CampoSelect';
import ListaEvidencias from './ListaEvidencias';
import SelectorEvidencias from './SelectorEvidencias';
import useMediaQuery from '@mui/material/useMediaQuery';

const FORMULARIO_INICIAL = { fecha: null, horarioId: '', tema: '', notas: '' };

// "2026-11-03" -> "03/11/2026"
const formatearFecha = (fecha) => dayjs(fecha).format('DD/MM/YYYY');

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

// Cuadrito con el día y el mes de la sesión
function FechaSesion({ fecha }) {
    const d = dayjs(fecha);

    return (
        <Box sx={{ width: 52, flexShrink: 0, py: '6px', borderRadius: '10px', backgroundColor: '#E6ECF8', color: '#08338F', textAlign: 'center' }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.1 }}>{d.format('DD')}</Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', lineHeight: 1.2 }}>{MESES[d.month()]}</Typography>
        </Box>
    );
}

// Título pequeño de cada sección del modal
const ETIQUETA_SECCION = {
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '#6A6A6A'
};

// Sesiones de una asesoría: lista, registrar y eliminar.
// data es la asesoría (usa data.id y data.fecha_inicio).
// soloLectura: sin registrar ni eliminar (la API solo lo permite con la asesoría en curso).
// onCambio: avisa a la vista que cambió el conteo de sesiones, para que recargue la lista.
// acciones: { registrar, eliminar, subirEvidencias, eliminarEvidencia } para usar otras rutas (el administrador usa /admin/...);
// por defecto son las del asesor. Listar siempre usa la ruta compartida.
export default function ModalSesionesAsesor({ open, onClose, data, soloLectura = false, showToast, onCambio, acciones }) {
    const registrar = acciones?.registrar ?? registrarSesion;
    const eliminar = acciones?.eliminar ?? eliminarSesion;
    const subirEv = acciones?.subirEvidencias ?? subirEvidenciasAsesor;
    const eliminarEv = acciones?.eliminarEvidencia ?? eliminarEvidenciaAsesor;
    const esCelular = useMediaQuery('(max-width:599.95px)');
    const { catalogos } = useCatalogos();
    const horarios = catalogos?.horarios ?? [];

    const [sesiones, setSesiones] = useState([]);
    // Id de la asesoría cuya lista ya llegó (sirve para saber si todavía se está cargando)
    const [cargadoDe, setCargadoDe] = useState(null);
    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
    const [calendarioOpen, setCalendarioOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [sesionAEliminar, setSesionAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);
    // Evidencias elegidas para la sesión que se está por registrar (todavía no se suben)
    const [archivosNuevos, setArchivosNuevos] = useState([]);
    // Id de la sesión a la que se le están subiendo evidencias (null = ninguna)
    const [subiendoEvidenciaDe, setSubiendoEvidenciaDe] = useState(null);
    const [evidenciaAEliminar, setEvidenciaAEliminar] = useState(null);
    const [eliminandoEvidencia, setEliminandoEvidencia] = useState(false);

    const asesoriaId = data?.id;
    const cargando = Boolean(open && asesoriaId && cargadoDe !== asesoriaId);

    // La API solo acepta sesiones desde el día de inicio de la asesoría y hasta hoy (nunca fechas futuras).
    // Si la asesoría todavía no empieza, no existe ningún día válido: se avisa y se bloquea el formulario.
    const inicioFuturo = Boolean(data?.fecha_inicio && dayjs(data.fecha_inicio).isAfter(dayjs(), 'day'));

    // Carga las sesiones cada vez que se abre el modal
    useEffect(() => {
        if (!open || !asesoriaId) return undefined;

        let cancelado = false;

        traerSesiones(asesoriaId)
            .then((lista) => {
                if (cancelado) return;
                setSesiones(lista);
                setCargadoDe(asesoriaId);
            })
            .catch((error) => {
                if (cancelado) return;
                setCargadoDe(asesoriaId);
                showToast?.(mensajesDeError(error)[0], 'error');
            });

        return () => {
            cancelado = true;
        };
    }, [open, asesoriaId, showToast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario((prev) => ({ ...prev, [name]: value }));
    };

    // Se quita el foco del campo antes de abrir el calendario (evita el aviso de aria-hidden)
    const abrirCalendario = () => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        setCalendarioOpen(true);
    };

    const formularioCompleto = Boolean(formulario.fecha?.isValid() && formulario.horarioId);

    const handleRegistrar = async () => {
        if (!formularioCompleto || guardando) return;

        setGuardando(true);
        try {
            const nueva = await registrar(asesoriaId, {
                fecha: formulario.fecha.format('YYYY-MM-DD'),
                horarioId: Number(formulario.horarioId),
                tema: formulario.tema.trim(),
                notas: formulario.notas.trim(),
            });
            // La sesión ya existe. Si se eligieron evidencias, se suben aparte: si fallan, la sesión se conserva
            // y las evidencias se pueden agregar después desde la propia sesión.
            let evidencias = [];
            let errorEvidencias = null;
            if (archivosNuevos.length > 0) {
                try {
                    evidencias = await subirEv(nueva.id, archivosNuevos);
                } catch (error) {
                    errorEvidencias = mensajesDeError(error)[0];
                }
            }

            // La API ordena por fecha descendente: se reacomoda la lista igual
            setSesiones((prev) => [{ ...nueva, evidencias }, ...prev].sort((a, b) => (b.fecha === a.fecha ? b.id - a.id : b.fecha.localeCompare(a.fecha))));
            setFormulario(FORMULARIO_INICIAL);
            setArchivosNuevos([]);
            if (errorEvidencias) {
                showToast?.(`Sesión registrada, pero no se subieron las evidencias: ${errorEvidencias} Puedes agregarlas desde la sesión.`, 'error');
            } else {
                showToast?.('Sesión registrada correctamente', 'success');
            }
            onCambio?.();
        } catch (error) {
            // Aquí caen, por ejemplo, 409 sesion_duplicada y 422 fecha_anterior_al_inicio
            showToast?.(mensajesDeError(error)[0], 'error');
        } finally {
            setGuardando(false);
        }
    };

    const handleConfirmarEliminacion = async () => {
        if (!sesionAEliminar) return;

        setEliminando(true);
        try {
            await eliminar(sesionAEliminar.id);
            setSesiones((prev) => prev.filter((s) => s.id !== sesionAEliminar.id));
            setSesionAEliminar(null);
            showToast?.('Sesión eliminada correctamente', 'success');
            onCambio?.();
        } catch (error) {
            showToast?.(mensajesDeError(error)[0], 'error');
        } finally {
            setEliminando(false);
        }
    };

    // Elegir evidencias para la sesión que se va a registrar
    const handleElegirEvidencias = (event) => {
        const elegidos = Array.from(event.target.files);
        event.target.value = null;
        if (elegidos.length === 0) return;

        const todos = [...archivosNuevos, ...elegidos];
        const problema = validarEvidencias(todos);
        if (problema) {
            showToast?.(problema, 'error');
            return;
        }
        setArchivosNuevos(todos);
    };

    const quitarArchivoNuevo = (indice) => setArchivosNuevos((prev) => prev.filter((_, i) => i !== indice));

    // Agregar evidencias a una sesión que ya existe
    const handleAgregarEvidencias = async (sesion, event) => {
        const elegidos = Array.from(event.target.files);
        event.target.value = null;
        if (elegidos.length === 0) return;

        const problema = validarEvidencias(elegidos);
        if (problema) {
            showToast?.(problema, 'error');
            return;
        }

        setSubiendoEvidenciaDe(sesion.id);
        try {
            const creadas = await subirEv(sesion.id, elegidos);
            setSesiones((prev) => prev.map((s) => (s.id === sesion.id ? { ...s, evidencias: [...(s.evidencias ?? []), ...creadas] } : s)));
            showToast?.(creadas.length === 1 ? 'Evidencia subida correctamente' : 'Evidencias subidas correctamente', 'success');
        } catch (error) {
            showToast?.(mensajesDeError(error)[0], 'error');
        } finally {
            setSubiendoEvidenciaDe(null);
        }
    };

    const handleDescargarEvidencia = async (evidencia) => {
        try {
            await descargarEvidencia(evidencia.id, evidencia.nombre);
        } catch (error) {
            showToast?.(mensajesDeError(error)[0], 'error');
        }
    };

    const handleConfirmarEliminarEvidencia = async () => {
        if (!evidenciaAEliminar) return;

        setEliminandoEvidencia(true);
        try {
            await eliminarEv(evidenciaAEliminar.id);
            setSesiones((prev) => prev.map((s) => ({ ...s, evidencias: (s.evidencias ?? []).filter((e) => e.id !== evidenciaAEliminar.id) })));
            setEvidenciaAEliminar(null);
            showToast?.('Evidencia eliminada correctamente', 'success');
        } catch (error) {
            showToast?.(mensajesDeError(error)[0], 'error');
        } finally {
            setEliminandoEvidencia(false);
        }
    };

    const cerrar = () => {
        setFormulario(FORMULARIO_INICIAL);
        setArchivosNuevos([]);
        setCalendarioOpen(false);
        onClose?.();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Dialog
                open={Boolean(open)}
                onClose={cerrar}
                fullScreen={esCelular}
                sx={{
                    '& .MuiPaper-root': esCelular ? { borderRadius: 0 } : {
                        width: '550px',
                        maxWidth: '90vw',
                        minHeight: '420px',
                        maxHeight: '90dvh',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1.5
                    }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, pr: 7, display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            flexShrink: 0,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #1E4DB7 0%, #08338F 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <EventNoteOutlinedIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1.2 }}>
                            Sesiones
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px', overflowWrap: 'anywhere' }}>
                            {data?.materia}
                            {data?.estudiante && ` · Alumno: ${data.estudiante}`}
                        </Typography>
                    </Box>
                    <IconButton
                        aria-label="close"
                        onClick={cerrar}
                        sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ overflowX: 'hidden' }}>
                    {!soloLectura && (
                        <>
                            <Typography sx={{ ...ETIQUETA_SECCION, mb: 1.5 }}>Registrar sesión</Typography>
                            <Box
                                sx={{
                                    // Una sola columna que nunca se ensancha más que el recuadro
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0, 1fr)',
                                    gap: 2,
                                    mb: 3,
                                    p: 2,
                                    borderRadius: '12px',
                                    backgroundColor: '#F7F9FD',
                                    border: '1px solid #EEF1F7'
                                }}
                            >
                                {inicioFuturo && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '10px',
                                            p: '10px 12px',
                                            borderRadius: '10px',
                                            backgroundColor: '#E8F1FB',
                                            color: '#0B4A8F'
                                        }}
                                    >
                                        <InfoOutlinedIcon sx={{ fontSize: 20, mt: '1px', flexShrink: 0 }} />
                                        <Typography variant="body2" sx={{ minWidth: 0, overflowWrap: 'break-word' }}>
                                            Esta asesoría inicia el {data.fecha_inicio_formateada}. Podrás registrar sesiones desde esa fecha.
                                        </Typography>
                                    </Box>
                                )}

                                <DatePicker
                                    label="Fecha de la sesión"
                                    value={formulario.fecha}
                                    onChange={(nueva) => setFormulario((prev) => ({ ...prev, fecha: nueva }))}
                                    format="DD/MM/YYYY"
                                    // La sesión ya ocurrió (hoy sí vale) y no puede ser anterior al inicio de la asesoría
                                    disableFuture
                                    disabled={inicioFuturo}
                                    minDate={data?.fecha_inicio ? dayjs(data.fecha_inicio) : undefined}
                                    open={calendarioOpen}
                                    onOpen={abrirCalendario}
                                    onClose={() => setCalendarioOpen(false)}
                                    slotProps={{
                                        textField: { size: 'small', fullWidth: true, onClick: abrirCalendario }
                                    }}
                                />

                                {/* Mismo select que usan los demás modales: la lista mide lo mismo que el campo y no se desborda */}
                                <CampoSelect
                                    label="Horario"
                                    name="horarioId"
                                    size="small"
                                    fullWidth
                                    disabled={inicioFuturo}
                                    value={formulario.horarioId}
                                    onChange={handleChange}
                                >
                                    {horarios.map((h) => (
                                        <MenuItem key={h.id} sx={{ whiteSpace: 'normal' }} value={String(h.id)}>{h.etiqueta}</MenuItem>
                                    ))}
                                </CampoSelect>

                                <TextField
                                    label="Tema (opcional)"
                                    name="tema"
                                    disabled={inicioFuturo}
                                    size="small"
                                    fullWidth
                                    value={formulario.tema}
                                    onChange={handleChange}
                                    slotProps={{ htmlInput: { maxLength: 150 } }}
                                />

                                <TextField
                                    label="Notas (opcional)"
                                    name="notas"
                                    disabled={inicioFuturo}
                                    size="small"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={formulario.notas}
                                    onChange={handleChange}
                                    slotProps={{ htmlInput: { maxLength: 2000 } }}
                                />

                                {/* Evidencias de la sesión (opcional): se suben al registrarla */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Evidencias</Typography>
                                    <SelectorEvidencias onElegir={handleElegirEvidencias} esCelular={esCelular} deshabilitado={inicioFuturo || guardando} />
                                    {archivosNuevos.map((archivo, indice) => (
                                        <Box
                                            key={`${archivo.name}-${indice}`}
                                            sx={{ display: 'flex', alignItems: 'center', gap: '6px', pl: '10px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E3E8F2' }}
                                        >
                                            <Typography noWrap title={archivo.name} sx={{ flex: 1, minWidth: 0, fontSize: '13px' }}>{archivo.name}</Typography>
                                            <IconButton size="small" aria-label={`Quitar ${archivo.name}`} disabled={guardando} onClick={() => quitarArchivoNuevo(indice)}>
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>

                                <Button
                                    variant="contained"
                                    onClick={handleRegistrar}
                                    disabled={!formularioCompleto || guardando || inicioFuturo}
                                    startIcon={<AddCircleOutlineOutlinedIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #1E4DB7 0%, #08338F 55%, #052466 100%)',
                                        boxShadow: '0 4px 12px rgba(8, 51, 143, 0.35)',
                                        '&:hover': { background: 'linear-gradient(135deg, #08338F 0%, #052466 100%)' },
                                        '&.Mui-disabled': { background: '#E0E0E0', boxShadow: 'none', color: '#9E9E9E' }
                                    }}
                                >
                                    Registrar sesión
                                </Button>
                            </Box>
                        </>
                    )}

                    <Typography sx={{ ...ETIQUETA_SECCION, mb: 1.5 }}>
                        Sesiones registradas ({sesiones.length})
                    </Typography>

                    {cargando ? (
                        <Box className="flex justify-center py-4"><CircularProgress size={28} /></Box>
                    ) : sesiones.length === 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', textAlign: 'center', py: 4 }}>
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: '50%',
                                    backgroundColor: '#F1F4FA',
                                    color: '#9AA7C4',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <EventNoteOutlinedIcon sx={{ fontSize: 34 }} />
                            </Box>
                            <Typography sx={{ fontWeight: 700, color: '#333333' }}>
                                Aún no hay sesiones
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Todavía no hay sesiones registradas.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {sesiones.map((sesion) => (
                                <Box
                                    key={sesion.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '14px',
                                        p: '12px 14px',
                                        borderRadius: '12px',
                                        backgroundColor: '#F7F9FD',
                                        border: '1px solid #EEF1F7'
                                    }}
                                >
                                    <FechaSesion fecha={sesion.fecha} />

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#08338F' }}>
                                            <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />
                                            <Typography sx={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>
                                                {formatearFecha(sesion.fecha)} · {sesion.horario?.etiqueta}
                                            </Typography>
                                        </Box>
                                        {sesion.tema && (
                                            <Typography variant="body2" sx={{ overflowWrap: 'anywhere', mt: '4px' }}>
                                                <strong>Tema: </strong>{sesion.tema}
                                            </Typography>
                                        )}
                                        {sesion.notas && (
                                            <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap', mt: '2px' }}>
                                                {sesion.notas}
                                            </Typography>
                                        )}

                                        <ListaEvidencias
                                            evidencias={sesion.evidencias}
                                            onDescargar={handleDescargarEvidencia}
                                            onEliminar={soloLectura ? undefined : setEvidenciaAEliminar}
                                        />

                                        {!soloLectura && (
                                            <Box sx={{ mt: 1 }}>
                                                <SelectorEvidencias
                                                    onElegir={(event) => handleAgregarEvidencias(sesion, event)}
                                                    esCelular={esCelular}
                                                    deshabilitado={subiendoEvidenciaDe === sesion.id}
                                                    texto={subiendoEvidenciaDe === sesion.id ? 'Subiendo...' : 'Agregar evidencia'}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                    {!soloLectura && (
                                        <Tooltip title="Eliminar sesión">
                                            <IconButton
                                                size="small"
                                                aria-label="Eliminar sesión"
                                                onClick={() => setSesionAEliminar(sesion)}
                                                sx={{ flexShrink: 0, color: '#C62828', backgroundColor: '#FDECEC', '&:hover': { backgroundColor: '#F9D6D6' } }}
                                            >
                                                <DeleteOutlineOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={cerrar} sx={{ backgroundColor: '#08338F', '&:hover': { backgroundColor: '#062568' } }}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmar eliminación */}
            <Dialog
                open={Boolean(sesionAEliminar)}
                onClose={() => setSesionAEliminar(null)}
                sx={{ '& .MuiPaper-root': { width: '420px', maxWidth: '90vw', borderRadius: '16px', p: 1.5 } }}
            >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            flexShrink: 0,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #E04848 0%, #C42525 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <DeleteOutlineOutlinedIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1.2 }}>
                            Eliminar sesión
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px' }}>
                            Esta acción no se puede deshacer
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1">
                        ¿Estás seguro de que deseas eliminar la sesión del{' '}
                        <strong>{sesionAEliminar ? formatearFecha(sesionAEliminar.fecha) : ''}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={() => setSesionAEliminar(null)} sx={{ borderRadius: '8px', textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmarEliminacion}
                        disabled={eliminando}
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmar eliminación de una evidencia */}
            <Dialog
                open={Boolean(evidenciaAEliminar)}
                onClose={() => setEvidenciaAEliminar(null)}
                sx={{ '& .MuiPaper-root': { width: '420px', maxWidth: '90vw', borderRadius: '16px', p: 1.5 } }}
            >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            flexShrink: 0,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #E04848 0%, #C42525 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <DeleteOutlineOutlinedIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1.2 }}>
                            Eliminar evidencia
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px' }}>
                            Esta acción no se puede deshacer
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
                        ¿Estás seguro de que deseas eliminar <strong>{evidenciaAEliminar?.nombre}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={() => setEvidenciaAEliminar(null)} sx={{ borderRadius: '8px', textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmarEliminarEvidencia}
                        disabled={eliminandoEvidencia}
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
