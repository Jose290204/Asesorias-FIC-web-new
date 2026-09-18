import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AdminLayout from './layouts/AdminLayout';

// vistas
import Login from './modules/auth/view/Login';

// Vistas del Dashboard admin
import AsesoresDisciplinares from './modules/tutorias/rolAdministrador/views/AsesoresDisciplinares';
import AsesoresPar from './modules/tutorias/rolAdministrador/views/AsesoresPar';
import Asesorias from './modules/tutorias/rolAdministrador/views/Asesorias';
import Catalogos from './modules/tutorias/rolAdministrador/views/Catalogos';
import Estudiantes from './modules/tutorias/rolAdministrador/views/Estudiantes';
import PerfilAdministrador from './modules/tutorias/rolAdministrador/views/PerfilAdministrador';
import Reportes from './modules/tutorias/rolAdministrador/views/Reportes';
import Solicitudes from './modules/tutorias/rolAdministrador/views/Solicitudes';

export default function App() {
  const { token, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // o un spinner más bonito
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta del Login */}
        <Route
          path="/"
          element={token ? <Navigate to="/admin" replace /> : <Login />}
        />

        {/* Rutas del Administrador protegidas */}
        <Route
          path="/admin"
          element={token ? <AdminLayout /> : <Navigate to="/" replace />}
        >
          {/* Redirección por defecto */}
          <Route index element={<Navigate to="/admin/asesorias" replace />} />

          {/* Subrutas */}
          <Route path="asesorias" element={<Asesorias />} />
          <Route path="solicitudes" element={<Solicitudes />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="estudiantes" element={<Estudiantes />} />
          <Route path="asesores-disciplinares" element={<AsesoresDisciplinares />} />
          <Route path="asesores-par" element={<AsesoresPar />} />
          <Route path="catalogos" element={<Catalogos />} />
          <Route path="perfil-administrador" element={<PerfilAdministrador />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}