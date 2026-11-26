import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

import { ICONO } from '../compartidos/estilosAdmin';
import TarjetaAdmin from '../compartidos/TarjetaAdmin';

// Versión móvil de una fila de la tabla de estudiantes: solo lo esencial.
// Información, Editar y Dar de baja van en el menú ⋮ de arriba; el correo y el teléfono están en el modal de información.
// Solo muestra; las acciones las maneja quien la usa (TablaEstudiantes).
export default function TarjetaEstudiante({ row, onInfo, onEditar, onEliminar }) {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const cerrarMenu = () => setMenuAnchor(null);
    const elegir = (accion) => (e) => {
        cerrarMenu();
        accion(row, e);
    };

    const menu = (
        <>
            <IconButton
                size="small"
                aria-label="Más acciones"
                aria-haspopup="true"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{ flexShrink: 0, mr: '-8px', mt: '-4px', color: '#08338F' }}
            >
                <MoreVertIcon />
            </IconButton>

            <Menu
                disableScrollLock
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={cerrarMenu}
                slotProps={{ paper: { sx: { borderRadius: '12px', boxShadow: '0px 8px 24px rgba(8, 51, 143, 0.18)' } } }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={elegir(onInfo)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><InfoOutlinedIcon fontSize="small" sx={{ color: '#08338F' }} /></ListItemIcon>
                    Información
                </MenuItem>
                <MenuItem onClick={elegir(onEditar)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><EditOutlinedIcon fontSize="small" sx={{ color: '#8A6D2B' }} /></ListItemIcon>
                    Editar
                </MenuItem>
                <Divider />
                <MenuItem onClick={elegir(onEliminar)} sx={{ minHeight: 44, color: '#C62828' }}>
                    <ListItemIcon><DeleteOutlineOutlinedIcon fontSize="small" sx={{ color: '#C62828' }} /></ListItemIcon>
                    Dar de baja
                </MenuItem>
            </Menu>
        </>
    );

    return (
        <TarjetaAdmin
            titulo={row.nombre}
            encabezadoDerecha={menu}
            lineas={[
                { icono: <BadgeOutlinedIcon sx={ICONO} />, etiqueta: 'Cuenta', valor: row.numeroCuenta },
                { icono: <SchoolOutlinedIcon sx={ICONO} />, etiqueta: 'Licenciatura', valor: row.licenciatura },
                { icono: <GroupsOutlinedIcon sx={ICONO} />, etiqueta: 'Grupo', valor: row.grupo }
            ]}
        />
    );
}
