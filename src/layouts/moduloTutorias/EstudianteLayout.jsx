import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Button, Divider, Drawer, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import EstudianteSidebar from '../../components/navigation/moduloTutorias/EstudianteSidbar';
import { useAuth } from '../../context/AuthContext';

// Misma ruta que usa "Perfil" en el sidebar
const RUTA_PERFIL = '/tutorias/estudiante/perfil-estudiante';

export default function EstudianteLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout, user } = useAuth();

  // El drawer está abierto solo mientras estés en la ruta donde se abrió
  const [openPath, setOpenPath] = useState(null);
  const open = openPath === pathname;
  const closeDrawer = () => setOpenPath(null);

  // Menú del usuario (arriba a la derecha)
  const [anchorEl, setAnchorEl] = useState(null);
  const userMenuOpen = Boolean(anchorEl);
  const closeUserMenu = () => setAnchorEl(null);

  // TODO: ajusta los campos a como venga el usuario en tu AuthContext
  const nombreUsuario = 'Jose Angel Astorga Mejia'; // TODO: usar user?.nombre ?? user?.name ?? user?.nombreCompleto cuando venga del login

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleVerPerfil = () => {
    closeUserMenu();
    navigate(RUTA_PERFIL, { replace: true });
  };

  const handleLogoutDesdeMenu = () => {
    closeUserMenu();
    handleLogout();
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[#244B91]">
      <Drawer
        open={open}
        onClose={closeDrawer}
        PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}
      >
        <EstudianteSidebar mobile />
      </Drawer>

      <header className="sticky top-0 z-10 flex items-center gap-2 bg-[#244B91] px-3 py-2 text-white">
        <IconButton
          color="inherit"
          onClick={() => setOpenPath(pathname)}
          aria-label="Abrir menú"
        >
          <MenuIcon />
        </IconButton>
        <span className="font-semibold">Asesorías FIC</span>

        {/* Empuja el usuario a la derecha */}
        <div className="flex-1" />

        {/* Usuario: avatar + nombre (el nombre solo desde pantallas sm) */}
        <Button
          color="inherit"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="Menú de usuario"
          aria-haspopup="true"
          aria-expanded={userMenuOpen ? 'true' : undefined}
          sx={{ textTransform: 'none', gap: 1, minWidth: 0, px: 1, mr: { xs: 0.5, sm: 2, md: 4 } }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#EBD9B4', color: '#8A6D2B', fontSize: 16, fontWeight: 'bold' }}>
            {nombreUsuario.charAt(0).toUpperCase()}
          </Avatar>
          <span className="hidden max-w-48 truncate text-sm font-medium sm:inline">{nombreUsuario}</span>
          <KeyboardArrowDownIcon fontSize="small" />
        </Button>

        <Menu
          disableScrollLock
          anchorEl={anchorEl}
          open={userMenuOpen}
          onClose={closeUserMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { mt: 0.5, minWidth: 180 } } }}
        >
          <MenuItem onClick={handleVerPerfil}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            Ver perfil
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogoutDesdeMenu} sx={{ color: 'error.main' }}>
            <ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon fontSize="small" /></ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </header>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}