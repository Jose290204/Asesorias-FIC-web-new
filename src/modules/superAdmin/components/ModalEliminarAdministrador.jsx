import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

// Confirmación para eliminar un administrador (no se puede deshacer).
// El aviso de éxito o error lo muestra quien usa el modal (la vista), no este componente.
export default function ModalEliminarAdministrador({ open, onClose, onConfirm, data }) {
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
      <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminación</DialogTitle>

      <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
        <Typography variant="body1" align="center">
          ¿Estás seguro de que deseas eliminar a {data?.nombreCompleto ? <strong>{data.nombreCompleto}</strong> : 'este administrador'}? Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="error" onClick={handleConfirm}>Sí, eliminar</Button>
      </DialogActions>
    </Dialog>
  );
}
