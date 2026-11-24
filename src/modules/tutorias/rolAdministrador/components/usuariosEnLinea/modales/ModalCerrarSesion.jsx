import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Typography } from '@mui/material';

import ModalConfirmacion from '../../compartidos/ModalConfirmacion';

/**
 * Confirmación para cerrar la sesión de un usuario.
 * El aviso de éxito o error lo muestra quien usa el modal (la tabla), no este componente.
 */
export default function ModalCerrarSesion({ open, onClose, onConfirm, data }) {
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
            icono={<LogoutOutlinedIcon />}
            titulo="Cerrar sesión"
            subtitulo="Tendrá que iniciar sesión de nuevo"
            tono="rojo"
            textoConfirmar="Cerrar sesión"
        >
            <Typography variant="body1">
                ¿Deseas cerrar la sesión de {data?.nombre ? <strong>{data.nombre}</strong> : 'este usuario'}
                {data?.dispositivo ? ` en ${data.dispositivo}` : ''}?
            </Typography>
        </ModalConfirmacion>
    );
}
