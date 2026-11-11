import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
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

// El historial son asesorías cerradas: completadas o canceladas
const ESTILO_ESTATUS = {
    completada: { label: 'Completada', color: '#2E7D32', fondo: '#E8F5E9' },
    cancelada: { label: 'Cancelada', color: '#C62828', fondo: '#FDECEA' }
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

// Tarjeta de una asesoría del historial. Recibe la asesoría y qué hacer al tocar cada botón.
export default function TarjetaHistorialEstudiante({ asesoria, onInfo, onMaterial, onSesiones }) {
    const estatus = ESTILO_ESTATUS[asesoria.estatus] ?? { label: asesoria.estatus, color: '#555555', fondo: '#F3F4F6' };

    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: '410px',
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
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', mb: 1.5 }}>
                    <Typography
                        title={asesoria.materia}
                        sx={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#000000',
                            lineHeight: 1.2,
                            overflowWrap: 'anywhere',
                            minWidth: 0
                        }}
                    >
                        {asesoria.materia}
                    </Typography>

                    <Tooltip title="Información">
                        <IconButton
                            aria-label="Ver información de la asesoría"
                            onClick={(e) => onInfo(asesoria, e)}
                            sx={{ flexShrink: 0, mr: '-12px', mt: '-10px', color: '#08338F' }}
                        >
                            <InfoOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <LineaDato icono={<BadgeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Asesor">{asesoria.asesor}</LineaDato>
                    <LineaDato icono={<HelpOutlineOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Razón">{asesoria.razon}</LineaDato>
                    <LineaDato icono={<CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Fecha de inicio">{asesoria.fecha_inicio_formateada}</LineaDato>
                    <LineaDato icono={<EventAvailableOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Fecha de fin">{asesoria.fecha_fin_formateada}</LineaDato>
                    <LineaDato icono={<AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Horario">{asesoria.horario_con_dia}</LineaDato>
                    <LineaDato icono={<LaptopOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Modalidad">{asesoria.modalidad}</LineaDato>
                    <LineaDato icono={<FiberManualRecordIcon sx={{ fontSize: 20, color: estatus.color }} />} etiqueta="Estatus">
                        <span className="font-semibold" style={{ color: estatus.color }}>{estatus.label}</span>
                    </LineaDato>
                </Box>
            </CardContent>

            {/* Botones: dos columnas iguales; Sesiones con relleno y Material solo con borde */}
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
                        color: '#8A6D2B',
                        borderColor: '#C49E0D',
                        borderRadius: '5px',
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
                    sx={{ minHeight: 40, color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                    startIcon={<EventNoteOutlinedIcon />}
                    onClick={(e) => onSesiones(asesoria, e)}
                >
                    Sesiones
                </Button>
            </CardActions>
        </Card>
    );
}
