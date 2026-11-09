import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

// Confirmación para desactivar una facultad (activarla no pide confirmación).
// Explica la consecuencia: sus usuarios dejan de poder entrar, pero no se borra nada.
// El aviso de éxito o error lo muestra quien usa el modal (la vista), no este componente.
export default function ModalDesactivarFacultad({ open, onClose, onConfirm, data }) {
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
      sx={{ '& .MuiPaper-root': { width: '450px', maxWidth: '90vw', borderRadius: '12px', p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Desactivar facultad</DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 3 }}>
        <Typography variant="body1" align="center">
          ¿Estás seguro de desactivar {data?.nombre ? <strong>{data.nombre}</strong> : 'esta facultad'}?
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          Sus administradores, asesores y estudiantes no podrán iniciar sesión mientras esté
          desactivada. Los datos se conservan y puedes volver a activarla cuando quieras.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="error" onClick={handleConfirm}>Sí, desactivar</Button>
      </DialogActions>
    </Dialog>
  );
}
