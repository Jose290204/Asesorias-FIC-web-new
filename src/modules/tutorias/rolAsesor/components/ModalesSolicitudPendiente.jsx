import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

// --- 1. MODAL ACEPTAR SOLICITUD ---
export function ModalAceptarSolicitud({ open, onClose, onConfirm, showToast }) {
    const handleConfirm = async () => {
        try {
            if (onConfirm) await onConfirm();
            if (showToast) showToast('Solicitud aceptada con éxito', 'success');
            if (onClose) onClose();
        } catch (error) {
            if (showToast) showToast('Ocurrió un error al aceptar la solicitud', 'error');
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
            <DialogTitle sx={{ fontWeight: 'bold' }}>Confirmación</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas aceptar esta solicitud de asesoría?
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

// --- 2. MODAL RECHAZAR SOLICITUD ---
export function ModalRechazarSolicitud({ open, onClose, onConfirm, showToast }) {
    const [motivo, setMotivo] = useState('');

    const handleConfirm = async () => {
        try {
            if (onConfirm) await onConfirm(motivo); // Se envía el motivo capturado
            if (showToast) showToast('Asesoría rechazada correctamente', 'error');
            setMotivo(''); // Limpiar el input
            if (onClose) onClose();
        } catch (error) {
            if (showToast) showToast('Ocurrió un error al rechazar la solicitud', 'error');
        }
    };

    const handleClose = () => {
        setMotivo(''); // Limpiar estado al cancelar
        if (onClose) onClose();
    };

    return (
        <Dialog
            open={Boolean(open)}
            onClose={handleClose}
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
            <DialogTitle sx={{ fontWeight: 'bold' }}>Rechazar Solicitud</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
                <Typography variant="body1">
                    ¿Estás seguro de que deseas rechazar esta solicitud de asesoría? Esta acción no se puede deshacer.
                </Typography>
                
                <TextField
                    label="Motivo del rechazo"
                    placeholder="Ingresa la razón por la que rechazas la solicitud..."
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                    size="small"
                />
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={handleConfirm}
                    disabled={!motivo.trim()} // Deshabilita el botón si no hay motivo escrito
                >
                    Rechazar
                </Button>
            </DialogActions>
        </Dialog>
    );
}