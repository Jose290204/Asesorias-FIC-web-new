import api from './api';

// La API entrega al estudiante como { id, nombre (completo), nombres, apellido_paterno, apellido_materno, correo,
// numero_cuenta, telefono, grupo, grupo_id, licenciatura, licenciatura_id }.
// La tabla y los modales usan estos nombres, así que se convierte aquí.
export const aFormatoEstudianteAdmin = (e) => ({
  id: e.id,
  nombre: e.nombre,
  nombres: e.nombres ?? '',
  apellido_paterno: e.apellido_paterno ?? '',
  apellido_materno: e.apellido_materno ?? '',
  correo: e.correo,
  numeroCuenta: e.numero_cuenta ?? '',
  telefono: e.telefono ?? '',
  grupo: e.grupo ?? '',
  grupo_id: e.grupo_id ?? '',
  licenciatura: e.licenciatura ?? '',
  licenciatura_id: e.licenciatura_id ?? '',
});

// Cuerpo del alta y de la edición (es el mismo). Lo opcional vacío se manda como null para poder borrarlo.
// La contraseña solo viaja si se escribió: en la edición, sin ella no se cambia.
const aCuerpo = (f) => {
  const cuerpo = {
    nombre: f.nombres,
    apellido_paterno: f.apellido_paterno,
    apellido_materno: f.apellido_materno || null,
    correo: f.correo,
    numero_cuenta: f.numeroCuenta,
    num_cel: f.telefono || null,
    grupo_id: f.grupo_id,
  };

  if (f.contrasena) {
    cuerpo.password = f.contrasena;
    cuerpo.password_confirmation = f.confirmarContrasena;
  }

  return cuerpo;
};

// GET /admin/estudiantes (paginada de 10 en 10). buscar: nombre, correo o número de cuenta.
export const traerEstudiantesAdmin = async ({ buscar, page, licenciaturaId, grupoId } = {}) => {
  const { data } = await api.get('/admin/estudiantes', {
    params: {
      buscar: buscar || undefined,
      page: page || undefined,
      licenciatura_id: licenciaturaId || undefined,
      grupo_id: grupoId || undefined,
    },
  });

  return { estudiantes: data.data.map(aFormatoEstudianteAdmin), meta: data.meta };
};

// POST /admin/estudiantes. Nace activo y con la contraseña que puso el admin. Responde 201.
export const crearEstudianteAdmin = async (formulario) => {
  const { data } = await api.post('/admin/estudiantes', aCuerpo(formulario));
  return aFormatoEstudianteAdmin(data.data);
};

// PUT /admin/estudiantes/{id}. Con contraseña nueva se cierran las sesiones abiertas del estudiante.
export const editarEstudianteAdmin = async (id, formulario) => {
  const { data } = await api.put(`/admin/estudiantes/${id}`, aCuerpo(formulario));
  return aFormatoEstudianteAdmin(data.data);
};

// DELETE /admin/estudiantes/{id}: baja (pasa a inactivo, conserva el historial). Responde 204.
// 409 estudiante_con_asesorias_en_curso si todavía tiene asesorías en curso.
export const darDeBajaEstudianteAdmin = async (id) => {
  await api.delete(`/admin/estudiantes/${id}`);
};
