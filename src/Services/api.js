import axios from 'axios';

// Creamos una instancia centralizada para no repetir la URL base en cada petición
const api = axios.create({
  baseURL: 'http://localhost:3000', // Ajusta según el puerto de tu backend Node.js
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // NUEVO: le dice a axios que mande y reciba cookies en cada petición
});

export default api;