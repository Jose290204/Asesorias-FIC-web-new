import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';


// Notas que el asesor escribió al rechazar la solicitud
export default function ModalNotaAsesor({ open, onClose, nota }) {
    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '420px',
                    maxWidth: '90vw',
                    borderRadius: '20px',
                    p: 2,
                    backgroundColor: '#FFFFFF',
                    textAlign: 'center',
                    boxShadow: '0px 8px 24px rgba(0,0,0,0.15)'
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#1C398B' }}>
                Notas del asesor
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
                <Typography variant="body1" sx={{ color: '#333333' }}>
                    {nota || 'Esa fecha ya no esta disponible'}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        backgroundColor: '#1C398B',
                        '&:hover': { backgroundColor: '#132863' },
                        textTransform: 'none',
                        borderRadius: '8px',
                        px: 4
                    }}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
