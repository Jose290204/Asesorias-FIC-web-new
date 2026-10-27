import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

/**
 * Confirmación para quitar el rol de Asesor Par a un estudiante.
 * El estudiante no se elimina: solo deja de ser asesor par.
 * El aviso de éxito lo muestra quien usa el modal (la tabla), no este componente.
 */
export default function ModalQuitarAsesorPar({ open, onClose, onConfirm, data }) {
    const handleConfirm = () => {
        document.activeElement?.blur();
        onConfirm?.(data);
        onClose();
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
            <DialogTitle sx={{ fontWeight: 'bold' }}>Quitar rol de Asesor Par</DialogTitle>

            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Deseas quitar el rol de Asesor Par a {data?.nombre ? <strong>{data.nombre}</strong> : 'este estudiante'}?
                    Seguirá registrado como estudiante.
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