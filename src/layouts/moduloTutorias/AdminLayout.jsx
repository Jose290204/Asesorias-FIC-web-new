import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Button, Drawer, IconButton } from '@mui/material';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import LogoAsesorias from '../../assets/logo_asesorias.png';
import AdminSidebar from '../../components/navigation/moduloTutorias/AdminSidebar';
import BarraFacultadActiva from '../../components/navigation/moduloTutorias/BarraFacultadActiva';
import BarraContexto from '../../components/navigation/moduloTutorias/BarraContexto';
import MenuUsuario from '../../components/navigation/moduloTutorias/MenuUsuario';
import { useAuth } from '../../context/AuthContext';
import { CatalogosProvider } from '../../context/CatalogosContext';
import { CLASES_FONDO_CONTENIDO, FONDO_CONTENIDO } from './fondoContenido';

const RUTA_PERFIL = '/admin/perfil-administrador';
const RUTA_INICIO = '/admin/asesorias';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout, usuario } = useAuth();

  // El drawer está abierto solo mientras estés en la ruta donde se abrió
  const [openPath, setOpenPath] = useState(null);
  const open = openPath === pathname;
  const closeDrawer = () => setOpenPath(null);

  // Al cambiar de ruta se olvida el drawer abierto: si no, al volver a la ruta donde se abrió
  // (p. ej. tocando "Asesorías FIC") el menú reaparecería solo.
  const [pathPrevio, setPathPrevio] = useState(pathname);
  if (pathPrevio !== pathname) {
    setPathPrevio(pathname);
    setOpenPath(null);
  }

  // Menú del usuario (arriba a la derecha)
  const [anchorEl, setAnchorEl] = useState(null);
  const userMenuOpen = Boolean(anchorEl);
  const closeUserMenu = () => setAnchorEl(null);

  const nombreUsuario = usuario?.nombre ?? '';

  const handleVerPerfil = () => {
    closeUserMenu();
    navigate(RUTA_PERFIL, { replace: true });
  };

  const handleLogoutDesdeMenu = () => {
    closeUserMenu();
    logout();
  };

  return (
    <div className="flex min-h-dvh bg-gray-100 lg:bg-[#244B91]">
      <Drawer
        open={open}
        onClose={closeDrawer}
        sx={{ display: { lg: 'none' } }}
        PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}
      >
        <AdminSidebar />
      </Drawer>

      {/* Escritorio (lg en adelante): el menú siempre visible, pegado a la izquierda */}
      <div className="sticky top-0 hidden h-dvh shrink-0 self-start lg:block">
        <AdminSidebar />
      </div>

      {/* Columna derecha: cabecera + contenido */}
      <div className="flex min-w-0 flex-1 flex-col">

      {/* La barra de facultad activa solo se ve si quien entra es el super admin */}
      <div className="sticky top-0 z-10">
      <BarraFacultadActiva />
      <BarraContexto />
      <header className="lg:hidden flex items-center gap-2 border-b border-[#d4b03c]/50 bg-[linear-gradient(180deg,#2a529b_0%,#244B91_55%,#162f66_100%)] px-3 py-2 text-white shadow-[0_4px_18px_rgba(0,0,0,0.25),0_1px_0_rgba(212,176,60,0.45)]">
        <IconButton
          color="inherit"
          onClick={() => setOpenPath(pathname)}
          aria-label="Abrir menú"
          sx={{ display: { lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Button
          color="inherit"
          onClick={() => navigate(RUTA_INICIO)}
          sx={{ textTransform: 'none', gap: 1, px: 1, minWidth: 0, display: { xs: 'inline-flex', lg: 'none' } }}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5">
            <img src={LogoAsesorias} alt="Logo Asesorías FIC" className="h-full w-full rounded-full object-contain" />
          </span>
          <span className="font-semibold">Asesorías FIC</span>
        </Button>

        {/* Empuja el usuario a la derecha */}
        <div className="flex-1" />

        <Button
          color="inherit"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="Menú de usuario"
          aria-haspopup="true"
          aria-expanded={userMenuOpen ? 'true' : undefined}
          sx={{ textTransform: 'none', gap: 1, minWidth: 0, px: 1, mr: { xs: 0.5, sm: 2, md: 4 } }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#EBD9B4', color: '#8A6D2B', fontSize: 16, fontWeight: 'bold' }}>
            {nombreUsuario ? nombreUsuario.charAt(0).toUpperCase() : ''}
          </Avatar>
          <span className="hidden max-w-48 truncate text-sm font-medium sm:inline">{nombreUsuario}</span>
          <KeyboardArrowDownIcon fontSize="small" />
        </Button>

        <MenuUsuario
          anchorEl={anchorEl}
          onClose={closeUserMenu}
          nombre={nombreUsuario}
          correo={usuario?.correo}
          onVerPerfil={handleVerPerfil}
          onLogout={handleLogoutDesdeMenu}
        />
      </header>
      </div>

      <main
        className={`min-w-0 flex-1 ${CLASES_FONDO_CONTENIDO}`}
        style={{ backgroundImage: FONDO_CONTENIDO }}
      >
        <CatalogosProvider>
          <Outlet />
        </CatalogosProvider>
      </main>
      </div>
    </div>
  );
}