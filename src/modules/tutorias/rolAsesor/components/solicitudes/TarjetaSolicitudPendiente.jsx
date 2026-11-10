import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

// Tarjeta de una solicitud pendiente para la vista móvil. Recibe la solicitud y qué hacer al aceptarla o rechazarla.
export default function TarjetaSolicitudPendiente({ solicitud, onAceptar, onRechazar }) {
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
            <CardContent sx={{ padding: '24px 24px 15px' }}>
                <Box sx={{ marginBottom: '20px' }}>
                    <Typography sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0 }}>
                        {solicitud.materia}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                        <span className="font-bold">Estudiante: </span> {solicitud.nombre_estudiante}
                    </Typography>
                    <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                        <span className="font-bold">Razón: </span> {solicitud.razon}
                    </Typography>

                    {/* Fecha y horario solicitados en una sola línea */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: '#08338F', mt: '1px', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                            {solicitud.fecha_inicio_formateada}
                            {solicitud.horario_con_dia && ` · ${solicitud.horario_con_dia}`}
                        </Typography>
                    </Box>

                    {/* Chips: modalidad y número de solicitud */}
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
                            label={`Solicitud #${solicitud.id_solicitud}`}
                            sx={{ borderColor: '#BDBDBD', color: '#555555', fontWeight: 600 }}
                        />
                    </Box>
                </Box>
            </CardContent>

            {/* Botones: dos columnas iguales; Rechazar solo con borde y Aceptar con relleno */}
            <CardActions
                sx={{
                    padding: '0px 24px 20px 24px',
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
                        borderRadius: '5px',
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
                        backgroundColor: '#2E7D32',
                        color: '#ffffff',
                        borderRadius: '5px',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#1B5E20' }
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
