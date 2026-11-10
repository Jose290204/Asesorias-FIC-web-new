import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';

/**
 * Confirmación para quitarle el rol de asesor a un asesor par.
 * Sigue siendo estudiante y conserva su disponibilidad; se rechazan las solicitudes pendientes que le habían pedido.
 *
 * Props:
 *  - onConfirm: regresa una promesa con true si salió bien (el modal se cierra) o false si falló
 *    (por ejemplo, tiene asesorías en curso como asesor; el aviso lo da quien lo usa)
 */
export default function ModalQuitarAsesorPar({ open, onClose, onConfirm, data }) {
    const [procesando, setProcesando] = useState(false);

    const handleConfirm = async () => {
        document.activeElement?.blur();
        setProcesando(true);
        const ok = await onConfirm?.(data);
        setProcesando(false);
        if (ok) onClose();
    };

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            disableRestoreFocus
            sx={{
                '& .MuiPaper-root': {
                    width: '450px',
                    maxWidth: '90vw',
                    borderRadius: '12px',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Quitar rol de asesor</DialogTitle>

            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas quitar el rol de asesor a {data?.nombre ? <strong>{data.nombre}</strong> : 'este estudiante'}?
                    {' '}Seguirá siendo estudiante, pero dejará de aparecer como asesor y se rechazarán las solicitudes
                    pendientes que le habían pedido.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="error" disabled={procesando} onClick={handleConfirm}>
                    Quitar rol
                </Button>
            </DialogActions>
        </Dialog>
    );
}
