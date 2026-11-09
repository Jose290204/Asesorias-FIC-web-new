// Bitácora del super admin, conectada al backend (fase 2.0.4).
//   listar -> GET /superadmin/bitacora?facultad_id=&accion=&buscar=&desde=&hasta=&page=&per_page=
// Solo lectura: la bitácora no se crea, edita ni borra desde la app.
// El backend filtra y pagina (10, 25 o 50 por página); aquí solo se traduce snake_case <-> camelCase.
// Los errores de Axios se dejan pasar: quien llama decide cómo mostrarlos.
import api from '../../../Services/api';

// Código de la acción -> cómo se muestra. `tono` decide el color del chip y `grupo` el
// encabezado en el filtro. Los códigos son los de AccionBitacora.php en el backend:
// si se agrega uno allá, se agrega aquí (si falta, el chip muestra el código tal cual).
export const ACCIONES = {
  'sesion.inicio': { etiqueta: 'Inicio de sesión', tono: 'gris', grupo: 'Cuenta' },
  'cuenta.contrasena_restablecida': { etiqueta: 'Contraseña restablecida', tono: 'azul', grupo: 'Cuenta' },

  'facultad.creada': { etiqueta: 'Facultad creada', tono: 'verde', grupo: 'Facultades' },
  'facultad.editada': { etiqueta: 'Facultad editada', tono: 'azul', grupo: 'Facultades' },
  'facultad.activada': { etiqueta: 'Facultad activada', tono: 'verde', grupo: 'Facultades' },
  'facultad.desactivada': { etiqueta: 'Facultad desactivada', tono: 'naranja', grupo: 'Facultades' },

  'administrador.creado': { etiqueta: 'Administrador creado', tono: 'verde', grupo: 'Administradores' },
  'administrador.editado': { etiqueta: 'Administrador editado', tono: 'azul', grupo: 'Administradores' },
  'administrador.movido': { etiqueta: 'Administrador movido', tono: 'azul', grupo: 'Administradores' },
  'administrador.activado': { etiqueta: 'Administrador activado', tono: 'verde', grupo: 'Administradores' },
  'administrador.desactivado': { etiqueta: 'Administrador desactivado', tono: 'naranja', grupo: 'Administradores' },
  'administrador.eliminado': { etiqueta: 'Administrador eliminado', tono: 'rojo', grupo: 'Administradores' },

  'estudiante.creado': { etiqueta: 'Estudiante creado', tono: 'verde', grupo: 'Estudiantes' },
  'estudiante.editado': { etiqueta: 'Estudiante editado', tono: 'azul', grupo: 'Estudiantes' },
  'estudiante.baja': { etiqueta: 'Estudiante dado de baja', tono: 'rojo', grupo: 'Estudiantes' },

  'solicitud.creada': { etiqueta: 'Solicitud creada', tono: 'verde', grupo: 'Solicitudes' },
  'solicitud.editada': { etiqueta: 'Solicitud editada', tono: 'azul', grupo: 'Solicitudes' },
  'solicitud.cancelada': { etiqueta: 'Solicitud cancelada', tono: 'naranja', grupo: 'Solicitudes' },
  'solicitud.aceptada': { etiqueta: 'Solicitud aceptada', tono: 'verde', grupo: 'Solicitudes' },
  'solicitud.rechazada': { etiqueta: 'Solicitud rechazada', tono: 'rojo', grupo: 'Solicitudes' },
  'solicitud.rechazada_auto': { etiqueta: 'Rechazada por el sistema', tono: 'naranja', grupo: 'Solicitudes' },

  'asesoria.creada': { etiqueta: 'Asesoría creada', tono: 'verde', grupo: 'Asesorías' },
  'asesoria.editada': { etiqueta: 'Asesoría editada', tono: 'azul', grupo: 'Asesorías' },
  'asesoria.completada': { etiqueta: 'Asesoría completada', tono: 'verde', grupo: 'Asesorías' },
  'asesoria.cancelada': { etiqueta: 'Asesoría cancelada', tono: 'rojo', grupo: 'Asesorías' },

  'sesion.registrada': { etiqueta: 'Sesión registrada', tono: 'verde', grupo: 'Trabajo del asesor' },
  'sesion.eliminada': { etiqueta: 'Sesión eliminada', tono: 'rojo', grupo: 'Trabajo del asesor' },
  'material.subido': { etiqueta: 'Material subido', tono: 'verde', grupo: 'Trabajo del asesor' },
  'material.eliminado': { etiqueta: 'Material eliminado', tono: 'rojo', grupo: 'Trabajo del asesor' },
  'disponibilidad.actualizada': { etiqueta: 'Disponibilidad actualizada', tono: 'azul', grupo: 'Trabajo del asesor' },
};

// [{ grupo: 'Cuenta', acciones: [[codigo, datos], ...] }, ...] en el orden en que se declararon
export const GRUPOS_ACCIONES = Object.entries(ACCIONES).reduce((grupos, [codigo, datos]) => {
  let g = grupos.find((x) => x.grupo === datos.grupo);
  if (!g) {
    g = { grupo: datos.grupo, acciones: [] };
    grupos.push(g);
  }
  g.acciones.push([codigo, datos]);
  return grupos;
}, []);

// API -> vistas. usuario null = lo hizo el sistema (por ejemplo, el rechazo automático por cupo)
const aFront = (r) => ({
  id: r.id,
  fecha: r.fecha,
  usuario: r.usuario ?? 'Sistema',
  facultadId: r.facultad_id,
  accion: r.accion,
  entidad: r.entidad ?? '—',
  detalle: r.detalle ?? '',
  esSuperAdmin: r.super_admin,
  ip: r.ip ?? '',
});

// `page` empieza en 1 (como Laravel). Los filtros vacíos no se mandan.
export async function listarBitacora({ facultadId = '', accion = '', buscar = '', desde = '', hasta = '', page = 1, porPagina = 10 } = {}) {
  const params = { page, per_page: porPagina };
  if (facultadId) params.facultad_id = facultadId;
  if (accion) params.accion = accion;
  if (buscar.trim()) params.buscar = buscar.trim();
  if (desde) params.desde = desde;
  if (hasta) params.hasta = hasta;

  const { data } = await api.get('/superadmin/bitacora', { params });
  return { registros: data.data.map(aFront), total: data.meta.total };
}
