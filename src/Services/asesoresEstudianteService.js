import api from './api';

// La API entrega al asesor como { id, nombre, apellido_paterno, correo, disponibilidad: {...} }.
// Las tarjetas y el ModalInformacion ya usan otro formato (asesor, email, materias[], modalidad...),
// así que aquí se convierte una sola vez y esos componentes no cambian.
const aFormatoTarjeta = (a) => {
  const { materias, horarios, modalidades } = a.disponibilidad;

  return {
    id: a.id,
    asesor: [a.nombre, a.apellido_paterno, a.apellido_materno].filter(Boolean).join(' '),
    email: a.correo,
    materias: materias.map((m) => m.nombre),
    // ["Presencial", "Virtual"] -> "Presencial / Virtual"
    modalidad: modalidades.map((m) => m.etiqueta).join(' / '),
    // Una línea por día y horario, SIN comas: ["Lunes 7:00-8:00 AM", "Lunes 8:00-9:00 AM", ...]
    // (el ModalInformacion actual parte los textos por comas y se perdería el día)
    horarios: horarios.flatMap((dia) => dia.horarios.map((h) => `${dia.etiqueta} ${h.etiqueta}`)),
    // Las licenciaturas de sus materias, sin repetir
    licenciatura: [...new Set(materias.map((m) => m.licenciatura))].join(', '),
    // La respuesta cruda se conserva: el formulario de solicitar la usará después
    disponibilidad: a.disponibilidad,
  };
};

// GET /estudiante/asesores
// Solo manda los filtros que tengan valor (undefined = Axios no lo incluye en la URL)
export const traerAsesores = async ({ buscar, materiaId, horarioId, modalidad, page } = {}) => {
  const { data } = await api.get('/estudiante/asesores', {
    params: {
      buscar: buscar || undefined,
      materia_id: materiaId || undefined,
      horario_id: horarioId || undefined,
      modalidad: modalidad || undefined,
      page: page || undefined,
    },
  });

  // data.data = lista de asesores; data.meta = página actual, total, etc.
  return { asesores: data.data.map(aFormatoTarjeta), meta: data.meta };
};