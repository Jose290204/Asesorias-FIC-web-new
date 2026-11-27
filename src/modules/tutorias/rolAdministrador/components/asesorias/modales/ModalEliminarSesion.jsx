import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Typography } from '@mui/material';

import ModalConfirmacion from '../../compartidos/ModalConfirmacion';

/**
 * Confirmación antes de quitar una sesión de la lista.
 *
 * Props:
 *  - open, onClose
 *  - onConfirm: () => void
 *  - detalle: texto que identifica la sesión, por ejemplo "Sesión 2 · 3 de noviembre de 2026"
 */
export default function ModalEliminarSesion({ open, onClose, onConfirm, detalle }) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    return (
        <ModalConfirmacion
            open={open}
            onClose={onClose}
            onConfirm={handleConfirm}
            icono={<DeleteOutlineOutlinedIcon />}
            titulo="Eliminar sesión"
            subtitulo="Esta acción no se puede deshacer"
            tono="rojo"
            textoConfirmar="Eliminar"
        >
            <Typography variant="body1">¿Estás seguro de que deseas eliminar esta sesión?</Typography>

            {detalle && (
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 1.5 }}>
                    {detalle}
                </Typography>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                La sesión se quitará al guardar los cambios.
            </Typography>
        </ModalConfirmacion>
    );
}
