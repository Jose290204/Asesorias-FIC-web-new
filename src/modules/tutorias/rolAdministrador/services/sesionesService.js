// rolAdministrador/services/sesionesService.js
import api from '../../../../Services/api';
// Adapta una sesión del backend a la forma que usa la UI
const adaptarSesion = (item) => ({
    id: item.id, // con prefijo: "web-..." (sesión del navegador) o "app-..." (token de la app)
    tipo: item.tipo,
    usuarioId: item.usuario_id,
    nombre: item.nombre,
    correo: item.correo,
    rol: item.rol,
    dispositivo: item.dispositivo,
    ip: item.ip,
    inicioSesion: item.inicio_sesion,
    ultimaActividad: item.ultima_actividad,
    esActual: Boolean(item.es_actual)
});

export const sesionesService = {
    // Lista de sesiones activas de todos los usuarios
    obtenerSesiones: async () => {
        const response = await api.get('/admin/conexiones');
        return response.data.data.map(adaptarSesion);
    },

    // Cierra una sesión (revoca la sesión o el token en el backend)
    cerrarSesion: async (id) => {
        await api.delete(`/admin/conexiones/${id}`);
    }
};