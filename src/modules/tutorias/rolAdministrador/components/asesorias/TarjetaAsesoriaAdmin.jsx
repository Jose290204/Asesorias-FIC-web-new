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
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

import { formatearFechaVisible } from '../../../rolEstudiante/utils/fechaSolicitud';
import { DEGRADADO_AZUL, DEGRADADO_AZUL_HOVER, ICONO } from '../compartidos/estilosAdmin';
import TarjetaAdmin from '../compartidos/TarjetaAdmin';

const EN_CURSO = { label: 'En curso', color: '#2E7D32', fondo: '#E8F5E9' };

// Versión móvil de una fila de la tabla de asesorías: solo lo esencial.
// El resto de las acciones (completar, sesiones, editar, cancelar) está en el menú ⋮.
export default function TarjetaAsesoriaAdmin({ row, onInfo, onMaterial, onChat, onCompletar, onEliminar, onSesiones }) {
    // Menú ⋮ de la tarjeta (Completar / Sesiones / Editar / Cancelar)
    const [menuAnchor, setMenuAnchor] = useState(null);
    const closeMenu = () => setMenuAnchor(null);

    // Cierra el menú y ejecuta la acción que corresponda
    const handleMenuAccion = (accion) => (event) => {
        closeMenu();
        accion(row, event);
    };

    return (
        <TarjetaAdmin
            franja={EN_CURSO.color}
            titulo={row.materia}
            pastilla={EN_CURSO}
            encabezadoDerecha={
                <IconButton
                    size="small"
                    aria-label="Más acciones"
                    aria-haspopup="true"
                    onClick={(e) => setMenuAnchor(e.currentTarget)}
                    sx={{ flexShrink: 0, mr: '-8px', mt: '-4px', color: '#08338F' }}
                >
                    <MoreVertIcon />
                </IconButton>
            }
            lineas={[
                { icono: <PersonOutlinedIcon sx={ICONO} />, etiqueta: 'Estudiante', valor: row.estudiante },
                { icono: <BadgeOutlinedIcon sx={ICONO} />, etiqueta: 'Asesor', valor: row.asesor },
                { icono: <CalendarMonthOutlinedIcon sx={ICONO} />, etiqueta: 'Fecha de inicio', valor: row.fecha_inicio ? formatearFechaVisible(row.fecha_inicio) : '' },
                { icono: <AccessTimeOutlinedIcon sx={ICONO} />, etiqueta: 'Horario', valor: row.horario_con_dia || row.horario },
                { icono: <LaptopOutlinedIcon sx={ICONO} />, etiqueta: 'Modalidad', valor: row.modalidad }
            ]}
            // Material solo con borde y Chat con relleno
            acciones={
                <>
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
                        onClick={(e) => onMaterial(row, e)}
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
                            background: DEGRADADO_AZUL,
                            boxShadow: '0 4px 12px rgba(8, 51, 143, 0.35)',
                            '&:hover': { background: DEGRADADO_AZUL_HOVER }
                        }}
                        startIcon={<ChatOutlinedIcon />}
                        onClick={(e) => onChat(row, e)}
                    >
                        Chat
                    </Button>

                    {/* Menú ⋮ de esta tarjeta */}
                    <Menu
                        disableScrollLock
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={closeMenu}
                        slotProps={{ paper: { sx: { borderRadius: '12px', boxShadow: '0px 8px 24px rgba(8, 51, 143, 0.18)' } } }}
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
                </>
            }
        />
    );
}
