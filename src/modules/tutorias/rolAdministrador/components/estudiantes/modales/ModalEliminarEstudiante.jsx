import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import { Typography } from '@mui/material';
import { useState } from 'react';

import ModalConfirmacion from '../../compartidos/ModalConfirmacion';

/**
 * Confirmación para dar de baja a un estudiante.
 * Pasa a inactivo: ya no puede entrar, pero su historial se conserva.
 *
 * Props:
 *  - onConfirm: regresa una promesa con true si la baja salió bien (el modal se cierra) o false si falló
 *    (por ejemplo, tiene asesorías en curso; el aviso lo da quien lo usa)
 */
export default function ModalEliminarEstudiante({ open, onClose, onConfirm, data }) {
    const [procesando, setProcesando] = useState(false);

    const handleConfirm = async () => {
        document.activeElement?.blur();
        setProcesando(true);
        const ok = await onConfirm?.(data);
        setProcesando(false);
        if (ok) onClose();
    };

    return (
        <ModalConfirmacion
            open={open}
            onClose={onClose}
            onConfirm={handleConfirm}
            icono={<PersonRemoveOutlinedIcon />}
            titulo="Dar de baja"
            subtitulo="Su historial se conserva"
            tono="rojo"
            textoConfirmar="Dar de baja"
            deshabilitado={procesando}
        >
            <Typography variant="body1">
                ¿Estás seguro de que deseas dar de baja a {data?.nombre ? <strong>{data.nombre}</strong> : 'este estudiante'}?
                {' '}Ya no podrá iniciar sesión y se cerrarán sus solicitudes pendientes.
            </Typography>
        </ModalConfirmacion>
    );
}
