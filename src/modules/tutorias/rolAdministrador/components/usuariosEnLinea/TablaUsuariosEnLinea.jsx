import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';

import ToastNotification from '../../../../../components/ui/ToastNotification';
import ModalCerrarSesion from './modales/ModalCerrarSesion';
import TarjetaUsuarioEnLinea from './TarjetaUsuarioEnLinea';
import { estaEnLinea, textoHace } from './tiempo';

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

const estiloAccion = (color, fondo) => ({
    color,
    '&:hover': { backgroundColor: fondo },
    '&.Mui-disabled': { color: '#C4C9D4' }
});

// rows: sesiones ya filtradas por la vista.
// onCerrarSesion: recibe el id de la sesión; si falla debe lanzar el error para avisarlo aquí.
export default function TablaUsuariosEnLinea({ rows = [], onCerrarSesion }) {
    // Mismo corte que "md" de Tailwind: menos de 768px = móvil
    const esMovil = useMediaQuery('(max-width:767px)');

    const [selectedRow, setSelectedRow] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Si la búsqueda o una sesión cerrada cambian la cantidad de filas, se vuelve a la primera página
    useEffect(() => {
        setPage(0);
    }, [rows.length]);

    const showToast = (message, type = 'info') => setToast({ open: true, message, type });

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = (row, event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
        setSelectedRow(row);
        setModalOpen(true);
    };

    const handleConfirm = async (row) => {
        try {
            await onCerrarSesion?.(row.id);
            showToast('Sesión cerrada con éxito', 'success');
        } catch (error) {
            console.error('Error al cerrar la sesión:', error);
            showToast('No se pudo cerrar la sesión', 'error');
        }
    };

    const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const paginacion = (
        <TablePagination
            rowsPerPageOptions={esMovil ? [] : [5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
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

    return (
        <>
            {esMovil ? (
                /* ---------- Vista móvil: tarjetas ---------- */
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {visibleRows.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', py: 4, color: '#666666' }}>
                            No hay usuarios en línea
                        </Typography>
                    ) : (
                        <Box className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4">
                            {visibleRows.map((row) => (
                                <TarjetaUsuarioEnLinea key={row.id} row={row} onCerrarSesion={handleOpenModal} />
                            ))}
                        </Box>
                    )}

                    <Paper variant="outlined" sx={{ borderRadius: '12px', borderColor: '#E5E7EB' }}>
                        {paginacion}
                    </Paper>
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
                        <Table stickyHeader sx={{ minWidth: 900 }}>
                            <TableHead>
                                <TableRow sx={{ '& th': ESTILO_ENCABEZADO, '& th:first-of-type': { pl: 3 }, '& th:last-child': { pr: 3 } }}>
                                    <TableCell align="left">Usuario</TableCell>
                                    <TableCell align="left">Correo</TableCell>
                                    <TableCell align="center">Rol</TableCell>
                                    <TableCell align="center">Dispositivo</TableCell>
                                    <TableCell align="center">Última actividad</TableCell>
                                    <TableCell align="center">Estado</TableCell>
                                    <TableCell sx={{ width: '100px' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {visibleRows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 5, color: '#6B7280', border: 0 }}>
                                            No hay usuarios en línea
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    visibleRows.map((row) => {
                                        const enLinea = estaEnLinea(row.ultimaActividad);

                                        return (
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
                                                <TableCell align="left" sx={{ fontWeight: 600, color: '#111827 !important' }}>
                                                    {row.nombre}
                                                    {row.esActual && (
                                                        <Chip size="small" label="Tú" sx={{ ml: 1, fontWeight: 600, height: 20 }} />
                                                    )}
                                                </TableCell>
                                                <TableCell align="left">{row.correo}</TableCell>
                                                <TableCell align="center">{row.rol}</TableCell>
                                                <TableCell align="center">{row.dispositivo}</TableCell>
                                                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                                    {textoHace(row.ultimaActividad)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        size="small"
                                                        label={enLinea ? 'EN LÍNEA' : 'AUSENTE'}
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: '12px',
                                                            ...(enLinea
                                                                ? { backgroundColor: '#E6F4EA', color: '#1B5E20' }
                                                                : { backgroundColor: '#FFF4E5', color: '#8A5A00' })
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title={row.esActual ? 'Tu sesión actual' : 'Cerrar sesión'}>
                                                        <span>
                                                            <IconButton
                                                                size="small"
                                                                disabled={row.esActual}
                                                                sx={estiloAccion('#C62828', 'rgba(198, 40, 40, 0.10)')}
                                                                onClick={(e) => handleOpenModal(row, e)}
                                                            >
                                                                <LogoutOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {paginacion}
                </Paper>
            )}

            <ModalCerrarSesion
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirm}
                data={selectedRow}
            />

            <ToastNotification
                open={toast.open}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
                message={toast.message}
                type={toast.type}
            />
        </>
    );
}