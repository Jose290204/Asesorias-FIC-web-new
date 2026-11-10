import axios from 'axios';
import { leerFacultadActiva } from './facultadActiva';

// Sin VITE_API_URL las peticiones van al mismo origen del front ('/api/v1/...')
// y el proxy de Vite las reenvía a Laravel.
// (La app de Capacitor sí tendrá que definirla: ahí no existe el proxy.)
const BASE = import.meta.env.VITE_API_URL ?? '';

const api = axios.create({
  baseURL: `${BASE}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // manda y recibe la cookie de sesión
  withXSRFToken: true,   // lee XSRF-TOKEN y lo manda como header X-XSRF-TOKEN
});

// Si el super admin está dentro del panel de una facultad, todas las peticiones llevan
// su id en X-Facultad-Id. El backend lo valida y solo lo respeta para el super admin.
api.interceptors.request.use((config) => {
  const facultad = leerFacultadActiva();
  if (facultad?.id) config.headers['X-Facultad-Id'] = facultad.id;
  return config;
});

// Se llama UNA vez antes del login. Esta ruta NO lleva /api/v1: la define Sanctum.
export const pedirCookieCsrf = () =>
  axios.get(`${BASE}/sanctum/csrf-cookie`, { withCredentials: true });

// Un 401 en cualquier petición (menos login y /auth/me) = la sesión expiró a media app.
// Se avisa para que AuthContext regrese al login.
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const url = error.config?.url ?? '';
    const esDeSesion = url.includes('/auth/login') || url.includes('/auth/me');

    const estatus = error.response?.status;
    const codigo = error.response?.data?.codigo;

    if (estatus === 401 && !esDeSesion) {
      window.dispatchEvent(new Event('sesion-expirada'));
    }

    // La facultad en la que trabajaba el super admin ya no sirve (se desactivó o no existe):
    // se avisa para que FacultadActivaContext la olvide y las guardas lo regresen a /superadmin
    if (
      estatus === 422 &&
      (codigo === 'facultad_invalida' || codigo === 'facultad_requerida') &&
      leerFacultadActiva()
    ) {
      window.dispatchEvent(new Event('facultad-invalida'));
    }

    // La facultad del usuario se desactivó con su sesión abierta: se cierra la sesión del front
    if (estatus === 403 && codigo === 'facultad_inactiva' && !esDeSesion) {
      window.dispatchEvent(new Event('sesion-expirada'));
    }

    return Promise.reject(error);
  }
);

export default api;