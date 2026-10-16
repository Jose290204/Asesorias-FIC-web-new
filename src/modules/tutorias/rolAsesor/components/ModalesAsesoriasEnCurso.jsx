import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import {
    Autocomplete,
    Box,
    Button,
    createFilterOptions,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useRef, useState } from 'react';

// Ajusta esta ruta según dónde esté tu estudianteService
import { getEstudiantes } from '../../rolAdministrador/services/estudianteService';

import { useAuth } from '../../../../context/AuthContext';
import { useCatalogos } from '../../../../context/CatalogosContext';

// --- HELPERS ---

// Quita espacios y pasa a minúsculas para comparar textos ("7:00 - 8:00 AM" == "7:00-8:00 AM")
const normalizar = (texto) => String(texto ?? '').replace(/\s+/g, '').toLowerCase();

// Busca en un catálogo el id que corresponde a un nombre. Devuelve '' si no lo encuentra.
const buscarId = (lista, campoNombre, campoId, nombre) => {
    const objetivo = normalizar(nombre);
    if (!objetivo) return '';
    const encontrado = lista.find((item) => normalizar(item[campoNombre]) === objetivo);
    return encontrado ? String(encontrado[campoId]) : '';
};

// Busca en un catálogo el nombre que corresponde a un id.
const buscarNombre = (lista, campoId, campoNombre, id) => {
    const encontrado = lista.find((item) => String(item[campoId]) === String(id));
    return encontrado ? encontrado[campoNombre] : undefined;
};

// La tarjeta muestra la fecha como DD/MM/YYYY. dayjs la leería como MM/DD/YYYY, así que se convierte a mano.
const parsearFecha = (valor) => {
    if (!valor) return null;
    if (typeof valor === 'string') {
        const match = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (match) {
            const [, dia, mes, anio] = match;
            const fecha = dayjs(`${anio}-${mes}-${dia}`);
            return fecha.isValid() ? fecha : null;
        }
    }
    const fecha = dayjs(valor);
    return fecha.isValid() ? fecha : null;
};

// Select cuya lista desplegable mide lo mismo que el campo (con scroll interno y texto largo en varias líneas)
function CampoSelect({ children, ...props }) {
    const campoRef = useRef(null);
    const [ancho, setAncho] = useState(undefined);

    return (
        <TextField
            select
            ref={campoRef}
            {...props}
            slotProps={{
                select: {
                    // Se mide el campo justo antes de abrir la lista
                    onOpen: () => setAncho(campoRef.current?.offsetWidth),
                    MenuProps: {
                        slotProps: {
                            paper: { sx: { maxHeight: 240, width: ancho, maxWidth: ancho } }
                        }
                    }
                }
            }}
        >
            {children}
        </TextField>
    );
}

// Deja solo las opciones del catálogo que ofrece el asesor.
// asesorLista puede traer objetos ({ id_materia, materia }), ids o nombres.
// Si el asesor no trae esa lista (undefined), se usa el catálogo completo.
const filtrarPorAsesor = (catalogo, asesorLista, campoId, campoNombre) => {
    if (!Array.isArray(asesorLista)) return catalogo;

    return catalogo.filter((item) =>
        asesorLista.some((a) => {
            if (a && typeof a === 'object') {
                return (
                    String(a[campoId] ?? '') === String(item[campoId]) ||
                    normalizar(a[campoNombre]) === normalizar(item[campoNombre])
                );
            }
            return String(a) === String(item[campoId]) || normalizar(a) === normalizar(item[campoNombre]);
        })
    );
};

// Si el valor actual de la asesoría no está entre las opciones del asesor, se agrega para que el select lo muestre
const conOpcionActual = (opciones, catalogo, campoId, idActual) => {
    if (!idActual || opciones.some((o) => String(o[campoId]) === String(idActual))) return opciones;
    const actual = catalogo.find((o) => String(o[campoId]) === String(idActual));
    return actual ? [actual, ...opciones] : opciones;
};

// Campos que se muestran pero no se pueden modificar: fondo gris, sin cursor al hacer clic
const CAMPO_BLOQUEADO = {
    sx: {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#F3F4F6',
            cursor: 'not-allowed',
            '& fieldset': { borderColor: '#E0E0E0' },
            '&:hover fieldset': { borderColor: '#E0E0E0' }
        },
        '& .MuiInputBase-input': { pointerEvents: 'none', caretColor: 'transparent', color: '#6B7280' },
        '& .MuiInputLabel-root': { color: '#6B7280' }
    },
    slotProps: { input: { readOnly: true }, htmlInput: { tabIndex: -1 } }
};

// --- 1. MODAL COMPLETAR ASESORÍA ---
export function ModalCompletarAsesoria({ open, onClose, onConfirm, showToast }) {
    const handleConfirm = async () => {
        try {
            if (onConfirm) await onConfirm();
            if (showToast) showToast('Asesoría completada con éxito', 'success');
            if (onClose) onClose();
        } catch (error) {
            if (showToast) showToast('Ocurrió un error al completar la asesoría', 'error');
        }
    };

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            disableAutoFocus
            disableEnforceFocus
            sx={{
                '& .MuiPaper-root': {
                    width: '450px',
                    borderRadius: '12px',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Completar asesoría</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas completar esta asesoría?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="success" onClick={handleConfirm}>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --- 2. MODAL ELIMINAR ASESORÍA ---
export function ModalEliminarAsesoria({ open, onClose, onConfirm, showToast }) {
    const handleConfirm = async () => {
        try {
            if (onConfirm) await onConfirm();
            if (showToast) showToast('Asesoría eliminada correctamente', 'error');
            if (onClose) onClose();
        } catch (error) {
            if (showToast) showToast('Ocurrió un error al eliminar la asesoría', 'error');
        }
    };

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            disableAutoFocus
            disableEnforceFocus
            sx={{
                '& .MuiPaper-root': {
                    width: '450px',
                    borderRadius: '12px',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminar asesoría</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas eliminar esta asesoría? Esta acción no se puede deshacer.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="error" onClick={handleConfirm}>
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --- 3. MODAL INFORMACIÓN ASESORÍA ---
// Solo lectura: estudiante, asesor, licenciatura, grado y grupo, materia.
// Editable: horario, modalidad, razón, fecha de inicio, sesiones tomadas y observaciones.
export function ModalInfoAsesoria({ open, onClose, data, onSave, showToast}) {
    const { catalogos } = useCatalogos();

    // Asesor logueado: de aquí salen sus horarios y modalidades
    // TODO: ajusta los nombres (horarios / modalidades) a como vengan en tu usuario
    const { usuario } = useAuth();

    const [formData, setFormData] = useState({
        estudiante: '',
        asesor: '',
        licenciatura: '',
        gradoGrupo: '',
        materia: '',
        materiaId: '',
        horario: '',
        horarioId: '',
        modalidad: '',
        modalidadId: '',
        inicio: '',
        razonAsesoria: '',
        razonId: '',
        sesionesTomadas: '1',
        observaciones: ''
    });

    const [initialFormData, setInitialFormData] = useState(null);
    const [calendarioOpen, setCalendarioOpen] = useState(false);

    // Cargar y normalizar los datos cada vez que se abre el modal.
    // Si data no trae los ids (como la tarjeta, que solo manda nombres), se buscan en el catálogo.
    useEffect(() => {
        if (!open || !data) return;

        setCalendarioOpen(false);

        const materias = catalogos?.materias || [];
        const horarios = catalogos?.horarios || [];
        const modalidades = catalogos?.modalidades || [];
        const razones = catalogos?.razon_asesoria || [];

        const nombreMateria = data.materia || '';
        const nombreHorario = data.horario || '';
        const nombreModalidad = data.modalidad || '';
        const nombreRazon = data.razon || data.razonAsesoria || '';

        const fecha = parsearFecha(data.fecha_inicio || data.inicio || data.fecha);

        const normalizedData = {
            estudiante: data.estudiante || data.alumno || '',

            asesor: data.asesor || '',

            licenciatura: data.licenciatura || 'Licenciatura en Informática',

            gradoGrupo: data.grupo || data.gradoGrupo || '3-1',

            materia: nombreMateria,
            // Se usa directo el id real del backend, sin necesitar buscar por nombre
            materiaId: String(data.id_materia ?? data.materiaId ?? buscarId(materias, 'materia', 'id_materia', nombreMateria)),

            horario: nombreHorario,
            horarioId: String(data.id_horario ?? data.horarioId ?? buscarId(horarios, 'horario', 'id_horario', nombreHorario)),

            modalidad: nombreModalidad,
            modalidadId: String(data.id_modalidad ?? data.modalidadId ?? buscarId(modalidades, 'modalidad', 'id_modalidad', nombreModalidad)),

            inicio: fecha ? fecha.format('YYYY-MM-DD') : '',

            razonAsesoria: nombreRazon,
            razonId: String(data.id_razon ?? data.razonId ?? buscarId(razones, 'razon', 'id_razon', nombreRazon)),

            sesionesTomadas: String(data.sesiones_tomadas ?? data.sesionesTomadas ?? '1'),

            observaciones: data.observaciones || ''
        };

        setFormData(normalizedData);
        setInitialFormData(normalizedData);
    }, [data, open, catalogos]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isModified = initialFormData ? Object.keys(formData).some(
        (key) => formData[key] !== initialFormData[key]
    ) : false;

    // Opciones: horario y modalidad solo las del asesor (más el valor actual de la asesoría); razón del catálogo
    const horariosCatalogo = catalogos?.horarios || [];
    const modalidadesCatalogo = catalogos?.modalidades || [];
    const razonesList = catalogos?.razon_asesoria || [];

    const horariosList = conOpcionActual(
        filtrarPorAsesor(horariosCatalogo, usuario?.horarios, 'id_horario', 'horario'),
        horariosCatalogo, 'id_horario', formData.horarioId
    );
    const modalidadesList = conOpcionActual(
        filtrarPorAsesor(modalidadesCatalogo, usuario?.modalidades, 'id_modalidad', 'modalidad'),
        modalidadesCatalogo, 'id_modalidad', formData.modalidadId
    );

    const parsedDate = formData.inicio && dayjs(formData.inicio).isValid()
        ? dayjs(formData.inicio)
        : null;

    // No se permite elegir una fecha anterior a hoy (la fecha original de la asesoría sí se conserva)
    const handleCambiarFecha = (nuevaFecha) => {
        if (nuevaFecha?.isValid() && nuevaFecha.isBefore(dayjs(), 'day') && nuevaFecha.format('YYYY-MM-DD') !== initialFormData?.inicio) {
            if (showToast) showToast('Elige una fecha de hoy en adelante', 'error');
            return;
        }
        setFormData((prev) => ({ ...prev, inicio: nuevaFecha?.isValid() ? nuevaFecha.format('YYYY-MM-DD') : '' }));
    };

    // Se quita el foco del campo antes de abrir el calendario
    const abrirCalendario = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setCalendarioOpen(true);
    };

    const handleApply = () => {
        if (!isModified) return;

        // Se sincronizan los nombres con los ids elegidos para que la tarjeta muestre el valor nuevo
        const actualizado = {
            ...data,
            ...formData,
            horario: buscarNombre(horariosCatalogo, 'id_horario', 'horario', formData.horarioId) ?? formData.horario,
            modalidad: buscarNombre(modalidadesCatalogo, 'id_modalidad', 'modalidad', formData.modalidadId) ?? formData.modalidad,
            razonAsesoria: buscarNombre(razonesList, 'id_razon', 'razon', formData.razonId) ?? formData.razonAsesoria
        };

        if (onSave) onSave(actualizado);
        if (showToast) showToast('Cambios aplicados correctamente', 'info');
        onClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
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
                    Información Asesoría
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
                        {/* --- Solo lectura --- */}
                        <TextField
                            label="Nombre del Estudiante"
                            name="estudiante"
                            size="small"
                            fullWidth
                            value={formData.estudiante}
                            {...CAMPO_BLOQUEADO}
                        />

                        <TextField
                            label="Nombre Asesor"
                            name="asesor"
                            size="small"
                            fullWidth
                            value={formData.asesor}
                            {...CAMPO_BLOQUEADO}
                        />

                        <TextField
                            label="Licenciatura del Estudiante"
                            name="licenciatura"
                            size="small"
                            fullWidth
                            value={formData.licenciatura}
                            {...CAMPO_BLOQUEADO}
                        />

                        <TextField
                            label="Grado y Grupo"
                            name="gradoGrupo"
                            size="small"
                            fullWidth
                            value={formData.gradoGrupo}
                            {...CAMPO_BLOQUEADO}
                        />

                        <TextField
                            label="Materia"
                            name="materia"
                            size="small"
                            fullWidth
                            value={formData.materia}
                            {...CAMPO_BLOQUEADO}
                        />

                        {/* --- Editable --- */}
                        <CampoSelect
                            label="Horario"
                            name="horarioId"
                            size="small"
                            fullWidth
                            value={formData.horarioId}
                            onChange={handleChange}
                        >
                            {horariosList.map((item) => (
                                <MenuItem key={item.id_horario} sx={{ whiteSpace: 'normal' }} value={String(item.id_horario)}>
                                    {item.horario}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        <CampoSelect
                            label="Modalidad"
                            name="modalidadId"
                            size="small"
                            fullWidth
                            value={formData.modalidadId}
                            onChange={handleChange}
                        >
                            {modalidadesList.map((item) => (
                                <MenuItem key={item.id_modalidad} sx={{ whiteSpace: 'normal' }} value={String(item.id_modalidad)}>
                                    {item.modalidad}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        <CampoSelect
                            label="Razón de Asesoría"
                            name="razonId"
                            size="small"
                            fullWidth
                            value={formData.razonId}
                            onChange={handleChange}
                        >
                            {razonesList.map((item) => (
                                <MenuItem key={item.id_razon} sx={{ whiteSpace: 'normal' }} value={String(item.id_razon)}>
                                    {item.razon}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        {/* Al hacer clic en el campo se abre el calendario y la fecha elegida se muestra en el campo */}
                        <DatePicker
                            label="Fecha de Inicio"
                            value={parsedDate}
                            onChange={handleCambiarFecha}
                            format="DD/MM/YYYY"
                            disablePast
                            open={calendarioOpen}
                            onOpen={abrirCalendario}
                            onClose={() => setCalendarioOpen(false)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    // La fecha original puede ser anterior a hoy: no se marca en rojo
                                    error: false,
                                    InputLabelProps: { shrink: true },
                                    onClick: abrirCalendario
                                }
                            }}
                        />

                        <CampoSelect
                            label="Sesiones Tomadas"
                            name="sesionesTomadas"
                            size="small"
                            fullWidth
                            value={formData.sesionesTomadas}
                            onChange={handleChange}
                        >
                            {[...Array(10)].map((_, i) => (
                                <MenuItem key={i + 1} value={String(i + 1)}>
                                    {i + 1}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        <TextField
                            label="Observaciones"
                            name="observaciones"
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.observaciones}
                            onChange={handleChange}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApply}
                        disabled={!isModified}
                        fullWidth
                    >
                        Aplicar Cambios
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}

// --- MODAL AUXILIAR: CONFIRMAR ELIMINACIÓN DE MATERIAL ---
function ModalConfirmarEliminarMaterial({ open, onClose, onConfirm, nombreArchivo }) {
    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '420px',
                    borderRadius: '12px',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminar archivo</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    ¿Estás seguro de que deseas eliminar el archivo <strong>{nombreArchivo}</strong>?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="error" onClick={onConfirm}>
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --- 4. MODAL MATERIAL ADICIONAL ---
export function ModalMaterialAdicional({ open, onClose, data, onSave, showToast }) {
    const [listaMateriales, setListaMateriales] = useState([]);
    const [initialMateriales, setInitialMateriales] = useState([]);
    const [archivoAEliminar, setArchivoAEliminar] = useState(null);
    const [modalConfirmEliminarOpen, setModalConfirmEliminarOpen] = useState(false);

    // Carga el material de la asesoría seleccionada cada vez que se abre el modal
    // y guarda una copia inicial para saber si hubo cambios
    useEffect(() => {
        if (!open) return;
        const materialInicial = data?.material_adicional ?? data?.raw?.material_adicional ?? [];
        setListaMateriales(materialInicial);
        setInitialMateriales(materialInicial);
    }, [data, open]);

    // Hay cambios si se agregó o eliminó algún archivo (se comparan por id_material).
    // Si agregas un archivo y luego lo eliminas, vuelve a contar como "sin cambios".
    const isModified =
        listaMateriales.length !== initialMateriales.length ||
        listaMateriales.some(
            (archivo) => !initialMateriales.some((inicial) => inicial.id_material === archivo.id_material)
        );

    const getFileIcon = (mimeType) => {
        if (mimeType?.includes('pdf')) return <PictureAsPdfIcon color="error" />;
        return <InsertDriveFileIcon color="primary" />;
    };

    const handleOpenConfirmEliminar = (archivo) => {
        setArchivoAEliminar(archivo);
        setModalConfirmEliminarOpen(true);
    };

    const handleConfirmarEliminacion = () => {
        if (archivoAEliminar) {
            setListaMateriales((prev) =>
                prev.filter((item) => item.id_material !== archivoAEliminar.id_material)
            );
        }
        setModalConfirmEliminarOpen(false);
        setArchivoAEliminar(null);
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const nuevosArchivos = files.map((file, index) => ({
            id_material: Date.now() + index,
            nombre_archivo: file.name,
            mime_type: file.type || 'application/octet-stream',
            url_archivo: URL.createObjectURL(file)
        }));

        setListaMateriales((prev) => [...prev, ...nuevosArchivos]);
        event.target.value = null;
    };

    const handleSave = () => {
        if (!isModified) return;
        if (onSave) onSave(listaMateriales);
        if (showToast) showToast('Material adicional guardado correctamente', 'success');
        onClose();
    };

    return (
        <>
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
                sx={{
                    '& .MuiPaper-root': {
                        width: '550px',
                        maxWidth: '550px',
                        height: '520px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Material: {data?.materia || 'Asesoría'}
                    {data?.alumno && (
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', fontWeight: 'normal' }}>
                            Alumno: {data.alumno}
                        </Typography>
                    )}
                </DialogTitle>

                <DialogContent dividers sx={{ overflowY: 'auto' }}>
                    <Box className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors" sx={{ mb: 2 }}>
                        <input
                            type="file"
                            id="file-material-input"
                            onChange={handleFileUpload}
                            className="hidden"
                            multiple
                        />
                        <label
                            htmlFor="file-material-input"
                            className="cursor-pointer flex flex-col items-center gap-2 w-full text-center"
                        >
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <Typography variant="body2" color="textSecondary">
                                Haz clic para seleccionar o cargar un documento
                            </Typography>
                        </label>
                    </Box>

                    {listaMateriales.length === 0 ? (
                        <Typography color="text.secondary" align="center" mt={2} mb={2}>
                            No hay archivos disponibles.
                        </Typography>
                    ) : (
                        <List disablePadding sx={{ mb: 2 }}>
                            {listaMateriales.map((archivo) => (
                                <ListItem
                                    key={archivo.id_material}
                                    sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        mb: 1,
                                        py: 0.5
                                    }}
                                    secondaryAction={
                                        <Stack direction="row" spacing={0.5}>
                                            <Tooltip title="Descargar / Abrir">
                                                <IconButton
                                                    component="a"
                                                    href={archivo.url_archivo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    color="primary"
                                                    size="small"
                                                >
                                                    <DownloadIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Eliminar archivo">
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleOpenConfirmEliminar(archivo)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    }
                                >
                                    <ListItemIcon>{getFileIcon(archivo.mime_type)}</ListItemIcon>
                                    <ListItemText
                                        primary={archivo.nombre_archivo}
                                        secondary={`Tipo: ${archivo.mime_type || 'Desconocido'}`}
                                        sx={{ pr: 6 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 1.5, gap: 1 }}>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={!isModified}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <ModalConfirmarEliminarMaterial
                open={modalConfirmEliminarOpen}
                onClose={() => setModalConfirmEliminarOpen(false)}
                onConfirm={handleConfirmarEliminacion}
                nombreArchivo={archivoAEliminar?.nombre_archivo || ''}
            />
        </>
    );
}

// --- 5. MODAL CREAR ASESORÍA ---


// Permite buscar al alumno por nombre, número de cuenta o correo
const filtrarEstudiantes = createFilterOptions({
    stringify: (estudiante) => `${estudiante.nombre} ${estudiante.numeroCuenta ?? ''} ${estudiante.correo ?? ''}`
});

const FORMULARIO_CREAR_INICIAL = {
    estudiante: null,
    materiaId: '',
    horarioId: '',
    modalidadId: '',
    razonId: '',
    inicio: null
};

export function ModalCrearAsesoria({ open, onClose, onSave, showToast, materiasAsesor, catalogos }) {
    // Si no se pasan catálogos por props, se toman del contexto (igual que ModalInfoAsesoria)
    const { catalogos: catalogosContexto } = useCatalogos();
    const catalogosActivos = catalogos ?? catalogosContexto;

    // Asesor logueado: de aquí salen sus materias, horarios y modalidades
    // TODO: ajusta los nombres (materias / horarios / modalidades) a como vengan en tu usuario
    const { usuario } = useAuth();

    const [formData, setFormData] = useState(FORMULARIO_CREAR_INICIAL);
    const [estudiantes, setEstudiantes] = useState([]);
    const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false);
    const [calendarioOpen, setCalendarioOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // Al abrir: se limpia el formulario y se cargan los estudiantes
    useEffect(() => {
        if (!open) return;

        setFormData(FORMULARIO_CREAR_INICIAL);
        setCalendarioOpen(false);

        let cancelado = false;
        setCargandoEstudiantes(true);

        getEstudiantes()
            .then((lista) => {
                if (!cancelado) setEstudiantes(lista);
            })
            .catch((error) => console.error('Error al cargar estudiantes:', error))
            .finally(() => {
                if (!cancelado) setCargandoEstudiantes(false);
            });

        return () => {
            cancelado = true;
        };
    }, [open]);

    // Solo las opciones del asesor (la prop materiasAsesor tiene prioridad si se manda)
    const materiasList = materiasAsesor ?? filtrarPorAsesor(catalogosActivos?.materias || [], usuario?.materias, 'id_materia', 'materia');
    const horariosList = filtrarPorAsesor(catalogosActivos?.horarios || [], usuario?.horarios, 'id_horario', 'horario');
    const modalidadesList = filtrarPorAsesor(catalogosActivos?.modalidades || [], usuario?.modalidades, 'id_modalidad', 'modalidad');
    const razonesList = catalogosActivos?.razon_asesoria || [];

    // Los demás campos quedan bloqueados hasta que se elija un alumno
    const alumnoElegido = Boolean(formData.estudiante);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Al elegir alumno se desbloquean los campos. Si se quita el alumno, se bloquean y se limpian de nuevo.
    const handleCambiarEstudiante = (_, nuevoEstudiante) => {
        if (!nuevoEstudiante) {
            setFormData(FORMULARIO_CREAR_INICIAL);
            setCalendarioOpen(false);
            return;
        }
        setFormData((prev) => ({ ...prev, estudiante: nuevoEstudiante }));
    };

    // No se permite una fecha anterior a hoy
    const handleCambiarFecha = (nuevaFecha) => {
        if (nuevaFecha?.isValid() && nuevaFecha.isBefore(dayjs(), 'day')) {
            if (showToast) showToast('Elige una fecha de hoy en adelante', 'error');
            return;
        }
        setFormData((prev) => ({ ...prev, inicio: nuevaFecha }));
    };

    // Se quita el foco del campo antes de abrir el calendario. Si el calendario se abre como su propio
    // diálogo, el modal de abajo queda con aria-hidden y no debe tener ningún elemento enfocado.
    const abrirCalendario = () => {
        if (!alumnoElegido) return;
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setCalendarioOpen(true);
    };

    // El botón de crear se habilita solo cuando todos los campos están llenos
    const formularioCompleto =
        alumnoElegido &&
        Boolean(formData.materiaId) &&
        Boolean(formData.horarioId) &&
        Boolean(formData.modalidadId) &&
        Boolean(formData.razonId) &&
        Boolean(formData.inicio?.isValid()) &&
        !formData.inicio.isBefore(dayjs(), 'day');

    const handleCrear = async () => {
        if (!formularioCompleto || guardando) return;

        setGuardando(true);
        try {
            const estudiante = formData.estudiante;

            // Misma forma de datos que lee el modal de información (ids + nombres)
            const nuevaAsesoria = {
                estudianteId: estudiante.id,
                estudiante: estudiante.nombre,
                alumno: estudiante.nombre,
                email: estudiante.correo,
                licenciatura: estudiante.licenciatura,
                gradoGrupo: estudiante.grupo,
                materiaId: formData.materiaId,
                materia: buscarNombre(materiasList, 'id_materia', 'materia', formData.materiaId),
                horarioId: formData.horarioId,
                horario: buscarNombre(horariosList, 'id_horario', 'horario', formData.horarioId),
                modalidadId: formData.modalidadId,
                modalidad: buscarNombre(modalidadesList, 'id_modalidad', 'modalidad', formData.modalidadId),
                razonId: formData.razonId,
                razonAsesoria: buscarNombre(razonesList, 'id_razon', 'razon', formData.razonId),
                inicio: formData.inicio.format('YYYY-MM-DD'),
                fecha: formData.inicio.format('DD/MM/YYYY')
            };

            if (onSave) await onSave(nuevaAsesoria);
            if (showToast) showToast('Asesoría creada correctamente', 'success');
            if (onClose) onClose();
        } catch (error) {
            if (showToast) showToast('Ocurrió un error al crear la asesoría', 'error');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
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
                    Crear Asesoría
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
                        {/* Buscador de alumno: al hacer clic se despliega la lista y al escribir se filtra */}
                        <Autocomplete
                            fullWidth
                            size="small"
                            openOnFocus
                            options={estudiantes}
                            value={formData.estudiante}
                            onChange={handleCambiarEstudiante}
                            getOptionLabel={(option) => option.nombre}
                            getOptionKey={(option) => option.id}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            filterOptions={filtrarEstudiantes}
                            loading={cargandoEstudiantes}
                            loadingText="Cargando alumnos..."
                            noOptionsText="No se encontraron alumnos"
                            renderInput={(params) => {
                                const inputProps = params.slotProps?.input ?? params.InputProps;
                                return (
                                    <TextField
                                        {...params}
                                        label="Alumno"
                                        placeholder="Escribe nombre del alumno"
                                        slotProps={{
                                            ...params.slotProps,
                                            input: {
                                                ...inputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <SearchIcon fontSize="small" />
                                                        </InputAdornment>
                                                        {inputProps?.startAdornment}
                                                    </>
                                                )
                                            }
                                        }}
                                    />
                                );
                            }}
                        />

                        {/* Leyenda: se muestra mientras no haya alumno elegido */}
                        {!alumnoElegido && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                <InfoOutlinedIcon fontSize="small" />
                                <Typography variant="body2">
                                    Selecciona un alumno para habilitar el resto de los campos.
                                </Typography>
                            </Box>
                        )}

                        <CampoSelect
                            label="Materia"
                            name="materiaId"
                            size="small"
                            fullWidth
                            disabled={!alumnoElegido}
                            value={formData.materiaId}
                            onChange={handleChange}
                        >
                            {materiasList.map((item) => (
                                <MenuItem key={item.id_materia} sx={{ whiteSpace: 'normal' }} value={String(item.id_materia)}>
                                    {item.materia}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        <CampoSelect
                            label="Horario"
                            name="horarioId"
                            size="small"
                            fullWidth
                            disabled={!alumnoElegido}
                            value={formData.horarioId}
                            onChange={handleChange}
                        >
                            {horariosList.map((item) => (
                                <MenuItem key={item.id_horario} sx={{ whiteSpace: 'normal' }} value={String(item.id_horario)}>
                                    {item.horario}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        <CampoSelect
                            label="Modalidad"
                            name="modalidadId"
                            size="small"
                            fullWidth
                            disabled={!alumnoElegido}
                            value={formData.modalidadId}
                            onChange={handleChange}
                        >
                            {modalidadesList.map((item) => (
                                <MenuItem key={item.id_modalidad} sx={{ whiteSpace: 'normal' }} value={String(item.id_modalidad)}>
                                    {item.modalidad}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        <CampoSelect
                            label="Razón de Asesoría"
                            name="razonId"
                            size="small"
                            fullWidth
                            disabled={!alumnoElegido}
                            value={formData.razonId}
                            onChange={handleChange}
                        >
                            {razonesList.map((item) => (
                                <MenuItem key={item.id_razon} sx={{ whiteSpace: 'normal' }} value={String(item.id_razon)}>
                                    {item.razon}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        {/* Al hacer clic en el campo se abre el calendario y la fecha elegida se muestra en el campo */}
                        <DatePicker
                            label="Fecha de Inicio"
                            value={formData.inicio}
                            onChange={handleCambiarFecha}
                            format="DD/MM/YYYY"
                            disablePast
                            disabled={!alumnoElegido}
                            open={calendarioOpen && alumnoElegido}
                            onOpen={abrirCalendario}
                            onClose={() => setCalendarioOpen(false)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    InputLabelProps: { shrink: true },
                                    onClick: abrirCalendario
                                }
                            }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5, justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCrear}
                        disabled={!formularioCompleto || guardando}
                    >
                        Crear asesoría
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}