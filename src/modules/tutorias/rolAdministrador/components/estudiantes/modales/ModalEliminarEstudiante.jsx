import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';

/**
 * Confirmación para dar de baja a un estudiante.
 * Pasa a inactivo: ya no puede entrar, pero su historial se conserva.
 *
 * Props:
 *  - onConfirm: regresa una promesa con true si la baja salió bien (el modal se cierra) o false si falló
 *    (por ejemplo, tiene asesorías en curso; el aviso lo da quien lo usa)
 */
export default function ModalEliminarEstudiante({ open, onClose, onConfirm, data }) {
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
            <DialogTitle sx={{ fontWeight: 'bold' }}>Dar de baja</DialogTitle>

            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas dar de baja a {data?.nombre ? <strong>{data.nombre}</strong> : 'este estudiante'}?
                    {' '}Ya no podrá iniciar sesión y se cerrarán sus solicitudes pendientes. Su historial se conserva.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="error" disabled={procesando} onClick={handleConfirm}>
                    Dar de baja
                </Button>
            </DialogActions>
        </Dialog>
    );
}
