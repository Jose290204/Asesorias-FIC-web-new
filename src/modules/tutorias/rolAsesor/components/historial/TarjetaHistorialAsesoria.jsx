import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// El historial son asesorías cerradas: completadas o canceladas
const ESTILO_ESTATUS = {
    completada: { label: 'Completada', color: '#2E7D32', fondo: '#E8F5E9' },
    cancelada: { label: 'Cancelada', color: '#C62828', fondo: '#FDECEA' }
};

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

// Tarjeta de una asesoría del historial para la vista móvil. Recibe la asesoría y qué hacer al tocar cada botón.
export default function TarjetaHistorialAsesoria({ asesoria, onMenu, onMaterial, onChat }) {
    const estatus = ESTILO_ESTATUS[asesoria.estatus] ?? { label: asesoria.estatus, color: '#555555', fondo: '#F3F4F6' };

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
            {/* Franja con el color del estatus */}
            <Box sx={{ height: '5px', backgroundColor: estatus.color }} />

            {/* Encabezado: materia, menú de acciones y estatus */}
            <Box
                sx={{
                    padding: '16px 22px',
                    background: 'linear-gradient(180deg, #F4F7FD 0%, #FFFFFF 100%)',
                    borderBottom: '1px solid #EEF1F7'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <Typography
                        title={asesoria.materia}
                        sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0, pt: '2px' }}
                    >
                        {asesoria.materia}
                    </Typography>

                    {/* Un solo botón ⋮ con las acciones poco frecuentes (información y sesiones) */}
                    <IconButton
                        size="small"
                        aria-label="Más acciones"
                        aria-haspopup="true"
                        onClick={(e) => onMenu(asesoria, e)}
                        sx={{ flexShrink: 0, mr: '-8px', mt: '-4px', color: '#08338F' }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        mt: '10px',
                        px: '10px',
                        py: '2px',
                        borderRadius: '999px',
                        border: `1px solid ${estatus.color}`,
                        backgroundColor: estatus.fondo
                    }}
                >
                    <FiberManualRecordIcon sx={{ fontSize: 12, color: estatus.color }} />
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: estatus.color, lineHeight: 1.4 }}>
                        {estatus.label}
                    </Typography>
                </Box>
            </Box>

            {/* Datos: ocupan el espacio sobrante para que los botones queden siempre abajo */}
            <CardContent sx={{ flex: 1, padding: '18px 22px 12px 22px', '&:last-child': { paddingBottom: '12px' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <LineaDato icono={<PersonOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Estudiante">{asesoria.estudiante}</LineaDato>
                    <LineaDato icono={<HelpOutlineOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Razón">{asesoria.razon}</LineaDato>
                    <LineaDato icono={<CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Fecha de inicio">{asesoria.fecha_inicio_formateada}</LineaDato>
                    <LineaDato icono={<EventAvailableOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Fecha de fin">{asesoria.fecha_fin_formateada}</LineaDato>
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
            </CardActions>
        </Card>
    );
}
