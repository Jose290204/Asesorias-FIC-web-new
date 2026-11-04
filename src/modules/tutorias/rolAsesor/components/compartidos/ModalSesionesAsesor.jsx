import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
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
import { eliminarSesion, registrarSesion, traerSesiones } from '../../../../../Services/sesionesAsesorService';
import CampoSelect from './CampoSelect';

const FORMULARIO_INICIAL = { fecha: null, horarioId: '', tema: '', notas: '' };

// "2026-11-03" -> "03/11/2026"
const formatearFecha = (fecha) => dayjs(fecha).format('DD/MM/YYYY');

// Sesiones de una asesoría: lista, registrar y eliminar.
// data es la asesoría (usa data.id y data.fecha_inicio).
// soloLectura: sin registrar ni eliminar (la API solo lo permite con la asesoría en curso).
// onCambio: avisa a la vista que cambió el conteo de sesiones, para que recargue la lista.
export default function ModalSesionesAsesor({ open, onClose, data, soloLectura = false, showToast, onCambio }) {
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
            const nueva = await registrarSesion(asesoriaId, {
                fecha: formulario.fecha.format('YYYY-MM-DD'),
                horarioId: Number(formulario.horarioId),
                tema: formulario.tema.trim(),
                notas: formulario.notas.trim(),
            });
            // La API ordena por fecha descendente: se reacomoda la lista igual
            setSesiones((prev) => [nueva, ...prev].sort((a, b) => (b.fecha === a.fecha ? b.id - a.id : b.fecha.localeCompare(a.fecha))));
            setFormulario(FORMULARIO_INICIAL);
            showToast?.('Sesión registrada correctamente', 'success');
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
            await eliminarSesion(sesionAEliminar.id);
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

    const cerrar = () => {
        setFormulario(FORMULARIO_INICIAL);
        setCalendarioOpen(false);
        onClose?.();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Dialog
                open={Boolean(open)}
                onClose={cerrar}
                sx={{
                    '& .MuiPaper-root': {
                        width: '550px',
                        maxWidth: '90vw',
                        maxHeight: '90dvh',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1.5
                    }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Sesiones: {data?.materia}
                    {data?.estudiante && (
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', fontWeight: 'normal' }}>
                            Alumno: {data.estudiante}
                        </Typography>
                    )}
                    <IconButton
                        aria-label="close"
                        onClick={cerrar}
                        sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {!soloLectura && (
                        <>
                            <Typography sx={{ fontWeight: 'bold', mb: 1.5 }}>Registrar sesión</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                                {inicioFuturo && (
                                    <Alert severity="info">
                                        Esta asesoría inicia el {data.fecha_inicio_formateada}. Las sesiones se pueden registrar
                                        a partir de esa fecha y nunca en fechas futuras.
                                    </Alert>
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

                                <Button
                                    variant="contained"
                                    onClick={handleRegistrar}
                                    disabled={!formularioCompleto || guardando || inicioFuturo}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Registrar sesión
                                </Button>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                        </>
                    )}

                    <Typography sx={{ fontWeight: 'bold', mb: 1.5 }}>
                        Sesiones registradas ({sesiones.length})
                    </Typography>

                    {cargando ? (
                        <Box className="flex justify-center py-4"><CircularProgress size={28} /></Box>
                    ) : sesiones.length === 0 ? (
                        <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                            Todavía no hay sesiones registradas.
                        </Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {sesiones.map((sesion) => (
                                <Box
                                    key={sesion.id}
                                    sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', p: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1 }}
                                >
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            {formatearFecha(sesion.fecha)} · {sesion.horario?.etiqueta}
                                        </Typography>
                                        {sesion.tema && (
                                            <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                                                <strong>Tema: </strong>{sesion.tema}
                                            </Typography>
                                        )}
                                        {sesion.notas && (
                                            <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                                                {sesion.notas}
                                            </Typography>
                                        )}
                                    </Box>
                                    {!soloLectura && (
                                        <Tooltip title="Eliminar sesión">
                                            <IconButton color="error" size="small" onClick={() => setSesionAEliminar(sesion)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5 }}>
                    <Button variant="outlined" color="inherit" onClick={cerrar}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* Confirmar eliminación */}
            <Dialog
                open={Boolean(sesionAEliminar)}
                onClose={() => setSesionAEliminar(null)}
                sx={{ '& .MuiPaper-root': { width: '420px', borderRadius: '12px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminar sesión</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        ¿Estás seguro de que deseas eliminar la sesión del{' '}
                        <strong>{sesionAEliminar ? formatearFecha(sesionAEliminar.fecha) : ''}</strong>? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={() => setSesionAEliminar(null)}>Cancelar</Button>
                    <Button variant="contained" color="error" onClick={handleConfirmarEliminacion} disabled={eliminando}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
