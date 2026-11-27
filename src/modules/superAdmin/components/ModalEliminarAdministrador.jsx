import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Typography } from '@mui/material';

import ModalConfirmacion from '../../tutorias/rolAdministrador/components/compartidos/ModalConfirmacion';

// Confirmación para eliminar un administrador (no se puede deshacer).
// El aviso de éxito o error lo muestra quien usa el modal (la vista), no este componente.
export default function ModalEliminarAdministrador({ open, onClose, onConfirm, data }) {
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
      icono={<DeleteOutlineOutlinedIcon />}
      titulo="Eliminar administrador"
      subtitulo="Esta acción no se puede deshacer"
      tono="rojo"
      textoConfirmar="Sí, eliminar"
    >
      <Typography variant="body1">
        ¿Estás seguro de que deseas eliminar a {data?.nombreCompleto ? <strong>{data.nombreCompleto}</strong> : 'este administrador'}?
      </Typography>
    </ModalConfirmacion>
  );
}
