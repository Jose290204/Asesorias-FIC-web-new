// DATOS DE PRUEBA en memoria. Endpoints futuros:
//   listar        -> GET   /superadmin/administradores?facultad_id=
//   crear         -> POST  /superadmin/administradores
//   editar        -> PUT   /superadmin/administradores/{id}
//   eliminar      -> DELETE /superadmin/administradores/{id}
//   cambiarEstado -> PATCH /superadmin/administradores/{id}
const esperar = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// La lista trae también el nombre completo ya armado, para mostrarlo en la tabla
const conNombreCompleto = (a) => ({
  ...a,
  nombreCompleto: [a.nombre, a.apellidoPaterno, a.apellidoMaterno].filter(Boolean).join(' '),
});

let administradores = [
  { id: 101, nombre: 'María Fernanda', apellidoPaterno: 'López', apellidoMaterno: 'Soto', correo: 'admin1@fic.test', facultadId: 1, estatus: 'activo' },
  { id: 102, nombre: 'Carlos Alberto', apellidoPaterno: 'Ruiz', apellidoMaterno: 'Pérez', correo: 'admin2@fic.test', facultadId: 1, estatus: 'activo' },
  { id: 103, nombre: 'Laura Beatriz', apellidoPaterno: 'Gómez', apellidoMaterno: 'Ibarra', correo: 'laura.gomez@fca.test', facultadId: 2, estatus: 'pendiente' },
];
let siguienteId = 104;

export async function listarAdministradores(facultadId = null) {
  await esperar();
  return administradores
    .filter((a) => !facultadId || a.facultadId === facultadId)
    .map(conNombreCompleto);
}

// Pendiente de decidir: contraseña inicial o código de activación. Por ahora queda "pendiente".
export async function crearAdministrador({ nombre, apellidoPaterno, apellidoMaterno, correo, facultadId }) {
  await esperar();
  if (administradores.some((a) => a.correo.toLowerCase() === correo.toLowerCase())) {
    throw new Error('Ya existe un usuario con ese correo.');
  }
  const nuevo = { id: siguienteId++, nombre, apellidoPaterno, apellidoMaterno, correo, facultadId, estatus: 'pendiente' };
  administradores = [...administradores, nuevo];
  return conNombreCompleto(nuevo);
}

export async function editarAdministrador(id, { nombre, apellidoPaterno, apellidoMaterno, correo, facultadId }) {
  await esperar();
  if (administradores.some((a) => a.id !== id && a.correo.toLowerCase() === correo.toLowerCase())) {
    throw new Error('Ya existe un usuario con ese correo.');
  }
  administradores = administradores.map((a) =>
    a.id === id ? { ...a, nombre, apellidoPaterno, apellidoMaterno, correo, facultadId } : a
  );
  return conNombreCompleto(administradores.find((a) => a.id === id));
}

export async function cambiarEstadoAdministrador(id, estatus) {
  await esperar();
  administradores = administradores.map((a) => (a.id === id ? { ...a, estatus } : a));
  return conNombreCompleto(administradores.find((a) => a.id === id));
}

export async function eliminarAdministrador(id) {
  await esperar();
  administradores = administradores.filter((a) => a.id !== id);
}
