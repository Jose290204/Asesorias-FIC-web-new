import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';

import { PAPER_CONFIRMACION } from '../../compartidos/estilosModales';

// onConfirm() regresa true si salió bien. La vista muestra el toast (éxito o error).
export default function ModalCompletarAsesoria({ open, onClose, onConfirm }) {
    const [enviando, setEnviando] = useState(false);

    const handleConfirm = async () => {
        setEnviando(true);
        try {
            const ok = await onConfirm?.();
            if (ok) onClose?.();
        } finally {
            setEnviando(false);
        }
    };

    return (
        <Dialog open={Boolean(open)} onClose={onClose} disableAutoFocus disableEnforceFocus sx={PAPER_CONFIRMACION}>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <TaskAltOutlinedIcon />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1.2 }}>
                        Completar asesoría
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px' }}>
                        Confirmación
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ py: 3 }}>
                <Typography variant="body1">
                    ¿Estás seguro de que deseas completar esta asesoría? Pasará al historial como completada.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose} sx={{ borderRadius: '8px', textTransform: 'none' }}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={enviando}
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 55%, #1B5E20 100%)',
                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.35)',
                        '&:hover': { background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' },
                        '&.Mui-disabled': { background: '#E0E0E0', boxShadow: 'none', color: '#9E9E9E' }
                    }}
                >
                    Completar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
