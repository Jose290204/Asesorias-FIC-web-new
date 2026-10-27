import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from '@mui/material';

/**
 * Confirmación para rechazar una solicitud.
 *
 * Props:
 *  - open, onClose
 *  - onConfirm: () => void
 *  - data: fila de la solicitud ({ materia, estudiante }); solo se usa para identificarla en el texto
 */
export default function ModalRechazarSolicitud({ open, onClose, onConfirm, data }) {
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
            <DialogTitle sx={{ fontWeight: 'bold' }}>Rechazar solicitud</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas rechazar esta solicitud?
                </Typography>

                {(data?.materia || data?.estudiante) && (
                    <Typography variant="body2" align="center" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
                        {data?.materia}
                        {data?.materia && data?.estudiante && ' · '}
                        {data?.estudiante}
                    </Typography>
                )}

                <Typography variant="body2" align="center" color="text.secondary">
                    Esta acción no se puede deshacer.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="error" onClick={handleConfirm}>
                    Rechazar
                </Button>
            </DialogActions>
        </Dialog>
    );
}