// rolAdministrador/components/reportes/exportarPdf.js

// Código del error que se usaba mientras el PDF no estaba implementado.
// Se conserva porque las vistas lo importan.
export const PDF_NO_DISPONIBLE = 'PDF_NO_DISPONIBLE';

const AZUL = [30, 58, 138];
const GRIS = [100, 100, 100];
const MARGEN = 36;

// Tamaños de letra (en puntos)
const TAM_TITULO = 22;
const TAM_FECHA = 11;
const TAM_FILTROS = 12;
const TAM_SECCION = 15;
const TAM_RESUMEN = 11;
const TAM_TABLA = 10;
const TAM_PIE = 9;

/**
 * Exporta un reporte a PDF. Misma firma que exportarExcel:
 *  - titulo, filtros (textos), resumen [{ titulo, valor, detalle? }]
 *  - secciones [{ titulo, columnas: [{ campo, etiqueta }], rows }]
 */
export async function exportarPdf({ titulo, filtros = [], resumen = [], secciones = [] }) {
    // Se cargan solo al exportar, para no inflar el bundle inicial
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    // Si alguna tabla tiene muchas columnas, la hoja va horizontal
    const horizontal = secciones.some((s) => s.columnas.length > 5);
    const doc = new jsPDF({ orientation: horizontal ? 'landscape' : 'portrait', unit: 'pt', format: 'letter' });
    const ancho = doc.internal.pageSize.getWidth();
    const alto = doc.internal.pageSize.getHeight();
    const anchoUtil = ancho - MARGEN * 2;

    let y = 56;

    // Título y fecha
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TAM_TITULO);
    doc.setTextColor(...AZUL);
    doc.text(titulo || 'Reporte', MARGEN, y);

    y += 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(TAM_FECHA);
    doc.setTextColor(...GRIS);
    doc.text(`Generado el ${new Date().toLocaleDateString('es-MX', { dateStyle: 'long' })}`, MARGEN, y);

    // Filtros aplicados
    if (filtros.length > 0) {
        y += 20;
        doc.setFontSize(TAM_FILTROS);
        const lineas = doc.splitTextToSize(filtros.join(' · '), anchoUtil);
        doc.text(lineas, MARGEN, y);
        y += lineas.length * 15;
    }

    // Resumen (totales)
    if (resumen.length > 0) {
        autoTable(doc, {
            startY: y + 10,
            head: [['Resumen', 'Valor', 'Detalle']],
            body: resumen.map((r) => [String(r.titulo ?? ''), String(r.valor ?? ''), String(r.detalle ?? '')]),
            theme: 'grid',
            styles: { fontSize: TAM_RESUMEN, cellPadding: 5 },
            headStyles: { fillColor: AZUL, textColor: [255, 255, 255], fontStyle: 'bold' },
            margin: { left: MARGEN, right: MARGEN }
        });
        y = doc.lastAutoTable.finalY;
    }

    // Una tabla por sección
    secciones.forEach((seccion) => {
        y += 32;
        // Si queda poco espacio, el título de la sección pasa a la hoja siguiente
        if (y > alto - 130) {
            doc.addPage();
            y = 56;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(TAM_SECCION);
        doc.setTextColor(...AZUL);
        doc.text(seccion.titulo, MARGEN, y);

        const body = seccion.rows.length > 0
            ? seccion.rows.map((row) => seccion.columnas.map((c) => String(row[c.campo] ?? '')))
            : [[{ content: 'Sin datos', colSpan: seccion.columnas.length, styles: { halign: 'center', textColor: GRIS } }]];

        autoTable(doc, {
            startY: y + 10,
            head: [seccion.columnas.map((c) => c.etiqueta)],
            body,
            theme: 'striped',
            styles: { fontSize: TAM_TABLA, cellPadding: 4, overflow: 'linebreak', textColor: [30, 30, 30] },
            headStyles: { fillColor: AZUL, textColor: [255, 255, 255], fontSize: TAM_TABLA, fontStyle: 'bold' },
            margin: { left: MARGEN, right: MARGEN, bottom: 44 }
        });
        y = doc.lastAutoTable.finalY;
    });

    // Número de página en todas las hojas
    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(TAM_PIE);
        doc.setTextColor(...GRIS);
        doc.text(`Asesorías FIC · Página ${i} de ${total}`, ancho / 2, alto - 20, { align: 'center' });
    }

    const fecha = new Date().toISOString().slice(0, 10);
    doc.save(`${(titulo || 'reporte').replace(/\s+/g, '_')}_${fecha}.pdf`);
}