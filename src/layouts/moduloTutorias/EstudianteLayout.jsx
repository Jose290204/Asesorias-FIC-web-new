import { Outlet, useNavigate } from 'react-router-dom';
import EstudianteSidebar from '../../components/navigation/moduloTutorias/EstudianteSidbar';
import { useAuth } from '../../context/AuthContext';

export default function EstudianteLayout() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* El Sidebar ahora gestiona su propia navegación y estado activo */}
      <EstudianteSidebar onLogout={handleLogout} />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Aquí se renderiza la subruta activa según la URL */}
        <Outlet />
      </main>
    </div>
  );
}