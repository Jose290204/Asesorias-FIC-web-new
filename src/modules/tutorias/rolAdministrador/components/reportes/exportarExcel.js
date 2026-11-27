// rolAdministrador/components/reportes/exportarExcel.js

// Colores (formato ARGB que usa Excel)
const AZUL = 'FF1E3A8A';
const BLANCO = 'FFFFFFFF';
const GRIS_FILA = 'FFF3F4F6';
const GRIS_BORDE = 'FFD1D5DB';
const GRIS_TEXTO = 'FF6B7280';

// Colores por estatus (relleno y texto)
const COLORES_ESTATUS = {
    'en curso': { fondo: 'FFDBEAFE', texto: 'FF1E40AF' },
    completada: { fondo: 'FFDCFCE7', texto: 'FF166534' },
    cancelada: { fondo: 'FFFEE2E2', texto: 'FF991B1B' }
};

const BORDE = {
    top: { style: 'thin', color: { argb: GRIS_BORDE } },
    left: { style: 'thin', color: { argb: GRIS_BORDE } },
    bottom: { style: 'thin', color: { argb: GRIS_BORDE } },
    right: { style: 'thin', color: { argb: GRIS_BORDE } }
};

// Excel no permite en el nombre de una hoja: \ / ? * [ ] : ni más de 31 caracteres
const nombreHoja = (texto, usados) => {
    const base = (texto || 'Hoja').replace(/[\\/?*[\]:]/g, ' ').trim().slice(0, 31) || 'Hoja';
    let nombre = base;
    let n = 2;
    while (usados.has(nombre)) {
        const sufijo = ` ${n++}`;
        nombre = base.slice(0, 31 - sufijo.length) + sufijo;
    }
    usados.add(nombre);
    return nombre;
};

// Estilo de una fila de encabezado: fondo azul, letra blanca y en negrita
const estilarEncabezado = (fila) => {
    fila.height = 22;
    fila.eachCell((celda) => {
        celda.font = { bold: true, color: { argb: BLANCO } };
        celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AZUL } };
        celda.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        celda.border = BORDE;
    });
};

// Estilo de una fila de datos: bordes y fila alterna en gris claro
const estilarFila = (fila, indice) => {
    fila.eachCell({ includeEmpty: true }, (celda) => {
        celda.border = BORDE;
        celda.alignment = { vertical: 'top', wrapText: true };
        if (indice % 2 === 1) {
            celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRIS_FILA } };
        }
    });
};

/**
 * Exporta un reporte a Excel (.xlsx) con colores. Misma firma que exportarPdf.
 * Crea una hoja "Resumen" (título, filtros y totales) y una hoja por cada sección.
 */
export async function exportarExcel({ titulo, filtros = [], resumen = [], secciones = [] }) {
    // Se carga solo al exportar, para no inflar el bundle inicial
    const ExcelJS = (await import('exceljs')).default;

    const libro = new ExcelJS.Workbook();
    libro.creator = 'Asesorías FIC';
    libro.created = new Date();
    const usados = new Set();

    // ---------- Hoja Resumen ----------
    const hojaResumen = libro.addWorksheet(nombreHoja('Resumen', usados), { views: [{ showGridLines: false }] });
    hojaResumen.columns = [{ width: 40 }, { width: 18 }, { width: 40 }];

    const filaTitulo = hojaResumen.addRow([titulo]);
    filaTitulo.getCell(1).font = { bold: true, size: 16, color: { argb: AZUL } };
    filaTitulo.height = 26;

    const filaFecha = hojaResumen.addRow([`Generado el ${new Date().toLocaleDateString('es-MX', { dateStyle: 'long' })}`]);
    filaFecha.getCell(1).font = { italic: true, color: { argb: GRIS_TEXTO } };
    hojaResumen.addRow([]);

    if (filtros.length > 0) {
        hojaResumen.addRow(['Filtros']).getCell(1).font = { bold: true, color: { argb: AZUL } };
        filtros.forEach((f) => hojaResumen.addRow([f]));
        hojaResumen.addRow([]);
    }

    if (resumen.length > 0) {
        estilarEncabezado(hojaResumen.addRow(['Resumen', 'Valor', 'Detalle']));
        resumen.forEach((r, i) => {
            const fila = hojaResumen.addRow([r.titulo, r.valor, r.detalle ?? '']);
            estilarFila(fila, i);
            fila.getCell(1).font = { bold: true };
            fila.getCell(2).alignment = { vertical: 'top', horizontal: 'center' };
        });
    }

    // ---------- Una hoja por sección ----------
    secciones.forEach((seccion) => {
        const hoja = libro.addWorksheet(nombreHoja(seccion.titulo, usados), {
            views: [{ state: 'frozen', ySplit: 1 }] // la fila de encabezados queda fija al bajar
        });

        const filas = seccion.rows.map((row) => seccion.columnas.map((c) => row[c.campo] ?? ''));

        hoja.columns = seccion.columnas.map((c, i) => {
            const maximo = Math.max(String(c.etiqueta).length, ...filas.map((f) => String(f[i]).length));
            return { width: Math.min(Math.max(maximo + 2, 10), 50) };
        });

        estilarEncabezado(hoja.addRow(seccion.columnas.map((c) => c.etiqueta)));

        filas.forEach((valores, i) => {
            const fila = hoja.addRow(valores);
            estilarFila(fila, i);

            // Colorea la celda del estatus (En curso / Completada / Cancelada)
            seccion.columnas.forEach((c, col) => {
                if (c.campo !== 'estatus') return;
                const color = COLORES_ESTATUS[String(valores[col]).toLowerCase()];
                if (!color) return;
                const celda = fila.getCell(col + 1);
                celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color.fondo } };
                celda.font = { bold: true, color: { argb: color.texto } };
                celda.alignment = { vertical: 'top', horizontal: 'center' };
            });
        });

        // Filtros desplegables en los encabezados (solo si hay filas)
        if (filas.length > 0) {
            hoja.autoFilter = {
                from: { row: 1, column: 1 },
                to: { row: filas.length + 1, column: seccion.columnas.length }
            };
        }
    });

    // ---------- Descargar ----------
    const buffer = await libro.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const fecha = new Date().toISOString().slice(0, 10);
    const archivo = `${(titulo || 'reporte').replace(/\s+/g, '_')}_${fecha}.xlsx`;

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = archivo;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
}
