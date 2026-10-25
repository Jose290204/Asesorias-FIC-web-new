import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Button, Divider, Drawer, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import LogoUas from '../../assets/logo_uas.png';
import AsesorSidebar from '../../components/navigation/moduloTutorias/AsesorSidebar';
import { useAuth } from '../../context/AuthContext';
import { CatalogosProvider } from '../../context/CatalogosContext';

// Misma ruta que usa "Perfil" en el sidebar
const RUTA_PERFIL = '/tutorias/asesor/perfil-asesor';
// Pantalla de inicio del asesor (el logo lleva aquí)
const RUTA_INICIO = '/tutorias/asesor/solicitudes-pendientes';

export default function AsesorLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout, usuario } = useAuth();

  // El drawer está abierto solo mientras estés en la ruta donde se abrió
  const [openPath, setOpenPath] = useState(null);
  const open = openPath === pathname;
  const closeDrawer = () => setOpenPath(null);

  // Menú del usuario (arriba a la derecha)
  const [anchorEl, setAnchorEl] = useState(null);
  const userMenuOpen = Boolean(anchorEl);
  const closeUserMenu = () => setAnchorEl(null);

  // El nombre sale de la sesión (/auth/me)
  const nombreUsuario = usuario?.nombre ?? 'Asesor';

  const handleLogout = () => {
    logout();
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
    // así todos los componentes hijos (Outlet) pueden usar useCatalogos()
    <CatalogosProvider>
    <div className="flex min-h-dvh flex-col bg-[#244B91]">
      <Drawer
        open={open}
        onClose={closeDrawer}
        slotProps={{ paper: { sx: { bgcolor: 'transparent', boxShadow: 'none' } } }}
      >
        <AsesorSidebar mobile />
      </Drawer>

      <header className="sticky top-0 z-10 flex items-center gap-2 bg-[#244B91] px-3 py-2 text-white">
        <IconButton
          color="inherit"
          onClick={() => setOpenPath(pathname)}
          aria-label="Abrir menú"
        >
          <MenuIcon />
        </IconButton>
        <Button
          color="inherit"
          onClick={() => navigate(RUTA_INICIO)}
          sx={{ textTransform: 'none', gap: 1, px: 1, minWidth: 0 }}
        >
          <img src={LogoUas} alt="Logo UAS" className="h-8 w-auto object-contain" />
          <span className="font-semibold">Asesorías FIC</span>
        </Button>

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

      <main className="min-w-0 flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
    </CatalogosProvider>
  );
}