// DATOS DE PRUEBA en memoria. Refleja la tabla `bitacora` del backend
// (usuario_id, facultad_id, accion, entidad_type/entidad_id, detalles, ip, created_at).
// Endpoint futuro: GET /superadmin/bitacora?facultad_id=&accion=&buscar=&desde=&hasta=&page=
// (el backend pagina y filtra; aquí se hace todo en el front para poder ver la pantalla).
const esperar = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// Código de la acción -> cómo se muestra. `tono` decide el color del chip.
// Los códigos son los que guarda Bitacora::registrar('...') en el backend.
export const ACCIONES = {
  'sesion.inicio': { etiqueta: 'Inicio de sesión', tono: 'gris' },
  'facultad.creada': { etiqueta: 'Facultad creada', tono: 'verde' },
  'facultad.editada': { etiqueta: 'Facultad editada', tono: 'azul' },
  'facultad.activada': { etiqueta: 'Facultad activada', tono: 'verde' },
  'facultad.desactivada': { etiqueta: 'Facultad desactivada', tono: 'naranja' },
  'administrador.creado': { etiqueta: 'Administrador creado', tono: 'verde' },
  'administrador.editado': { etiqueta: 'Administrador editado', tono: 'azul' },
  'administrador.desactivado': { etiqueta: 'Administrador desactivado', tono: 'naranja' },
  'administrador.eliminado': { etiqueta: 'Administrador eliminado', tono: 'rojo' },
  'asesoria.creada': { etiqueta: 'Asesoría creada', tono: 'verde' },
  'asesoria.eliminada': { etiqueta: 'Asesoría eliminada', tono: 'rojo' },
  'solicitud.aceptada': { etiqueta: 'Solicitud aceptada', tono: 'verde' },
  'solicitud.rechazada': { etiqueta: 'Solicitud rechazada', tono: 'rojo' },
};

const hace = (minutos) => new Date(Date.now() - minutos * 60 * 1000).toISOString();

// [minutosAtrás, usuario, facultadId, acción, entidad, detalle, ip]
const FILAS = [
  [3, 'Super Admin UAS', 1, 'facultad.desactivada', 'Facultad Ingeniería Culiacán', 'Desactivada desde el panel principal', '187.190.10.4'],
  [18, 'Super Admin UAS', 1, 'administrador.creado', 'Laura Beatriz Gómez Ibarra', 'Facultad: FCA · estatus pendiente', '187.190.10.4'],
  [47, 'Admin Uno FIC', 1, 'solicitud.aceptada', 'Solicitud #214', 'Materia: Álgebra Lineal', '201.141.22.9'],
  [95, 'Admin Uno FIC', 1, 'asesoria.creada', 'Asesoría #88', 'Asesor: Héctor Avendaño · Presencial', '201.141.22.9'],
  [140, 'Admin Dos FIC', 1, 'solicitud.rechazada', 'Solicitud #213', 'Motivo: horario no disponible', '201.141.22.15'],
  [260, 'Super Admin UAS', 1, 'administrador.editado', 'Carlos Alberto Ruiz Pérez', 'Cambió el correo', '187.190.10.4'],
  [330, 'Admin Uno FIC', 1, 'sesion.inicio', 'Sesión', 'Navegador Chrome · Windows', '201.141.22.9'],
  [520, 'Super Admin UAS', 1, 'facultad.editada', 'Facultad de Informática Culiacán', 'Cambió el logo', '187.190.10.4'],
  [700, 'Admin Dos FIC', 1, 'asesoria.eliminada', 'Asesoría #71', 'Eliminada por captura duplicada', '201.141.22.15'],
  [1300, 'Super Admin UAS', 2, 'facultad.creada', 'Facultad de Contaduría y Administración', 'Siglas: FCA', '187.190.10.4'],
  [1320, 'Super Admin UAS', 2, 'administrador.creado', 'Laura Beatriz Gómez Ibarra', 'Primer administrador de la facultad', '187.190.10.4'],
  [1800, 'Super Admin UAS', 1, 'administrador.desactivado', 'Mario Soto Lara', 'Ya no labora en la facultad', '187.190.10.4'],
  [2900, 'Super Admin UAS', 1, 'administrador.eliminado', 'Usuario de prueba', 'Registro duplicado', '187.190.10.4'],
  [3100, 'Admin Uno FIC', 1, 'sesion.inicio', 'Sesión', 'Navegador Edge · Windows', '201.141.22.9'],
  [4300, 'Super Admin UAS', 1, 'facultad.activada', 'Facultad de Informática Culiacán', 'Reactivada', '187.190.10.4'],
  [4400, 'Admin Dos FIC', 1, 'solicitud.aceptada', 'Solicitud #205', 'Materia: Bases de Datos', '201.141.22.15'],
  [5600, 'Admin Uno FIC', 1, 'asesoria.creada', 'Asesoría #80', 'Asesor: Valeria Moroyoqui · Virtual', '201.141.22.9'],
  [7200, 'Super Admin UAS', 1, 'sesion.inicio', 'Sesión', 'Navegador Chrome · Windows', '187.190.10.4'],
  [8700, 'Admin Dos FIC', 1, 'solicitud.rechazada', 'Solicitud #198', 'Motivo: alumno con asesoría en curso', '201.141.22.15'],
  [10100, 'Admin Uno FIC', 1, 'asesoria.creada', 'Asesoría #75', 'Asesor: Jorge Luis Camacho · Presencial', '201.141.22.9'],
  [12000, 'Super Admin UAS', 1, 'facultad.creada', 'Facultad de Informática Culiacán', 'Siglas: FIC', '187.190.10.4'],
  [12010, 'Super Admin UAS', 1, 'administrador.creado', 'Admin Uno FIC', 'Primer administrador de la facultad', '187.190.10.4'],
];

const REGISTROS = FILAS.map(([min, usuario, facultadId, accion, entidad, detalle, ip], i) => ({
  id: FILAS.length - i,
  fecha: hace(min),
  usuario,
  facultadId,
  accion,
  entidad,
  detalle,
  ip,
}));

export async function listarBitacora({ facultadId = '', accion = '', buscar = '', desde = '', hasta = '' } = {}) {
  await esperar();
  const texto = buscar.trim().toLowerCase();
  // `desde` y `hasta` vienen como YYYY-MM-DD; "hasta" incluye todo ese día
  const inicio = desde ? new Date(`${desde}T00:00:00`).getTime() : null;
  const fin = hasta ? new Date(`${hasta}T23:59:59.999`).getTime() : null;

  return REGISTROS.filter((r) => {
    if (facultadId && r.facultadId !== Number(facultadId)) return false;
    if (accion && r.accion !== accion) return false;
    const t = new Date(r.fecha).getTime();
    if (inicio && t < inicio) return false;
    if (fin && t > fin) return false;
    if (texto && ![r.usuario, r.entidad, r.detalle, r.ip].some((c) => c.toLowerCase().includes(texto))) return false;
    return true;
  }).map((r) => ({ ...r }));
}
