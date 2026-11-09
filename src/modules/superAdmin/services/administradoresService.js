// Administradores de facultad, conectados al backend (fase 2.0.3).
//   listar        -> GET    /superadmin/administradores?facultad_id=
//   crear         -> POST   /superadmin/administradores            (nace activo, con la contraseña que se define)
//   editar        -> PUT    /superadmin/administradores/{id}       (password opcional)
//   cambiarEstado -> PATCH  /superadmin/administradores/{id}/estado  { estatus: 'activo' | 'inactivo' }
//   eliminar      -> DELETE /superadmin/administradores/{id}       (borrado lógico)
// La API usa snake_case; las vistas usan camelCase, así que aquí se traduce en ambos sentidos.
// Los errores de Axios se dejan pasar: quien llama los muestra con mensajesDeError().
import api from '../../../Services/api';

// API -> vistas
const aFront = (a) => ({
  id: a.id,
  nombre: a.nombre,
  apellidoPaterno: a.apellido_paterno,
  apellidoMaterno: a.apellido_materno ?? '',
  nombreCompleto: a.nombre_completo,
  correo: a.correo,
  facultadId: a.facultad_id,
  estatus: a.estatus,
});

// Vistas -> API. La contraseña solo viaja si se escribió (al editar, vacía = no cambiarla)
const aApi = ({ facultadId, nombre, apellidoPaterno, apellidoMaterno, correo, password }) => ({
  facultad_id: facultadId,
  nombre,
  apellido_paterno: apellidoPaterno,
  apellido_materno: apellidoMaterno || null,
  correo,
  ...(password ? { password } : {}),
});

export async function listarAdministradores(facultadId = null) {
  const { data } = await api.get('/superadmin/administradores', {
    params: facultadId ? { facultad_id: facultadId } : {},
  });
  return data.data.map(aFront);
}

export async function crearAdministrador(datos) {
  const { data } = await api.post('/superadmin/administradores', aApi(datos));
  return aFront(data.data);
}

export async function editarAdministrador(id, datos) {
  const { data } = await api.put(`/superadmin/administradores/${id}`, aApi(datos));
  return aFront(data.data);
}

export async function cambiarEstadoAdministrador(id, estatus) {
  const { data } = await api.patch(`/superadmin/administradores/${id}/estado`, { estatus });
  return aFront(data.data);
}

export async function eliminarAdministrador(id) {
  await api.delete(`/superadmin/administradores/${id}`);
}
