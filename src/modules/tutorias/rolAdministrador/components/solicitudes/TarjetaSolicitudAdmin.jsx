import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { formatearFechaVisible } from '../../../rolEstudiante/utils/fechaSolicitud';

// Versión móvil de una fila de la tabla de solicitudes.
// Mismo diseño que la tarjeta de asesorías: ícono de información arriba a la derecha + botones Rechazar y Aprobar.
// Solo muestra; las acciones las maneja quien la usa (TablaSolicitudes).
export default function TarjetaSolicitudAdmin({ row, onInfo, onAprobar, onRechazar }) {
    // La fecha viene en "fecha_inicio" (datos de prueba) o dentro de "raw" (servicio)
    const fecha = row.fecha_inicio ?? row.raw?.fecha ?? row.fecha;

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
                    <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                        <span className="font-bold">Estudiante: </span> {row.estudiante}
                    </Typography>

                    {row.asesor && (
                        <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                            <span className="font-bold">Asesor: </span> {row.asesor}
                        </Typography>
                    )}

                    {/* Fecha y horario solicitados en una sola línea */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: '#08338F', mt: '1px', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                            {formatearFechaVisible(fecha)}
                            {row.horario && ` · ${row.horario}`}
                        </Typography>
                    </Box>

                    {/* Chips: modalidad y número de solicitud */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {row.modalidad && (
                            <Chip
                                size="small"
                                variant="outlined"
                                label={row.modalidad}
                                sx={{ borderColor: '#08338F', color: '#08338F', fontWeight: 600 }}
                            />
                        )}
                        <Chip
                            size="small"
                            variant="outlined"
                            label={`Solicitud #${row.id_solicitud ?? row.id}`}
                            sx={{ borderColor: '#BDBDBD', color: '#555555', fontWeight: 600 }}
                        />
                    </Box>
                </Box>
            </CardContent>

            {/* Botones: dos columnas iguales; Rechazar con borde y Aprobar con relleno */}
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
        </Card>
    );
}