import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/navigation/moduloTutorias/AdminSidebar';


export default function AdminLayout({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* El Sidebar ahora gestiona su propia navegación y estado activo */}
      <AdminSidebar onLogout={handleLogout} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Aquí se renderiza la subruta activa según la URL */}
        <Outlet />
      </main>
    </div>
  );
}