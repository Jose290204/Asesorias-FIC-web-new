import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Typography } from '@mui/material';

import ModalConfirmacion from '../../compartidos/ModalConfirmacion';

export default function ModalEliminarAsesoria({ open, onClose, onConfirm, showToast }) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        if (showToast) showToast('Asesoría eliminada correctamente', 'error');
        onClose();
    };

    return (
        <ModalConfirmacion
            open={open}
            onClose={onClose}
            onConfirm={handleConfirm}
            icono={<DeleteOutlineOutlinedIcon />}
            titulo="Eliminar asesoría"
            subtitulo="Esta acción no se puede deshacer"
            tono="rojo"
            textoConfirmar="Eliminar"
        >
            <Typography variant="body1">¿Estás seguro de que deseas eliminar esta asesoría?</Typography>
        </ModalConfirmacion>
    );
}
