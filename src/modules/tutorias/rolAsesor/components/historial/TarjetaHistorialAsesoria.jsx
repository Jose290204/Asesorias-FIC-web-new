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
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// El historial son asesorías cerradas: completadas o canceladas
const ESTILO_ESTATUS = {
    completada: { label: 'Completada', color: '#2E7D32' },
    cancelada: { label: 'Cancelada', color: '#C62828' }
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
    const estatus = ESTILO_ESTATUS[asesoria.estatus] ?? { label: asesoria.estatus, color: '#555555' };

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
            <CardContent sx={{ padding: '24px 24px 15px' }}>
                <Box sx={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <Typography sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0 }}>
                        {asesoria.materia}
                    </Typography>

                    {/* Un solo botón ⋮ con las acciones poco frecuentes */}
                    <IconButton
                        aria-label="Más acciones"
                        aria-haspopup="true"
                        onClick={(e) => onMenu(asesoria, e)}
                        sx={{ flexShrink: 0, mr: '-12px', mt: '-10px', color: '#555555' }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <LineaDato icono={<PersonOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Estudiante">{asesoria.estudiante}</LineaDato>
                    <LineaDato icono={<HelpOutlineOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Razón">{asesoria.razon}</LineaDato>
                    <LineaDato icono={<CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Fecha de inicio">{asesoria.fecha_inicio_formateada}</LineaDato>
                    <LineaDato icono={<EventAvailableOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Fecha de fin">{asesoria.fecha_fin_formateada}</LineaDato>
                    <LineaDato icono={<AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Horario">{asesoria.horario_con_dia}</LineaDato>
                    <LineaDato icono={<LaptopOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Modalidad">{asesoria.modalidad}</LineaDato>
                    <LineaDato icono={<FiberManualRecordIcon sx={{ fontSize: 20, color: estatus.color }} />} etiqueta="Estatus">
                        <span className="font-semibold" style={{ color: estatus.color }}>{estatus.label}</span>
                    </LineaDato>
                    <LineaDato icono={<TagOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Asesoría">{`#${asesoria.id}`}</LineaDato>
                </Box>
            </CardContent>

            {/* Botones: dos columnas iguales; Chat con relleno y Material solo con borde */}
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
                    startIcon={<ChatOutlinedIcon />}
                    onClick={(e) => onChat(asesoria, e)}
                >
                    Chat
                </Button>
            </CardActions>
        </Card>
    );
}
