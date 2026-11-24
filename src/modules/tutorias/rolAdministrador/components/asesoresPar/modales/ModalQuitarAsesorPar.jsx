import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import { Typography } from '@mui/material';
import { useState } from 'react';

import ModalConfirmacion from '../../compartidos/ModalConfirmacion';

/**
 * Confirmación para quitarle el rol de asesor a un asesor par.
 * Sigue siendo estudiante y conserva su disponibilidad; se rechazan las solicitudes pendientes que le habían pedido.
 *
 * Props:
 *  - onConfirm: regresa una promesa con true si salió bien (el modal se cierra) o false si falló
 *    (por ejemplo, tiene asesorías en curso como asesor; el aviso lo da quien lo usa)
 */
export default function ModalQuitarAsesorPar({ open, onClose, onConfirm, data }) {
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
            titulo="Quitar rol de asesor"
            subtitulo="Seguirá siendo estudiante"
            tono="rojo"
            textoConfirmar="Quitar rol"
            deshabilitado={procesando}
        >
            <Typography variant="body1">
                ¿Estás seguro de que deseas quitar el rol de asesor a {data?.nombre ? <strong>{data.nombre}</strong> : 'este estudiante'}?
                {' '}Dejará de aparecer como asesor y se rechazarán las solicitudes pendientes que le habían pedido.
            </Typography>
        </ModalConfirmacion>
    );
}
