// Tiempo mínimo (ms) que se muestra el "cargando" al pedir una lista: si la API responde al instante,
// el spinner aparecía y desaparecía de golpe y parecía un parpadeo
export const MINIMO_CARGA_MS = 400;

/**
 * Espera a que termine la promesa y también a que pase el tiempo mínimo.
 * Si la promesa falla, el error sale de inmediato (sin esperar).
 * Con ms = 0 no agrega ninguna espera (por ejemplo en las recargas silenciosas).
 */
export async function conTiempoMinimo(promesa, ms = MINIMO_CARGA_MS) {
    const [resultado] = await Promise.all([promesa, new Promise((resolver) => setTimeout(resolver, ms))]);
    return resultado;
}
