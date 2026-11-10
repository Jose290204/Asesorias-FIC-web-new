import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

/**
 * Confirmación para eliminar un asesor disciplinar.
 * El aviso de éxito lo muestra quien usa el modal (la tabla), no este componente.
 */
export default function ModalEliminarAsesorDisciplinar({ open, onClose, onConfirm, data }) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm(data);
        onClose();
    };

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '450px',
                    maxWidth: '90vw',
                    borderRadius: '12px',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminación</DialogTitle>

            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas eliminar a {data?.nombre ? <strong>{data.nombre}</strong> : 'este asesor'}? Esta acción no se puede deshacer.
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