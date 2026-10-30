// rolAdministrador/components/reportes/exportarPdf.js

// Código del error que se lanza mientras la exportación no esté implementada
export const PDF_NO_DISPONIBLE = 'PDF_NO_DISPONIBLE';

/**
 * Exporta un reporte a PDF.
 *
 * Recibe todo lo necesario para armar el documento, de modo que solo este archivo cambia
 * cuando se implemente la generación real:
 *  - titulo: título del reporte
 *  - filtros: lista de textos con los filtros aplicados (por ejemplo "Asesor: Todos")
 *  - resumen: [{ titulo, valor, detalle? }] con los totales
 *  - secciones: [{ titulo, columnas: [{ campo, etiqueta }], rows }] una por cada tabla del reporte
 */
// eslint-disable-next-line no-unused-vars
export async function exportarPdf({ titulo, filtros = [], resumen = [], secciones = [] }) {
    // TODO: generar el PDF (en el navegador con jspdf + jspdf-autotable, o pidiéndolo al backend)
    throw new Error(PDF_NO_DISPONIBLE);
}