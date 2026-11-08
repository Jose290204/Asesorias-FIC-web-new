import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// Tarjeta de una asesoría en curso del estudiante. Recibe la asesoría y qué hacer al tocar cada botón.
export default function TarjetaAsesoriaEstudiante({ asesoria, onSesiones, onMaterial, onChat }) {
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
            <CardContent sx={{ padding: '24px 24px 16px 24px' }}>
                {/* Encabezado: avatar, nombre del asesor y botón de sesiones */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '16px', mb: 2 }}>
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
                        {asesoria.asesor ? asesoria.asesor.charAt(0) : 'A'}
                    </Avatar>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#08338F', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1.2 }}>
                            Asesor
                        </Typography>
                        <Typography
                            title={asesoria.asesor}
                            sx={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#000000',
                                lineHeight: 1.2,
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}
                        >
                            {asesoria.asesor}
                        </Typography>
                        {/* Correo del asesor, debajo del nombre */}
                        {asesoria.asesor_correo && (
                            <Typography
                                title={asesoria.asesor_correo}
                                sx={{ fontSize: '13px', color: '#666666', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                                {asesoria.asesor_correo}
                            </Typography>
                        )}
                    </Box>

                    {/* Sesiones registradas por el asesor (solo consulta) */}
                    <Tooltip title={`Sesiones (${asesoria.sesiones_count ?? 0})`}>
                        <IconButton
                            size="small"
                            aria-label="Ver sesiones"
                            sx={{ color: '#6A1B9A', flexShrink: 0, mr: '-8px', mt: '-4px' }}
                            onClick={(e) => onSesiones(asesoria, e)}
                        >
                            <EventNoteOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mb: '5px' }}>
                    <Typography
                        title={asesoria.materia}
                        sx={{ fontSize: '15px', color: '#333333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                        <span className="font-bold">Materia: </span> {asesoria.materia}
                    </Typography>
                    <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                        <span className="font-bold">Razón: </span> {asesoria.razon}
                    </Typography>

                    {/* Fecha de inicio y horario */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: '#08338F', mt: '1px', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                            {asesoria.fecha_inicio_formateada}
                            {asesoria.horario_con_dia && ` · ${asesoria.horario_con_dia}`}
                        </Typography>
                    </Box>

                    {/* Chips: modalidad y estado */}
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
                            label="En curso"
                            sx={{ borderColor: '#2E7D32', color: '#2E7D32', fontWeight: 600 }}
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
