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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

import ToastNotification from '../../../../components/ui/ToastNotification';
import {
    ModalInfoEstudiante,
    ModalEliminarEstudiante
} from './ModalesEstudiantes';

export default function TablaEstudiantes({ rows = [], onUpdate, onDelete }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalEliminarOpen, setModalEliminarOpen] = useState(false);

    const [toast, setToast] = useState({
        open: false,
        message: '',
        type: 'info'
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const showToast = (message, type = 'info') => {
        setToast({ open: true, message, type });
    };

    const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

    // Helper para desenfocar elementos activos antes de abrir el modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    const handleOpenInfo = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalInfoOpen(true);
    };

    const handleOpenEliminar = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalEliminarOpen(true);
    };

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
            <TableContainer sx={{ px: 2.5, pt: 2.5, pb: 0, maxHeight: '500px', overflowY: 'auto' }}>
                <Table stickyHeader sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    <TableHead>
                        <TableRow 
                            sx={{ 
                                '& th': { 
                                    border: 0, 
                                    fontWeight: 'bold', 
                                    color: '#1a1a1a', 
                                    backgroundColor: '#ffffff',
                                    py: 1.5
                                } 
                            }}
                        >
                            <TableCell sx={{ width: '60px' }} align='center'>Id</TableCell>
                            <TableCell align='left'>Nombre</TableCell>
                            <TableCell align='left'>Correo</TableCell>
                            <TableCell align='center'>Número de cuenta</TableCell>
                            <TableCell align='center'>Grupo</TableCell>
                            <TableCell align='center'>Estado</TableCell>
                            <TableCell sx={{ width: '130px' }} align='center'>Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {visibleRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3, color: '#666' }}>
                                    No se encontraron estudiantes
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
                                    <TableCell align='left'>{row.nombre}</TableCell>
                                    <TableCell align='left'>{row.correo}</TableCell>
                                    <TableCell align='center'>{row.numeroCuenta}</TableCell>
                                    <TableCell align='center'>{row.grupo}</TableCell>
                                    <TableCell align='center'>{row.estado}</TableCell>
                                    <TableCell align='center'>
                                        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                                            <Tooltip title="Información">
                                                <IconButton 
                                                    size="small" 
                                                    sx={{ color: '#0d47a1' }} 
                                                    onClick={(e) => handleOpenInfo(row, e)}
                                                >
                                                    <InfoOutlinedIcon fontSize="medium" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Eliminar">
                                                <IconButton 
                                                    size="small" 
                                                    sx={{ color: '#c62828' }} 
                                                    onClick={(e) => handleOpenEliminar(row, e)}
                                                >
                                                    <DeleteIcon fontSize="medium" />
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
                sx={{ borderTop: '1px solid #e0e0e0', px: 2 }}
            />

            {/* Modales */}
            <ModalInfoEstudiante
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedRow}
                onSave={onUpdate}
                showToast={showToast}
            />

            <ModalEliminarEstudiante
                open={modalEliminarOpen}
                onClose={() => setModalEliminarOpen(false)}
                onConfirm={onDelete}
                data={selectedRow}
                showToast={showToast}
            />

            {/* Toast Notification */}
            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </Paper>
    );
}