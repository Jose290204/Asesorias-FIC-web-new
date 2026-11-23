// Nombre corto de cada licenciatura para las etiquetas de grupo (igual que en el Excel de carga masiva)
const NOMBRES_CORTOS = [
    ['INFORMATICA', 'Informática'],
    ['CIENCIA DE DATOS', 'Ciencia de Datos'],
    ['TELECOMUNICACIONES', 'ITSE']
];

const sinAcentos = (texto) =>
    String(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();

/**
 * Etiqueta de un grupo que lo distingue de los demás con el mismo nombre:
 * "1-1 Informática", "1-1 Informática Virtual", "1-1 Ciencia de Datos", "3-1 ITSE".
 * Es la misma que se usa en la columna "grupo" del Excel de carga de estudiantes.
 *
 * - grupo: { nombre, modalidad, licenciatura_id }
 * - licenciaturas: lista del catálogo, [{ id, nombre }]
 */
export function etiquetaGrupo(grupo, licenciaturas = []) {
    const licenciatura = licenciaturas.find((l) => l.id === grupo.licenciatura_id);
    const nombreLic = sinAcentos(licenciatura?.nombre);
    const corto = NOMBRES_CORTOS.find(([clave]) => nombreLic.includes(clave))?.[1] ?? licenciatura?.nombre ?? '';

    return [grupo.nombre, corto, grupo.modalidad === 'virtual' ? 'Virtual' : '']
        .filter(Boolean)
        .join(' ');
}

// Orden para las listas: por licenciatura, presencial antes que virtual y luego por nombre (1-1, 1-2, 2-1...)
export function compararGrupos(a, b) {
    return (
        a.licenciatura_id - b.licenciatura_id ||
        (a.modalidad === 'virtual') - (b.modalidad === 'virtual') ||
        a.nombre.localeCompare(b.nombre, undefined, { numeric: true })
    );
}
