import api from './api';

// Reglas del backend (se validan también aquí para avisar antes de subir)
export const MATERIAL_MAX_ARCHIVOS = 5;
export const MATERIAL_MAX_MB = 20;
export const MATERIAL_EXTENSIONES = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'zip'];

// GET /asesorias/{id}/material (sin paginar, el más reciente primero)
// Regresa [{ id, nombre, tipo, tamano, subido_por, fecha }]
export const traerMaterial = async (asesoriaId) => {
  const { data } = await api.get(`/asesorias/${asesoriaId}/material`);
  return data.data;
};

// POST /asesor/asesorias/{id}/material como multipart: un campo "archivos[]" por archivo.
// Responde 201 con la lista de los archivos recién creados.
export const subirMaterial = async (asesoriaId, archivos) => {
  const formulario = new FormData();
  archivos.forEach((archivo) => formulario.append('archivos[]', archivo));

  // Sin Content-Type a mano: el navegador lo arma con su "boundary"
  const { data } = await api.post(`/asesor/asesorias/${asesoriaId}/material`, formulario, {
    headers: { 'Content-Type': undefined },
  });
  return data.data;
};

// DELETE /asesor/material/{id}. Responde 204 sin cuerpo.
export const eliminarMaterial = async (materialId) => {
  await api.delete(`/asesor/material/${materialId}`);
};

// GET /material/{id}/descargar. El endpoint exige sesión, así que no sirve un <a href> simple:
// se pide el archivo como blob y se dispara la descarga desde el navegador.
export const descargarMaterial = async (materialId, nombre) => {
  let respuesta;
  try {
    respuesta = await api.get(`/material/${materialId}/descargar`, { responseType: 'blob' });
  } catch (error) {
    // Con responseType blob, el JSON del error llega como Blob: se vuelve a leer como objeto
    // para que mensajesDeError() pueda mostrar el mensaje de la API.
    if (error.response?.data instanceof Blob) {
      try {
        error.response.data = JSON.parse(await error.response.data.text());
      } catch {
        // si no era JSON se deja tal cual
      }
    }
    throw error;
  }

  const url = URL.createObjectURL(respuesta.data);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
};
