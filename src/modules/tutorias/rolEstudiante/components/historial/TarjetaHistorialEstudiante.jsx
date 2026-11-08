import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// El historial son asesorías cerradas: completadas o canceladas
const ESTILO_ESTATUS = {
    completada: { label: 'Completada', color: '#2E7D32', fondo: '#E8F5E9' },
    cancelada: { label: 'Cancelada', color: '#C62828', fondo: '#FDECEA' }
};

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
                    <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                        <span className="font-bold">Asesor: </span> {asesoria.asesor}
                    </Typography>
                    <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                        <span className="font-bold">Razón: </span> {asesoria.razon}
                    </Typography>

                    {/* Fecha de inicio (y de finalización, si la hay) con su horario */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: '#08338F', mt: '1px', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                            {asesoria.fecha_inicio_formateada}
                            {asesoria.fecha_fin_formateada && ` – ${asesoria.fecha_fin_formateada}`}
                            {asesoria.horario_con_dia && ` · ${asesoria.horario_con_dia}`}
                        </Typography>
                    </Box>

                    {/* Chips: estatus y modalidad */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <Chip
                            size="small"
                            label={estatus.label}
                            sx={{ backgroundColor: estatus.fondo, color: estatus.color, fontWeight: 600 }}
                        />
                        {asesoria.modalidad && (
                            <Chip
                                size="small"
                                variant="outlined"
                                label={asesoria.modalidad}
                                sx={{ borderColor: '#08338F', color: '#08338F', fontWeight: 600 }}
                            />
                        )}
                    </Box>
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
