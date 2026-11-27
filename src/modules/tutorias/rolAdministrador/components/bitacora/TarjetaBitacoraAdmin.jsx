import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

import { ACCIONES } from '../../../../superAdmin/services/bitacoraService';
import { ICONO } from '../compartidos/estilosAdmin';
import TarjetaAdmin from '../compartidos/TarjetaAdmin';

// Color de la franja según el tipo de acción (crear, editar, borrar...)
const COLOR_TONO = {
    verde: '#2E7D32',
    azul: '#08338F',
    naranja: '#B26A00',
    rojo: '#C62828',
    gris: '#5F6368'
};

// Versión móvil de una fila de la bitácora. Solo muestra.
// siglasFacultad es opcional: la bitácora del super admin la manda; la del administrador no (ya es de su facultad).
export default function TarjetaBitacoraAdmin({ registro, fecha, siglasFacultad }) {
    const { accion, entidad, detalle, usuario } = registro;
    const { etiqueta, tono } = ACCIONES[accion] ?? { etiqueta: accion, tono: 'gris' };

    return (
        <TarjetaAdmin
            franja={COLOR_TONO[tono] ?? COLOR_TONO.gris}
            titulo={etiqueta}
            lineas={[
                { icono: <DescriptionOutlinedIcon sx={ICONO} />, etiqueta: 'Afectado', valor: entidad },
                { icono: <InfoOutlinedIcon sx={ICONO} />, etiqueta: 'Detalle', valor: detalle },
                { icono: <PersonOutlinedIcon sx={ICONO} />, etiqueta: 'Realizado por', valor: usuario },
                { icono: <AccessTimeOutlinedIcon sx={ICONO} />, etiqueta: 'Fecha', valor: fecha },
                { icono: <SchoolOutlinedIcon sx={ICONO} />, etiqueta: 'Facultad', valor: siglasFacultad }
            ]}
        />
    );
}
