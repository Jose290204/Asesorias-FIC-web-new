import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import fondoInicio from './assets/fondo_inicio.jpeg';
import { useAuth } from './context/AuthContext';
import AdminLayout from './layouts/moduloTutorias/AdminLayout';
import AsesorLayout from './layouts/moduloTutorias/AsesorLayout';
import EstudianteLayout from './layouts/moduloTutorias/EstudianteLayout';

import SkeletonApp from './components/ui/SkeletonApp';

// vistas
import Login from './modules/auth/view/Login';
import RecuperarContrasena from './modules/auth/view/RecuperarContrasena';

// Vistas del Dashboard admin
import Conocenos from './modules/paginasInicio/Conocenos';
import AsesoresDisciplinares from './modules/tutorias/rolAdministrador/views/AsesoresDisciplinares';
import AsesoresPar from './modules/tutorias/rolAdministrador/views/AsesoresPar';
import Asesorias from './modules/tutorias/rolAdministrador/views/Asesorias';
import Catalogos from './modules/tutorias/rolAdministrador/views/Catalogos';
import Estudiantes from './modules/tutorias/rolAdministrador/views/Estudiantes';
import PerfilAdministrador from './modules/tutorias/rolAdministrador/views/PerfilAdministrador';
import Reportes from './modules/tutorias/rolAdministrador/views/Reportes';
import Solicitudes from './modules/tutorias/rolAdministrador/views/Solicitudes';

// Vistas de asesor
import AsesoriasEnCurso from './modules/tutorias/rolAsesor/views/AsesoriasEnCurso';
import DisponibilidadAsesor from './modules/tutorias/rolAsesor/views/DisponibilidadAsesor';
import HistorialAsesorias from './modules/tutorias/rolAsesor/views/HistorialAsesorias';
import PerfilAsesor from './modules/tutorias/rolAsesor/views/PerfilAsesor';
import SolicitudesPendientes from './modules/tutorias/rolAsesor/views/SolicitudesPendientes';

// Vistas de Estudiante
import AsesoriasEstudiante from './modules/tutorias/rolEstudiante/views/AsesoriasEstudiante';
import HistorialAsesoriasEstudiante from './modules/tutorias/rolEstudiante/views/HistorialAsesoriasEstudiante';
import PerfilEstudiante from './modules/tutorias/rolEstudiante/views/PerfilEstudiante';
import SolicitarAsesoria from './modules/tutorias/rolEstudiante/views/SolicitarAsesoria';
import SolicitudesEnRevision from './modules/tutorias/rolEstudiante/views/SolicitudesEnRevision';

const precargaFondoLogin = new Image();
precargaFondoLogin.src = fondoInicio;
// IDs `roles`
const ROLES_ADMIN = [1, 2];
const ROLES_ASESOR = [3];
const ROL_ESTUDIANTE = 4;

// Decide a qué pantalla mandar según el rol. Va directo a la vista final:
// si apuntara al layout, se haría una segunda redirección (la del "index") y se vería un destello.
function getRutaPorRol(rol) {
  if (ROLES_ADMIN.includes(rol)) return '/admin/asesorias';
  if (ROLES_ASESOR.includes(rol)) return '/tutorias/asesor/solicitudes-pendientes';
  if (rol === ROL_ESTUDIANTE) return '/tutorias/estudiante/solicitar-asesorias';
  return '/';
}

export default function App() {
  const { usuario, rol, loading } = useAuth();

 if (loading && localStorage.getItem('_uix')) {
    return <SkeletonApp />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={usuario ? <Navigate to={getRutaPorRol(rol)} replace /> : <Login />}
        />

        {/* Ruta pública */}
        <Route path="/conocenos" element={<Conocenos />} />

        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />

        {/* Rutas del Administrador */}
        <Route
          path="/admin"
          element={
            usuario && ROLES_ADMIN.includes(rol)
              ? <AdminLayout />
              : <Navigate to="/" replace />
          }
        >
          <Route index element={<Navigate to="/admin/asesorias" replace />} />
          <Route path="asesorias" element={<Asesorias />} />
          <Route path="solicitudes" element={<Solicitudes />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="estudiantes" element={<Estudiantes />} />
          <Route path="asesores-disciplinares" element={<AsesoresDisciplinares />} />
          <Route path="asesores-par" element={<AsesoresPar />} />
          <Route path="catalogos" element={<Catalogos />} />
          <Route path="perfil-administrador" element={<PerfilAdministrador />} />
        </Route>

        {/* Rutas de Asesor (disciplinar y par comparten layout) */}
        <Route
          path="/tutorias/asesor"
          element={
            usuario && ROLES_ASESOR.includes(rol)
              ? <AsesorLayout />
              : <Navigate to="/" replace />
          }
        >
          <Route index element={<Navigate to="/tutorias/asesor/solicitudes-pendientes" replace />} />
          <Route path="solicitudes-pendientes" element={<SolicitudesPendientes />} />
          <Route path="disponibilidad" element={<DisponibilidadAsesor />} />
          <Route path="asesorias-en-curso" element={<AsesoriasEnCurso />} />
          <Route path="historial-de-asesorias" element={<HistorialAsesorias />} />
          <Route path="perfil-asesor" element={<PerfilAsesor />} />
        </Route>

        {/* Rutas de Estudiante */}
        <Route
          path="/tutorias/estudiante"
          element={
            usuario && rol === ROL_ESTUDIANTE
              ? <EstudianteLayout />
              : <Navigate to="/" replace />
          }
        >
          <Route index element={<Navigate to="/tutorias/estudiante/solicitar-asesorias" replace />} />
          <Route path="solicitar-asesorias" element={<SolicitarAsesoria />} />
          <Route path="asesorias-estudiante" element={<AsesoriasEstudiante />} />
          <Route path="solicitudes-en-revision" element={<SolicitudesEnRevision />} />
          <Route path="historial-de-asesorias" element={<HistorialAsesoriasEstudiante />} />
          <Route path="perfil-estudiante" element={<PerfilEstudiante />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}