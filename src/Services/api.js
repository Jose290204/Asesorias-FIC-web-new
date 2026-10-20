import axios from 'axios';

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

    if (error.response?.status === 401 && !esDeSesion) {
      window.dispatchEvent(new Event('sesion-expirada'));
    }

    return Promise.reject(error);
  }
);

export default api;