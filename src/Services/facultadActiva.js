// Facultad "activa" del super administrador: la facultad en cuyo panel está trabajando.
// Se guarda en sessionStorage (por pestaña): sobrevive a recargar la página
// pero no se mezcla entre pestañas ni queda guardada al cerrar el navegador.
// Lo leen: el contexto (para la UI) y api.js (para mandar el header X-Facultad-Id).
const CLAVE = 'facultadActiva';

export function leerFacultadActiva() {
  try {
    const crudo = sessionStorage.getItem(CLAVE);
    return crudo ? JSON.parse(crudo) : null;
  } catch {
    return null;
  }
}

// Solo se guarda lo necesario para mostrar la barra: id, nombre y siglas
export function guardarFacultadActiva({ id, nombre, siglas }) {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify({ id, nombre, siglas }));
  } catch {
    /* sin storage disponible: la facultad activa solo vive en memoria */
  }
}

export function limpiarFacultadActiva() {
  try {
    sessionStorage.removeItem(CLAVE);
  } catch {
    /* nada que limpiar */
  }
}
