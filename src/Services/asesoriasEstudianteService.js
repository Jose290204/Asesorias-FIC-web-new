import api from './api';
import { etiquetaDia, formatearFechaVisible } from './formatoFechas';

// La API entrega { id, estatus, asesor: {id, nombre}, materia: {id, nombre}, horario: {id, etiqueta},
// modalidad: {valor, etiqueta}, razon: {valor, etiqueta}, ... }. Las tarjetas usan nombres planos,
// así que se convierte una sola vez aquí.
export const aFormatoAsesoria = (a) => ({
  id: a.id,
  estatus: a.estatus,
  id_asesor: a.asesor?.id,
  asesor: a.asesor?.nombre ?? '',
  asesor_correo: a.asesor?.correo ?? '',
  id_materia: a.materia.id,
  materia: a.materia.nombre,
  horario: a.horario.etiqueta,
  // "Lunes 11:00-12:00 PM": el día de la semana sale de la fecha de inicio
  horario_con_dia: `${etiquetaDia(a.fecha_inicio)} ${a.horario.etiqueta}`,
  modalidad: a.modalidad.etiqueta,
  razon: a.razon.etiqueta,
  fecha_inicio: a.fecha_inicio,
  fecha_inicio_formateada: formatearFechaVisible(a.fecha_inicio),
  // Solo las completadas tienen fecha de finalización (finalizada_en viene como "2026-11-03T11:26:14-07:00")
  fecha_fin_formateada: a.finalizada_en ? formatearFechaVisible(a.finalizada_en.slice(0, 10)) : '',
  observaciones: a.observaciones ?? '',
  motivo_cancelacion: a.motivo_cancelacion,
  finalizada_en: a.finalizada_en,
  sesiones_count: a.sesiones_count ?? 0,
  // Mensajes del chat que la otra persona escribió y este usuario aún no ha leído (globito del botón Chat)
  mensajes_sin_leer: a.mensajes_sin_leer ?? 0,
});

// GET /estudiante/asesorias (paginada de 10 en 10)
// estatus: 'en_curso' | 'completada' | 'cancelada' | 'historial' (completadas + canceladas)
export const traerAsesorias = async ({ estatus, page } = {}) => {
  const { data } = await api.get('/estudiante/asesorias', {
    params: { estatus: estatus || undefined, page: page || undefined },
  });
  return { asesorias: data.data.map(aFormatoAsesoria), meta: data.meta };
};
