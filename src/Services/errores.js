// Convierte cualquier error de la API en una lista de textos listos para mostrar
export function mensajesDeError(error) {
  const data = error.response?.data;

  // Sin respuesta: servidor caído o sin internet
  if (!data) return ['No se pudo conectar con el servidor.'];

  // 422: un mensaje por cada campo con problema
  if (data.errors) return Object.values(data.errors).flat();

  // 401, 403, 404, 409, 429...
  return [data.message ?? 'Ocurrió un error inesperado.'];
}

// Para decidir sin depender del texto: codigoDeError(e) === 'cuenta_inactiva'
export const codigoDeError = (error) => error.response?.data?.codigo ?? null;