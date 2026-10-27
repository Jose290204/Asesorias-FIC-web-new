import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
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
import { useEffect, useMemo, useState } from 'react';


import ModalMaterialAdicional from '../../../../../components/modales/ModalMaterialAdicional';
import ToastNotification from '../../../../../components/ui/ToastNotification';
import { formatearFechaVisible } from '../../../rolEstudiante/utils/fechaSolicitud';
import TarjetaAsesoriaAdmin from '../../components/asesorias/TarjetaAsesoriaAdmin';
import { USAR_DATOS_PRUEBA_ADMIN } from '../../datosPrueba';
import { asesoriasService } from '../../services/asesoriasService';
import ModalChatAsesoriaAdmin from './modales/ModalChatAsesoriaAdmin';
import ModalConfirmarAsesoria from './modales/ModalConfirmarAsesoria';
import ModalEliminarAsesoria from './modales/ModalEliminarAsesoria';
import ModalInfoAsesoria from './modales/ModalInfoAsesoria';
import ModalSesionesAsesoria from './modales/ModalSesionesAsesoria';

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

// rows: filas ya filtradas por la vista. onRefresh: recarga desde la API.
// onRemove: quita una fila de la lista (solo se usa con datos de prueba).
export default function TablaAsesorias({ rows = [], onRefresh, onRemove }) {
    // Mismo corte que "md" de Tailwind: menos de 768px = móvil
    const esMovil = useMediaQuery('(max-width:767px)');

    // Estados para Modales
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
    const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);
    const [modalChatOpen, setModalChatOpen] = useState(false);
    const [modalSesionesOpen, setModalSesionesOpen] = useState(false);
    // Sesiones ya guardadas por asesoría { [id]: [...] } (mientras no exista el endpoint)
    const [sesionesGuardadas, setSesionesGuardadas] = useState({});

    // Estados para la Paginación
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Si la búsqueda cambia la cantidad de filas, se vuelve a la primera página
    useEffect(() => {
        setPage(0);
    }, [rows.length]);

    // Estado para el Toast Global
    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

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

    const handleOpenMaterial = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalMaterialOpen(true);
    };

    // El administrador solo puede leer el chat, no escribir
    const handleOpenChat = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalChatOpen(true);
    };

    const handleOpenSesiones = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalSesionesOpen(true);
    };

    const handleOpenAprobar = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalConfirmOpen(true);
    };

    const handleOpenEliminar = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalEliminarOpen(true);
    };

    // Completar: con datos de prueba solo se quita de la lista; si no, se llama al servicio
    const handleConfirmAprobar = async () => {
        try {
            if (USAR_DATOS_PRUEBA_ADMIN) {
                onRemove?.(selectedRow?.id);
            } else {
                await asesoriasService.completarAsesoria(selectedRow?.id);
                onRefresh?.();
            }
            showToast('Asesoría completada correctamente', 'success');
            setModalConfirmOpen(false);
        } catch (error) {
            console.error(error);
            showToast('Hubo un error al completar la asesoría', 'error');
        }
    };

    const handleConfirmEliminar = async () => {
        try {
            if (USAR_DATOS_PRUEBA_ADMIN) {
                onRemove?.(selectedRow?.id);
            } else {
                await asesoriasService.eliminarAsesoria(selectedRow?.id);
                onRefresh?.();
            }
            showToast('Asesoría eliminada con éxito', 'success');
            setModalEliminarOpen(false);
        } catch (error) {
            console.error(error);
            showToast('Hubo un error al eliminar la asesoría', 'error');
        }
    };

    const handleSaveInfo = (updatedData) => {
        console.log('Datos actualizados:', updatedData);
        showToast('Información actualizada con éxito', 'success');
        onRefresh?.();
    };

    const handleSaveSesiones = (sesiones) => {
        // TODO (fase 1.6): await asesoriasService.guardarSesiones(selectedRow.id, sesiones); onRefresh?.();
        setSesionesGuardadas((prev) => ({ ...prev, [selectedRow.id]: sesiones }));
        showToast('Sesiones guardadas con éxito', 'success');
    };

    // Debe ser el mismo objeto entre renders (useMemo), porque el modal se reinicia cuando "data" cambia
    const datosSesiones = useMemo(
        () => selectedRow && { ...selectedRow, sesiones: sesionesGuardadas[selectedRow.id] ?? selectedRow.sesiones },
        [selectedRow, sesionesGuardadas]
    );

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
                            No se encontraron registros
                        </Typography>
                    ) : (
                        <Box className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4">
                            {visibleRows.map((row, index) => (
                                <TarjetaAsesoriaAdmin
                                    key={row.id ? `${row.id}-${index}` : index}
                                    row={row}
                                    onInfo={handleOpenInfo}
                                    onSesiones={handleOpenSesiones}
                                    onMaterial={handleOpenMaterial}
                                    onChat={handleOpenChat}
                                    onCompletar={handleOpenAprobar}
                                    onEliminar={handleOpenEliminar}
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
                        <Table stickyHeader sx={{ minWidth: 700 }}>
                            <TableHead>
                                <TableRow sx={{ '& th': ESTILO_ENCABEZADO, '& th:first-of-type': { pl: 3 }, '& th:last-child': { pr: 3 } }}>
                                    <TableCell sx={{ width: '70px' }} align="center">ID</TableCell>
                                    <TableCell align="left">Materia</TableCell>
                                    <TableCell align="left">Estudiante</TableCell>
                                    <TableCell align="left">Asesor</TableCell>
                                    <TableCell align="center">Inicio</TableCell>
                                    <TableCell align="center">Horario</TableCell>
                                    <TableCell sx={{ width: '260px' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {visibleRows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 5, color: '#6B7280', border: 0 }}>
                                            No se encontraron registros
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    visibleRows.map((row, index) => {
                                        return (
                                            <TableRow
                                                key={row.id ? `${row.id}-${index}` : index}
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
                                                    #{row.id_asesoria ?? row.id}
                                                </TableCell>

                                                <TableCell align="left" sx={{ fontWeight: 600, color: '#111827 !important' }}>
                                                    {row.materia}
                                                </TableCell>

                                                <TableCell align="left">{row.estudiante}</TableCell>
                                                <TableCell align="left">{row.asesor}</TableCell>

                                                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                                    {formatearFechaVisible(row.fecha_inicio)}
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

                                                        <Tooltip title="Sesiones">
                                                            <IconButton
                                                                size="small"
                                                                sx={estiloAccion('#6A1B9A', 'rgba(106, 27, 154, 0.10)')}
                                                                onClick={(e) => handleOpenSesiones(row, e)}
                                                            >
                                                                <EventNoteOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Material adicional">
                                                            <IconButton
                                                                size="small"
                                                                sx={estiloAccion('#A8860B', 'rgba(196, 158, 13, 0.12)')}
                                                                onClick={(e) => handleOpenMaterial(row, e)}
                                                            >
                                                                <MenuBookOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Ver chat (solo lectura)">
                                                            <IconButton
                                                                size="small"
                                                                sx={estiloAccion('#1565C0', 'rgba(21, 101, 192, 0.10)')}
                                                                onClick={(e) => handleOpenChat(row, e)}
                                                            >
                                                                <ChatOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Completar asesoría">
                                                            <IconButton
                                                                size="small"
                                                                sx={estiloAccion('#2E7D32', 'rgba(46, 125, 50, 0.10)')}
                                                                onClick={(e) => handleOpenAprobar(row, e)}
                                                            >
                                                                <CheckCircleOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Eliminar">
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
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {paginacion}
                </Paper>
            )}

            {/* Modales (compartidos por la tabla y las tarjetas) */}
            <ModalInfoAsesoria
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedRow}
                onSave={handleSaveInfo}
                showToast={showToast}
            />

            <ModalSesionesAsesoria
                open={modalSesionesOpen}
                onClose={() => setModalSesionesOpen(false)}
                data={datosSesiones}
                onSave={handleSaveSesiones}
                showToast={showToast}
            />

            <ModalConfirmarAsesoria
                open={modalConfirmOpen}
                onClose={() => setModalConfirmOpen(false)}
                onConfirm={handleConfirmAprobar}
                showToast={showToast}
            />

            <ModalEliminarAsesoria
                open={modalEliminarOpen}
                onClose={() => setModalEliminarOpen(false)}
                onConfirm={handleConfirmEliminar}
                showToast={showToast}
            />

            <ModalMaterialAdicional
                open={modalMaterialOpen}
                onClose={() => setModalMaterialOpen(false)}
                data={selectedRow}
            />

            <ModalChatAsesoriaAdmin
                open={modalChatOpen}
                onClose={() => setModalChatOpen(false)}
                data={selectedRow}
            />

            {/* Toast Global */}
            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </>
    );
}