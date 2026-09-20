// --- 2. MODAL CONFIRMAR APROBACIÓN ---
export function ModalConfirmarSolicitud({ open, onClose, onConfirm, showToast }) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        if (showToast) showToast('Solicitud aceptada con éxito', 'success');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '450px',
                    borderRadius: '12px',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Confirmación</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas aceptar esta solicitud de asesoria?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="success" onClick={handleConfirm}>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}