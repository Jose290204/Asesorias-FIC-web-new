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

// --- 1. MODAL INFORMACIÓN ---
export function ModalInfoAsesoria({ open, onClose, data, onSave, showToast }) {
    const [formData, setFormData] = useState({
        estudiante: '',
        asesor: '',
        licenciatura: '',
        gradoGrupo: '3-1',
        materia1: '',
        horario: '',
        modalidad: '',
        inicio: '',
        razonAsesoria: '',
        sesionesTomadas: '1',
        observaciones: ''
    });

    // Guardamos una referencia de los datos iniciales ya normalizados para comparar cambios
    const [initialFormData, setInitialFormData] = useState(null);

    // Cargar y normalizar los datos al abrir el modal
    useEffect(() => {
        if (data) {
            const rawFecha = data.raw?.fecha_inicio || data.inicio;
            const fechaValida = rawFecha && dayjs(rawFecha).isValid()
                ? dayjs(rawFecha).format('YYYY-MM-DD')
                : '';

            const normalizedData = {
                estudiante: data.estudiante || data.raw?.estudiante_nombre || '',
                asesor: data.asesor || data.raw?.asesor_nombre || '',
                licenciatura: data.licenciatura || data.raw?.licenciatura_nombre || 'Licenciatura en Informática',
                gradoGrupo: data.gradoGrupo || data.raw?.grado_grupo || '3-1',
                materia1: data.materia1 || data.materia || data.raw?.materia_nombre || '',
                horario: data.horario || data.raw?.horario_texto || '',
                modalidad: data.modalidad || data.raw?.modalidad_nombre || '',
                inicio: fechaValida,
                razonAsesoria: data.razonAsesoria || data.raw?.razon_texto || '',
                sesionesTomadas: String(data.sesionesTomadas ?? data.raw?.sesiones_tomadas ?? '1'),
                observaciones: data.observaciones || data.raw?.observaciones || ''
            };

            setFormData(normalizedData);
            setInitialFormData(normalizedData); // Guardamos la foto inicial para comparar
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Verificamos si existe algún cambio comparando con los datos iniciales
    const isModified = initialFormData ? Object.keys(formData).some(
        (key) => formData[key] !== initialFormData[key]
    ) : false;

    const handleApply = () => {
        if (!isModified) return; // Doble validación por seguridad
        if (onSave) onSave({ ...data, ...formData });
        if (showToast) showToast('Cambios aplicados correctamente', 'info');
        onClose();
    };

    const parsedDate = formData.inicio && dayjs(formData.inicio).isValid()
        ? dayjs(formData.inicio)
        : null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog
                open={open}
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
                    {/* Contenedor principal organizado en una sola columna vertical */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
                        <TextField
                            label="Nombre del Estudiante"
                            name="estudiante"
                            size="small"
                            fullWidth
                            value={formData.estudiante}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <TextField
                            label="Nombre Asesor"
                            name="asesor"
                            size="small"
                            fullWidth
                            value={formData.asesor}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <TextField
                            label="Licenciatura del Estudiante"
                            name="licenciatura"
                            size="small"
                            fullWidth
                            value={formData.licenciatura}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <TextField
                            label="Grado y Grupo"
                            name="gradoGrupo"
                            size="small"
                            fullWidth
                            value={formData.gradoGrupo}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Materia"
                            name="materia1"
                            size="small"
                            fullWidth
                            value={formData.materia1}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <TextField
                            label="Horario"
                            name="horario"
                            size="small"
                            fullWidth
                            value={formData.horario}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <DatePicker
                            label="Fecha de Inicio"
                            value={parsedDate}
                            disabled
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true
                                }
                            }}
                        />

                        <TextField
                            label="Modalidad"
                            name="modalidad"
                            size="small"
                            fullWidth
                            value={formData.modalidad}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <TextField
                            label="Razón de Asesoría"
                            name="razonAsesoria"
                            size="small"
                            fullWidth
                            value={formData.razonAsesoria}
                            slotProps={{ input: { readOnly: true } }}
                        />

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

// --- 2. MODAL CONFIRMAR APROBACIÓN ---
export function ModalConfirmarAsesoria({ open, onClose, onConfirm, showToast }) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        if (showToast) showToast('Asesoría confirmada con éxito', 'success');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '450px',
                    borderRadius: '12px',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Confirmación</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas aprobar esta asesoría?
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

// --- 3. MODAL ELIMINAR ASESORÍA ---
export function ModalEliminarAsesoria({ open, onClose, onConfirm, showToast }) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        if (showToast) showToast('Asesoría eliminada correctamente', 'error');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '450px',
                    borderRadius: '12px',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminación</DialogTitle>
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
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --- MODAL AUXILIAR: CONFIRMAR ELIMINACIÓN DE MATERIAL ---
function ModalConfirmarEliminarMaterial({ open, onClose, onConfirm, nombreArchivo }) {
    return (
        <Dialog
            open={open}
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
    const [archivoAEliminar, setArchivoAEliminar] = useState(null);
    const [modalConfirmEliminarOpen, setModalConfirmEliminarOpen] = useState(false);

    useEffect(() => {
        if (data?.raw?.material_adicional) {
            setListaMateriales(data.raw.material_adicional);
        } else {
            setListaMateriales([]);
        }
    }, [data, open]);

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
        if (onSave) {
            onSave(listaMateriales);
        }
        if (showToast) {
            showToast('Material adicional guardado correctamente', 'success');
        }
        onClose();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                sx={{
                    '& .MuiPaper-root': {
                        width: '550px',
                        maxWidth: '550px',
                        height: '520px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justify: 'space-between',
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Material: {data?.materia || 'Asesoría'}
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
                    <Button variant="contained" color="primary" onClick={handleSave}>
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