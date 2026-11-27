import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { Typography } from '@mui/material';

import ModalConfirmacion from '../../compartidos/ModalConfirmacion';

/**
 * Confirmación para rechazar una solicitud.
 *
 * Props:
 *  - open, onClose
 *  - onConfirm: () => void
 *  - data: fila de la solicitud ({ materia, estudiante }); solo se usa para identificarla en el texto
 */
export default function ModalRechazarSolicitud({ open, onClose, onConfirm, data }) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    return (
        <ModalConfirmacion
            open={open}
            onClose={onClose}
            onConfirm={handleConfirm}
            icono={<HighlightOffOutlinedIcon />}
            titulo="Rechazar solicitud"
            subtitulo="Esta acción no se puede deshacer"
            tono="rojo"
            textoConfirmar="Rechazar"
        >
            <Typography variant="body1">¿Estás seguro de que deseas rechazar esta solicitud?</Typography>

            {(data?.materia || data?.estudiante) && (
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 1.5 }}>
                    {data?.materia}
                    {data?.materia && data?.estudiante && ' · '}
                    {data?.estudiante}
                </Typography>
            )}
        </ModalConfirmacion>
    );
}
