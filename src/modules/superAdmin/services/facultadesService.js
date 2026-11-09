// DATOS DE PRUEBA en memoria (se reinician al recargar la página).
// Cuando exista el backend se reemplaza el cuerpo de cada función por la llamada a api:
//   listar   -> GET   /superadmin/facultades
//   crear    -> POST  /superadmin/facultades   (multipart/form-data: nombre, siglas, logo)
//   editar   -> POST  /superadmin/facultades/{id} con _method=PUT (multipart, por el archivo)
//     logo: File = reemplazar | null = quitar | undefined = dejar el actual
//   cambiarEstado -> PATCH /superadmin/facultades/{id}  { activa }
// Las vistas no cambian: ya consumen estas funciones.
import logoFic from '../../../assets/fic_logo.png';

const esperar = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// En la prueba el logo se guarda como data URL; con el backend será la URL que él devuelva
const leerComoDataUrl = (archivo) =>
  new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result);
    lector.onerror = () => reject(new Error('No se pudo leer el logo.'));
    lector.readAsDataURL(archivo);
  });

let facultades = [
  { id: 1, nombre: 'Facultad de Informática Culiacán', siglas: 'FIC', logo: logoFic, activa: true, administradores: 2, asesores: 14, estudiantes: 320, asesorias: 87 },
  { id: 2, nombre: 'Facultad de Contaduría y Administración', siglas: 'FCA', logo: null, activa: true, administradores: 1, asesores: 6, estudiantes: 140, asesorias: 22 },
  { id: 3, nombre: 'Facultad de Ingeniería Culiacán', siglas: 'FIC-ING', logo: null, activa: false, administradores: 0, asesores: 0, estudiantes: 0, asesorias: 0 },
];
let siguienteId = 4;

export async function listarFacultades() {
  await esperar();
  return facultades.map((f) => ({ ...f }));
}

export async function crearFacultad({ nombre, siglas, logo }) {
  await esperar();
  if (facultades.some((f) => f.siglas.toLowerCase() === siglas.toLowerCase())) {
    throw new Error('Ya existe una facultad con esas siglas.');
  }
  const urlLogo = logo ? await leerComoDataUrl(logo) : null;
  const nueva = { id: siguienteId++, nombre, siglas, logo: urlLogo, activa: true, administradores: 0, asesores: 0, estudiantes: 0, asesorias: 0 };
  facultades = [...facultades, nueva];
  return { ...nueva };
}

export async function editarFacultad(id, { nombre, siglas, logo }) {
  await esperar();
  if (facultades.some((f) => f.id !== id && f.siglas.toLowerCase() === siglas.toLowerCase())) {
    throw new Error('Ya existe una facultad con esas siglas.');
  }
  // undefined = no tocar el logo; null = quitarlo; File = reemplazarlo
  const urlLogo = logo instanceof File ? await leerComoDataUrl(logo) : logo;
  facultades = facultades.map((f) =>
    f.id === id ? { ...f, nombre, siglas, ...(urlLogo !== undefined && { logo: urlLogo }) } : f
  );
  return { ...facultades.find((f) => f.id === id) };
}

export async function cambiarEstadoFacultad(id, activa) {
  await esperar();
  facultades = facultades.map((f) => (f.id === id ? { ...f, activa } : f));
  return { ...facultades.find((f) => f.id === id) };
}
