import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { PAPER_CONFIRMACION } from '../../compartidos/estilosModales';

// Ya no se "elimina": se cancela y queda en el historial como "Cancelada" con su motivo (obligatorio).
// onConfirm(motivo) regresa true si salió bien.
export default function ModalCancelarAsesoria({ open, onClose, onConfirm }) {
    const [motivo, setMotivo] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleConfirm = async () => {
        setEnviando(true);
        try {
            const ok = await onConfirm?.(motivo.trim());
            if (ok) {
                setMotivo('');
                onClose?.();
            }
        } finally {
            setEnviando(false);
        }
    };

    const handleClose = () => {
        setMotivo('');
        onClose?.();
    };

    return (
        <Dialog open={Boolean(open)} onClose={handleClose} disableAutoFocus disableEnforceFocus sx={PAPER_CONFIRMACION}>
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
                        Cancelar asesoría
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px' }}>
                        Esta acción no se puede deshacer
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
                <Typography variant="body1">
                    ¿Estás seguro de que deseas cancelar esta asesoría? Quedará en el historial como cancelada y no se podrá reactivar.
                </Typography>

                <TextField
                    label="Motivo de la cancelación"
                    placeholder="Explica por qué se cancela la asesoría..."
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                    size="small"
                    slotProps={{ htmlInput: { maxLength: 500 } }}
                />
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={handleClose} sx={{ borderRadius: '8px', textTransform: 'none' }}>
                    Volver
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirm}
                    disabled={!motivo.trim() || enviando}
                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
                >
                    Cancelar asesoría
                </Button>
            </DialogActions>
        </Dialog>
    );
}
