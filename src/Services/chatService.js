import api from './api';

// Un mensaje llega como { id, texto, fecha, propio, emisor: {id, nombre} }
// "propio" ya viene calculado para quien consulta (true = a la derecha, en azul).
// Lo usan el estudiante y el asesor: es la misma ruta para los dos.

// GET /asesorias/{id}/mensajes
// Regresa { mensajes, leidosHasta }.
// Sin despuesDe: la conversación completa (máx. 300, del más viejo al más nuevo).
// Con despuesDe (id del último mensaje que ya tienes): solo los más nuevos.
export const traerMensajes = async (asesoriaId, despuesDe = null) => {
  const { data } = await api.get(`/asesorias/${asesoriaId}/mensajes`, {
    params: { despues_de: despuesDe ?? undefined },
  });
  // leidosHasta: id del último mensaje PROPIO que la otra persona ya leyó (0 si ninguno).
  // Todo mensaje propio con id menor o igual a ese número lleva la palomita doble.
  return { mensajes: data.data, leidosHasta: data.meta?.leidos_hasta ?? 0 };
};

// POST /asesorias/{id}/mensajes. Responde 201 con el mensaje creado.
// 409 asesoria_no_en_curso si la asesoría ya se cerró.
export const enviarMensaje = async (asesoriaId, mensaje) => {
  const { data } = await api.post(`/asesorias/${asesoriaId}/mensajes`, { mensaje });
  return data.data;
};

// POST /asesorias/{id}/mensajes/leidos. Marca como leídos los de la otra persona.
// Responde { marcados: n }
export const marcarLeidos = async (asesoriaId) => {
  const { data } = await api.post(`/asesorias/${asesoriaId}/mensajes/leidos`);
  return data.marcados;
};
