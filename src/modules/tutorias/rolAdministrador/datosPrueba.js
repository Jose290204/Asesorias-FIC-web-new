// Datos de prueba solo para "Usuarios en línea", que aún no tiene endpoint en el backend (etapa 2.9).
// Cuando exista /admin/conexiones se borra este archivo y la bandera de sesionesService.
export const USAR_DATOS_PRUEBA_ADMIN = true;

// Sesiones activas para diseñar la pantalla "Usuarios en línea" sin backend.
// Las fechas se calculan respecto al momento de carga para que siempre haya gente "en línea" y "ausente".
const haceMinutos = (minutos) => new Date(Date.now() - minutos * 60000).toISOString();

export const SESIONES_ADMIN_PRUEBA = [
    { id: 1, usuario_id: 1, nombre: 'Leslie Mayram Barrera Rodriguez', correo: 'admin.prueba@info.uas.edu.mx', rol: 'Administrador', dispositivo: 'Web', ip: '189.203.10.21', inicio_sesion: haceMinutos(95), ultima_actividad: haceMinutos(0), es_actual: true },
    { id: 2, usuario_id: 2, nombre: 'Luis Fernando Pérez Gámez', correo: 'estudiante1@fic.test', rol: 'Estudiante', dispositivo: 'App móvil', ip: '189.203.44.8', inicio_sesion: haceMinutos(40), ultima_actividad: haceMinutos(1), es_actual: false },
    { id: 3, usuario_id: 3, nombre: 'Patricia Rentería Beltrán', correo: 'asesor.bd@fic.test', rol: 'Asesor disciplinar', dispositivo: 'Web', ip: '187.190.2.77', inicio_sesion: haceMinutos(120), ultima_actividad: haceMinutos(3), es_actual: false },
    { id: 4, usuario_id: 4, nombre: 'María Guadalupe Hernández Valenzuela', correo: 'estudiante2@fic.test', rol: 'Estudiante', dispositivo: 'Web', ip: '189.203.51.140', inicio_sesion: haceMinutos(180), ultima_actividad: haceMinutos(12), es_actual: false },
    { id: 5, usuario_id: 5, nombre: 'José Ángel Astorga Mejía', correo: 'asesor.par@fic.test', rol: 'Asesor par', dispositivo: 'App móvil', ip: '189.203.9.33', inicio_sesion: haceMinutos(300), ultima_actividad: haceMinutos(47), es_actual: false },
    { id: 6, usuario_id: 6, nombre: 'Alexander Israel Barrera Rodrígez', correo: 'asesor.ia@fic.test', rol: 'Asesor disciplinar', dispositivo: 'Web', ip: '187.190.8.120', inicio_sesion: haceMinutos(600), ultima_actividad: haceMinutos(130), es_actual: false }
];
