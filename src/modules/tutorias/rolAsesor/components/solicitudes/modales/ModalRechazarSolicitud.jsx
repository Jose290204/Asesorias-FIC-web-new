import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

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
                    maxWidth: '90vw',
                    borderRadius: '16px',
                    p: 1.5
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #E04848 0%, #C42525 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <HighlightOffOutlinedIcon />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1.2 }}>
                        Rechazar solicitud
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px' }}>
                        Esta acción no se puede deshacer
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
                <Typography variant="body1">
                    ¿Estás seguro de que deseas rechazar esta solicitud de asesoría? El estudiante verá el motivo que escribas.
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
                <Button variant="outlined" color="inherit" onClick={handleClose} sx={{ borderRadius: '8px', textTransform: 'none' }}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirm}
                    disabled={!motivo.trim()} // Deshabilita el botón si no hay motivo escrito
                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
                >
                    Rechazar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
