import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import TablePagination from '@mui/material/TablePagination';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

import ToastNotification from '../../../../components/ui/ToastNotification';
import {
    ModalConfirmarAsesoria,
    ModalEliminarAsesoria
} from './ModalesAsesorias';

export default function TablaSolicitudes({ rows = [] }) {
    // Estados para Modales
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
    const [modalEliminarOpen, setModalEliminarOpen] = useState(false);

    // Estado para el Toast Global
    const [toast, setToast] = useState({
        open: false,
        message: '',
        type: 'info'
    });

    // Estados para la Paginación
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Handlers para Paginación
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const showToast = (message, type = 'info') => {
        setToast({ open: true, message, type });
    };

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    // Helper para desenfocar elementos activos antes de abrir el modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    // Handlers para Abrir Modales
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

    const handleConfirmAprobar = () => {
        console.log('Solicitud aprobada:', selectedRow?.id);
        setModalConfirmOpen(false);
    };

    const handleConfirmEliminar = () => {
        console.log('Solicitud eliminada:', selectedRow?.id);
        setModalEliminarOpen(false);
    };

    // Corte de filas visibles según la página actual
    const visibleRows = rows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Paper 
            variant="outlined" 
            sx={{ 
                width: '100%', 
                borderRadius: '12px', 
                borderColor: '#e0e0e0',
                overflow: 'hidden' 
            }}
        >
            {/* Contenedor con altura máxima y scroll interno exclusivo */}
            <TableContainer 
                sx={{ 
                    px: 0, 
                    pt: 0, 
                    pb: 0,
                    maxHeight: '500px', 
                    overflowY: 'auto' 
                }}
            >
                <Table
                    stickyHeader
                    sx={{
                        minWidth: 500,
                        borderCollapse: 'separate',
                        borderSpacing: '0 10px',
                        px: 2.5
                    }}
                >
                    <TableHead>
                        <TableRow 
                            sx={{ 
                                '& th': { 
                                    border: 0, 
                                    fontWeight: 'bold', 
                                    color: '#1a1a1a', 
                                    backgroundColor: '#ffffff',
                                    py: 2,
                                    zIndex: 2
                                },
                                '& th:first-of-type': {
                                    pl: 2.5
                                },
                                '& th:last-child': {
                                    pr: 2.5
                                }
                            }}
                        >
                            <TableCell sx={{ width: '60px' }} align='center'>ID</TableCell>
                            <TableCell align='left'>Materia</TableCell>
                            <TableCell align='left'>Estudiante</TableCell>
                            <TableCell align='center'>Fecha</TableCell>
                            <TableCell align='center'>Horario</TableCell>
                            <TableCell align='center'>Modalidad</TableCell>
                            <TableCell sx={{ width: '130px' }} align='center'>Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {visibleRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3, color: '#666' }}>
                                    No se encontraron solicitudes
                                </TableCell>
                            </TableRow>
                        ) : (
                            visibleRows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? '#f4f5f7' : '#dbe2ea',
                                        '& td': { border: 0, py: 1.5 },
                                        '& td:first-of-type': { borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' },
                                        '& td:last-child': { borderTopRightRadius: '8px', borderBottomRightRadius: '8px' },
                                    }}
                                >
                                    <TableCell align='center'>{row.id}</TableCell>
                                    <TableCell align='left'>{row.materia}</TableCell>
                                    <TableCell align='left'>{row.estudiante}</TableCell>
                                    <TableCell align='center'>{row.fecha}</TableCell>
                                    <TableCell align='center'>{row.horario}</TableCell>
                                    <TableCell align='center'>{row.modalidad}</TableCell>
                                    <TableCell align='center'>
                                        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                                            <Tooltip title="Aprobar solicitud">
                                                <IconButton color="success" onClick={(e) => handleOpenAprobar(row, e)}>
                                                    <CheckCircleIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Eliminar">
                                                <IconButton color="error" onClick={(e) => handleOpenEliminar(row, e)}>
                                                    <DeleteIcon />
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

            {/* Paginación */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
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
                    borderTop: '1px solid #e0e0e0',
                    px: 2
                }}
            />

            {/* Modales */}
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

            {/* Toast Global */}
            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </Paper>
    );
}