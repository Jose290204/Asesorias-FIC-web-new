import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

// Línea con ícono, etiqueta en negritas y valor (Estudiante:, Razón:, Fecha...). Si no hay valor, no se muestra.
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

// Tarjeta de una solicitud pendiente para la vista móvil: lo necesario para decidir
// (estudiante, razón, fecha de inicio, horario y modalidad). Recibe la solicitud y qué hacer al aceptarla o rechazarla.
export default function TarjetaSolicitudPendiente({ solicitud, onAceptar, onRechazar }) {
    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: '400px',
                height: '100%',
                background: '#FFFFFF',
                border: '1px solid #E3E8F2',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0px 2px 10px rgba(8, 51, 143, 0.08)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0px 10px 24px rgba(8, 51, 143, 0.16)'
                }
            }}
        >
            {/* Franja dorada: la solicitud está pendiente */}
            <Box sx={{ height: '5px', backgroundColor: '#C49E0D' }} />

            {/* Encabezado: materia, estatus y número de solicitud */}
            <Box
                sx={{
                    padding: '16px 22px',
                    background: 'linear-gradient(180deg, #F4F7FD 0%, #FFFFFF 100%)',
                    borderBottom: '1px solid #EEF1F7'
                }}
            >
                <Typography
                    title={solicitud.materia}
                    sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0 }}
                >
                    {solicitud.materia}
                </Typography>

                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        mt: '10px',
                        px: '10px',
                        py: '3px',
                        borderRadius: '999px',
                        border: '1px solid #C49E0D',
                        backgroundColor: '#FFFFFF'
                    }}
                >
                    <FiberManualRecordIcon sx={{ fontSize: 12, color: '#8A6D00' }} />
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#8A6D00', lineHeight: 1.4 }}>
                        Pendiente
                    </Typography>
                </Box>
            </Box>

            {/* Datos: ocupan el espacio sobrante para que los botones queden siempre abajo */}
            <CardContent sx={{ flex: 1, padding: '18px 22px 12px 22px', '&:last-child': { paddingBottom: '12px' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <LineaDato icono={<PersonOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Estudiante">{solicitud.nombre_estudiante}</LineaDato>
                    <LineaDato icono={<HelpOutlineOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Razón">{solicitud.razon}</LineaDato>
                    <LineaDato icono={<CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Fecha de inicio">{solicitud.fecha_inicio_formateada}</LineaDato>
                    <LineaDato icono={<AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Horario">{solicitud.horario_con_dia}</LineaDato>
                    <LineaDato icono={<LaptopOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Modalidad">{solicitud.modalidad}</LineaDato>
                </Box>
            </CardContent>

            {/* Botones: dos columnas iguales; Rechazar solo con borde y Aceptar con relleno verde */}
            <CardActions
                sx={{
                    padding: '6px 22px 20px 22px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    // CardActions mete margen izquierdo a los botones; aquí lo anulamos por el grid
                    '& > :not(:first-of-type)': { marginLeft: 0 }
                }}
            >
                <Button
                    variant="outlined"
                    sx={{
                        minHeight: 40,
                        color: '#C42525',
                        borderColor: '#C42525',
                        borderRadius: '8px',
                        textTransform: 'none',
                        '&:hover': { borderColor: '#9B1C1C', backgroundColor: 'rgba(196, 37, 37, 0.08)' }
                    }}
                    startIcon={<CloseOutlinedIcon />}
                    onClick={(e) => onRechazar(solicitud, e)}
                >
                    Rechazar
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        minHeight: 40,
                        color: '#ffffff',
                        fontWeight: 700,
                        borderRadius: '8px',
                        textTransform: 'none',
                        letterSpacing: '0.3px',
                        background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 55%, #1B5E20 100%)',
                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.35)',
                        '&:hover': { background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' }
                    }}
                    startIcon={<CheckOutlinedIcon />}
                    onClick={(e) => onAceptar(solicitud, e)}
                >
                    Aceptar
                </Button>
            </CardActions>
        </Card>
    );
}
