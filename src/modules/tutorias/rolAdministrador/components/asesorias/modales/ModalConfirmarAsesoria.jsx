import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Typography } from '@mui/material';

import ModalConfirmacion from '../../compartidos/ModalConfirmacion';

export default function ModalConfirmarAsesoria({ open, onClose, onConfirm, showToast }) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        if (showToast) showToast('Asesoría confirmada con éxito', 'success');
        onClose();
    };

    return (
        <ModalConfirmacion
            open={open}
            onClose={onClose}
            onConfirm={handleConfirm}
            icono={<CheckCircleOutlinedIcon />}
            titulo="Aprobar asesoría"
            tono="verde"
            textoConfirmar="Aprobar"
        >
            <Typography variant="body1">¿Estás seguro de que deseas aprobar esta asesoría?</Typography>
        </ModalConfirmacion>
    );
}
