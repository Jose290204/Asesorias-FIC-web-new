import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';

// vistas 
import Login from './modules/auth/view/Login';

// Vistas del Dashboard admin
import AsesoresDisci from './modules/tutorias/rolAdministrador/views/AsesoresDisci';
import AsesoresPar from './modules/tutorias/rolAdministrador/views/AsesoresPar';
import Asesorias from './modules/tutorias/rolAdministrador/views/Asesorias';
import Catalogos from './modules/tutorias/rolAdministrador/views/Catalogos';
import Estudiantes from './modules/tutorias/rolAdministrador/views/Estudiantes';
import Reportes from './modules/tutorias/rolAdministrador/views/Reportes';
import Solicitudes from './modules/tutorias/rolAdministrador/views/Solicitudes';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta del Login */}
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

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
          <Route path="asesores-disciplinares" element={<AsesoresDisci />} />
          <Route path="asesores-par" element={<AsesoresPar />} />
          <Route path="catalogos" element={<Catalogos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}