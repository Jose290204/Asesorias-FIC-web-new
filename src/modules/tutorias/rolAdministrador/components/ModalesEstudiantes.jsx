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
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// --- 1. MODAL INFORMACIÓN DEL ESTUDIANTE ---
export function ModalInfoEstudiante({ open, onClose, data, onSave, showToast }) {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        numeroCuenta: '',
        grupo: '',
        estado: 'ACTIVO'
    });

    useEffect(() => {
        if (data) {
            setFormData({
                nombre: data.nombre || '',
                correo: data.correo || '',
                numeroCuenta: data.numeroCuenta || '',
                grupo: data.grupo || '',
                estado: data.estado || 'ACTIVO'
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleApply = async () => {
        try {
            if (onSave) await onSave({ ...data, ...formData });
            if (showToast) showToast('Información del estudiante actualizada', 'info');
            onClose();
        } catch (error) {
            if (showToast) showToast('Error al guardar los cambios', 'error');
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '600px',
                    maxWidth: '600px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 1.5
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>
                Información del Estudiante
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ pt: 1 }}>
                    <TextField
                        label="Nombre Completo"
                        name="nombre"
                        size="small"
                        fullWidth
                        value={formData.nombre}
                        onChange={handleChange}
                        sx={{ marginBottom: 2.5 }}
                    />
                    <TextField
                        label="Correo Electrónico"
                        name="correo"
                        type="email"
                        size="small"
                        fullWidth
                        value={formData.correo}
                        onChange={handleChange}
                        sx={{ marginBottom: 2.5 }}
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                            marginBottom: 2.5
                        }}
                    >
                        <TextField
                            label="Número de Cuenta"
                            name="numeroCuenta"
                            size="small"
                            value={formData.numeroCuenta}
                            onChange={handleChange}
                            sx={{ width: '49%' }}
                        />
                        <TextField
                            label="Grupo"
                            name="grupo"
                            size="small"
                            value={formData.grupo}
                            onChange={handleChange}
                            sx={{ width: '49%' }}
                        />
                    </Box>

                    <TextField
                        select
                        label="Estado"
                        name="estado"
                        size="small"
                        fullWidth
                        value={formData.estado}
                        onChange={handleChange}
                    >
                        <MenuItem value="ACTIVO">ACTIVO</MenuItem>
                        <MenuItem value="INACTIVO">INACTIVO</MenuItem>
                    </TextField>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1.5 }}>
                <Button variant="contained" color="primary" onClick={handleApply}>
                    Aplicar Cambios
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --- 2. MODAL ELIMINAR ESTUDIANTE ---
export function ModalEliminarEstudiante({ open, onClose, onConfirm, data, showToast }) {
    const handleConfirm = async () => {
        try {
            if (onConfirm) await onConfirm(data);
            if (showToast) showToast('Estudiante eliminado correctamente', 'error');
            onClose();
        } catch (error) {
            if (showToast) showToast('Error al eliminar estudiante', 'error');
        }
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
                    justifyContent: 'space-between',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminación</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas eliminar a {data?.nombre ? <strong>{data.nombre}</strong> : 'este estudiante'}? Esta acción no se puede deshacer.
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

