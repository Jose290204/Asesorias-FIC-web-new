import api from './api';

// La API entrega la disponibilidad así: materias [{id, nombre, ...}], horarios agrupados por día
// [{ dia, etiqueta, horarios: [{ id, etiqueta }] }] y modalidades [{ valor, etiqueta }].
// Se conserva tal cual para mostrarla y se agrega "vacia" para saber si el asesor ya es contactable.
export const aFormatoDisponibilidad = (d) => {
  const materias = (d?.materias ?? []).map((m) => ({ id: m.id, nombre: m.nombre }));
  const horariosPorDia = d?.horarios ?? [];
  const modalidades = d?.modalidades ?? [];
  const totalHorarios = horariosPorDia.reduce((suma, dia) => suma + dia.horarios.length, 0);

  return {
    materias,
    horariosPorDia,
    modalidades,
    totalHorarios,
    vacia: materias.length === 0 || totalHorarios === 0 || modalidades.length === 0,
  };
};

// La API entrega al asesor (disciplinar o par) como { id, nombre (completo), nombres, apellido_paterno,
// apellido_materno, correo, numero_cuenta, telefono, disponibilidad }.
// La tabla y los modales usan estos nombres, así que se convierte aquí.
export const aFormatoAsesorAdmin = (a) => ({
  id: a.id,
  nombre: a.nombre,
  nombres: a.nombres ?? '',
  apellido_paterno: a.apellido_paterno ?? '',
  apellido_materno: a.apellido_materno ?? '',
  correo: a.correo,
  numeroCuenta: a.numero_cuenta ?? '',
  telefono: a.telefono ?? '',
  disponibilidad: aFormatoDisponibilidad(a.disponibilidad),
});

// Cuerpo del alta y de la edición de un disciplinar (es el mismo). Lo opcional vacío se manda como null para poder borrarlo.
// La contraseña solo viaja si se escribió: en la edición, sin ella no se cambia.
const aCuerpo = (f) => {
  const cuerpo = {
    nombre: f.nombres,
    apellido_paterno: f.apellido_paterno,
    apellido_materno: f.apellido_materno || null,
    correo: f.correo,
    numero_cuenta: f.numeroCuenta || null,
    num_cel: f.telefono || null,
  };

  if (f.contrasena) {
    cuerpo.password = f.contrasena;
    cuerpo.password_confirmation = f.confirmarContrasena;
  }

  return cuerpo;
};

const traerLista = async (ruta, { buscar, page, materiaId } = {}) => {
  const { data } = await api.get(ruta, {
    params: {
      buscar: buscar || undefined,
      page: page || undefined,
      materia_id: materiaId || undefined,
    },
  });

  return { asesores: data.data.map(aFormatoAsesorAdmin), meta: data.meta };
};

// ---------- Asesores disciplinares ----------

// GET /admin/asesores-disciplinares (paginada de 10 en 10). buscar: nombre, correo o número de cuenta.
export const traerDisciplinaresAdmin = (filtros) => traerLista('/admin/asesores-disciplinares', filtros);

// POST /admin/asesores-disciplinares. Nace activo y con la contraseña que puso el admin. Responde 201.
// Sin disponibilidad: se arma después con guardarDisponibilidadAsesorAdmin.
export const crearDisciplinarAdmin = async (formulario) => {
  const { data } = await api.post('/admin/asesores-disciplinares', aCuerpo(formulario));
  return aFormatoAsesorAdmin(data.data);
};

// PUT /admin/asesores-disciplinares/{id}. Con contraseña nueva se cierran las sesiones abiertas del asesor.
export const editarDisciplinarAdmin = async (id, formulario) => {
  const { data } = await api.put(`/admin/asesores-disciplinares/${id}`, aCuerpo(formulario));
  return aFormatoAsesorAdmin(data.data);
};

// DELETE /admin/asesores-disciplinares/{id}: baja (pasa a inactivo, se cierran sus sesiones y se rechazan sus
// solicitudes pendientes). Responde 204. 409 asesor_con_asesorias_en_curso si todavía tiene asesorías en curso.
export const darDeBajaDisciplinarAdmin = async (id) => {
  await api.delete(`/admin/asesores-disciplinares/${id}`);
};

// ---------- Asesores par (estudiantes con rol de asesor) ----------

// GET /admin/asesores-par (paginada de 10 en 10). Mismos filtros que los disciplinares.
export const traerParesAdmin = (filtros) => traerLista('/admin/asesores-par', filtros);

// GET /admin/asesores-par/candidatos?buscar= : estudiantes activos que todavía no son asesores.
// Regresa [{ id, nombre, correo, numeroCuenta, grupo, licenciatura }]
export const traerCandidatosParAdmin = async ({ buscar } = {}) => {
  const { data } = await api.get('/admin/asesores-par/candidatos', { params: { buscar: buscar || undefined } });

  return data.data.map((e) => ({
    id: e.id,
    nombre: e.nombre,
    correo: e.correo,
    numeroCuenta: e.numero_cuenta ?? '',
    grupo: e.grupo ?? '',
    licenciatura: e.licenciatura ?? '',
  }));
};

// POST /admin/asesores-par {usuario_id}: le agrega el rol de asesor al estudiante (conserva el de estudiante). Responde 201.
// 409 ya_es_asesor si ya lo era.
export const asignarParAdmin = async (usuarioId) => {
  const { data } = await api.post('/admin/asesores-par', { usuario_id: usuarioId });
  return aFormatoAsesorAdmin(data.data);
};

// DELETE /admin/asesores-par/{id}: le quita el rol de asesor (sigue siendo estudiante). Responde 204.
// 409 asesor_con_asesorias_en_curso si todavía tiene asesorías en curso como asesor.
export const quitarParAdmin = async (id) => {
  await api.delete(`/admin/asesores-par/${id}`);
};

// ---------- Disponibilidad (sirve para disciplinar y par) ----------

// PUT /admin/asesores/{id}/disponibilidad: reemplaza TODO lo que el asesor imparte.
// materias: ids; horarios: [{ dia, horario_id }]; modalidades: ['presencial', 'virtual']. Responde con la nueva disponibilidad.
export const guardarDisponibilidadAsesorAdmin = async (id, { materias, horarios, modalidades }) => {
  const { data } = await api.put(`/admin/asesores/${id}/disponibilidad`, { materias, horarios, modalidades });
  return aFormatoDisponibilidad(data.data);
};
