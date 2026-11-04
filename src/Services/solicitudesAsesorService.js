import api from './api';
import { etiquetaDia, formatearFechaVisible } from './formatoFechas';

// La API entrega la solicitud como { id, fecha, estudiante: {id, nombre}, materia: {id, nombre},
// horario: {id, etiqueta}, modalidad: {valor, etiqueta}, ... }.
// La tarjeta ya usa otro formato (id_solicitud, nombre_estudiante, materia como texto...),
// así que se convierte aquí y la tarjeta no cambia.
const aFormatoTarjeta = (s) => ({
  id_solicitud: s.id,
  nombre_estudiante: s.estudiante?.nombre ?? '',
  // La API no manda el correo del estudiante: la tarjeta deja ese renglón vacío
  correo: '',
  materia: s.materia.nombre,
  // "2026-11-09": la tarjeta ya sabe formatearla sin desfase de zona horaria
  fecha_inicio: s.fecha,
  fecha_inicio_formateada: formatearFechaVisible(s.fecha),
  horario: s.horario.etiqueta,
  // "Lunes 11:00-12:00 PM": el día de la semana sale de la fecha solicitada
  horario_con_dia: `${etiquetaDia(s.fecha)} ${s.horario.etiqueta}`,
  modalidad: s.modalidad.etiqueta,
  razon: s.razon.etiqueta,
  nota: s.nota,
});

// GET /asesor/solicitudes?estatus=pendiente (paginada de 10 en 10)
export const traerSolicitudesPendientes = async ({ page } = {}) => {
  const { data } = await api.get('/asesor/solicitudes', {
    params: { estatus: 'pendiente', page: page || undefined },
  });

  // data.data = lista; data.meta = página actual, última página, total...
  return { solicitudes: data.data.map(aFormatoTarjeta), meta: data.meta };
};

// POST /asesor/solicitudes/{id}/aceptar (sin body). Crea la asesoría y rechaza
// solas las demás solicitudes del mismo cupo.
export const aceptarSolicitud = async (id) => {
  const { data } = await api.post(`/asesor/solicitudes/${id}/aceptar`);
  return data.data;
};

// POST /asesor/solicitudes/{id}/rechazar. El motivo es obligatorio (máx. 500).
export const rechazarSolicitud = async (id, motivo) => {
  const { data } = await api.post(`/asesor/solicitudes/${id}/rechazar`, {
    motivo_rechazo: motivo,
  });
  return data.data;
};
