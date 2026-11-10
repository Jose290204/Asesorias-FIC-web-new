import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function ModalRechazarSolicitud({ open, onClose, onConfirm }) {
    const [motivo, setMotivo] = useState('');

    // La vista ya muestra el toast; el motivo se limpia solo si el rechazo salió bien
    const handleConfirm = async () => {
        const ok = await onConfirm?.(motivo);
        if (ok) setMotivo('');
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
                    inputProps={{ maxLength: 500 }}
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
