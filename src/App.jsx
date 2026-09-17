import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';

// vistas 
import Login from './modules/auth/view/Login';

// Vistas del Dashboard admin
import AsesoresDisciplinares from './modules/tutorias/rolAdministrador/views/AsesoresDisciplinares';
import AsesoresPar from './modules/tutorias/rolAdministrador/views/AsesoresPar';
import Asesorias from './modules/tutorias/rolAdministrador/views/Asesorias';
import Catalogos from './modules/tutorias/rolAdministrador/views/Catalogos';
import Estudiantes from './modules/tutorias/rolAdministrador/views/Estudiantes';
import Reportes from './modules/tutorias/rolAdministrador/views/Reportes';
import Solicitudes from './modules/tutorias/rolAdministrador/views/Solicitudes';
import PerfilAdministrador from './modules/tutorias/rolAdministrador/views/PerfilAdministrador';
import Conocenos from './modules/paginasInicio/Conocenos';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta del Login */}
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/conocenos" element={<Conocenos />}/>

        {/* Rutas del Administrador protegidas */}
        <Route 
          path="/admin" 
          element={isAuthenticated ? <AdminLayout setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
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
          <Route path="perfil-administrador" element={<PerfilAdministrador/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}