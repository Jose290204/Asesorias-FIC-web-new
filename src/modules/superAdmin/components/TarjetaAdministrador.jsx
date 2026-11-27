import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { Divider, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import { ICONO } from '../../tutorias/rolAdministrador/components/compartidos/estilosAdmin';
import TarjetaAdmin from '../../tutorias/rolAdministrador/components/compartidos/TarjetaAdmin';

// Estatus de la cuenta: color de la franja, de la pastilla y su fondo
const ESTATUS = {
  activo: { label: 'Activo', color: '#2E7D32', fondo: '#E8F5E9' },
  pendiente: { label: 'Pendiente', color: '#B26A00', fondo: '#FFF4E0' },
  inactivo: { label: 'Inactivo', color: '#5F6368', fondo: '#F1F3F4' },
};

// Versión móvil de una fila de la tabla de administradores: solo lo esencial.
// Las acciones (Editar, Activar/Desactivar y Eliminar) van en el menú ⋮ de arriba.
// Solo muestra; las acciones las maneja quien la usa (la vista).
export default function TarjetaAdministrador({ administrador, siglasFacultad, onEditar, onCambiarEstado, onEliminar }) {
  const { nombreCompleto, correo, estatus } = administrador;
  const inactivo = estatus === 'inactivo';
  const pastilla = ESTATUS[estatus] ?? ESTATUS.inactivo;

  const [menuAnchor, setMenuAnchor] = useState(null);
  const cerrarMenu = () => setMenuAnchor(null);
  const elegir = (accion) => () => {
    cerrarMenu();
    accion(administrador);
  };

  return (
    <TarjetaAdmin
      franja={pastilla.color}
      titulo={nombreCompleto}
      pastilla={pastilla}
      encabezadoDerecha={
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
            <MenuItem onClick={elegir(onEditar)} sx={{ minHeight: 44 }}>
              <ListItemIcon><EditOutlinedIcon fontSize="small" sx={{ color: '#08338F' }} /></ListItemIcon>
              Editar
            </MenuItem>
            <MenuItem onClick={elegir(onCambiarEstado)} sx={{ minHeight: 44, color: inactivo ? '#2E7D32' : '#B26A00' }}>
              <ListItemIcon>
                <PowerSettingsNewIcon fontSize="small" sx={{ color: inactivo ? '#2E7D32' : '#B26A00' }} />
              </ListItemIcon>
              {inactivo ? 'Activar' : 'Desactivar'}
            </MenuItem>
            <Divider />
            <MenuItem onClick={elegir(onEliminar)} sx={{ minHeight: 44, color: '#C42525' }}>
              <ListItemIcon><DeleteOutlineOutlinedIcon fontSize="small" sx={{ color: '#C42525' }} /></ListItemIcon>
              Eliminar
            </MenuItem>
          </Menu>
        </>
      }
      lineas={[
        { icono: <MailOutlinedIcon sx={ICONO} />, etiqueta: 'Correo', valor: correo },
        { icono: <SchoolOutlinedIcon sx={ICONO} />, etiqueta: 'Facultad', valor: siglasFacultad },
      ]}
    />
  );
}
