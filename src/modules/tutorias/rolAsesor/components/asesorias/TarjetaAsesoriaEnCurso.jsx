import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// Tarjeta de una asesoría en curso para la vista móvil. Recibe la asesoría y qué hacer al tocar cada botón.
export default function TarjetaAsesoriaEnCurso({ asesoria, onMenu, onMaterial, onChat }) {
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
                    <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                        <span className="font-bold">Estudiante: </span> {asesoria.estudiante}
                    </Typography>

                    {/* Fecha de inicio y horario en una sola línea */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: '#08338F', mt: '1px', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                            {asesoria.fecha_inicio_formateada}
                            {asesoria.horario_con_dia && ` · ${asesoria.horario_con_dia}`}
                        </Typography>
                    </Box>

                    {/* Chips: modalidad y número de asesoría */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {asesoria.modalidad && (
                            <Chip
                                size="small"
                                variant="outlined"
                                label={asesoria.modalidad}
                                sx={{ borderColor: '#08338F', color: '#08338F', fontWeight: 600 }}
                            />
                        )}
                        <Chip
                            size="small"
                            variant="outlined"
                            label={`Asesoría #${asesoria.id}`}
                            sx={{ borderColor: '#BDBDBD', color: '#555555', fontWeight: 600 }}
                        />
                    </Box>
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
                {/* Globito rojo con los mensajes sin leer; con 0 no se muestra */}
                <Badge
                    badgeContent={asesoria.mensajes_sin_leer}
                    max={99}
                    color="error"
                    sx={{ width: '100%', '& > .MuiButton-root': { flex: 1 } }}
                >
                    <Button
                        variant="contained"
                        sx={{ minHeight: 40, color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
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
