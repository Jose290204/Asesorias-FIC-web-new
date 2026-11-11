import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { formatearFechaVisible } from '../../../rolEstudiante/utils/fechaSolicitud';
import { COLOR_ESTATUS, ETIQUETA_ESTATUS } from './estatusSolicitud';

// Línea con ícono, etiqueta en negritas y valor (Estudiante:, Asesor:, Fecha:...). Si no hay valor, no se muestra.
function LineaDato({ icono, etiqueta, children }) {
    if (!children) return null;

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Box sx={{ display: 'flex', color: '#08338F', mt: '1px', flexShrink: 0 }}>{icono}</Box>
            <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere', minWidth: 0 }}>
                <span className="font-bold">{etiqueta}: </span>
                {children}
            </Typography>
        </Box>
    );
}

// Versión móvil de una fila de la tabla de solicitudes.
// Mismo diseño que la tarjeta de asesorías: ícono de información arriba a la derecha + botones Rechazar y Aprobar.
// Solo muestra; las acciones las maneja quien la usa (TablaSolicitudes).
export default function TarjetaSolicitudAdmin({ row, onInfo, onAprobar, onRechazar }) {
    const fecha = row.fecha_inicio;
    const pendiente = row.estatus === 'pendiente';
    const colorEstatus = COLOR_ESTATUS[row.estatus];

    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: '400px',
                background: '#FFFFFF',
                borderLeft: '20px solid #08338F',
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.20)'
            }}
        >
            <CardContent sx={{ padding: '24px 24px 15px' }}>
                <Box sx={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <Typography sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0 }}>
                        {row.materia}
                    </Typography>

                    {/* Información de la solicitud */}
                    <IconButton
                        aria-label="Ver información de la solicitud"
                        onClick={(e) => onInfo(row, e)}
                        sx={{ flexShrink: 0, mr: '-12px', mt: '-10px', color: '#08338F' }}
                    >
                        <InfoOutlinedIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <LineaDato icono={<PersonOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Estudiante">{row.estudiante}</LineaDato>
                    <LineaDato icono={<BadgeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Asesor">{row.asesor}</LineaDato>
                    <LineaDato icono={<CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Fecha">
                        {fecha ? formatearFechaVisible(fecha) : ''}
                    </LineaDato>
                    <LineaDato icono={<AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Horario">
                        {row.horario_con_dia || row.horario}
                    </LineaDato>
                    <LineaDato icono={<LaptopOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Modalidad">{row.modalidad}</LineaDato>
                    <LineaDato
                        icono={<FiberManualRecordIcon sx={{ fontSize: 20, color: colorEstatus?.texto ?? '#5F6368' }} />}
                        etiqueta="Estatus"
                    >
                        <span className="font-semibold" style={{ color: colorEstatus?.texto ?? '#5F6368' }}>
                            {ETIQUETA_ESTATUS[row.estatus] ?? row.estatus}
                        </span>
                    </LineaDato>
                    <LineaDato icono={<TagOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Solicitud">
                        {`#${row.id_solicitud ?? row.id}`}
                    </LineaDato>
                </Box>
            </CardContent>

            {/* Botones: dos columnas iguales; Rechazar con borde y Aprobar con relleno. Solo en pendientes */}
            {pendiente && (
            <CardActions
                sx={{
                    padding: '0px 24px 20px 24px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    // CardActions mete margen izquierdo a los botones; aquí se anula por el grid
                    '& > :not(:first-of-type)': { marginLeft: 0 }
                }}
            >
                <Button
                    variant="outlined"
                    color="error"
                    sx={{ minHeight: 40, borderRadius: '5px', textTransform: 'none' }}
                    startIcon={<HighlightOffOutlinedIcon />}
                    onClick={(e) => onRechazar(row, e)}
                >
                    Rechazar
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    sx={{ minHeight: 40, color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                    startIcon={<CheckCircleOutlinedIcon />}
                    onClick={(e) => onAprobar(row, e)}
                >
                    Aprobar
                </Button>
            </CardActions>
            )}
        </Card>
    );
}