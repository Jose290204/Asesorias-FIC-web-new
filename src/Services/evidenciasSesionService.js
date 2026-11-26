import api from './api';
import { MATERIAL_EXTENSIONES, MATERIAL_MAX_ARCHIVOS, MATERIAL_MAX_MB } from './materialAsesorService';

// Evidencias de una sesión (fotos o archivos que respaldan que la sesión se dio).
// Las reglas de archivos son las mismas del material: hasta 5 por envío, 20 MB cada uno,
// PDF, Word, PowerPoint, Excel, JPG, PNG o ZIP (ver materialAsesorService).
//
//   subir     -> POST   /asesor/sesiones/{id}/evidencias   (multipart, campo "archivos[]")
//   eliminar  -> DELETE /asesor/evidencias/{id}
//   descargar -> GET    /evidencias/{id}/descargar          (ruta compartida)
// El administrador usa las mismas rutas con prefijo /admin (ver asesoriasAdminService).
// Cada evidencia llega como { id, nombre, tipo, tamano, fecha }.

const armarFormulario = (archivos) => {
  const formulario = new FormData();
  archivos.forEach((archivo) => formulario.append('archivos[]', archivo));
  return formulario;
};

// Sin Content-Type a mano: el navegador lo arma con su "boundary"
const MULTIPART = { headers: { 'Content-Type': undefined } };

// Responde 201 con la lista de las evidencias recién creadas
export const subirEvidencias = async (sesionId, archivos) => {
  const { data } = await api.post(`/asesor/sesiones/${sesionId}/evidencias`, armarFormulario(archivos), MULTIPART);
  return data.data;
};

// Responde 204 sin cuerpo
export const eliminarEvidencia = async (evidenciaId) => {
  await api.delete(`/asesor/evidencias/${evidenciaId}`);
};

// El endpoint exige sesión, así que no sirve un <a href> simple: se pide como blob y se dispara la descarga
export const descargarEvidencia = async (evidenciaId, nombre) => {
  let respuesta;
  try {
    respuesta = await api.get(`/evidencias/${evidenciaId}/descargar`, { responseType: 'blob' });
  } catch (error) {
    // Con responseType blob el JSON del error llega como Blob: se vuelve a leer para mostrar el mensaje
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

// Avisa antes de subir lo que el backend rechazaría. Regresa el texto del problema o null.
export const validarEvidencias = (archivos) => {
    if (archivos.length > MATERIAL_MAX_ARCHIVOS) {
        return `Solo se pueden subir ${MATERIAL_MAX_ARCHIVOS} archivos a la vez.`;
    }
    for (const archivo of archivos) {
        const extension = archivo.name.split('.').pop().toLowerCase();
        if (!MATERIAL_EXTENSIONES.includes(extension)) {
            return `"${archivo.name}" no es un tipo permitido (PDF, Word, PowerPoint, Excel, JPG, PNG o ZIP).`;
        }
        if (archivo.size > MATERIAL_MAX_MB * 1024 * 1024) {
            return `"${archivo.name}" pesa más de ${MATERIAL_MAX_MB} MB.`;
        }
    }
    return null;
};
