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
    ModalInfoAsesor,
    ModalEliminarAsesor
} from './ModalesAsesorDisciplinar';

export default function TablaAsesoresDisciplinares({ rows = [] }) {
    // Estados para Modales
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
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

    // Handlers para Abrir Modales
    const handleOpenInfo = (row) => {
        setSelectedRow(row);
        setModalInfoOpen(true);
    };

    const handleOpenEliminar = (row) => {
        setSelectedRow(row);
        setModalEliminarOpen(true);
    };

    const handleConfirmEliminar = () => {
        console.log('Asesor eliminado:', selectedRow?.id);
        setModalEliminarOpen(false);
    };

    const handleSaveInfo = (updatedData) => {
        console.log('Datos actualizados del asesor:', updatedData);
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
                    px: 2.5, 
                    pt: 2.5, 
                    pb: 0,
                    maxHeight: '500px', 
                    overflowY: 'auto' 
                }}
            >
                <Table
                    stickyHeader
                    sx={{
                        minWidth: 600,
                        borderCollapse: 'separate',
                        borderSpacing: '0 10px'
                    }}
                >
                    <TableHead>
                        <TableRow 
                            sx={{ 
                                '& th': { 
                                    border: 0, 
                                    fontWeight: 'bold', 
                                    color: '#1a1a1a', 
                                    pb: 1,
                                    backgroundColor: '#ffffff',
                                    py: 1.5
                                } 
                            }}
                        >
                            <TableCell sx={{ width: '60px' }} align='center'>ID</TableCell>
                            <TableCell align='left'>Nombre</TableCell>
                            <TableCell align='left'>Correo</TableCell>
                            <TableCell align='center'>Teléfono</TableCell>
                            <TableCell align='center'>Número de Cuenta</TableCell>
                            <TableCell align='center'>Estado</TableCell>
                            <TableCell sx={{ width: '130px' }} align='center'>Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {visibleRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3, color: '#666' }}>
                                    No se encontraron asesores disciplinares
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
                                    <TableCell align='center'>{row.telefono}</TableCell>
                                    <TableCell align='center'>{row.numeroCuenta}</TableCell>
                                    <TableCell align='center'>{row.estado}</TableCell>
                                    <TableCell align='center'>
                                        <Stack direction="row" spacing={0.2} justifyContent="center">
                                            <Tooltip title="Información">
                                                <IconButton color="primary" onClick={() => handleOpenInfo(row)}>
                                                    <InfoOutlinedIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Eliminar">
                                                <IconButton color="error" onClick={() => handleOpenEliminar(row)}>
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

            {/* Paginación con total de páginas calculado */}
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
            <ModalInfoAsesor
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedRow}
                onSave={handleSaveInfo}
                showToast={showToast}
            />

            <ModalEliminarAsesor
                open={modalEliminarOpen}
                onClose={() => setModalEliminarOpen(false)}
                onConfirm={handleConfirmEliminar}
                data={selectedRow}
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