import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from '@mui/material';

/**
 * Confirmación antes de quitar una sesión de la lista.
 *
 * Props:
 *  - open, onClose
 *  - onConfirm: () => void
 *  - detalle: texto que identifica la sesión, por ejemplo "Sesión 2 · 3 de noviembre de 2026"
 */
export default function ModalEliminarSesion({ open, onClose, onConfirm, detalle }) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm();
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
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas eliminar esta sesión?
                </Typography>

                {detalle && (
                    <Typography variant="body2" align="center" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
                        {detalle}
                    </Typography>
                )}

                <Typography variant="body2" align="center" color="text.secondary">
                    La sesión se quitará al guardar los cambios.
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