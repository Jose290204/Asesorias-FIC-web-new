import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// Cómo se ve cada estatus en el chip
const ESTILO_ESTATUS = {
    pendiente: { etiqueta: 'Pendiente', color: '#8A6D00', borde: '#C49E0D' },
    aceptada: { etiqueta: 'Aceptada', color: '#2E7D32', borde: '#2E7D32' },
    rechazada: { etiqueta: 'Rechazada', color: '#C62828', borde: '#C62828' },
    cancelada: { etiqueta: 'Cancelada', color: '#555555', borde: '#9E9E9E' }
};

// Línea con ícono, etiqueta en negritas y valor (Asesor:, Correo:, Fecha...). Si no hay valor, no se muestra.
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

// Tarjeta de una solicitud del estudiante. Según su estatus ofrece sus acciones:
// pendiente -> cancelar o editar; rechazada -> ver las notas del asesor.
export default function TarjetaSolicitud({ solicitud, onInfo, onEditar, onCancelar, onNota }) {
    const estilo = ESTILO_ESTATUS[solicitud.estatus] ?? { etiqueta: solicitud.estatus, color: '#555555', borde: '#BDBDBD' };
    const pendiente = solicitud.estatus === 'pendiente';
    const rechazada = solicitud.estatus === 'rechazada';

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
            {/* Franja del color del estatus */}
            <Box sx={{ height: '5px', backgroundColor: estilo.borde }} />

            {/* Encabezado: materia, botón de información y estatus */}
            <Box
                sx={{
                    padding: '16px 22px',
                    background: 'linear-gradient(180deg, #F4F7FD 0%, #FFFFFF 100%)',
                    borderBottom: '1px solid #EEF1F7'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <Typography
                        title={solicitud.materia}
                        sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0 }}
                    >
                        {solicitud.materia}
                    </Typography>

                    <Tooltip title="Información">
                        <IconButton
                            size="small"
                            aria-label="Información"
                            sx={{ color: '#08338F', flexShrink: 0, mr: '-8px', mt: '-4px' }}
                            onClick={() => onInfo(solicitud)}
                        >
                            <InfoOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Estatus: lo primero que el estudiante quiere saber */}
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        mt: '10px',
                        px: '10px',
                        py: '3px',
                        borderRadius: '999px',
                        border: `1px solid ${estilo.borde}`,
                        backgroundColor: '#FFFFFF'
                    }}
                >
                    <FiberManualRecordIcon sx={{ fontSize: 12, color: estilo.color }} />
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: estilo.color, lineHeight: 1.4 }}>
                        {estilo.etiqueta}
                    </Typography>
                </Box>
            </Box>

            {/* Datos: ocupan el espacio sobrante para que los botones queden siempre abajo */}
            <CardContent sx={{ flex: 1, padding: '18px 22px 12px 22px', '&:last-child': { paddingBottom: '12px' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <LineaDato icono={<BadgeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Asesor">{solicitud.asesor}</LineaDato>
                    <LineaDato icono={<CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Fecha">{solicitud.fecha_formateada}</LineaDato>
                    <LineaDato icono={<AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Horario">{solicitud.horario_con_dia || 'N/A'}</LineaDato>
                    <LineaDato icono={<LaptopOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Modalidad">{solicitud.modalidad}</LineaDato>
                </Box>
            </CardContent>

            {/* Acciones según el estatus (las aceptadas y canceladas ya no tienen) */}
            {(pendiente || rechazada) && (
                <CardActions
                    sx={{
                        padding: '6px 22px 20px 22px',
                        display: 'grid',
                        gridTemplateColumns: pendiente ? '1fr 1fr' : '1fr',
                        gap: '10px',
                        // CardActions mete margen izquierdo a los botones; aquí lo anulamos por el grid
                        '& > :not(:first-of-type)': { marginLeft: 0 }
                    }}
                >
                    {pendiente && (
                        <>
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
                                onClick={() => onCancelar(solicitud)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    minHeight: 40,
                                    background: 'linear-gradient(135deg, #1E4DB7 0%, #08338F 55%, #052466 100%)',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 12px rgba(8, 51, 143, 0.35)',
                                    '&:hover': { background: 'linear-gradient(135deg, #08338F 0%, #052466 100%)' }
                                }}
                                onClick={() => onEditar(solicitud)}
                            >
                                Editar
                            </Button>
                        </>
                    )}

                    {rechazada && (
                        <Button
                            variant="outlined"
                            sx={{
                                minHeight: 40,
                                color: '#8A6D2B',
                                borderColor: '#C49E0D',
                                borderRadius: '8px',
                                textTransform: 'none',
                                '&:hover': { borderColor: '#8A6D2B', backgroundColor: 'rgba(196, 158, 13, 0.08)' }
                            }}
                            onClick={() => onNota(solicitud)}
                        >
                            Notas del asesor
                        </Button>
                    )}
                </CardActions>
            )}
        </Card>
    );
}
