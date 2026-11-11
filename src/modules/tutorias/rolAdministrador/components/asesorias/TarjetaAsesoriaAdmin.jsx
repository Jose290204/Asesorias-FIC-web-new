import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { formatearFechaVisible } from '../../../rolEstudiante/utils/fechaSolicitud';

// Línea con ícono, etiqueta en negritas y valor (Estudiante:, Asesor:, Fecha de inicio:...). Si no hay valor, no se muestra.
function LineaDato({ icono, etiqueta, valor }) {
    if (!valor) return null;

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Box sx={{ display: 'flex', color: '#08338F', mt: '1px', flexShrink: 0 }}>{icono}</Box>
            <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere', minWidth: 0 }}>
                <span className="font-bold">{etiqueta}: </span>
                {valor}
            </Typography>
        </Box>
    );
}

// Versión móvil de una fila de la tabla de asesorías.
export default function TarjetaAsesoriaAdmin({ row, onInfo, onMaterial, onChat, onCompletar, onEliminar, onSesiones }) {
    // Menú ⋮ de la tarjeta (Información / Completar / Eliminar)
    const [menuAnchor, setMenuAnchor] = useState(null);
    const closeMenu = () => setMenuAnchor(null);

    // Cierra el menú y ejecuta la acción que corresponda
    const handleMenuAccion = (accion) => (event) => {
        closeMenu();
        accion(row, event);
    };

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

                    {/* Un solo botón ⋮ con las acciones poco frecuentes */}
                    <IconButton
                        aria-label="Más acciones"
                        aria-haspopup="true"
                        onClick={(e) => setMenuAnchor(e.currentTarget)}
                        sx={{ flexShrink: 0, mr: '-12px', mt: '-10px', color: '#555555' }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <LineaDato icono={<PersonOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Estudiante" valor={row.estudiante} />
                    <LineaDato icono={<BadgeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Asesor" valor={row.asesor} />
                    <LineaDato
                        icono={<CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />}
                        etiqueta="Fecha de inicio"
                        valor={row.fecha_inicio ? formatearFechaVisible(row.fecha_inicio) : ''}
                    />
                    <LineaDato icono={<AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Horario" valor={row.horario_con_dia || row.horario} />
                    <LineaDato icono={<LaptopOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Modalidad" valor={row.modalidad} />
                    <LineaDato icono={<TagOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Asesoría" valor={`#${row.id_asesoria ?? row.id}`} />
                </Box>
            </CardContent>

            {/* Botones: dos columnas iguales; el principal con relleno y Material solo con borde */}
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
                    onClick={(e) => onMaterial(row, e)}
                >
                    Material
                </Button>
                <Button
                    variant="contained"
                    sx={{ minHeight: 40, color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                    startIcon={<ChatOutlinedIcon />}
                    onClick={(e) => onChat(row, e)}
                >
                    Chat
                </Button>
            </CardActions>

            {/* Menú ⋮ de esta tarjeta */}
            <Menu
                disableScrollLock
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleMenuAccion(onCompletar)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><CheckOutlinedIcon fontSize="small" sx={{ color: '#2E7D32' }} /></ListItemIcon>
                    Completar asesoría
                </MenuItem>
                <MenuItem onClick={handleMenuAccion(onSesiones)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><EventNoteOutlinedIcon fontSize="small" sx={{ color: '#6A1B9A' }} /></ListItemIcon>
                    Sesiones
                </MenuItem>
                <MenuItem onClick={handleMenuAccion(onInfo)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><EditOutlinedIcon fontSize="small" sx={{ color: '#08338F' }} /></ListItemIcon>
                    Editar información
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuAccion(onEliminar)} sx={{ minHeight: 44, color: '#C42525' }}>
                    <ListItemIcon><DeleteOutlineOutlinedIcon fontSize="small" sx={{ color: '#C42525' }} /></ListItemIcon>
                    Cancelar asesoría
                </MenuItem>
            </Menu>
        </Card>
    );
}