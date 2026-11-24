import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Typography } from '@mui/material';

import ModalConfirmacion from '../../compartidos/ModalConfirmacion';

/**
 * Confirmación para aprobar una solicitud.
 *
 * Props:
 *  - open, onClose
 *  - onConfirm: () => void
 *  - data: fila de la solicitud ({ materia, estudiante }); solo se usa para identificarla en el texto
 */
export default function ModalAprobarSolicitud({ open, onClose, onConfirm, data }) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    return (
        <ModalConfirmacion
            open={open}
            onClose={onClose}
            onConfirm={handleConfirm}
            icono={<CheckCircleOutlinedIcon />}
            titulo="Aprobar solicitud"
            tono="verde"
            textoConfirmar="Aprobar"
        >
            <Typography variant="body1">¿Estás seguro de que deseas aprobar esta solicitud?</Typography>

            {(data?.materia || data?.estudiante) && (
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 1.5 }}>
                    {data?.materia}
                    {data?.materia && data?.estudiante && ' · '}
                    {data?.estudiante}
                </Typography>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Al aprobarla, la solicitud pasa a ser una asesoría en curso.
            </Typography>
        </ModalConfirmacion>
    );
}
