import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';

// Antes se "eliminaba": ahora la solicitud se cancela y queda en la lista como "Cancelada".
// onConfirm() regresa true si salió bien. La vista muestra el toast (éxito o error).
export default function ModalCancelarSolicitud({ open, onClose, onConfirm }) {
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
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            sx={{ '& .MuiPaper-root': { width: '420px', maxWidth: '90vw', borderRadius: '12px', p: 1 } }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Cancelar solicitud</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    ¿Estás seguro de que deseas cancelar esta solicitud? Quedará en tu lista como cancelada.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Volver
                </Button>
                <Button variant="contained" color="error" onClick={handleConfirm} disabled={enviando}>
                    Cancelar solicitud
                </Button>
            </DialogActions>
        </Dialog>
    );
}
