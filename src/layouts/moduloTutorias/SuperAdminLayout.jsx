import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Button, Drawer, IconButton } from '@mui/material';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import LogoAsesorias from '../../assets/logo_asesorias.png';
import BarraContexto from '../../components/navigation/moduloTutorias/BarraContexto';
import SuperAdminSidebar from '../../components/navigation/moduloTutorias/SuperAdminSidebar';
import MenuUsuario from '../../components/navigation/moduloTutorias/MenuUsuario';
import { useAuth } from '../../context/AuthContext';
import { CatalogosProvider } from '../../context/CatalogosContext';
import { CLASES_FONDO_CONTENIDO, FONDO_CONTENIDO } from './fondoContenido';

const RUTA_PERFIL = '/superadmin/perfil';
const RUTA_INICIO = '/superadmin/facultades';

// Panel principal del super admin. Misma estructura que los demás roles:
// escritorio = menú lateral fijo + franja superior; celular = cabecera + cajón.
// El super admin solo ve el panel de una facultad cuando "entra" a ella desde Facultades.
export default function SuperAdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout, usuario } = useAuth();

  // El drawer está abierto solo mientras estés en la ruta donde se abrió
  const [openPath, setOpenPath] = useState(null);
  const open = openPath === pathname;
  const closeDrawer = () => setOpenPath(null);

  // Menú del usuario (arriba a la derecha, solo en celular)
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
        slotProps={{ paper: { sx: { bgcolor: 'transparent', boxShadow: 'none' } } }}
      >
        <SuperAdminSidebar />
      </Drawer>

      {/* Escritorio (lg en adelante): el menú siempre visible, pegado a la izquierda */}
      <div className="sticky top-0 hidden h-dvh shrink-0 self-start lg:block">
        <SuperAdminSidebar />
      </div>

      {/* Columna derecha: franja superior (escritorio) o cabecera (celular) + contenido */}
      <div className="flex min-w-0 flex-1 flex-col">
        <BarraContexto />

        <header className="lg:hidden sticky top-0 z-10 flex items-center gap-2 border-b border-[#d4b03c]/50 bg-[linear-gradient(180deg,#2a529b_0%,#244B91_55%,#162f66_100%)] px-3 py-2 text-white shadow-[0_4px_18px_rgba(0,0,0,0.25),0_1px_0_rgba(212,176,60,0.45)]">
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
            sx={{ textTransform: 'none', gap: 1, px: 1, minWidth: 0 }}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5">
            <img src={LogoAsesorias} alt="Logo Asesorías FIC" className="h-full w-full rounded-full object-contain" />
          </span>
            <span className="font-semibold">Asesorías FIC</span>
          </Button>

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
