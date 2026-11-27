import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Typography } from '@mui/material';

import ModalConfirmacion from '../../tutorias/rolAdministrador/components/compartidos/ModalConfirmacion';

// Confirmación para desactivar un administrador (activarlo no pide confirmación).
// El aviso de éxito o error lo muestra quien usa el modal (la vista), no este componente.
export default function ModalDesactivarAdministrador({ open, onClose, onConfirm, data }) {
  const handleConfirm = () => {
    document.activeElement?.blur();
    onConfirm?.(data);
    onClose();
  };

  return (
    <ModalConfirmacion
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      icono={<PowerSettingsNewIcon />}
      titulo="Desactivar administrador"
      subtitulo="Puedes volver a activarlo cuando quieras"
      tono="rojo"
      textoConfirmar="Sí, desactivar"
    >
      <Typography variant="body1" sx={{ mb: 1.5 }}>
        ¿Estás seguro de desactivar a {data?.nombreCompleto ? <strong>{data.nombreCompleto}</strong> : 'este administrador'}?
      </Typography>
      <Typography variant="body2" color="text.secondary">
        No podrá iniciar sesión mientras esté desactivado. Sus datos se conservan.
      </Typography>
    </ModalConfirmacion>
  );
}
