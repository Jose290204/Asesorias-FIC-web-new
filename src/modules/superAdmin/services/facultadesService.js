// Facultades del super admin, conectadas al backend (fase 2.0.2).
//   listar        -> GET   /superadmin/facultades
//   crear         -> POST  /superadmin/facultades                (multipart/form-data)
//   editar        -> POST  /superadmin/facultades/{id} con _method=PUT (multipart, por el archivo)
//   cambiarEstado -> PATCH /superadmin/facultades/{id}/estado    { activa }
// El backend devuelve { data: { id, nombre, siglas, logo (URL o null), activa,
// administradores, asesores, estudiantes, asesorias } }: ya coincide con lo que usan las vistas.
// Los errores de Axios se dejan pasar: quien llama los muestra con mensajesDeError().
import api from '../../../Services/api';

// Arma el multipart. Logo: File = reemplazar | null = quitar | undefined = dejar el actual
function armarFormulario({ nombre, siglas, logo }, esEdicion) {
  const datos = new FormData();
  datos.append('nombre', nombre);
  datos.append('siglas', siglas);

  if (logo instanceof File) datos.append('logo', logo);
  if (esEdicion && logo === null) datos.append('quitar_logo', '1');

  // Laravel no lee archivos en un PUT real: se manda POST y se disfraza con _method
  if (esEdicion) datos.append('_method', 'PUT');

  return datos;
}

const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } };

export async function listarFacultades() {
  const { data } = await api.get('/superadmin/facultades');
  return data.data;
}

export async function crearFacultad(datos) {
  const { data } = await api.post('/superadmin/facultades', armarFormulario(datos, false), MULTIPART);
  return data.data;
}

export async function editarFacultad(id, datos) {
  const { data } = await api.post(`/superadmin/facultades/${id}`, armarFormulario(datos, true), MULTIPART);
  return data.data;
}

export async function cambiarEstadoFacultad(id, activa) {
  const { data } = await api.patch(`/superadmin/facultades/${id}/estado`, { activa });
  return data.data;
}
