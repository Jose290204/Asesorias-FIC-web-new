import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Avatar, Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';
import useCambioDePanel from '../../../hooks/useCambioDePanel';

// Menú que se abre al tocar el botón del usuario en la cabecera (celular).
// Arriba lleva una tarjeta con el avatar, el nombre y el correo; abajo, las acciones.
export default function MenuUsuario({ anchorEl, onClose, nombre, correo, onVerPerfil, onLogout }) {
  // Solo para quien tiene los dos paneles (estudiante que también es asesor)
  const cambioPanel = useCambioDePanel();

  return (
    <Menu
      disableScrollLock
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            width: 'min(280px, calc(100vw - 24px))',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22)'
          }
        },
        list: { sx: { p: 0 } }
      }}
    >
      <div className="flex items-center gap-3 bg-[linear-gradient(180deg,#2a529b_0%,#244B91_55%,#162f66_100%)] px-4 py-4 text-white">
        <Avatar sx={{ width: 44, height: 44, bgcolor: '#EBD9B4', color: '#8A6D2B', fontSize: 20, fontWeight: 'bold' }}>
          {nombre ? nombre.charAt(0).toUpperCase() : ''}
        </Avatar>
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-semibold leading-tight">{nombre}</p>
          {correo && <p className="mt-0.5 truncate text-xs text-blue-100">{correo}</p>}
        </div>
      </div>

      <div className="p-1.5">
        <MenuItem onClick={onVerPerfil} sx={{ borderRadius: '8px', py: 1.25, fontSize: 14, fontWeight: 500 }}>
          <ListItemIcon sx={{ color: '#244B91' }}><PersonOutlineIcon fontSize="small" /></ListItemIcon>
          Ver perfil
        </MenuItem>
        {cambioPanel && (
          <MenuItem
            onClick={() => {
              onClose();
              cambioPanel.cambiar();
            }}
            sx={{ borderRadius: '8px', py: 1.25, fontSize: 14, fontWeight: 500 }}
          >
            <ListItemIcon sx={{ color: '#244B91' }}><SwapHorizIcon fontSize="small" /></ListItemIcon>
            {cambioPanel.etiqueta}
          </MenuItem>
        )}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={onLogout}
          sx={{ borderRadius: '8px', py: 1.25, fontSize: 14, fontWeight: 500, color: 'error.main', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' } }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon fontSize="small" /></ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </div>
    </Menu>
  );
}
