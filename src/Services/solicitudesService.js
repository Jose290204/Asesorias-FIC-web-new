// src/Services/solicitudesService.js
import api from './api';

// Convierte una fecha en formato ISO (como viene de la base de datos: "2026-10-10T00:00:00.000Z")
// al formato DD/MM/YYYY que espera el validador de Joi en el backend.
function convertirFechaParaBackend(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

export const solicitudesService = {

    // Trae todas las solicitudes desde el backend.
    // "filtros" es opcional: permite mandar query params, por ejemplo
    // { id_asesor: 2 } para traer solo las solicitudes de un asesor específico
    // (esto arma la URL como /solicitudes?id_asesor=2).
    obtenerTodas: async (filtros = {}) => {
        const response = await api.get('/solicitudes', { params: filtros });
        return response.data;
    },

    // Acepta una solicitud existente. Recibe el objeto completo de la solicitud
    // (tal como viene de la tabla/lista en el frontend), arma el body que el
    // backend necesita para crear la asesoría, convierte la fecha al formato
    // correcto, y manda el PATCH a /solicitudes/:id.
    // Internamente, el backend cambia el estatus de la solicitud a "Aceptada"
    // Y crea la asesoría nueva, todo en una sola transacción.
    aceptar: async (solicitud) => {
        const body = {
            id_estudiante: solicitud.id_estudiante,
            id_asesor: solicitud.id_asesor,
            id_materia: solicitud.id_materia,
            id_modalidad: solicitud.id_modalidad,
            fecha_inicio: convertirFechaParaBackend(solicitud.fecha_inicio),
            id_razon: solicitud.id_razon,
            sesiones_tomadas: 0,
            observaciones: solicitud.nota_estudiante || '',
            id_horario: solicitud.id_horario
        };
        const response = await api.patch(`/solicitudes/${solicitud.id_solicitud}`, body);
        return response.data;
    },

    // Rechaza una solicitud, mandando el id de la solicitud y la razón
    // del rechazo (texto libre que el asesor escribe). El backend guarda
    // esa razón en el campo "explicacion_asesor" y cambia el estatus a "Rechazada".
    rechazar: async (id_solicitud, razon) => {
        const response = await api.post(`/solicitudes/${id_solicitud}`, { razon });
        return response.data;
    },

    // Crea una nueva solicitud desde cero (la usa el estudiante cuando
    // pide una asesoría por primera vez). Recibe el objeto con todos
    // los datos necesarios y los manda tal cual al backend.
    crear: async (datosSolicitud) => {
        const response = await api.post('/solicitudes', datosSolicitud);
        return response.data;
    }
};