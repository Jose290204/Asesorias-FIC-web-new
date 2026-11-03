import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { formatearFechaVisible } from '../../../rolEstudiante/utils/fechaSolicitud';

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
                    <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                        <span className="font-bold">Estudiante: </span> {row.estudiante}
                    </Typography>
                    <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                        <span className="font-bold">Asesor: </span> {row.asesor}
                    </Typography>

                    {/* Fecha de inicio y horario en una sola línea */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: '#08338F', mt: '1px', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                            {formatearFechaVisible(row.fecha_inicio)}
                            {row.horario && ` · ${row.horario}`}
                        </Typography>
                    </Box>

                    {/* Chips: modalidad y número de asesoría */}
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
                            label={`Asesoría #${row.id_asesoria ?? row.id}`}
                            sx={{ borderColor: '#BDBDBD', color: '#555555', fontWeight: 600 }}
                        />
                    </Box>
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
                    Eliminar asesoría
                </MenuItem>
            </Menu>
        </Card>
    );
}