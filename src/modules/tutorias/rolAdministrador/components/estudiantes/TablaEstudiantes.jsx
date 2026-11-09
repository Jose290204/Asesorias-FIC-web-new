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
import { useState } from 'react';

import ModalEliminarEstudiante from './modales/ModalEliminarEstudiante';
import ModalEstudiante from './modales/ModalEstudiante';
import TarjetaEstudiante from './TarjetaEstudiante';

// Estilo del encabezado de la tabla: azul sólido, letras chicas, mayúsculas y en negritas
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

// Botón de acción redondo y suave: ícono con su color y fondo tenue al pasar el mouse
const estiloAccion = (color, fondo) => ({
    color,
    '&:hover': { backgroundColor: fondo },
    '&.Mui-disabled': { color: '#C4C9D4' }
});

// rows: la página actual que entregó la API (la búsqueda, los filtros y la paginación los maneja la vista).
// onUpdate(estudiante, formulario) y onDelete(estudiante): regresan una promesa con true si salió bien
// y false si falló; la vista es quien avisa del resultado con su toast.
export default function TablaEstudiantes({ rows = [], onUpdate, onDelete }) {
    // Mismo corte que "md" de Tailwind: menos de 768px = móvil
    const esMovil = useMediaQuery('(max-width:767px)');

    // Estados para modales
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [modalEliminarOpen, setModalEliminarOpen] = useState(false);

    // Quita el foco del elemento activo antes de abrir un modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    // Handlers para abrir modales (los usan la tabla y las tarjetas)
    const handleOpenInfo = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalInfoOpen(true);
    };

    const handleOpenEditar = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalEditarOpen(true);
    };

    const handleOpenEliminar = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalEliminarOpen(true);
    };

    const handleConfirmEliminar = () => onDelete?.(selectedRow);

    return (
        <>
            {esMovil ? (
                /* ---------- Vista móvil: tarjetas ---------- */
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {rows.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', py: 4, color: '#666666' }}>
                            No se encontraron estudiantes
                        </Typography>
                    ) : (
                        <Box className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4">
                            {rows.map((row) => (
                                <TarjetaEstudiante
                                    key={row.id}
                                    row={row}
                                    onInfo={handleOpenInfo}
                                    onEditar={handleOpenEditar}
                                    onEliminar={handleOpenEliminar}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            ) : (
                /* ---------- Vista escritorio: tabla ---------- */
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
                                    <TableCell align="left">Licenciatura</TableCell>
                                    <TableCell align="center">Grupo</TableCell>
                                    <TableCell sx={{ width: '120px' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 5, color: '#6B7280', border: 0 }}>
                                            No se encontraron estudiantes
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

                                            <TableCell align="left">{row.licenciatura}</TableCell>

                                            <TableCell align="center">
                                                {row.grupo && (
                                                    <Chip
                                                        size="small"
                                                        label={row.grupo}
                                                        sx={{ backgroundColor: '#E8EEF9', color: '#08338F', fontWeight: 600, fontSize: '12px' }}
                                                    />
                                                )}
                                            </TableCell>

                                            <TableCell align="center">
                                                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                                                    <Tooltip title="Información">
                                                        <IconButton
                                                            size="small"
                                                            sx={estiloAccion('#08338F', 'rgba(8, 51, 143, 0.08)')}
                                                            onClick={(e) => handleOpenInfo(row, e)}
                                                        >
                                                            <InfoOutlinedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Editar">
                                                        <IconButton
                                                            size="small"
                                                            sx={estiloAccion('#8A6D2B', 'rgba(196, 158, 13, 0.12)')}
                                                            onClick={(e) => handleOpenEditar(row, e)}
                                                        >
                                                            <EditOutlinedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Dar de baja">
                                                        <IconButton
                                                            size="small"
                                                            sx={estiloAccion('#C62828', 'rgba(198, 40, 40, 0.10)')}
                                                            onClick={(e) => handleOpenEliminar(row, e)}
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
            )}

            {/* Modales (compartidos por la tabla y las tarjetas) */}
            {/* Información: todo bloqueado */}
            <ModalEstudiante
                soloLectura
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedRow}
            />

            {/* Editar */}
            <ModalEstudiante
                open={modalEditarOpen}
                onClose={() => setModalEditarOpen(false)}
                data={selectedRow}
                onSave={onUpdate}
            />

            <ModalEliminarEstudiante
                open={modalEliminarOpen}
                onClose={() => setModalEliminarOpen(false)}
                onConfirm={handleConfirmEliminar}
                data={selectedRow}
            />
        </>
    );
}
