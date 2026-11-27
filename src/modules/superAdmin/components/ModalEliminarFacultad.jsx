import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Typography } from '@mui/material';

import ModalConfirmacion from '../../tutorias/rolAdministrador/components/compartidos/ModalConfirmacion';

// Confirmación para eliminar una facultad. Solo se puede si está vacía (sin usuarios ni asesorías);
// si no lo está, el backend lo rechaza y la vista muestra el motivo.
export default function ModalEliminarFacultad({ open, onClose, onConfirm, data }) {
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
      titulo="Eliminar facultad"
      subtitulo="Solo se puede si no tiene usuarios ni asesorías"
      tono="rojo"
      textoConfirmar="Sí, eliminar"
    >
      <Typography variant="body1">
        ¿Estás seguro de que deseas eliminar {data?.nombre ? <strong>{data.nombre}</strong> : 'esta facultad'}?
        Dejará de aparecer en la lista.
      </Typography>
    </ModalConfirmacion>
  );
}
