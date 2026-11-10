import api from './api';

// GET /asesorias/{id}/sesiones (sin paginar, la más reciente primero)
// Regresa [{ id, fecha, horario: {id, etiqueta}, tema, notas, registrada_por }]
export const traerSesiones = async (asesoriaId) => {
  const { data } = await api.get(`/asesorias/${asesoriaId}/sesiones`);
  return data.data;
};

// POST /asesor/asesorias/{id}/sesiones. Responde 201 con la sesión creada.
// fecha: 'AAAA-MM-DD' (no futura y no anterior al inicio de la asesoría)
export const registrarSesion = async (asesoriaId, { fecha, horarioId, tema, notas }) => {
  const { data } = await api.post(`/asesor/asesorias/${asesoriaId}/sesiones`, {
    fecha,
    horario_id: horarioId,
    tema: tema || undefined,
    notas: notas || undefined,
  });
  return data.data;
};

// DELETE /asesor/sesiones/{id}. Responde 204 sin cuerpo.
export const eliminarSesion = async (sesionId) => {
  await api.delete(`/asesor/sesiones/${sesionId}`);
};
