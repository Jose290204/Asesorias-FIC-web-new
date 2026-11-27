import api from './api';

// GET /estudiante/calendario o /asesor/calendario (?desde=YYYY-MM-DD&hasta=YYYY-MM-DD, máx. 62 días)
// "como": 'estudiante' | 'asesor'. Regresa las sesiones que tocan por semana de las asesorías en curso:
// [{ asesoria_id, fecha, hora_inicio, hora_fin, horario, materia, con, modalidad, registrada }]
// "hora_inicio" y "hora_fin" vienen en 24 h ("13:00"); "horario" es la etiqueta para mostrar ("1:00-2:00 PM").
export const traerCalendario = async ({ como, desde, hasta }) => {
  const { data } = await api.get(`/${como}/calendario`, { params: { desde, hasta } });
  // inhabiles: [{ fecha_inicio, fecha_fin, tipo, motivo }] del rango (vacaciones y suspensiones; esos días no hay sesión)
  return { sesiones: data.data, inhabiles: data.inhabiles ?? [] };
};
