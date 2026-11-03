// rolAdministrador/services/sesionesService.js
import api from '../../../../Services/api';
import { SESIONES_ADMIN_PRUEBA, USAR_DATOS_PRUEBA_ADMIN } from '../datosPrueba';

// Copia local de las sesiones de prueba para que cerrar una se refleje al recargar la lista
let sesionesPrueba = [...SESIONES_ADMIN_PRUEBA];

// Adapta una sesión del backend a la forma que usa la UI
const adaptarSesion = (item) => ({
    id: item.id,
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
        if (USAR_DATOS_PRUEBA_ADMIN) return sesionesPrueba.map(adaptarSesion);

        // TODO: confirmar la ruta y el formato cuando exista el endpoint de admin en el backend
        const response = await api.get('/admin/sesiones');
        return response.data.data.map(adaptarSesion);
    },

    // Cierra una sesión (revoca la sesión o el token en el backend)
    cerrarSesion: async (id) => {
        if (USAR_DATOS_PRUEBA_ADMIN) {
            sesionesPrueba = sesionesPrueba.filter((item) => item.id !== id);
            return;
        }

        // TODO: confirmar la ruta cuando exista el endpoint de admin en el backend
        await api.delete(`/admin/sesiones/${id}`);
    }
};