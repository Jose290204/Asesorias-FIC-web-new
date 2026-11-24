import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Button from '@mui/material/Button';

import { formatearFechaVisible } from '../../../rolEstudiante/utils/fechaSolicitud';
import { ESTILO_BOTON_VERDE } from '../compartidos/estilosAdmin';
import TarjetaAdmin from '../compartidos/TarjetaAdmin';
import { COLOR_ESTATUS, ETIQUETA_ESTATUS } from './estatusSolicitud';

const ICONO = { fontSize: 20 };

// Versión móvil de una fila de la tabla de solicitudes: solo lo esencial.
// El resto (licenciatura, grupo, razón, observaciones...) está en el botón de información.
// Solo muestra; las acciones las maneja quien la usa (TablaSolicitudes).
export default function TarjetaSolicitudAdmin({ row, onInfo, onAprobar, onRechazar }) {
    const fecha = row.fecha_inicio;
    const pendiente = row.estatus === 'pendiente';
    const color = COLOR_ESTATUS[row.estatus]?.texto ?? '#5F6368';

    return (
        <TarjetaAdmin
            franja={color}
            titulo={row.materia}
            pastilla={{ label: ETIQUETA_ESTATUS[row.estatus] ?? row.estatus, color, fondo: COLOR_ESTATUS[row.estatus]?.fondo }}
            onInfo={(e) => onInfo(row, e)}
            lineas={[
                { icono: <PersonOutlinedIcon sx={ICONO} />, etiqueta: 'Estudiante', valor: row.estudiante },
                { icono: <BadgeOutlinedIcon sx={ICONO} />, etiqueta: 'Asesor', valor: row.asesor },
                { icono: <CalendarMonthOutlinedIcon sx={ICONO} />, etiqueta: 'Fecha', valor: fecha ? formatearFechaVisible(fecha) : '' },
                { icono: <AccessTimeOutlinedIcon sx={ICONO} />, etiqueta: 'Horario', valor: row.horario_con_dia || row.horario },
                { icono: <LaptopOutlinedIcon sx={ICONO} />, etiqueta: 'Modalidad', valor: row.modalidad }
            ]}
            // Botones solo en las pendientes: Rechazar con borde y Aprobar con relleno
            acciones={
                pendiente && (
                    <>
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{ minHeight: 40, borderRadius: '8px', textTransform: 'none' }}
                            startIcon={<HighlightOffOutlinedIcon />}
                            onClick={(e) => onRechazar(row, e)}
                        >
                            Rechazar
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ minHeight: 40, ...ESTILO_BOTON_VERDE }}
                            startIcon={<CheckCircleOutlinedIcon />}
                            onClick={(e) => onAprobar(row, e)}
                        >
                            Aprobar
                        </Button>
                    </>
                )
            }
        />
    );
}
