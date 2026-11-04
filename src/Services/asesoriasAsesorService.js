import api from './api';
import { etiquetaDia, formatearFechaVisible } from './formatoFechas';

// La API entrega { id, estatus, estudiante: {id, nombre}, materia: {id, nombre}, horario: {id, etiqueta},
// modalidad: {valor, etiqueta}, razon: {valor, etiqueta}, ... }.
// Las tarjetas y los modales usan nombres planos, así que se convierte una sola vez aquí.
export const aFormatoAsesoria = (a) => ({
  id: a.id,
  estatus: a.estatus,
  id_estudiante: a.estudiante?.id,
  estudiante: a.estudiante?.nombre ?? '',
  id_materia: a.materia.id,
  materia: a.materia.nombre,
  id_horario: a.horario.id,
  horario: a.horario.etiqueta,
  // "Lunes 11:00-12:00 PM": el día de la semana sale de la fecha de inicio
  horario_con_dia: `${etiquetaDia(a.fecha_inicio)} ${a.horario.etiqueta}`,
  modalidad: a.modalidad.etiqueta,
  modalidad_valor: a.modalidad.valor,
  razon: a.razon.etiqueta,
  razon_valor: a.razon.valor,
  // "2026-11-09": se conserva tal cual para mandarla de vuelta a la API
  fecha_inicio: a.fecha_inicio,
  fecha_inicio_formateada: formatearFechaVisible(a.fecha_inicio),
  // Solo las completadas tienen fecha de finalización; en las canceladas queda vacía
  // (finalizada_en viene como "2026-11-03T11:26:14-07:00": los primeros 10 caracteres son el día)
  fecha_fin_formateada: a.finalizada_en ? formatearFechaVisible(a.finalizada_en.slice(0, 10)) : '',
  observaciones: a.observaciones ?? '',
  motivo_cancelacion: a.motivo_cancelacion,
  finalizada_en: a.finalizada_en,
  sesiones_count: a.sesiones_count ?? 0,
});

// GET /asesor/asesorias (paginada de 10 en 10)
// estatus: 'en_curso' | 'completada' | 'cancelada' | 'historial' (completadas + canceladas)
export const traerAsesorias = async ({ estatus, buscar, page } = {}) => {
  const { data } = await api.get('/asesor/asesorias', {
    params: { estatus: estatus || undefined, buscar: buscar || undefined, page: page || undefined },
  });
  return { asesorias: data.data.map(aFormatoAsesoria), meta: data.meta };
};

// POST /asesor/asesorias (asesoría directa, sin solicitud). Responde 201.
export const crearAsesoria = async ({ estudianteId, materiaId, horarioId, fechaInicio, modalidad, razon, observaciones }) => {
  const { data } = await api.post('/asesor/asesorias', {
    estudiante_id: estudianteId,
    materia_id: materiaId,
    horario_id: horarioId,
    fecha_inicio: fechaInicio,
    modalidad,
    razon,
    observaciones: observaciones || undefined,
  });
  return aFormatoAsesoria(data.data);
};

// PATCH /asesor/asesorias/{id}: solo se manda lo que cambió (fecha_inicio, horario_id, modalidad, razon, observaciones)
export const editarAsesoria = async (id, cambios) => {
  const { data } = await api.patch(`/asesor/asesorias/${id}`, cambios);
  return aFormatoAsesoria(data.data);
};

// POST /asesor/asesorias/{id}/completar (sin body)
export const completarAsesoria = async (id) => {
  const { data } = await api.post(`/asesor/asesorias/${id}/completar`);
  return aFormatoAsesoria(data.data);
};

// POST /asesor/asesorias/{id}/cancelar. El motivo es obligatorio (máx. 500).
export const cancelarAsesoria = async (id, motivo) => {
  const { data } = await api.post(`/asesor/asesorias/${id}/cancelar`, { motivo_cancelacion: motivo });
  return aFormatoAsesoria(data.data);
};

// GET /asesor/estudiantes?buscar= : autocompletar del alumno (10 por página, sin datos de contacto)
// Regresa [{ id, nombre, numero_cuenta, grupo }]
export const buscarEstudiantes = async ({ buscar, page } = {}) => {
  const { data } = await api.get('/asesor/estudiantes', {
    params: { buscar: buscar || undefined, page: page || undefined },
  });
  return data.data;
};

// GET /asesor/disponibilidad: lo que el asesor imparte (materias, horarios por día y modalidades)
export const traerDisponibilidad = async () => {
  const { data } = await api.get('/asesor/disponibilidad');
  return data.data;
};

// PUT /asesor/disponibilidad: reemplaza TODO lo que el asesor imparte.
// materias: ids; horarios: [{ dia, horario_id }]; modalidades: ['presencial', 'virtual'].
// Cada lista lleva al menos un elemento. Responde con la misma forma que el GET.
export const guardarDisponibilidad = async ({ materias, horarios, modalidades }) => {
  const { data } = await api.put('/asesor/disponibilidad', { materias, horarios, modalidades });
  return data.data;
};

// GET /materias: todas las materias de la facultad (sin paginar), para elegir las que el asesor imparte
// Regresa [{ id, nombre, semestre, licenciatura }]
export const traerMaterias = async () => {
  const { data } = await api.get('/materias');
  return data.data;
};
