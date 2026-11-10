import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import TarjetaAsesor from './TarjetaAsesor';

// Estilo del encabezado de la tabla: azul sólido, letras chicas, mayúsculas y en negritas
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

// Botón de acción redondo y suave: ícono con su color y fondo tenue al pasar el mouse
const estiloAccion = (color, fondo) => ({
    color,
    '&:hover': { backgroundColor: fondo },
    '&.Mui-disabled': { color: '#C4C9D4' }
});

/**
 * Tabla (escritorio) o tarjetas (celular) de asesores, para disciplinares y par. Solo muestra:
 * quien la usa decide qué hace cada botón y maneja los modales.
 *
 * Props:
 *  - rows: la página actual que entregó la API (la búsqueda y la paginación las maneja la vista)
 *  - onInfo(row, event), onBaja(row, event); onEditar(row, event) es opcional (los pares no se editan aquí)
 *  - textoBaja: 'Dar de baja' (disciplinares) o 'Quitar rol' (pares)
 *  - textoVacio: lo que se muestra si no hay filas
 *  - etiquetaId: texto de la tarjeta ("Asesor #3")
 */
export default function TablaAsesores({
    rows = [],
    onInfo,
    onEditar,
    onBaja,
    textoBaja = 'Dar de baja',
    textoVacio = 'No se encontraron asesores',
    etiquetaId = 'Asesor'
}) {
    // Mismo corte que "md" de Tailwind: menos de 768px = móvil
    const esMovil = useMediaQuery('(max-width:767px)');

    // Quita el foco del elemento activo antes de abrir un modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    const conFoco = (accion) => (row, event) => {
        clearFocus(event);
        accion(row, event);
    };

    const handleInfo = conFoco(onInfo);
    const handleEditar = onEditar ? conFoco(onEditar) : undefined;
    const handleBaja = conFoco(onBaja);

    if (esMovil) {
        /* ---------- Vista móvil: tarjetas ---------- */
        return (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {rows.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', py: 4, color: '#666666' }}>{textoVacio}</Typography>
                ) : (
                    <Box className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4">
                        {rows.map((row) => (
                            <TarjetaAsesor
                                key={row.id}
                                row={row}
                                onInfo={handleInfo}
                                onEditar={handleEditar}
                                onBaja={handleBaja}
                                textoBaja={textoBaja}
                                etiquetaId={etiquetaId}
                            />
                        ))}
                    </Box>
                )}
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
                <Table stickyHeader sx={{ minWidth: 950 }}>
                    <TableHead>
                        <TableRow sx={{ '& th': ESTILO_ENCABEZADO, '& th:first-of-type': { pl: 3 }, '& th:last-child': { pr: 3 } }}>
                            <TableCell sx={{ width: '70px' }} align="center">ID</TableCell>
                            <TableCell align="left">Nombre</TableCell>
                            <TableCell align="left">Correo</TableCell>
                            <TableCell align="center">Número de Cuenta</TableCell>
                            <TableCell align="center">Teléfono</TableCell>
                            <TableCell align="center">Disponibilidad</TableCell>
                            <TableCell sx={{ width: '120px' }} align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 5, color: '#6B7280', border: 0 }}>
                                    {textoVacio}
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => (
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
                                    <TableCell align="center" sx={{ color: '#6B7280 !important', fontWeight: 600 }}>
                                        #{row.id}
                                    </TableCell>

                                    <TableCell align="left" sx={{ fontWeight: 600, color: '#111827 !important' }}>
                                        {row.nombre}
                                    </TableCell>

                                    <TableCell align="left">{row.correo}</TableCell>
                                    <TableCell align="center">{row.numeroCuenta}</TableCell>
                                    <TableCell align="center">{row.telefono}</TableCell>

                                    {/* Sin materias, horarios o modalidad el asesor no aparece para los estudiantes */}
                                    <TableCell align="center">
                                        <Chip
                                            size="small"
                                            label={row.disponibilidad.vacia ? 'Pendiente' : 'Lista'}
                                            sx={
                                                row.disponibilidad.vacia
                                                    ? { backgroundColor: '#FFF4D6', color: '#8A6D2B', fontWeight: 600, fontSize: '12px' }
                                                    : { backgroundColor: '#E6F2E7', color: '#1b5e20', fontWeight: 600, fontSize: '12px' }
                                            }
                                        />
                                    </TableCell>

                                    <TableCell align="center">
                                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                                            <Tooltip title="Información">
                                                <IconButton
                                                    size="small"
                                                    sx={estiloAccion('#08338F', 'rgba(8, 51, 143, 0.08)')}
                                                    onClick={(e) => handleInfo(row, e)}
                                                >
                                                    <InfoOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            {handleEditar && (
                                                <Tooltip title="Editar">
                                                    <IconButton
                                                        size="small"
                                                        sx={estiloAccion('#8A6D2B', 'rgba(196, 158, 13, 0.12)')}
                                                        onClick={(e) => handleEditar(row, e)}
                                                    >
                                                        <EditOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            <Tooltip title={textoBaja}>
                                                <IconButton
                                                    size="small"
                                                    sx={estiloAccion('#C62828', 'rgba(198, 40, 40, 0.10)')}
                                                    onClick={(e) => handleBaja(row, e)}
                                                >
                                                    <DeleteOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
