import axios from 'axios';

// Creamos una instancia centralizada para no repetir la URL base en cada petición
const api = axios.create({
  baseURL: 'http://localhost:3000/usuarios', // Ajusta según el puerto de tu backend Node.js
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: actua como un filtro de salida
api.interceptors.request.use(
  (config) => {
    // 1. Busca el token guardado en el navegador
    const token = localStorage.getItem('token');

    // 2. Si existe, lo adjunta automáticamente a las cabeceras HTTP de la petición
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;