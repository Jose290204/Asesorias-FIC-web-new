import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// Línea con ícono, etiqueta en negritas y valor (Asesor:, Horario:...). Si no hay valor, no se muestra.
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

// Tarjeta de una asesoría en curso del estudiante: solo lo esencial para llegar a ella
// (materia, asesor, fecha de inicio, horario y modalidad). El resto está en el botón de información.
// Recibe la asesoría y qué hacer al tocar cada botón.
export default function TarjetaAsesoriaEstudiante({ asesoria, onInfo, onSesiones, onMaterial, onChat }) {
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
            {/* Franja verde: la asesoría está en curso */}
            <Box sx={{ height: '5px', backgroundColor: '#2E7D32' }} />

            {/* Encabezado: materia y botones de información y sesiones a la derecha */}
            <Box
                sx={{
                    padding: '16px 22px',
                    background: 'linear-gradient(180deg, #F4F7FD 0%, #FFFFFF 100%)',
                    borderBottom: '1px solid #EEF1F7',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '8px'
                }}
            >
                <Typography
                    title={asesoria.materia}
                    sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0, pt: '2px' }}
                >
                    {asesoria.materia}
                </Typography>

                <Box sx={{ display: 'flex', flexShrink: 0, mr: '-8px', mt: '-4px' }}>
                    <Tooltip title="Información">
                        <IconButton
                            size="small"
                            aria-label="Información"
                            sx={{ color: '#08338F' }}
                            onClick={(e) => onInfo(asesoria, e)}
                        >
                            <InfoOutlinedIcon />
                        </IconButton>
                    </Tooltip>

                    {/* Sesiones registradas por el asesor (solo consulta) */}
                    <Tooltip title={`Sesiones (${asesoria.sesiones_count ?? 0})`}>
                        <IconButton
                            size="small"
                            aria-label="Ver sesiones"
                            sx={{ color: '#6A1B9A' }}
                            onClick={(e) => onSesiones(asesoria, e)}
                        >
                            <EventNoteOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Datos: ocupan el espacio sobrante para que los botones queden siempre abajo */}
            <CardContent sx={{ flex: 1, padding: '18px 22px 12px 22px', '&:last-child': { paddingBottom: '12px' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <LineaDato icono={<BadgeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Asesor">{asesoria.asesor}</LineaDato>
                    <LineaDato icono={<CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Fecha de inicio">{asesoria.fecha_inicio_formateada}</LineaDato>
                    <LineaDato icono={<AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Horario">{asesoria.horario_con_dia}</LineaDato>
                    <LineaDato icono={<LaptopOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Modalidad">{asesoria.modalidad}</LineaDato>
                </Box>
            </CardContent>

            {/* Botones: dos columnas iguales; Chat con relleno y Material solo con borde */}
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
                        color: '#8A6D2B',
                        borderColor: '#C49E0D',
                        borderRadius: '8px',
                        textTransform: 'none',
                        '&:hover': { borderColor: '#8A6D2B', backgroundColor: 'rgba(196, 158, 13, 0.08)' }
                    }}
                    startIcon={<FileDownloadOutlinedIcon />}
                    onClick={(e) => onMaterial(asesoria, e)}
                >
                    Material
                </Button>
                {/* Globito rojo con los mensajes sin leer; con 0 no se muestra */}
                <Badge
                    badgeContent={asesoria.mensajes_sin_leer}
                    max={99}
                    color="error"
                    sx={{ width: '100%', '& > .MuiButton-root': { flex: 1 } }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            minHeight: 40,
                            color: '#ffffff',
                            fontWeight: 700,
                            borderRadius: '8px',
                            textTransform: 'none',
                            letterSpacing: '0.3px',
                            background: 'linear-gradient(135deg, #1E4DB7 0%, #08338F 55%, #052466 100%)',
                            boxShadow: '0 4px 12px rgba(8, 51, 143, 0.35)',
                            '&:hover': { background: 'linear-gradient(135deg, #08338F 0%, #052466 100%)' }
                        }}
                        startIcon={<ChatOutlinedIcon />}
                        onClick={(e) => onChat(asesoria, e)}
                    >
                        Chat
                    </Button>
                </Badge>
            </CardActions>
        </Card>
    );
}
