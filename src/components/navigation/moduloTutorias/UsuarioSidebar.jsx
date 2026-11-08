import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// Bloque del fondo del menú lateral (solo escritorio): botón de perfil (ícono + nombre) y cerrar sesión.
// En celular esto sigue viviendo en el menú de usuario de la cabecera.
export default function UsuarioSidebar({ rutaPerfil }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { usuario, logout } = useAuth();

  const nombre = usuario?.nombre ?? '';
  const enPerfil = pathname.startsWith(rutaPerfil);

  return (
    <div className="mt-4 space-y-1.5 border-t border-blue-300/30 px-3 pb-4 pt-3">
      <button
        type="button"
        onClick={() => navigate(rutaPerfil, { replace: true })}
        title="Ver perfil"
        className={`flex w-full cursor-pointer items-center gap-3 rounded-[5px] px-3 py-2.5 text-sm font-medium transition-all duration-200 ${enPerfil
          ? 'bg-white text-[#122a88] shadow-md font-semibold'
          : 'text-blue-100 hover:bg-blue-900/50 hover:text-white'
          }`}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: '#EBD9B4', color: '#8A6D2B', fontSize: 16, fontWeight: 'bold' }}>
          {nombre ? nombre.charAt(0).toUpperCase() : ''}
        </Avatar>
        <span className="truncate">{nombre}</span>
      </button>

      <button
        type="button"
        onClick={logout}
        className="flex w-full cursor-pointer items-center gap-3 rounded-[5px] px-3 py-3 text-sm font-medium text-red-200 transition-all duration-200 hover:bg-red-900/40 hover:text-white"
      >
        <LogoutIcon fontSize="small" />
        <span>Cerrar sesión</span>
      </button>
    </div>
  );
}
