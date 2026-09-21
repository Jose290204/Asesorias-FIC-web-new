import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    Typography,
    TextField,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { catalogoService } from '../../rolAdministrador/services/catalogoService';

// --- HELPERS ---

// Se usa cuando el nombre que manda la tarjeta (ej. una materia) no existe en el catálogo:
// se agrega como opción temporal para que el select no se vea vacío.
const ACTUAL = '__actual__';

// Quita espacios y pasa a minúsculas para comparar textos ("7:00 - 8:00 AM" == "7:00-8:00 AM")
const normalizar = (texto) => String(texto ?? '').replace(/\s+/g, '').toLowerCase();

// Busca en un catálogo el id que corresponde a un nombre. Devuelve '' si no lo encuentra.
const buscarId = (lista, campoNombre, campoId, nombre) => {
    const objetivo = normalizar(nombre);
    if (!objetivo) return '';
    const encontrado = lista.find((item) => normalizar(item[campoNombre]) === objetivo);
    return encontrado ? String(encontrado[campoId]) : '';
};

// Igual que buscarId, pero si el nombre existe y no está en el catálogo devuelve ACTUAL.
const resolverId = (lista, campoNombre, campoId, nombre) => {
    const id = buscarId(lista, campoNombre, campoId, nombre);
    if (id) return id;
    return nombre ? ACTUAL : '';
};

// Agrega al inicio de la lista la opción "actual" cuando el valor original no estaba en el catálogo.
const conOpcionActual = (lista, campoId, campoNombre, nombreInicial, idInicial) =>
    idInicial === ACTUAL && nombreInicial
        ? [{ [campoId]: ACTUAL, [campoNombre]: nombreInicial }, ...lista]
        : lista;

// El id temporal nunca debe salir hacia el padre / API
const limpiarId = (id) => (id === ACTUAL ? '' : id);

// Busca en un catálogo el nombre que corresponde a un id.
const buscarNombre = (lista, campoId, campoNombre, id) => {
    if (id === undefined || id === null || id === '') return undefined;
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

// Tipo de archivo según la extensión (la tarjeta solo manda { id, nombre, url })
const tipoPorExtension = (nombre) => (/\.pdf$/i.test(nombre ?? '') ? 'application/pdf' : undefined);

// Unifica el material a { id_material, nombre_archivo, mime_type, url_archivo }.
// Acepta tanto esa forma como la de la tarjeta: { id, nombre, url }.
const normalizarMaterial = (lista) =>
    (lista ?? []).map((item, index) => ({
        id_material: item.id_material ?? item.id ?? `material-${index}`,
        nombre_archivo: item.nombre_archivo ?? item.nombre ?? 'Archivo',
        mime_type: item.mime_type ?? tipoPorExtension(item.nombre_archivo ?? item.nombre),
        url_archivo: item.url_archivo ?? item.url ?? '#'
    }));

// --- 1. MODAL INFORMACIÓN (HISTORIAL DEL ESTUDIANTE) ---
// data: asesoría con la forma { id, asesor, materia, modalidad, fecha, horario, estado, descripcion, ... }
export function ModalInfoHistorialEstudiante({ open, onClose, data, onSave, showToast }) {
    const [formData, setFormData] = useState({
        asesor: '',
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

    // Cargar y normalizar los datos cada vez que se abre el modal.
    // Si data no trae los ids (como la tarjeta, que solo manda nombres), se buscan en catalogoService.
    useEffect(() => {
        if (!open || !data) return;

        const materias = catalogoService.getMaterias();
        const horarios = catalogoService.getHorarios();
        const modalidades = catalogoService.getModalidades();
        const razones = catalogoService.getRazonesAsesoria();

        const nombreMateria = data.materia || data.raw?.materia_nombre || '';
        const nombreHorario = data.horario || data.raw?.horario_nombre || '';
        const nombreModalidad = data.modalidad || data.raw?.modalidad_nombre || '';
        const nombreRazon = data.razonAsesoria || data.raw?.razon_texto || '';

        const fecha = parsearFecha(data.raw?.fecha_inicio || data.inicio || data.fecha);

        // Los ids se toman con || (no ??) para que un id vacío también caiga a la búsqueda por nombre
        const normalizedData = {
            asesor:
                data.asesor ||
                data.raw?.asesor_nombre ||
                '',

            materia: nombreMateria,
            materiaId: String(
                data.materiaId ||
                data.raw?.id_materia ||
                resolverId(materias, 'materia', 'id_materia', nombreMateria)
            ),

            horario: nombreHorario,
            horarioId: String(
                data.horarioId ||
                data.raw?.id_horario ||
                resolverId(horarios, 'horario', 'id_horario', nombreHorario)
            ),

            modalidad: nombreModalidad,
            modalidadId: String(
                data.modalidadId ||
                data.raw?.id_modalidad ||
                resolverId(modalidades, 'modalidad', 'id_modalidad', nombreModalidad)
            ),

            inicio: fecha ? fecha.format('YYYY-MM-DD') : '',

            razonAsesoria: nombreRazon,
            razonId: String(
                data.razonId ||
                data.raw?.id_razon ||
                resolverId(razones, 'razon', 'id_razon', nombreRazon)
            ),

            sesionesTomadas: String(
                data.sesionesTomadas ??
                data.raw?.sesiones_tomadas ??
                '1'
            ),

            observaciones:
                data.observaciones ||
                data.raw?.observaciones ||
                ''
        };

        setFormData(normalizedData);
        setInitialFormData(normalizedData);
    }, [data, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isModified = initialFormData ? Object.keys(formData).some(
        (key) => formData[key] !== initialFormData[key]
    ) : false;

    // Catálogos desde catalogoService (con la opción "actual" si el valor de la tarjeta no está en el catálogo)
    const materiasCatalogo = catalogoService.getMaterias();
    const horariosCatalogo = catalogoService.getHorarios();
    const modalidadesCatalogo = catalogoService.getModalidades();
    const razonesCatalogo = catalogoService.getRazonesAsesoria();

    const materiasList = conOpcionActual(materiasCatalogo, 'id_materia', 'materia', initialFormData?.materia, initialFormData?.materiaId);
    const horariosList = conOpcionActual(horariosCatalogo, 'id_horario', 'horario', initialFormData?.horario, initialFormData?.horarioId);
    const modalidadesList = conOpcionActual(modalidadesCatalogo, 'id_modalidad', 'modalidad', initialFormData?.modalidad, initialFormData?.modalidadId);
    const razonesList = conOpcionActual(razonesCatalogo, 'id_razon', 'razon', initialFormData?.razonAsesoria, initialFormData?.razonId);

    const handleApply = () => {
        if (!isModified) return;

        // Se sincronizan los nombres con los ids elegidos para que la tarjeta muestre el valor nuevo
        const actualizado = {
            ...data,
            ...formData,
            materiaId: limpiarId(formData.materiaId),
            horarioId: limpiarId(formData.horarioId),
            modalidadId: limpiarId(formData.modalidadId),
            razonId: limpiarId(formData.razonId),
            materia: buscarNombre(materiasCatalogo, 'id_materia', 'materia', formData.materiaId) ?? formData.materia,
            horario: buscarNombre(horariosCatalogo, 'id_horario', 'horario', formData.horarioId) ?? formData.horario,
            modalidad: buscarNombre(modalidadesCatalogo, 'id_modalidad', 'modalidad', formData.modalidadId) ?? formData.modalidad,
            razonAsesoria: buscarNombre(razonesCatalogo, 'id_razon', 'razon', formData.razonId) ?? formData.razonAsesoria
        };

        if (onSave) onSave(actualizado);
        if (showToast) showToast('Cambios aplicados correctamente', 'info');
        onClose();
    };

    const parsedDate = formData.inicio && dayjs(formData.inicio).isValid()
        ? dayjs(formData.inicio)
        : null;

    // Datos de solo lectura que trae la tarjeta y que no se editan
    const estado = data?.estado ?? data?.raw?.estado_texto ?? '';
    const descripcion = data?.descripcion ?? data?.raw?.descripcion ?? '';

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
                sx={{
                    '& .MuiPaper-root': {
                        width: '550px',
                        maxWidth: '550px',
                        maxHeight: '90vh',
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
                        <TextField
                            label="Nombre Asesor"
                            name="asesor"
                            size="small"
                            fullWidth
                            value={formData.asesor}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <TextField
                            label="Estado"
                            size="small"
                            fullWidth
                            placeholder="—"
                            value={estado}
                            slotProps={{
                                input: { readOnly: true },
                                inputLabel: { shrink: true }
                            }}
                        />

                        <TextField
                            select
                            label="Materia"
                            name="materiaId"
                            size="small"
                            fullWidth
                            value={formData.materiaId}
                            onChange={handleChange}
                        >
                            {materiasList.map((item) => (
                                <MenuItem
                                    key={item.id_materia}
                                    value={String(item.id_materia)}
                                >
                                    {item.materia}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Horario"
                            name="horarioId"
                            size="small"
                            fullWidth
                            value={formData.horarioId}
                            onChange={handleChange}
                        >
                            {horariosList.map((item) => (
                                <MenuItem
                                    key={item.id_horario}
                                    value={String(item.id_horario)}
                                >
                                    {item.horario}
                                </MenuItem>
                            ))}
                        </TextField>

                        <DatePicker
                            label="Fecha"
                            value={parsedDate}
                            format="DD/MM/YYYY"
                            disabled
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true
                                }
                            }}
                        />

                        <TextField
                            select
                            label="Modalidad"
                            name="modalidadId"
                            size="small"
                            fullWidth
                            value={formData.modalidadId}
                            onChange={handleChange}
                        >
                            {modalidadesList.map((item) => (
                                <MenuItem
                                    key={item.id_modalidad}
                                    value={String(item.id_modalidad)}
                                >
                                    {item.modalidad}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Razón de Asesoría"
                            name="razonId"
                            size="small"
                            fullWidth
                            value={formData.razonId}
                            onChange={handleChange}
                        >
                            {razonesList.map((item) => (
                                <MenuItem
                                    key={item.id_razon}
                                    value={String(item.id_razon)}
                                >
                                    {item.razon}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
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
                        </TextField>

                        <TextField
                            label="Descripción"
                            size="small"
                            fullWidth
                            multiline
                            placeholder="—"
                            value={descripcion}
                            slotProps={{
                                input: { readOnly: true },
                                inputLabel: { shrink: true }
                            }}
                        />

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

// --- 2. MODAL MATERIAL ADICIONAL (HISTORIAL DEL ESTUDIANTE) ---
// data: asesoría con el material en data.material_adicional o data.material -> [{ id, nombre, url }]
// onSave recibe la lista completa: [{ id_material, nombre_archivo, mime_type, url_archivo }]
export function ModalMaterialHistorialEstudiante({ open, onClose, data, onSave, showToast }) {
    const [listaMateriales, setListaMateriales] = useState([]);
    const [initialMateriales, setInitialMateriales] = useState([]);
    const [archivoAEliminar, setArchivoAEliminar] = useState(null);
    const [modalConfirmEliminarOpen, setModalConfirmEliminarOpen] = useState(false);

    // Carga el material de la asesoría seleccionada cada vez que se abre el modal
    // y guarda una copia inicial para saber si hubo cambios
    useEffect(() => {
        if (!open) return;
        const materialInicial = normalizarMaterial(
            data?.material_adicional ?? data?.raw?.material_adicional ?? data?.material
        );
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
                    {data?.asesor && (
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', fontWeight: 'normal' }}>
                            Asesor: {data.asesor}
                        </Typography>
                    )}
                </DialogTitle>

                <DialogContent dividers sx={{ overflowY: 'auto' }}>
                    <Box className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors" sx={{ mb: 2 }}>
                        <input
                            type="file"
                            id="file-material-historial-estudiante-input"
                            onChange={handleFileUpload}
                            className="hidden"
                            multiple
                        />
                        <label
                            htmlFor="file-material-historial-estudiante-input"
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
                                        secondary={archivo.mime_type ? `Tipo: ${archivo.mime_type}` : undefined}
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
