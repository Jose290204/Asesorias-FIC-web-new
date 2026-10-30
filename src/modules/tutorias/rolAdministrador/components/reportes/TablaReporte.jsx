
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useMemo, useState } from 'react';

// Estilo del encabezado de la tabla
// TODO: compartir con las demás tablas del admin cuando se haga la limpieza de duplicados
const ESTILO_ENCABEZADO = {
    backgroundColor: '#244B91',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    borderBottom: 0,
    py: 1.75,
    whiteSpace: 'nowrap'
};

// Compara dos valores: números como números y texto en orden alfabético del español
const comparar = (a, b) => {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a ?? '').localeCompare(String(b ?? ''), 'es', { sensitivity: 'base' });
};

// Propiedades de la etiqueta (chip) de una columna: con color propio si la columna trae estiloChip
const propsChip = (col, valor) =>
    col.estiloChip
        ? { sx: { ...col.estiloChip(valor), fontWeight: 600, fontSize: '12px' } }
        : { variant: 'outlined', sx: { borderColor: '#BDBDBD', color: '#555555', fontWeight: 600, fontSize: '12px' } };

/**
 * Tabla genérica para los reportes del administrador (tabla en escritorio, tarjetas en celular).
 *
 * Props:
 *  - columnas: [{ campo, etiqueta, alinear?: 'left' | 'center', principal?: boolean, chip?: boolean, estiloChip?: (valor) => object, ordenarPor?: string }]
 *      · estiloChip: recibe el valor y devuelve { backgroundColor, color } para pintar la etiqueta (si no se manda, va con borde gris)
 *      · ordenarPor: campo por el que se ordena al tocar el encabezado (útil si lo que se ve es un texto, como una fecha)
 *      · principal: columna que sirve de título en la tarjeta (solo una)
 *      · chip: el valor se muestra como etiqueta
 *      · el resto se muestra como "etiqueta: valor"
 *  - rows: filas ya filtradas por la vista (cada una con `id`)
 *  - ordenInicial: { campo, direccion: 'asc' | 'desc' }
 *  - anchoMinimo: ancho mínimo de la tabla en escritorio (si es más angosta el contenedor, aparece scroll horizontal)
 *  - textoVacio: mensaje cuando no hay filas
 */
export default function TablaReporte({
    columnas = [],
    rows = [],
    ordenInicial = null,
    anchoMinimo = 900,
    textoVacio = 'No se encontraron resultados'
}) {
    // Mismo corte que "md" de Tailwind: menos de 768px = móvil
    const esMovil = useMediaQuery('(max-width:767px)');

    const [orden, setOrden] = useState(ordenInicial);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Si el filtro cambia la cantidad de filas, se vuelve a la primera página
    useEffect(() => {
        setPage(0);
    }, [rows.length]);

    // Al tocar un encabezado: primero ascendente, luego descendente
    const handleOrdenar = (campo) => {
        setOrden((prev) =>
            prev?.campo === campo && prev.direccion === 'asc'
                ? { campo, direccion: 'desc' }
                : { campo, direccion: 'asc' }
        );
    };

    const filasOrdenadas = useMemo(() => {
        if (!orden) return rows;
        const factor = orden.direccion === 'asc' ? 1 : -1;
        const columna = columnas.find((col) => col.campo === orden.campo);
        const campo = columna?.ordenarPor || orden.campo;
        return [...rows].sort((a, b) => factor * comparar(a[campo], b[campo]));
    }, [rows, orden, columnas]);

    const visibleRows = filasOrdenadas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const columnaPrincipal = columnas.find((col) => col.principal) || columnas[0];
    const columnasChip = columnas.filter((col) => col.chip && col !== columnaPrincipal);
    const columnasDato = columnas.filter((col) => !col.chip && col !== columnaPrincipal);

    const paginacion = (
        <TablePagination
            rowsPerPageOptions={esMovil ? [] : [5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
            }}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ page, count }) => {
                const totalPages = Math.ceil(count / rowsPerPage) || 1;
                return `Página ${page + 1} de ${totalPages}`;
            }}
            sx={{
                borderTop: esMovil ? 'none' : '1px solid #E5E7EB',
                px: 2,
                color: '#374151',
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { color: '#374151' }
            }}
        />
    );

    if (esMovil) {
        /* ---------- Vista móvil: tarjetas ---------- */
        return (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {visibleRows.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', py: 4, color: '#666666' }}>{textoVacio}</Typography>
                ) : (
                    <Box className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4">
                        {visibleRows.map((row) => (
                            <Card
                                key={row.id}
                                sx={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    background: '#FFFFFF',
                                    borderLeft: '20px solid #08338F',
                                    borderRadius: '5px',
                                    boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.20)'
                                }}
                            >
                                <CardContent sx={{ padding: '24px' }}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', mb: 1.5 }}>
                                        {row[columnaPrincipal.campo]}
                                    </Typography>

                                    {columnasChip.length > 0 && (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                            {columnasChip.map((col) => (
                                                <Chip
                                                    key={col.campo}
                                                    size="small"
                                                    label={row[col.campo]}
                                                    {...propsChip(col, row[col.campo])}
                                                />
                                            ))}
                                        </Box>
                                    )}

                                    {/* Datos en dos columnas: etiqueta chica y valor grande */}
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        {columnasDato.map((col) => (
                                            <Box key={col.campo}>
                                                <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>{col.etiqueta}</Typography>
                                                <Typography sx={{ fontSize: '17px', fontWeight: 700, color: '#1F2937' }}>
                                                    {row[col.campo]}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}

                <Paper variant="outlined" sx={{ borderRadius: '12px', borderColor: '#E5E7EB' }}>
                    {paginacion}
                </Paper>
            </Box>
        );
    }

    /* ---------- Vista escritorio: tabla ---------- */
    return (
        <Paper
            variant="outlined"
            sx={{
                width: '100%',
                borderRadius: '12px',
                borderColor: '#E5E7EB',
                overflow: 'hidden',
                boxShadow: '0px 2px 8px rgba(16, 24, 40, 0.06)'
            }}
        >
            <TableContainer sx={{ maxHeight: '560px', overflowY: 'auto' }}>
                <Table stickyHeader sx={{ minWidth: anchoMinimo }}>
                    <TableHead>
                        <TableRow sx={{ '& th': ESTILO_ENCABEZADO, '& th:first-of-type': { pl: 3 }, '& th:last-child': { pr: 3 } }}>
                            {columnas.map((col) => (
                                <TableCell
                                    key={col.campo}
                                    align={col.alinear || 'center'}
                                    sortDirection={orden?.campo === col.campo ? orden.direccion : false}
                                >
                                    <TableSortLabel
                                        active={orden?.campo === col.campo}
                                        direction={orden?.campo === col.campo ? orden.direccion : 'asc'}
                                        onClick={() => handleOrdenar(col.campo)}
                                        sx={{
                                            color: '#FFFFFF !important',
                                            '&:hover': { color: '#FFFFFF' },
                                            '& .MuiTableSortLabel-icon': { color: '#FFFFFF !important' }
                                        }}
                                    >
                                        {col.etiqueta}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {visibleRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columnas.length} align="center" sx={{ py: 5, color: '#6B7280', border: 0 }}>
                                    {textoVacio}
                                </TableCell>
                            </TableRow>
                        ) : (
                            visibleRows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    hover
                                    sx={{
                                        '& td': {
                                            color: '#1F2937',
                                            fontSize: '14.5px',
                                            borderBottom: '1px solid #EEF1F6',
                                            py: 1.75
                                        },
                                        '& td:first-of-type': { pl: 3 },
                                        '& td:last-child': { pr: 3 },
                                        '&:hover': { backgroundColor: '#EAF0FB !important' },
                                        '&:last-child td': { borderBottom: 0 }
                                    }}
                                >
                                    {columnas.map((col) => (
                                        <TableCell
                                            key={col.campo}
                                            align={col.alinear || 'center'}
                                            sx={col === columnaPrincipal ? { fontWeight: 600, color: '#111827 !important' } : undefined}
                                        >
                                            {col.chip ? (
                                                <Chip
                                                    size="small"
                                                    label={row[col.campo]}
                                                    {...propsChip(col, row[col.campo])}
                                                />
                                            ) : (
                                                row[col.campo]
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {paginacion}
        </Paper>
    );
}