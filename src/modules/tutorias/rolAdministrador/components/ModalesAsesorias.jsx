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
    ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
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

// --- 3. MODAL ELIMINAR ---
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

// --- 4. MODAL MATERIAL ADICIONAL ---
export function ModalMaterialAdicional({ open, onClose, data }) {
    const materiales = data?.raw?.material_adicional || [];

    const getFileIcon = (mimeType) => {
        if (mimeType?.includes('pdf')) return <PictureAsPdfIcon color="error" />;
        return <InsertDriveFileIcon color="primary" />;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '550px',
                    maxWidth: '550px',
                    height: '380px',
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
                {materiales.length === 0 ? (
                    <Typography color="text.secondary" align="center" mt={3}>
                        No hay archivos disponibles.
                    </Typography>
                ) : (
                    <List disablePadding>
                        {materiales.map((archivo) => (
                            <ListItem
                                key={archivo.id_material}
                                sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    mb: 1,
                                    py: 0.5
                                }}
                                secondaryAction={
                                    <IconButton
                                        component="a"
                                        href={archivo.url_archivo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        color="primary"
                                        title="Descargar / Abrir en Drive"
                                    >
                                        <DownloadIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemIcon>{getFileIcon(archivo.mime_type)}</ListItemIcon>
                                <ListItemText
                                    primary={archivo.nombre_archivo}
                                    secondary={`Tipo: ${archivo.mime_type || 'Desconocido'}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 1.5 }}>
                <Button variant="outlined" color="primary" onClick={onClose}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}