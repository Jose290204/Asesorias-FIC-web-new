import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useState } from 'react';

import { catalogoService } from '../../../services/catalogoService';
import ModalEliminarSesion from './ModalEliminarSesion';

// Lista desplegable con scroll interno (el catálogo de horarios es largo)
const MENU_CON_SCROLL = {
    select: { MenuProps: { slotProps: { paper: { sx: { maxHeight: 240 } } } } }
};

// "2026-11-03" -> "3 de noviembre de 2026"
const fechaLarga = (fecha) => dayjs(fecha).locale('es').format('D [de] MMMM [de] YYYY');

// Ordena las sesiones de la más antigua a la más reciente
const ordenarSesiones = (lista) =>
    [...lista].sort(
        (a, b) => String(a.fecha).localeCompare(String(b.fecha)) || Number(a.horarioId) - Number(b.horarioId)
    );

// Quita espacios y pasa a minúsculas para comparar textos ("7:00 - 8:00 AM" == "7:00-8:00 AM")
const normalizar = (texto) => String(texto ?? '').replace(/\s+/g, '').toLowerCase();

// Texto corto para mostrar el tipo de archivo (igual que en el modal de material adicional)
// TODO: cuando se haga la limpieza de duplicados, compartirlo con ModalMaterialAdicional
const etiquetaTipoArchivo = (archivo) => {
    const mime = archivo?.mime_type || '';
    if (mime.includes('pdf')) return 'PDF';
    if (mime.includes('word')) return 'Word';
    if (mime.includes('sheet') || mime.includes('excel')) return 'Excel';
    if (mime.includes('presentation') || mime.includes('powerpoint')) return 'PowerPoint';
    if (mime.startsWith('image/')) return 'Imagen';

    const extension = String(archivo?.nombre_archivo || '').split('.').pop();
    return extension && extension !== archivo?.nombre_archivo ? extension.toUpperCase() : 'Archivo';
};

const iconoArchivo = (mimeType) =>
    mimeType?.includes('pdf') ? <PictureAsPdfIcon color="error" /> : <InsertDriveFileIcon color="primary" />;

// Formulario de "Detalle de sesión": la fecha empieza siendo la de hoy
const sesionNuevaInicial = (horarioId = '') => ({
    fecha: dayjs(),
    horarioId,
    observaciones: '',
    evidencias: []
});

/**
 * Modal para registrar las sesiones de una asesoría, una por una.
 *
 * Props:
 *  - open, onClose
 *  - data: la fila de la asesoría. Las sesiones se leen de data.sesiones (o data.raw.sesiones):
 *      [{ id, fecha: 'YYYY-MM-DD', horarioId, horario, observaciones, evidencias }]
 *      evidencias: [{ id_material, nombre_archivo, mime_type, url_archivo }] (misma forma que el material adicional)
 *  - onSave: (sesiones) => void   (recibe la lista completa; se llama con "Guardar cambios")
 *  - showToast
 */
export default function ModalSesionesAsesoria({ open, onClose, data, onSave, showToast }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const [sesiones, setSesiones] = useState([]);
    const [sesionesIniciales, setSesionesIniciales] = useState([]);
    const [sesionNueva, setSesionNueva] = useState(() => sesionNuevaInicial());
    const [calendarioOpen, setCalendarioOpen] = useState(false);
    // Sesión que se está por eliminar (pide confirmación): { id, numero, fecha }
    const [sesionAEliminar, setSesionAEliminar] = useState(null);

    const horariosList = catalogoService.getHorarios();

    // Horario de la asesoría: sirve como valor inicial del formulario de sesión.
    // Se busca por id; si la fila solo trae el texto, se busca por nombre.
    const horarioAsesoriaId = (() => {
        const id = data?.horarioId ?? data?.raw?.id_horario;
        if (id !== undefined && id !== null && id !== '') return String(id);
        const porNombre = horariosList.find((h) => normalizar(h.horario) === normalizar(data?.horario));
        return porNombre ? String(porNombre.id_horario) : '';
    })();

    // Cada vez que se abre: se cargan las sesiones de la asesoría y el formulario queda limpio (con la fecha de hoy)
    useEffect(() => {
        if (!open) return;

        // TODO: ajusta el nombre del campo (sesiones) a como lo mande el backend
        const origen = data?.sesiones ?? data?.raw?.sesiones ?? [];
        const lista = ordenarSesiones(
            (Array.isArray(origen) ? origen : [])
                .filter((s) => s && dayjs(s.fecha).isValid())
                .map((s, i) => ({
                    id: s.id ?? `sesion-${i}`,
                    fecha: dayjs(s.fecha).format('YYYY-MM-DD'),
                    horarioId: String(s.horarioId ?? s.id_horario ?? ''),
                    horario: s.horario ?? '',
                    observaciones: s.observaciones ?? s.nota ?? '',
                    evidencias: Array.isArray(s.evidencias) ? s.evidencias : []
                }))
        );

        setSesiones(lista);
        setSesionesIniciales(lista);
        setSesionNueva(sesionNuevaInicial(horarioAsesoriaId));
        setCalendarioOpen(false);
        setSesionAEliminar(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, open]);

    // Se compara como texto porque "sesiones" es una lista
    const isModified = JSON.stringify(sesiones) !== JSON.stringify(sesionesIniciales);

    const sesionValida = Boolean(sesionNueva.fecha?.isValid()) && Boolean(sesionNueva.horarioId);

    // Se quita el foco antes de abrir el calendario para no dejar un elemento enfocado bajo el modal (aria-hidden)
    const abrirCalendario = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setCalendarioOpen(true);
    };

    // --- Evidencia de la sesión que se está llenando ---

    const handleAgregarEvidencia = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const nuevos = files.map((file, index) => ({
            id_material: `evidencia-${Date.now()}-${index}`,
            nombre_archivo: file.name,
            mime_type: file.type || 'application/octet-stream',
            url_archivo: URL.createObjectURL(file)
        }));

        setSesionNueva((prev) => ({ ...prev, evidencias: [...prev.evidencias, ...nuevos] }));
        // Permite volver a elegir el mismo archivo si se borró
        event.target.value = null;
    };

    const handleQuitarEvidencia = (archivo) => {
        URL.revokeObjectURL(archivo.url_archivo);
        setSesionNueva((prev) => ({
            ...prev,
            evidencias: prev.evidencias.filter((e) => e.id_material !== archivo.id_material)
        }));
    };

    // --- Lista de sesiones ---

    // Pasa la sesión a la lista (todavía no se guarda en la asesoría: eso pasa con "Guardar cambios")
    const handleAgregarSesion = () => {
        if (!sesionValida) return;

        const fecha = sesionNueva.fecha.format('YYYY-MM-DD');
        const yaExiste = sesiones.some((s) => s.fecha === fecha && s.horarioId === sesionNueva.horarioId);
        if (yaExiste) {
            if (showToast) showToast('Ya hay una sesión con esa fecha y horario', 'error');
            return;
        }

        const horario = horariosList.find((h) => String(h.id_horario) === sesionNueva.horarioId)?.horario ?? '';
        const nueva = {
            id: `nueva-${Date.now()}`,
            fecha,
            horarioId: sesionNueva.horarioId,
            horario,
            observaciones: sesionNueva.observaciones.trim(),
            evidencias: sesionNueva.evidencias
        };

        setSesiones((prev) => ordenarSesiones([...prev, nueva]));
        // El formulario vuelve a empezar (fecha de hoy, sin observaciones ni evidencia); el horario se conserva
        setSesionNueva(sesionNuevaInicial(sesionNueva.horarioId));
    };

    // Se llama desde la confirmación: quita la sesión de la lista (se aplica al guardar los cambios)
    const handleConfirmarEliminarSesion = () => {
        if (!sesionAEliminar) return;
        setSesiones((prev) => prev.filter((s) => s.id !== sesionAEliminar.id));
        setSesionAEliminar(null);
    };

    const handleGuardar = () => {
        if (!isModified) return;
        if (onSave) onSave(sesiones);
        onClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
                fullScreen={esCelular}
                sx={{
                    '& .MuiPaper-root': esCelular
                        ? { borderRadius: 0 }
                        : {
                            width: '550px',
                            maxWidth: '90vw',
                            maxHeight: '90dvh',
                            borderRadius: '12px',
                            p: 1.5
                        }
                }}
            >
                {/* Encabezado: materia y personas de la asesoría */}
                <DialogTitle sx={{ m: 0, p: 2, pr: 7, fontWeight: 'bold', fontSize: '1.2rem', overflowWrap: 'anywhere' }}>
                    Sesiones: {data?.materia || 'Asesoría'}
                    {(data?.estudiante || data?.asesor) && (
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', fontWeight: 'normal' }}>
                            {data?.estudiante && `Estudiante: ${data.estudiante}`}
                            {data?.estudiante && data?.asesor && ' · '}
                            {data?.asesor && `Asesor: ${data.asesor}`}
                        </Typography>
                    )}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
                        {/* Arriba: detalle de la sesión que se va a agregar */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Detalle de sesión</Typography>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                                <DatePicker
                                    label="Fecha"
                                    value={sesionNueva.fecha}
                                    onChange={(fecha) => setSesionNueva((prev) => ({ ...prev, fecha }))}
                                    format="DD/MM/YYYY"
                                    open={calendarioOpen}
                                    onOpen={abrirCalendario}
                                    onClose={() => setCalendarioOpen(false)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            onClick: abrirCalendario
                                        }
                                    }}
                                />

                                <TextField
                                    select
                                    label="Horario"
                                    size="small"
                                    fullWidth
                                    value={sesionNueva.horarioId}
                                    onChange={(e) => setSesionNueva((prev) => ({ ...prev, horarioId: e.target.value }))}
                                    slotProps={MENU_CON_SCROLL}
                                >
                                    {horariosList.map((item) => (
                                        <MenuItem key={item.id_horario} sx={{ whiteSpace: 'normal' }} value={String(item.id_horario)}>
                                            {item.horario}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            <TextField
                                label="Observaciones"
                                size="small"
                                fullWidth
                                multiline
                                minRows={2}
                                value={sesionNueva.observaciones}
                                onChange={(e) => setSesionNueva((prev) => ({ ...prev, observaciones: e.target.value }))}
                                placeholder="Ej. Se vio el tema de normalización"
                            />

                            {/* Evidencia: título a la izquierda y el botón para subir archivos al lado */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Evidencia</Typography>

                                <Button
                                    component="label"
                                    variant="outlined"
                                    size="small"
                                    startIcon={<AttachFileOutlinedIcon />}
                                    sx={{ textTransform: 'none', minHeight: 36 }}
                                >
                                    Agregar evidencia
                                    <input type="file" hidden multiple onChange={handleAgregarEvidencia} />
                                </Button>
                            </Box>

                            {/* Archivos elegidos: solo se pueden quitar */}
                            {sesionNueva.evidencias.length > 0 && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {sesionNueva.evidencias.map((archivo) => (
                                        <Box
                                            key={archivo.id_material}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '8px',
                                                p: 1.25,
                                                backgroundColor: '#FFFFFF'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', flexShrink: 0 }}>{iconoArchivo(archivo.mime_type)}</Box>

                                            {/* Nombre y tipo: el nombre largo se corta con "…" y no empuja el botón */}
                                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                                <Typography noWrap title={archivo.nombre_archivo} sx={{ fontSize: '14.5px', fontWeight: 600 }}>
                                                    {archivo.nombre_archivo}
                                                </Typography>
                                                <Typography noWrap sx={{ fontSize: '12px', color: 'text.secondary' }}>
                                                    {etiquetaTipoArchivo(archivo)}
                                                </Typography>
                                            </Box>

                                            <Tooltip title="Quitar archivo">
                                                <IconButton
                                                    size="small"
                                                    aria-label="Quitar archivo"
                                                    onClick={() => handleQuitarEvidencia(archivo)}
                                                    sx={{ color: '#C42525', flexShrink: 0 }}
                                                >
                                                    <DeleteOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {/* Al final del formulario: pasa la sesión a la lista de abajo */}
                            <Button
                                variant="contained"
                                startIcon={<AddOutlinedIcon />}
                                onClick={handleAgregarSesion}
                                disabled={!sesionValida}
                                sx={{ textTransform: 'none', minHeight: 40 }}
                            >
                                Agregar sesión
                            </Button>
                        </Box>

                        {/* Abajo: sesiones registradas, una debajo de otra */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Sesiones registradas</Typography>
                                <Chip
                                    size="small"
                                    variant="outlined"
                                    label={sesiones.length}
                                    sx={{ borderColor: '#08338F', color: '#08338F', fontWeight: 600 }}
                                />
                            </Box>

                            {sesiones.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                                    Aún no hay sesiones registradas.
                                </Typography>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {sesiones.map((sesion, indice) => (
                                        <Box
                                            key={sesion.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                borderLeft: '4px solid #08338F',
                                                backgroundColor: '#F7F9FD',
                                                borderRadius: '6px',
                                                px: 1.5,
                                                py: 1
                                            }}
                                        >
                                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                                    Sesión {indice + 1}
                                                </Typography>

                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                                                    <CalendarMonthOutlinedIcon sx={{ fontSize: 18, color: '#08338F', mt: '2px', flexShrink: 0 }} />
                                                    <Typography sx={{ fontSize: '0.9rem', color: '#333333', overflowWrap: 'anywhere' }}>
                                                        {fechaLarga(sesion.fecha)}
                                                        {sesion.horario && ` · ${sesion.horario}`}
                                                    </Typography>
                                                </Box>

                                                {sesion.observaciones && (
                                                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', overflowWrap: 'anywhere', mt: 0.25 }}>
                                                        {sesion.observaciones}
                                                    </Typography>
                                                )}

                                                {/* Evidencia de la sesión: cada archivo abre en otra pestaña */}
                                                {sesion.evidencias.length > 0 && (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.75 }}>
                                                        {sesion.evidencias.map((archivo) => (
                                                            <Chip
                                                                key={archivo.id_material}
                                                                size="small"
                                                                variant="outlined"
                                                                component="a"
                                                                clickable
                                                                href={archivo.url_archivo}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                icon={<AttachFileOutlinedIcon />}
                                                                label={archivo.nombre_archivo}
                                                                sx={{ maxWidth: '100%' }}
                                                            />
                                                        ))}
                                                    </Box>
                                                )}
                                            </Box>

                                            <Tooltip title="Eliminar sesión">
                                                <IconButton
                                                    size="small"
                                                    aria-label={`Eliminar sesión ${indice + 1}`}
                                                    onClick={() => setSesionAEliminar({ id: sesion.id, numero: indice + 1, fecha: sesion.fecha })}
                                                    sx={{ color: '#C42525', flexShrink: 0 }}
                                                >
                                                    <DeleteOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </DialogContent>

                {/* Pie: dos botones del mismo ancho en celular */}
                <DialogActions
                    sx={{
                        p: 2,
                        pt: 1.5,
                        gap: 1,
                        pb: esCelular ? 'calc(16px + env(safe-area-inset-bottom))' : 2,
                        '& > button': { flex: esCelular ? 1 : 'none', minHeight: 40 }
                    }}
                >
                    <Button variant="outlined" color="inherit" onClick={onClose}>
                        Cerrar
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleGuardar} disabled={!isModified}>
                        Guardar cambios
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmación antes de quitar una sesión */}
            <ModalEliminarSesion
                open={Boolean(sesionAEliminar)}
                onClose={() => setSesionAEliminar(null)}
                onConfirm={handleConfirmarEliminarSesion}
                detalle={sesionAEliminar && `Sesión ${sesionAEliminar.numero} · ${fechaLarga(sesionAEliminar.fecha)}`}
            />
        </LocalizationProvider>
    );
}