import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
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
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';

import ToastNotification from '../../../../../components/ui/ToastNotification';
import { formatearFechaVisible } from '../../../rolEstudiante/utils/fechaSolicitud';
import { USAR_DATOS_PRUEBA_ADMIN } from '../../datosPrueba';
import ModalAprobarSolicitud from './modales/ModalAprobarSolicitud';
import ModalInfoSolicitud from './modales/ModalInfoSolicitud';
import ModalRechazarSolicitud from './modales/ModalRechazarSolicitud';
import TarjetaSolicitudAdmin from './TarjetaSolicitudAdmin';

// Estilo del encabezado de la tabla: azul sólido, letras chicas, mayúsculas y en negritas
// TODO: compartir con TablaAsesorias cuando se haga la limpieza de duplicados
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

// rows: filas ya filtradas por la vista. onRemove: quita una fila de la lista (datos de prueba).
// onRefresh: recarga desde la API.
export default function TablaSolicitudes({ rows = [], onRemove, onRefresh }) {
    // Mismo corte que "md" de Tailwind: menos de 768px = móvil
    const esMovil = useMediaQuery('(max-width:767px)');

    // Estados para modales
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalAprobarOpen, setModalAprobarOpen] = useState(false);
    const [modalRechazarOpen, setModalRechazarOpen] = useState(false);

    // Estado para el toast global
    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    // Estados para la paginación
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Si la búsqueda o los filtros cambian la cantidad de filas, se vuelve a la primera página
    useEffect(() => {
        setPage(0);
    }, [rows.length]);

    const showToast = (message, type = 'info') => {
        setToast({ open: true, message, type });
    };

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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

    const handleOpenAprobar = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalAprobarOpen(true);
    };

    const handleOpenRechazar = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalRechazarOpen(true);
    };

    // Aprobar: con datos de prueba solo se quita de la lista; si no, se llama al servicio
    const handleConfirmAprobar = async () => {
        try {
            if (USAR_DATOS_PRUEBA_ADMIN) {
                onRemove?.(selectedRow?.id);
            } else {
                // TODO: await solicitudesService.aprobarSolicitud(selectedRow?.id);
                onRefresh?.();
            }
            showToast('Solicitud aprobada con éxito', 'success');
        } catch (error) {
            console.error(error);
            showToast('Hubo un error al aprobar la solicitud', 'error');
        }
    };

    // Rechazar: igual que aprobar
    const handleConfirmRechazar = async () => {
        try {
            if (USAR_DATOS_PRUEBA_ADMIN) {
                onRemove?.(selectedRow?.id);
            } else {
                // TODO: await solicitudesService.rechazarSolicitud(selectedRow?.id);
                onRefresh?.();
            }
            showToast('Solicitud rechazada', 'success');
        } catch (error) {
            console.error(error);
            showToast('Hubo un error al rechazar la solicitud', 'error');
        }
    };

    const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Paginación compartida; en móvil se oculta el selector de filas por página
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
                            No se encontraron solicitudes
                        </Typography>
                    ) : (
                        <Box className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4">
                            {visibleRows.map((row) => (
                                <TarjetaSolicitudAdmin
                                    key={row.id}
                                    row={row}
                                    onInfo={handleOpenInfo}
                                    onAprobar={handleOpenAprobar}
                                    onRechazar={handleOpenRechazar}
                                />
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
                                    <TableCell sx={{ width: '70px' }} align="center">ID</TableCell>
                                    <TableCell align="left">Materia</TableCell>
                                    <TableCell align="left">Estudiante</TableCell>
                                    <TableCell align="left">Asesor</TableCell>
                                    <TableCell align="center">Fecha</TableCell>
                                    <TableCell align="center">Horario</TableCell>
                                    <TableCell align="center">Modalidad</TableCell>
                                    <TableCell sx={{ width: '160px' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {visibleRows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 5, color: '#6B7280', border: 0 }}>
                                            No se encontraron solicitudes
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
                                            <TableCell align="center" sx={{ color: '#6B7280 !important', fontWeight: 600 }}>
                                                #{row.id_solicitud ?? row.id}
                                            </TableCell>

                                            <TableCell align="left" sx={{ fontWeight: 600, color: '#111827 !important' }}>
                                                {row.materia}
                                            </TableCell>

                                            <TableCell align="left">{row.estudiante}</TableCell>
                                            <TableCell align="left">{row.asesor}</TableCell>

                                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                                {formatearFechaVisible(row.fecha_inicio ?? row.raw?.fecha ?? row.fecha)}
                                            </TableCell>

                                            <TableCell align="center">
                                                {row.horario && (
                                                    <Chip
                                                        size="small"
                                                        label={row.horario}
                                                        sx={{
                                                            backgroundColor: '#E8EEF9',
                                                            color: '#08338F',
                                                            fontWeight: 600,
                                                            fontSize: '12.5px'
                                                        }}
                                                    />
                                                )}
                                            </TableCell>

                                            <TableCell align="center">
                                                {row.modalidad && (
                                                    <Chip
                                                        size="small"
                                                        variant="outlined"
                                                        label={row.modalidad}
                                                        sx={{ borderColor: '#08338F', color: '#08338F', fontWeight: 600, fontSize: '12.5px' }}
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

                                                    <Tooltip title="Aprobar solicitud">
                                                        <IconButton
                                                            size="small"
                                                            sx={estiloAccion('#2E7D32', 'rgba(46, 125, 50, 0.10)')}
                                                            onClick={(e) => handleOpenAprobar(row, e)}
                                                        >
                                                            <CheckCircleOutlinedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Rechazar solicitud">
                                                        <IconButton
                                                            size="small"
                                                            sx={estiloAccion('#C62828', 'rgba(198, 40, 40, 0.10)')}
                                                            onClick={(e) => handleOpenRechazar(row, e)}
                                                        >
                                                            <HighlightOffOutlinedIcon fontSize="small" />
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

                    {paginacion}
                </Paper>
            )}

            {/* Modales (compartidos por la tabla y las tarjetas) */}
            <ModalInfoSolicitud
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedRow}
            />

            <ModalAprobarSolicitud
                open={modalAprobarOpen}
                onClose={() => setModalAprobarOpen(false)}
                onConfirm={handleConfirmAprobar}
                data={selectedRow}
            />

            <ModalRechazarSolicitud
                open={modalRechazarOpen}
                onClose={() => setModalRechazarOpen(false)}
                onConfirm={handleConfirmRechazar}
                data={selectedRow}
            />

            {/* Toast global */}
            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </>
    );
}