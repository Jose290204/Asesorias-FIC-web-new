import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
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
            <CardContent sx={{ padding: '24px 24px 10px 24px' }}>
                {/* Encabezado: avatar del asesor, su nombre y el botón de información a la derecha */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '16px', mb: 2.5 }}>
                    <Avatar
                        sx={{
                            backgroundColor: '#EBD9B4',
                            color: '#8A6D2B',
                            width: 50,
                            height: 50,
                            fontSize: '24px',
                            fontWeight: 'bold',
                            flexShrink: 0
                        }}
                    >
                        {solicitud.asesor?.charAt(0)}
                    </Avatar>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#08338F', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1.2 }}>
                            Asesor
                        </Typography>
                        <Typography
                            title={solicitud.asesor}
                            sx={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#000000',
                                lineHeight: 1.2,
                                overflowWrap: 'anywhere',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}
                        >
                            {solicitud.asesor}
                        </Typography>
                        {/* Correo del asesor, debajo del nombre */}
                        {solicitud.asesor_correo && (
                            <Typography
                                title={solicitud.asesor_correo}
                                sx={{ fontSize: '13px', color: '#666666', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                                {solicitud.asesor_correo}
                            </Typography>
                        )}
                    </Box>

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

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mb: '5px' }}>
                    <Typography
                        title={solicitud.materia}
                        sx={{ fontSize: '15px', color: '#333333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                        <span className="font-bold">Materia: </span>
                        <span style={{ color: '#08338F', fontWeight: 600 }}>{solicitud.materia}</span>
                    </Typography>

                    {/* Fecha y horario solicitados */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: '#08338F', mt: '1px', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                            {solicitud.fecha_formateada} · {solicitud.horario_con_dia || 'N/A'}
                        </Typography>
                    </Box>

                    {/* Chips: modalidad y estatus */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {solicitud.modalidad && (
                            <Chip
                                size="small"
                                variant="outlined"
                                label={solicitud.modalidad}
                                sx={{ borderColor: '#08338F', color: '#08338F', fontWeight: 600 }}
                            />
                        )}
                        <Chip
                            size="small"
                            variant="outlined"
                            label={estilo.etiqueta}
                            sx={{ borderColor: estilo.borde, color: estilo.color, fontWeight: 600 }}
                        />
                    </Box>
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
