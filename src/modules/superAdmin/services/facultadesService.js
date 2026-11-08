// DATOS DE PRUEBA en memoria (se reinician al recargar la página).
// Cuando exista el backend se reemplaza el cuerpo de cada función por la llamada a api:
//   listar   -> GET   /superadmin/facultades
//   crear    -> POST  /superadmin/facultades
//   editar   -> PUT   /superadmin/facultades/{id}
//   cambiarEstado -> PATCH /superadmin/facultades/{id}  { activa }
// Las vistas no cambian: ya consumen estas funciones.
const esperar = (ms = 250) => new Promise((r) => setTimeout(r, ms));

let facultades = [
  { id: 1, nombre: 'Facultad de Informática Culiacán', siglas: 'FIC', activa: true, administradores: 2, asesores: 14, estudiantes: 320, asesorias: 87 },
  { id: 2, nombre: 'Facultad de Contaduría y Administración', siglas: 'FCA', activa: true, administradores: 1, asesores: 6, estudiantes: 140, asesorias: 22 },
  { id: 3, nombre: 'Facultad de Ingeniería Culiacán', siglas: 'FIC-ING', activa: false, administradores: 0, asesores: 0, estudiantes: 0, asesorias: 0 },
];
let siguienteId = 4;

export async function listarFacultades() {
  await esperar();
  return facultades.map((f) => ({ ...f }));
}

export async function crearFacultad({ nombre, siglas }) {
  await esperar();
  if (facultades.some((f) => f.siglas.toLowerCase() === siglas.toLowerCase())) {
    throw new Error('Ya existe una facultad con esas siglas.');
  }
  const nueva = { id: siguienteId++, nombre, siglas, activa: true, administradores: 0, asesores: 0, estudiantes: 0, asesorias: 0 };
  facultades = [...facultades, nueva];
  return { ...nueva };
}

export async function editarFacultad(id, { nombre, siglas }) {
  await esperar();
  if (facultades.some((f) => f.id !== id && f.siglas.toLowerCase() === siglas.toLowerCase())) {
    throw new Error('Ya existe una facultad con esas siglas.');
  }
  facultades = facultades.map((f) => (f.id === id ? { ...f, nombre, siglas } : f));
  return { ...facultades.find((f) => f.id === id) };
}

export async function cambiarEstadoFacultad(id, activa) {
  await esperar();
  facultades = facultades.map((f) => (f.id === id ? { ...f, activa } : f));
  return { ...facultades.find((f) => f.id === id) };
}
