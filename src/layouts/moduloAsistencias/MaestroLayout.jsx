import { Outlet, useNavigate } from 'react-router-dom';
import MaestroSidebar from '../../components/navigation/moduloAsistencias/MaestroSidbar';

export default function MaestroLayout({ setIsAuthenticated }) {

    const navigate = useNavigate();

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/', { replace: true });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* El Sidebar ahora gestiona su propia navegación y estado activo */}
            <MaestroSidebar onLogout={handleLogout} />

            <main className="flex-1 p-6 overflow-y-auto">
                {/* Aquí se renderiza la subruta activa según la URL */}
                <Outlet />
            </main>
        </div>
    );

}