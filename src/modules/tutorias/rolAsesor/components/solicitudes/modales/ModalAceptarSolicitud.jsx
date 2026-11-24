import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

export default function ModalAceptarSolicitud({ open, onClose, onConfirm }) {
    // La vista ya muestra el toast (éxito o error) y la tarjeta cierra el modal solo si salió bien
    const handleConfirm = async () => {
        if (onConfirm) await onConfirm();
    };

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            disableAutoFocus
            disableEnforceFocus
            sx={{
                '& .MuiPaper-root': {
                    width: '450px',
                    maxWidth: '90vw',
                    borderRadius: '16px',
                    p: 1.5
                }
            }}
        >
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
                    <CheckCircleOutlinedIcon />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1.2 }}>
                        Aceptar solicitud
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px' }}>
                        Confirmación
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ py: 3 }}>
                <Typography variant="body1">
                    ¿Estás seguro de que deseas aceptar esta solicitud de asesoría?
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose} sx={{ borderRadius: '8px', textTransform: 'none' }}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 55%, #1B5E20 100%)',
                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.35)',
                        '&:hover': { background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' }
                    }}
                >
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
