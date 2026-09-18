import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CircularProgress from '@mui/material/CircularProgress';
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
import { useCallback, useEffect, useState } from 'react';

import ToastNotification from '../../../../components/ui/ToastNotification';
import {
    ModalConfirmarAsesoria,
    ModalEliminarAsesoria,
    ModalInfoAsesoria,
    ModalMaterialAdicional
} from '../components/ModalesAsesorias';
import { asesoriasService } from '../services/asesoriasService1'; // Ajusta la ruta si es necesario

export default function TablaAsesorias() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para Modales
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
    const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);

     // Estados para la Paginación
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Estado para el Toast Global
    const [toast, setToast] = useState({
        open: false,
        message: '',
        type: 'info'
    });

     const showToast = (message, type = 'info') => {
        setToast({ open: true, message, type });
    };

   

     // Cargar asesorías usando el servicio
       const fetchAsesorias = useCallback(async (isInitialLoad = false) => {
        if (!isInitialLoad) setLoading(true);
        try {
            const data = await asesoriasService.getAsesoriasEnCurso();
            setRows(data || []);
        } catch (error) {
            console.error(error);
            showToast('No se pudieron cargar las asesorías', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    
    // efecto para cargar datos al montar
    useEffect(() => {
    fetchAsesorias();
    }, [fetchAsesorias]);

 

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    // Handlers para Abrir Modales
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

    // Consumir servicio para Completar/Aprobar
    const handleConfirmAprobar = async () => {
        try {
            await asesoriasService.completarAsesoria(selectedRow?.id);
            showToast('Asesoría completada correctamente', 'success');
            setModalConfirmOpen(false);
            fetchAsesorias();
        } catch (error) {
            console.error(error);
            showToast('Hubo un error al completar la asesoría', 'error');
        }
    };

    // Consumir servicio para Eliminar
    const handleConfirmEliminar = async () => {
        try {
            await asesoriasService.eliminarAsesoria(selectedRow?.id);
            showToast('Asesoría eliminada con éxito', 'success');
            setModalEliminarOpen(false);
            fetchAsesorias();
        } catch (error) {
            console.error(error);
            showToast('Hubo un error al eliminar la asesoría', 'error');
        }
    };

    const handleSaveInfo = (updatedData) => {
        console.log('Datos actualizados:', updatedData);
        showToast('Información actualizada con éxito', 'success');
        fetchAsesorias();
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
                                '& th:first-of-type': { pl: 2.5 },
                                '& th:last-child': { pr: 2.5 }
                            }}
                        >
                            <TableCell sx={{ width: '60px' }} align='center'>ID</TableCell>
                            <TableCell align='left'>Materia</TableCell>
                            <TableCell align='left'>Estudiante</TableCell>
                            <TableCell align='left'>Asesor</TableCell>
                            <TableCell align='center'>Inicio</TableCell>
                            <TableCell align='center'>Horario</TableCell>
                            <TableCell sx={{ width: '200px' }} align='center'>Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                    <CircularProgress size={30} />
                                </TableCell>
                            </TableRow>
                        ) : visibleRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3, color: '#666' }}>
                                    No se encontraron registros
                                </TableCell>
                            </TableRow>
                        ) : (
                            visibleRows.map((row, index) => {
                                const tieneMateriales = row.raw?.material_adicional && row.raw.material_adicional.length > 0;

                                return (
                                    <TableRow
                                        key={row.id ? `${row.id}-${index}` : index}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? '#f4f5f7' : '#dbe2ea',
                                            '& td': { border: 0, py: 1.5 },
                                            '& td:first-of-type': { 
                                                borderTopLeftRadius: '8px', 
                                                borderBottomLeftRadius: '8px',
                                                pl: 2.5
                                            },
                                            '& td:last-child': { 
                                                borderTopRightRadius: '8px', 
                                                borderBottomRightRadius: '8px',
                                                pr: 2.5
                                            },
                                        }}
                                    >
                                        <TableCell align='center'>{row.id_asesoria}</TableCell>
                                        <TableCell align='left'>{row.materia}</TableCell>
                                        <TableCell align='left'>{row.estudiante}</TableCell>
                                        <TableCell align='left'>{row.asesor}</TableCell>
                                        <TableCell align='center'>{row.fecha_inicio ? row.fecha_inicio.split('T')[0] : ''}</TableCell>
                                        <TableCell align='center'>{row.horario}</TableCell>
                                        <TableCell align='center'>
                                            <Stack direction="row" spacing={0.2} sx={{ justifyContent: 'center' }}>
                                                <Tooltip title="Información">
                                                    <IconButton color="primary" onClick={(e) => handleOpenInfo(row, e)}>
                                                        <InfoOutlinedIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title={tieneMateriales ? "Ver material adicional" : "Sin material adicional"}>
                                                    <span>
                                                        <IconButton
                                                            disabled={!tieneMateriales}
                                                            sx={{ color: tieneMateriales ? '#cbcf0a' : 'inherit' }}
                                                            onClick={(e) => handleOpenMaterial(row, e)}
                                                        >
                                                            <MenuBookIcon />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>

                                                <Tooltip title="Aprobar asesoría">
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
                                );
                            })
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
                sx={{
                    borderTop: '1px solid #e0e0e0',
                    px: 2
                }}
            />

            {/* Modales */}
            <ModalInfoAsesoria
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedRow}
                onSave={handleSaveInfo}
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