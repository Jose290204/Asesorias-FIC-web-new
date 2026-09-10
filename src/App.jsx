import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';

// vistas 
import Login from './pages/Login';

// Vistas del Dashboard admin
import AsesoresDisci from './pages/admin/AsesoresDisci';
import AsesoresPar from './pages/admin/AsesoresPar';
import Asesorias from './pages/admin/Asesorias';
import Catalogos from './pages/admin/Catalogos';
import Estudiantes from './pages/admin/Estudiantes';
import Reportes from './pages/admin/Reportes';
import Solicitudes from './pages/admin/Solicitudes';

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