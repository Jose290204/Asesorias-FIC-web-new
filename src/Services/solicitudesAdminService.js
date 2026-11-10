import api from './api';
import { etiquetaDia } from './formatoFechas';

// La API entrega la solicitud como { id, fecha, estatus, estudiante: {id, nombre}, asesor: {id, nombre, correo},
// materia: {id, nombre}, horario: {id, etiqueta}, modalidad: {valor, etiqueta}, razon: {valor, etiqueta},
// nota, motivo_rechazo, ... }. La tabla y los modales de admin usan campos planos, así que se convierte aquí.
export const aFormatoSolicitudAdmin = (s) => ({
  id: s.id,
  id_solicitud: s.id,
  estatus: s.estatus,
  materia: s.materia.nombre,
  estudiante: s.estudiante?.nombre ?? '',
  asesor: s.asesor.nombre,
  asesor_correo: s.asesor.correo,
  // "2026-11-09": el formateador de fechas la parte sin desfase de zona horaria
  fecha_inicio: s.fecha,
  horario: s.horario.etiqueta,
  // "Lunes 11:00-12:00 PM": el día sale de la fecha solicitada
  horario_con_dia: `${etiquetaDia(s.fecha)} ${s.horario.etiqueta}`,
  modalidad: s.modalidad.etiqueta,
  razonAsesoria: s.razon.etiqueta,
  observaciones: s.nota ?? '',
  motivo_rechazo: s.motivo_rechazo ?? '',
});

// GET /admin/solicitudes (paginada de 10 en 10). estatus: pendiente | aceptada | rechazada | cancelada.
// buscar: nombre del estudiante o del asesor.
export const traerSolicitudesAdmin = async ({ buscar, page, estatus } = {}) => {
  const { data } = await api.get('/admin/solicitudes', {
    params: {
      buscar: buscar || undefined,
      page: page || undefined,
      estatus: estatus || undefined,
    },
  });

  return { solicitudes: data.data.map(aFormatoSolicitudAdmin), meta: data.meta };
};

// POST /admin/solicitudes/{id}/aceptar (sin body): acepta en lugar del asesor.
// Crea la asesoría y rechaza solas las demás solicitudes del mismo cupo.
export const aceptarSolicitudAdmin = async (id) => {
  const { data } = await api.post(`/admin/solicitudes/${id}/aceptar`);
  return data.data;
};

// POST /admin/solicitudes/{id}/rechazar. El motivo es obligatorio (máx. 500).
export const rechazarSolicitudAdmin = async (id, motivo) => {
  const { data } = await api.post(`/admin/solicitudes/${id}/rechazar`, {
    motivo_rechazo: motivo,
  });
  return data.data;
};
