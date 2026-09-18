import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// VISTAS GLOBALES
import Login from './modules/auth/view/Login';
import SeleccionModulo from './modules/seleccionModulo/views/SeleccionModulo';

// MODULO DE TUTORIAS

// Layouts
// Rol Adminstrador
import AdminLayout from './layouts/moduloTutorias/AdminLayout';
// Rol Asesor

// Rol Estudiantes

// Vistas de admnistrador
import AsesoresDisciplinares from './modules/tutorias/rolAdministrador/views/AsesoresDisciplinares';
import AsesoresPar from './modules/tutorias/rolAdministrador/views/AsesoresPar';
import Asesorias from './modules/tutorias/rolAdministrador/views/Asesorias';
import Catalogos from './modules/tutorias/rolAdministrador/views/Catalogos';
import Estudiantes from './modules/tutorias/rolAdministrador/views/Estudiantes';
import Reportes from './modules/tutorias/rolAdministrador/views/Reportes';
import Solicitudes from './modules/tutorias/rolAdministrador/views/Solicitudes';
import PerfilAdministrador from './modules/tutorias/rolAdministrador/views/PerfilAdministrador';

//Vistas de asesor
import SolicitudesPendientes from './modules/tutorias/rolAsesor/views/SolicitudesPendientes'
import AsesoriasEnCurso from './modules/tutorias/rolAsesor/views/AsesoriasEnCurso';
import HistorialAsesorias from './modules/tutorias/rolAsesor/views/HistorialAsesorias';
import PerfilAsesor from './modules/tutorias/rolAsesor/views/PerfilAsesor';

// MODULO ASISTENCIAS

// Layouts
// Rol Maestro
// Aqui el adminstrador de la pagina del checador en el rol de maestro
import MaestroLayout from './layouts/moduloAsistencias/MaestroLayout';

// Vistas de maestro
//Aqui van todas las rutas que se necesitaran para la vista de maestro (las que estaran en el sidebar)
import Asistencias from './modules/asistencias/rolMaestro/views/Asistencia';
import Alumnos from './modules/asistencias/rolMaestro/views/Alumnos';
import PerfilMaestro from './modules/asistencias/rolMaestro/views/PerfilMaestro'
import AsesorLayout from './layouts/moduloTutorias/AsesorLayout';


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState('admin'); //Este es temporal, (admin, estudiante, asesor, maestro)

  return (
    <BrowserRouter>
      <Routes>

        {/* ------------------------ GLOBALES ------------------------*/}

        {/* Ruta del Login */}
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />

        {/* Seleccion de modulo */}
        <Route
          path="/seleccion-modulo"
          element={isAuthenticated ? <SeleccionModulo userRole={userRole} /> : <Navigate to="/" />}
        />

        {/* ------------------------ MOUDLO DE TUTORIAS ------------------------*/}
        {/* -----------------RUTAS DE ADMIN, ESTUDIANTE, ASESOR ----------------*/}

        {/* RUTAS DE ADMINISTRADOR protegidas */}
        <Route
          path="/tutorias/admin"
          element={isAuthenticated && userRole === 'admin' ? <AdminLayout setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
        >

          {/* Redirección por defecto DE ADMIN*/}
          <Route index element={<Navigate to="/tutorias/admin/asesorias" replace />} />

          {/* Subrutas DE ADMIN*/}
          <Route path="asesorias" element={<Asesorias />} />
          <Route path="solicitudes" element={<Solicitudes />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="estudiantes" element={<Estudiantes />} />
          <Route path="asesores-disciplinares" element={<AsesoresDisciplinares />} />
          <Route path="asesores-par" element={<AsesoresPar />} />
          <Route path="catalogos" element={<Catalogos />} />
          <Route path="perfil-administrador" element={<PerfilAdministrador />} />
        </Route>

        {/* RUTAS DE ASESOR */}

        <Route
          path="/tutorias/asesor"
          element={isAuthenticated && userRole === 'asesor' ? <AsesorLayout setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
        >

          {/* Redirección por defecto DE ADMIN*/}
          <Route index element={<Navigate to="/tutorias/asesor/solicitudes-pendientes" replace />} />

          {/* Subrutas DE ASESOR*/}
          <Route path="solicitudes-pendientes" element={<SolicitudesPendientes />} />
          <Route path="asesorias-en-curso" element={<AsesoriasEnCurso />} />
          <Route path="historial-de-asesorias" element={<HistorialAsesorias />} />
          <Route path="perfil-asesor" element={<PerfilAsesor />} />
          

        </Route>

        {/* RUATAS DE ESTUDIANTE */}

        {/* ------------------------ MOUDLO DE aSISTENCIAS ------------------------*/}
        {/* -------------------RUTAS DE ADMIN, ESTUDIANTE, ASESOR -----------------*/}
        <Route
          path="/asistencias/maestro"
          element={isAuthenticated && userRole === 'asesor' ? <MaestroLayout setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
        >

          {/* Redirección por defecto DE ADMIN*/}
          <Route index element={<Navigate to="/asistencias/maestro/asistencias" replace />} />

          <Route path="asistencias" element={<Asistencias/>}/>
          <Route path="alumnos" element={<Alumnos/>}/>
          <Route path="perfil-maestro" element={<PerfilMaestro />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}