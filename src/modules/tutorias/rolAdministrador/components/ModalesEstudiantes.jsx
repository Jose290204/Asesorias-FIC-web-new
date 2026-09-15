import { useState, useMemo, useEffect } from 'react';
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
    const getInitialValues = (sourceData) => ({
        nombre: sourceData?.nombre || sourceData?.raw?.nombre || '',
        correo: sourceData?.correo || sourceData?.raw?.correo || '',
        numeroCuenta: sourceData?.numeroCuenta || sourceData?.raw?.numeroCuenta || '',
        grupo: sourceData?.grupo || sourceData?.raw?.grupo || '',
        promedio: sourceData?.promedio || sourceData?.raw?.promedio || '',
        contrasena: sourceData?.contrasena || sourceData?.raw?.contrasena || '',
        licenciatura: sourceData?.licenciatura || sourceData?.raw?.licenciatura || 'Licenciatura en informática',
        telefono: sourceData?.telefono || sourceData?.raw?.telefono || '',
        estado: sourceData?.estado || sourceData?.raw?.estado || 'ACTIVO'
    });

    const [formData, setFormData] = useState(getInitialValues(data));
    const [initialData, setInitialData] = useState(getInitialValues(data));

    useEffect(() => {
        if (data) {
            const initialValues = getInitialValues(data);
            setFormData(initialValues);
            setInitialData(initialValues);
        }
    }, [data]);

    // Compara si el formulario actual es diferente al original
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

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
                {/* Contenedor principal en una sola columna vertical */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
                    <TextField
                        label="Nombre Completo"
                        name="nombre"
                        size="small"
                        fullWidth
                        value={formData.nombre}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Número de Cuenta"
                        name="numeroCuenta"
                        size="small"
                        fullWidth
                        value={formData.numeroCuenta}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Grupo"
                        name="grupo"
                        size="small"
                        fullWidth
                        value={formData.grupo}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Promedio"
                        name="promedio"
                        size="small"
                        fullWidth
                        value={formData.promedio}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Correo Institucional"
                        name="correo"
                        type="email"
                        size="small"
                        fullWidth
                        value={formData.correo}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Contraseña"
                        name="contrasena"
                        type="password"
                        size="small"
                        fullWidth
                        value={formData.contrasena}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Licenciatura"
                        name="licenciatura"
                        size="small"
                        fullWidth
                        value={formData.licenciatura}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Teléfono"
                        name="telefono"
                        size="small"
                        fullWidth
                        value={formData.telefono}
                        onChange={handleChange}
                    />

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
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleApply} 
                    disabled={!hasChanges} // <--- Deshabilitado si no hay cambios
                    fullWidth
                >
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