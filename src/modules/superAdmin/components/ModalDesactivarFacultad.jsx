import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Typography } from '@mui/material';

import ModalConfirmacion from '../../tutorias/rolAdministrador/components/compartidos/ModalConfirmacion';

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
    <ModalConfirmacion
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      icono={<PowerSettingsNewIcon />}
      titulo="Desactivar facultad"
      subtitulo="Puedes volver a activarla cuando quieras"
      tono="rojo"
      textoConfirmar="Sí, desactivar"
    >
      <Typography variant="body1" sx={{ mb: 1.5 }}>
        ¿Estás seguro de desactivar {data?.nombre ? <strong>{data.nombre}</strong> : 'esta facultad'}?
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Sus administradores, asesores y estudiantes no podrán iniciar sesión mientras esté desactivada. Los datos se conservan.
      </Typography>
    </ModalConfirmacion>
  );
}
