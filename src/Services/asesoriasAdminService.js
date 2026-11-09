import api from './api';
import { aFormatoAsesoria } from './asesoriasAsesorService';

// Misma forma que la del asesor, más el asesor (el admin ve a las dos personas).
// Las respuestas de crear, editar, completar y cancelar no traen "asesor": esas
// acciones recargan la lista después, así que ahí el campo queda vacío sin problema.
export const aFormatoAsesoriaAdmin = (a) => ({
  ...aFormatoAsesoria(a),
  id_asesor: a.asesor?.id,
  asesor: a.asesor?.nombre ?? '',
  asesor_correo: a.asesor?.correo ?? '',
});

// Los filtros del modal usan nombres cortos; la API espera estos
const aParametrosFiltros = (filtros = {}) => ({
  licenciatura_id: filtros.licenciatura || undefined,
  grupo_id: filtros.grupo || undefined,
  modalidad: filtros.modalidad || undefined,
  horario_id: filtros.horario || undefined,
  razon: filtros.razon || undefined,
});

// GET /admin/asesorias (paginada de 10 en 10, solo las en curso en esta pantalla)
export const traerAsesoriasAdmin = async ({ buscar, page, filtros } = {}) => {
  const { data } = await api.get('/admin/asesorias', {
    params: {
      estatus: 'en_curso',
      buscar: buscar || undefined,
      page: page || undefined,
      ...aParametrosFiltros(filtros),
    },
  });
  return { asesorias: data.data.map(aFormatoAsesoriaAdmin), meta: data.meta };
};

// PATCH /admin/asesorias/{id}: solo se manda lo que cambió (fecha_inicio, horario_id, modalidad, razon, observaciones)
export const editarAsesoriaAdmin = async (id, cambios) => {
  const { data } = await api.patch(`/admin/asesorias/${id}`, cambios);
  return aFormatoAsesoriaAdmin(data.data);
};

// POST /admin/asesorias/{id}/completar (sin body)
export const completarAsesoriaAdmin = async (id) => {
  const { data } = await api.post(`/admin/asesorias/${id}/completar`);
  return aFormatoAsesoriaAdmin(data.data);
};

// POST /admin/asesorias/{id}/cancelar. El motivo es obligatorio (máx. 500).
export const cancelarAsesoriaAdmin = async (id, motivo) => {
  const { data } = await api.post(`/admin/asesorias/${id}/cancelar`, { motivo_cancelacion: motivo });
  return aFormatoAsesoriaAdmin(data.data);
};

// POST /admin/asesorias/{id}/sesiones. Responde 201 con la sesión creada (queda registrada por el admin).
// Mismo body que la del asesor: fecha 'AAAA-MM-DD' (no futura y no anterior al inicio de la asesoría).
// Listar las sesiones usa la ruta compartida: traerSesiones de sesionesAsesorService.
export const registrarSesionAdmin = async (asesoriaId, { fecha, horarioId, tema, notas }) => {
  const { data } = await api.post(`/admin/asesorias/${asesoriaId}/sesiones`, {
    fecha,
    horario_id: horarioId,
    tema: tema || undefined,
    notas: notas || undefined,
  });
  return data.data;
};

// DELETE /admin/sesiones/{id}. Responde 204 sin cuerpo.
export const eliminarSesionAdmin = async (sesionId) => {
  await api.delete(`/admin/sesiones/${sesionId}`);
};

// POST /admin/asesorias/{id}/material como multipart: un campo "archivos[]" por archivo.
// Responde 201 con la lista de los archivos recién creados (quedan a nombre del admin).
// Listar y descargar usan las rutas compartidas: traerMaterial y descargarMaterial de materialAsesorService.
export const subirMaterialAdmin = async (asesoriaId, archivos) => {
  const formulario = new FormData();
  archivos.forEach((archivo) => formulario.append('archivos[]', archivo));

  // Sin Content-Type a mano: el navegador lo arma con su "boundary"
  const { data } = await api.post(`/admin/asesorias/${asesoriaId}/material`, formulario, {
    headers: { 'Content-Type': undefined },
  });
  return data.data;
};

// DELETE /admin/material/{id}. El admin puede borrar cualquier archivo. Responde 204 sin cuerpo.
export const eliminarMaterialAdmin = async (materialId) => {
  await api.delete(`/admin/material/${materialId}`);
};

// POST /admin/asesorias (alta a nombre de un asesor). Responde 201.
// Se valida contra la disponibilidad de ESE asesor: materia, modalidad, día y horario, cupo y ciclo.
export const crearAsesoriaAdmin = async ({ asesorId, estudianteId, materiaId, horarioId, fechaInicio, modalidad, razon, observaciones }) => {
  const { data } = await api.post('/admin/asesorias', {
    asesor_id: asesorId,
    estudiante_id: estudianteId,
    materia_id: materiaId,
    horario_id: horarioId,
    fecha_inicio: fechaInicio,
    modalidad,
    razon,
    observaciones: observaciones || undefined,
  });
  return aFormatoAsesoriaAdmin(data.data);
};

// GET /admin/asesores?buscar= : asesores de la facultad que ya tienen disponibilidad (10 por página).
// Regresa [{ id, nombre, apellido_paterno, apellido_materno, correo, disponibilidad: { materias, horarios, modalidades } }]
export const buscarAsesoresAdmin = async ({ buscar, page } = {}) => {
  const { data } = await api.get('/admin/asesores', {
    params: { buscar: buscar || undefined, page: page || undefined },
  });
  return data.data;
};

// GET /admin/estudiantes?buscar= : alumnos activos de la facultad (10 por página).
// Regresa [{ id, nombre, numero_cuenta, grupo }]
export const buscarEstudiantesAdmin = async ({ buscar, page } = {}) => {
  const { data } = await api.get('/admin/estudiantes', {
    params: { buscar: buscar || undefined, page: page || undefined },
  });
  return data.data;
};

// GET /admin/asesores/{id}/disponibilidad : lo que imparte ese asesor (misma forma que /asesor/disponibilidad)
export const traerDisponibilidadDeAsesor = async (asesorId) => {
  const { data } = await api.get(`/admin/asesores/${asesorId}/disponibilidad`);
  return data.data;
};
