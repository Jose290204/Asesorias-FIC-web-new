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
    Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// --- 1. MODAL INFORMACIÓN ---
export function ModalInfoAsesoria({ open, onClose, data, onSave, showToast }) {
    const [formData, setFormData] = useState({
        materia: '',
        estudiante: '',
        asesor: '',
        inicio: '',
        horario: '',
        observaciones: ''
    });

    // Cargar y normalizar la fecha desde el mock API al abrir el modal
    useEffect(() => {
        if (data) {
            // Priorizamos la fecha ISO original de data.raw.fecha_inicio
            const rawFecha = data.raw?.fecha_inicio || data.inicio;
            
            // Si la fecha es válida la formateamos como YYYY-MM-DD para el DatePicker, si no dejamos el string
            const fechaValida = rawFecha && dayjs(rawFecha).isValid()
                ? dayjs(rawFecha).format('YYYY-MM-DD')
                : '';

            setFormData({
                materia: data.materia || '',
                estudiante: data.estudiante || '',
                asesor: data.asesor || '',
                inicio: fechaValida, // Queda guardado en formato ISO corto (YYYY-MM-DD)
                horario: data.horario || '',
                observaciones: data.raw?.observaciones || ''
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleApply = () => {
        if (onSave) onSave({ ...data, ...formData });
        if (showToast) showToast('Cambios aplicados correctamente', 'info');
        onClose();
    };

    // Parseo seguro para el componente DatePicker de Material UI
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
                        width: '600px',
                        maxWidth: '600px',
                        height: '600px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justify: 'space-between',
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
                    <Box>
                        <TextField
                            label="Materia"
                            name="materia"
                            size="small"
                            fullWidth
                            value={formData.materia}
                            onChange={handleChange}
                            sx={{ marginBottom: 2.5 }}
                        />
                        <TextField
                            label="Estudiante"
                            name="estudiante"
                            size="small"
                            fullWidth
                            value={formData.estudiante}
                            onChange={handleChange}
                            sx={{ marginBottom: 2.5 }}
                        />
                        <TextField
                            label="Asesor"
                            name="asesor"
                            size="small"
                            fullWidth
                            value={formData.asesor}
                            onChange={handleChange}
                            sx={{ marginBottom: 2.5 }}
                        />

                        {/* Horario y DatePicker */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 2,
                                marginBottom: 2.5
                            }}
                        >
                            <TextField
                                label="Horario"
                                name="horario"
                                size="small"
                                value={formData.horario}
                                onChange={handleChange}
                                sx={{ width: '49%' }}
                            />

                            <DatePicker
                                label="Fecha Inicio"
                                value={parsedDate}
                                onChange={(newValue) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        inicio: newValue && newValue.isValid() ? newValue.format('YYYY-MM-DD') : ''
                                    }));
                                }}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        sx: { width: '49%' }
                                    }
                                }}
                            />
                        </Box>

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
                    <Button variant="contained" color="primary" onClick={handleApply}>
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
                    maxWidth: '450px',
                    height: '240px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Confirmación</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    maxWidth: '450px',
                    height: '250px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminación</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

// --- MODAL AUXILIAR: CONFIRMAR ELIMINACIÓN DE UN MATERIAL ADICIONAL ---
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

    // Actualizar los materiales al abrir el modal o recibir nuevos datos
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

    // Abre el modal de confirmación enviando la información del archivo a eliminar
    const handleOpenConfirmEliminar = (archivo) => {
        setArchivoAEliminar(archivo);
        setModalConfirmEliminarOpen(true);
    };

    // Confirmar eliminación del archivo tras dar click en Aceptar/Eliminar dentro del sub-modal
    const handleConfirmarEliminacion = () => {
        if (archivoAEliminar) {
            setListaMateriales((prev) =>
                prev.filter((item) => item.id_material !== archivoAEliminar.id_material)
            );
        }
        setModalConfirmEliminarOpen(false);
        setArchivoAEliminar(null);
    };

    // Handler para cargar y agregar archivos locales
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

    // Función para guardar cambios
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
                    {/* Zona personalizada de carga de archivos (Movida arriba) */}
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

                    {/* Lista de archivos abajo del uploader */}
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

            {/* Modal de Confirmación para eliminar el archivo individual */}
            <ModalConfirmarEliminarMaterial
                open={modalConfirmEliminarOpen}
                onClose={() => setModalConfirmEliminarOpen(false)}
                onConfirm={handleConfirmarEliminacion}
                nombreArchivo={archivoAEliminar?.nombre_archivo || ''}
            />
        </>
    );
}