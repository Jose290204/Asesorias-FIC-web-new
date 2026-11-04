import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
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
            <DialogTitle sx={{ fontWeight: 'bold' }}>Completar asesoría</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas completar esta asesoría?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="success" onClick={handleConfirm} disabled={enviando}>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
