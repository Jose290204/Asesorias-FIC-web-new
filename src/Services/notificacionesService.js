import api from './api';
import { ROL } from '../constants/roles';

// Una notificación llega como
// { id, tipo, titulo, mensaje, solicitud_id, asesoria_id, como, leida, fecha }
// Es la misma ruta para el estudiante y el asesor: cada quien ve solo las suyas.

// Los mismos códigos que el enum TipoNotificacion del backend.
// Si se agrega uno allá, se agrega aquí. Cada tipo lleva:
// - "rol" y "ruta" si siempre lo recibe el mismo rol (las de solicitudes), o
// - "rutas" por rol si lo pueden recibir los dos (las de asesorías y el chat). En ese caso el backend
//   manda "como" ('estudiante' o 'asesor'): el rol con el que la recibe esa persona.
const RUTAS_EN_CURSO = { estudiante: '/estudiante/asesorias-estudiante', asesor: '/asesor/asesorias-en-curso' };
const RUTAS_HISTORIAL = { estudiante: '/estudiante/historial-de-asesorias', asesor: '/asesor/historial-de-asesorias' };

export const TIPOS = {
  'solicitud.nueva': { rol: ROL.ASESOR, ruta: '/asesor/solicitudes-pendientes' },
  'solicitud.cancelada': { rol: ROL.ASESOR, ruta: '/asesor/solicitudes-pendientes' },
  'solicitud.editada': { rol: ROL.ASESOR, ruta: '/asesor/solicitudes-pendientes' },
  'solicitud.aceptada': { rol: ROL.ESTUDIANTE, ruta: '/estudiante/asesorias-estudiante' },
  'solicitud.rechazada': { rol: ROL.ESTUDIANTE, ruta: '/estudiante/solicitudes-en-revision' },
  'solicitud.rechazada_por_cupo': { rol: ROL.ESTUDIANTE, ruta: '/estudiante/solicitudes-en-revision' },

  'asesoria.creada': { rutas: RUTAS_EN_CURSO },
  'asesoria.editada': { rutas: RUTAS_EN_CURSO },
  'asesoria.completada': { rutas: RUTAS_HISTORIAL },
  'asesoria.cancelada': { rutas: RUTAS_HISTORIAL },
  'sesion.registrada': { rutas: RUTAS_EN_CURSO },
  'material.subido': { rutas: RUTAS_EN_CURSO },
  'chat.mensaje': { rutas: RUTAS_EN_CURSO },
};

const ROL_COMO = { estudiante: ROL.ESTUDIANTE, asesor: ROL.ASESOR };

// A dónde lleva un aviso: { rol, ruta }, o null si el tipo no se conoce (aviso de una versión nueva)
export const destinoDe = (notificacion) => {
  const tipo = TIPOS[notificacion.tipo];
  if (!tipo) return null;
  if (tipo.rol) return { rol: tipo.rol, ruta: tipo.ruta };

  const como = tipo.rutas[notificacion.como] ? notificacion.como : 'estudiante';
  return { rol: ROL_COMO[como], ruta: tipo.rutas[como] };
};

const adaptar = (n) => ({
  id: n.id,
  tipo: n.tipo,
  titulo: n.titulo,
  mensaje: n.mensaje,
  solicitudId: n.solicitud_id,
  asesoriaId: n.asesoria_id,
  como: n.como,
  leida: n.leida,
  fecha: n.fecha,
});

// GET /notificaciones (de 10 en 10). Regresa
// { notificaciones, noLeidas, ultimaPagina }; "noLeidas" es el total, no solo el de esta página.
export const traerNotificaciones = async (pagina = 1) => {
  const { data } = await api.get('/notificaciones', { params: { page: pagina } });
  return {
    notificaciones: data.data.map(adaptar),
    noLeidas: data.meta?.no_leidas ?? 0,
    ultimaPagina: data.meta?.last_page ?? 1,
  };
};

// POST /notificaciones/{id}/leida. 404 si no es del usuario.
export const marcarNotificacionLeida = async (id) => {
  const { data } = await api.post(`/notificaciones/${id}/leida`);
  return adaptar(data.data);
};

// POST /notificaciones/leidas. Responde { marcadas: n }
export const marcarTodasLeidas = async () => {
  const { data } = await api.post('/notificaciones/leidas');
  return data.marcadas;
};
