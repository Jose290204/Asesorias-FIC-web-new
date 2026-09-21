import { Outlet, useNavigate } from 'react-router-dom';
import AsesorSidebar from '../../components/navigation/moduloTutorias/AsesorSidebar';
import { useAuth } from '../../context/AuthContext';

export default function AsesorLayout() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#244B91] pr-2">
      {/* El Sidebar ahora gestiona su propia navegación y estado activo */}
      <AsesorSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Aquí se renderiza la subruta activa según la URL */}
        <Outlet />
      </main>
    </div>
  );
}