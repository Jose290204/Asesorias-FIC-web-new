import api from "./api";
import { etiquetaDia, formatearFechaVisible } from "./formatoFechas";

export const crearSolicitud = async ({ asesorId, materiaId, horarioId, fecha, modalidad, razon, nota }) => {
    const { data } = await api.post("/estudiante/solicitudes", {
        asesor_id: asesorId,
        materia_id: materiaId,
        horario_id: horarioId,
        fecha,
        modalidad,
        razon,
        nota: nota || undefined,
    });
    return data.data;
};

// La API entrega { id, fecha, estatus, asesor: {id, nombre}, materia: {id, nombre}, horario: {id, etiqueta},
// modalidad: {valor, etiqueta}, razon: {valor, etiqueta}, nota, motivo_rechazo, ... }.
// Las tarjetas usan nombres planos, así que se convierte una sola vez aquí.
const aFormatoSolicitud = (s) => ({
  id: s.id,
  // pendiente | aceptada | rechazada | cancelada
  estatus: s.estatus,
  id_asesor: s.asesor.id,
  asesor: s.asesor.nombre,
  asesor_correo: s.asesor.correo ?? '',
  id_materia: s.materia.id,
  materia: s.materia.nombre,
  id_horario: s.horario.id,
  horario: s.horario.etiqueta,
  // "Lunes 11:00-12:00 PM": el día de la semana sale de la fecha solicitada
  horario_con_dia: `${etiquetaDia(s.fecha)} ${s.horario.etiqueta}`,
  modalidad: s.modalidad.etiqueta,
  razon: s.razon.etiqueta,
  fecha: s.fecha,
  fecha_formateada: formatearFechaVisible(s.fecha),
  nota: s.nota ?? "",
  // Lo que el asesor escribió al rechazar (el front lo muestra como "Notas del asesor")
  motivo_rechazo: s.motivo_rechazo ?? "",
});

// GET /estudiante/solicitudes (paginada de 10 en 10, las más recientes primero)
// estatus (opcional): pendiente | aceptada | rechazada | cancelada
export const traerSolicitudes = async ({ estatus, page } = {}) => {
  const { data } = await api.get("/estudiante/solicitudes", {
    params: { estatus: estatus || undefined, page: page || undefined },
  });
  return { solicitudes: data.data.map(aFormatoSolicitud), meta: data.meta };
};

// PATCH /estudiante/solicitudes/{id}: solo si está pendiente. Se manda únicamente lo que cambió
// (fecha "AAAA-MM-DD", horario_id y/o nota; "nota": null la borra).
export const editarSolicitud = async (id, cambios) => {
  const { data } = await api.patch(`/estudiante/solicitudes/${id}`, cambios);
  return aFormatoSolicitud(data.data);
};

// POST /estudiante/solicitudes/{id}/cancelar (sin body): solo si está pendiente.
// La solicitud no se borra: queda en la lista como "cancelada".
export const cancelarSolicitud = async (id) => {
  const { data } = await api.post(`/estudiante/solicitudes/${id}/cancelar`);
  return aFormatoSolicitud(data.data);
};
