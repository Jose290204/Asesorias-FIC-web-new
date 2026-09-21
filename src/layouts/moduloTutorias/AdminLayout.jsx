import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/navigation/moduloTutorias/AdminSidebar';
import { useAuth } from '../../context/AuthContext';


export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#244B91] justify-center items-center pr-2">
      {/* El Sidebar ahora gestiona su propia navegación y estado activo */}
      <AdminSidebar onLogout={handleLogout} />
      
      <main className="flex-1 overflow-y-auto">
        {/* Aquí se renderiza la subruta activa según la URL */}
        <Outlet />
      </main>
    </div>
  );
}