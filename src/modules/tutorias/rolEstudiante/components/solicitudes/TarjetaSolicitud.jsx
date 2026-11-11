import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
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
                background: '#FFFFFF',
                borderLeft: '20px solid #08338F',
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.20)',
            }}
        >
            <CardContent sx={{ padding: '24px 24px 15px 24px' }}>
                {/* Encabezado: materia y botón de información a la derecha */}
                <Box sx={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
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

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <LineaDato icono={<BadgeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Asesor">{solicitud.asesor}</LineaDato>
                    <LineaDato icono={<MailOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Correo">{solicitud.asesor_correo}</LineaDato>
                    <LineaDato icono={<CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Fecha">{solicitud.fecha_formateada}</LineaDato>
                    <LineaDato icono={<AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Horario">{solicitud.horario_con_dia || 'N/A'}</LineaDato>
                    <LineaDato icono={<LaptopOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Modalidad">{solicitud.modalidad}</LineaDato>
                    <LineaDato icono={<FiberManualRecordIcon sx={{ fontSize: 20, color: estilo.color }} />} etiqueta="Estatus">
                        <span className="font-semibold" style={{ color: estilo.color }}>{estilo.etiqueta}</span>
                    </LineaDato>
                </Box>
            </CardContent>

            {/* Acciones según el estatus (las aceptadas y canceladas ya no tienen) */}
            {(pendiente || rechazada) && (
                <CardActions
                    sx={{
                        padding: '0px 24px 20px 24px',
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
                                    borderRadius: '5px',
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
                                    backgroundColor: '#08338F',
                                    color: '#ffffff',
                                    borderRadius: '5px',
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: '#062568' }
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
                                borderRadius: '5px',
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
