import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LoginIcon from '@mui/icons-material/Login';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Avatar, Box, Button, Card, CardActions, CardContent, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

import {
  DEGRADADO_AZUL,
  DEGRADADO_AZUL_HOVER,
} from '../../tutorias/rolAdministrador/components/compartidos/estilosAdmin';

function Dato({ valor, etiqueta }) {
  return (
    <Box sx={{ textAlign: 'center', flex: 1 }}>
      <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#08338F' }}>{valor}</Typography>
      <Typography sx={{ fontSize: '12px', color: '#5F6368' }}>{etiqueta}</Typography>
    </Box>
  );
}

// Tarjeta de una facultad en el panel del super admin. Mismo diseño que las tarjetas del administrador.
// Solo muestra; las acciones las maneja la vista. "Entrar al panel" queda a la vista y
// Editar, Desactivar/Activar y Eliminar van en el menú ⋮ de arriba.
export default function TarjetaFacultad({ facultad, onEntrar, onEditar, onCambiarEstado, onEliminar }) {
  const { nombre, siglas, logo, activa, administradores, asesores, estudiantes, asesorias } = facultad;
  const color = activa ? '#2E7D32' : '#5F6368';

  const [menuAnchor, setMenuAnchor] = useState(null);
  const cerrarMenu = () => setMenuAnchor(null);
  const elegir = (accion) => () => {
    cerrarMenu();
    accion(facultad);
  };

  return (
    <Card
      sx={{
        width: '100%',
        background: '#FFFFFF',
        border: '1px solid #E3E8F2',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 2px 10px rgba(8, 51, 143, 0.08)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0px 10px 24px rgba(8, 51, 143, 0.16)' },
      }}
    >
      <Box sx={{ height: '5px', backgroundColor: color }} />

      <Box
        sx={{
          padding: '16px 22px',
          background: 'linear-gradient(180deg, #F4F7FD 0%, #FFFFFF 100%)',
          borderBottom: '1px solid #EEF1F7',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar
          src={logo ?? undefined}
          variant="rounded"
          slotProps={{ img: { style: { objectFit: 'contain' } } }}
          sx={{ width: 56, height: 56, borderRadius: '12px', bgcolor: '#E6ECF8', color: '#08338F', fontWeight: 700, fontSize: 16, flexShrink: 0 }}
        >
          {siglas.slice(0, 3)}
        </Avatar>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#000', lineHeight: 1.2, overflowWrap: 'anywhere' }}>
            {nombre}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '6px', flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#08338F' }}>{siglas}</Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                px: '10px',
                py: '2px',
                borderRadius: '999px',
                border: `1px solid ${color}`,
                backgroundColor: activa ? '#E8F5E9' : '#F1F3F4',
              }}
            >
              <FiberManualRecordIcon sx={{ fontSize: 12, color }} />
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color, lineHeight: 1.4 }}>
                {activa ? 'Activa' : 'Inactiva'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <IconButton
          size="small"
          aria-label="Más acciones"
          aria-haspopup="true"
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          sx={{ flexShrink: 0, alignSelf: 'flex-start', mr: '-8px', mt: '-4px', color: '#08338F' }}
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
            <ListItemIcon><EditOutlinedIcon fontSize="small" sx={{ color: '#8A6D2B' }} /></ListItemIcon>
            Editar
          </MenuItem>
          <MenuItem onClick={elegir(onCambiarEstado)} sx={{ minHeight: 44, color: activa ? '#B26A00' : '#2E7D32' }}>
            <ListItemIcon>
              <PowerSettingsNewIcon fontSize="small" sx={{ color: activa ? '#B26A00' : '#2E7D32' }} />
            </ListItemIcon>
            {activa ? 'Desactivar' : 'Activar'}
          </MenuItem>
          <Divider />
          <MenuItem onClick={elegir(onEliminar)} sx={{ minHeight: 44, color: '#C62828' }}>
            <ListItemIcon><DeleteOutlineOutlinedIcon fontSize="small" sx={{ color: '#C62828' }} /></ListItemIcon>
            Eliminar
          </MenuItem>
        </Menu>
      </Box>

      <CardContent sx={{ flex: 1, padding: '18px 22px 12px', '&:last-child': { paddingBottom: '12px' } }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Dato valor={administradores} etiqueta="Admins" />
          <Dato valor={asesores} etiqueta="Asesores" />
          <Dato valor={estudiantes} etiqueta="Estudiantes" />
          <Dato valor={asesorias} etiqueta="Asesorías" />
        </Box>
      </CardContent>

      <CardActions
        sx={{
          padding: '6px 22px 20px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '10px',
          // CardActions mete margen izquierdo a los botones; aquí se anula por el grid
          '& > :not(:first-of-type)': { marginLeft: 0 },
        }}
      >
        <Button
          variant="contained"
          startIcon={<LoginIcon />}
          onClick={() => onEntrar(facultad)}
          disabled={!activa}
          sx={{
            minHeight: 40,
            color: '#ffffff',
            fontWeight: 700,
            borderRadius: '8px',
            textTransform: 'none',
            background: DEGRADADO_AZUL,
            boxShadow: '0 4px 12px rgba(8, 51, 143, 0.35)',
            '&:hover': { background: DEGRADADO_AZUL_HOVER },
            '&.Mui-disabled': { background: '#E0E0E0', boxShadow: 'none', color: '#9E9E9E' },
          }}
        >
          Entrar al panel
        </Button>
      </CardActions>
    </Card>
  );
}
