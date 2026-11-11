import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { Box, Card, CardContent, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

// Color del punto y del texto de cada estatus
const colorEstatus = {
  activo: '#1B5E20',
  pendiente: '#8A5A00',
  inactivo: '#5F6368',
};

// Línea con ícono, etiqueta en negritas y valor (Nombre:, Correo:, Facultad:, Estatus:)
function LineaDato({ icono, etiqueta, children }) {
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

// Versión móvil de una fila de la tabla de administradores.
// Mismo diseño que las demás tarjetas del admin: borde azul, nombre arriba con el menú ⋮
// (Editar, Desactivar/Activar y Eliminar) y los datos con su etiqueta.
// Solo muestra; las acciones las maneja quien la usa (la vista).
export default function TarjetaAdministrador({ administrador, siglasFacultad, onEditar, onCambiarEstado, onEliminar }) {
  const { nombreCompleto, correo, estatus } = administrador;
  const inactivo = estatus === 'inactivo';

  const [menuAnchor, setMenuAnchor] = useState(null);
  const cerrarMenu = () => setMenuAnchor(null);

  // Cierra el menú y ejecuta la acción que corresponda
  const handleAccion = (accion) => () => {
    cerrarMenu();
    accion(administrador);
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
        boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.20)',
      }}
    >
      <CardContent sx={{ padding: '24px 24px 20px' }}>
        <Box sx={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
            <PersonOutlinedIcon sx={{ fontSize: 24, color: '#08338F', flexShrink: 0 }} />
            <Typography sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0 }}>
              {nombreCompleto}
            </Typography>
          </Box>

          {/* Un solo botón ⋮ con todas las acciones */}
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
          <LineaDato icono={<MailOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Correo">{correo}</LineaDato>
          <LineaDato icono={<SchoolOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Facultad">{siglasFacultad}</LineaDato>
          <LineaDato
            icono={<FiberManualRecordIcon sx={{ fontSize: 20, color: colorEstatus[estatus] ?? '#5F6368' }} />}
            etiqueta="Estatus"
          >
            <span className="font-semibold" style={{ color: colorEstatus[estatus] ?? '#5F6368' }}>
              {estatus.charAt(0).toUpperCase() + estatus.slice(1)}
            </span>
          </LineaDato>
        </Box>
      </CardContent>

      {/* Menú ⋮ de esta tarjeta */}
      <Menu
        disableScrollLock
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={cerrarMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleAccion(onEditar)} sx={{ minHeight: 44 }}>
          <ListItemIcon><EditOutlinedIcon fontSize="small" sx={{ color: '#08338F' }} /></ListItemIcon>
          Editar
        </MenuItem>
        <MenuItem onClick={handleAccion(onCambiarEstado)} sx={{ minHeight: 44 }}>
          <ListItemIcon>
            <PowerSettingsNewIcon fontSize="small" sx={{ color: inactivo ? '#2E7D32' : '#C42525' }} />
          </ListItemIcon>
          {inactivo ? 'Activar' : 'Desactivar'}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleAccion(onEliminar)} sx={{ minHeight: 44, color: '#C42525' }}>
          <ListItemIcon><DeleteOutlinedIcon fontSize="small" sx={{ color: '#C42525' }} /></ListItemIcon>
          Eliminar
        </MenuItem>
      </Menu>
    </Card>
  );
}
