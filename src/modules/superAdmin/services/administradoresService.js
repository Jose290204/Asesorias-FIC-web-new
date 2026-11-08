// DATOS DE PRUEBA en memoria. Endpoints futuros:
//   listar        -> GET   /superadmin/administradores?facultad_id=
//   crear         -> POST  /superadmin/administradores
//   cambiarEstado -> PATCH /superadmin/administradores/{id}
const esperar = (ms = 250) => new Promise((r) => setTimeout(r, ms));

let administradores = [
  { id: 101, nombre: 'María Fernanda López Soto', correo: 'admin1@fic.test', facultadId: 1, estatus: 'activo' },
  { id: 102, nombre: 'Carlos Alberto Ruiz Pérez', correo: 'admin2@fic.test', facultadId: 1, estatus: 'activo' },
  { id: 103, nombre: 'Laura Beatriz Gómez Ibarra', correo: 'laura.gomez@fca.test', facultadId: 2, estatus: 'pendiente' },
];
let siguienteId = 104;

export async function listarAdministradores(facultadId = null) {
  await esperar();
  return administradores
    .filter((a) => !facultadId || a.facultadId === facultadId)
    .map((a) => ({ ...a }));
}

// Pendiente de decidir: contraseña inicial o código de activación. Por ahora queda "pendiente".
export async function crearAdministrador({ nombre, apellidoPaterno, apellidoMaterno, correo, facultadId }) {
  await esperar();
  if (administradores.some((a) => a.correo.toLowerCase() === correo.toLowerCase())) {
    throw new Error('Ya existe un usuario con ese correo.');
  }
  const nombreCompleto = [nombre, apellidoPaterno, apellidoMaterno].filter(Boolean).join(' ');
  const nuevo = { id: siguienteId++, nombre: nombreCompleto, correo, facultadId, estatus: 'pendiente' };
  administradores = [...administradores, nuevo];
  return { ...nuevo };
}

export async function cambiarEstadoAdministrador(id, estatus) {
  await esperar();
  administradores = administradores.map((a) => (a.id === id ? { ...a, estatus } : a));
  return { ...administradores.find((a) => a.id === id) };
}
