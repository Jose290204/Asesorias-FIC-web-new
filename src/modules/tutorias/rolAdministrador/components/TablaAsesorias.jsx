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
import InfoIcon from '@mui/icons-material/Info';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import ToastNotification from '../../../../components/ui/ToastNotification';
import {
    ModalInfoAsesoria,
    ModalConfirmarAsesoria,
    ModalEliminarAsesoria,
    ModalMaterialAdicional
} from './ModalesAsesorias';

export default function TablaAsesorias({ rows = [] }) {
    // Estados para controlar los modales
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
    const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);

    // Estado global para controlar el ToastNotification
    const [toast, setToast] = useState({
        open: false,
        message: '',
        type: 'info' // 'info' (azul), 'success' (verde), 'error' (rojo)
    });

    // Función para mostrar la notificación Toast
    const showToast = (message, type = 'info') => {
        setToast({
            open: true,
            message,
            type
        });
    };

    // Función para cerrar la notificación Toast
    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    // Handlers para abrir los modales
    const handleOpenInfo = (row) => {
        setSelectedRow(row);
        setModalInfoOpen(true);
    };

    const handleOpenMaterial = (row) => {
        setSelectedRow(row);
        setModalMaterialOpen(true);
    };

    const handleOpenAprobar = (row) => {
        setSelectedRow(row);
        setModalConfirmOpen(true);
    };

    const handleOpenEliminar = (row) => {
        setSelectedRow(row);
        setModalEliminarOpen(true);
    };

    // Confirmación de acciones
    const handleConfirmAprobar = () => {
        console.log('Asesoría aprobada:', selectedRow?.id);
        setModalConfirmOpen(false);
    };

    const handleConfirmEliminar = () => {
        console.log('Asesoría eliminada:', selectedRow?.id);
        setModalEliminarOpen(false);
    };

    const handleSaveInfo = (updatedData) => {
        console.log('Datos actualizados:', updatedData);
    };

    return (
        <>
            <TableContainer
                component={Paper}
                variant='outlined'
                sx={{
                    p: 2.5,
                    borderRadius: '12px',
                    borderColor: '#e0e0e0',
                    width: '100%',
                    boxSizing: 'border-box'
                }}
            >
                <Table
                    sx={{
                        minWidth: 500,
                        borderCollapse: 'separate',
                        borderSpacing: '0 10px'
                    }}
                >
                    <TableHead>
                        <TableRow sx={{ '& th': { border: 0, fontWeight: 'bold', color: '#1a1a1a', pb: 1 } }}>
                            <TableCell sx={{ width: '60px' }} align='center'>ID</TableCell>
                            <TableCell align='left'>Materia</TableCell>
                            <TableCell align='left'>Estudiante</TableCell>
                            <TableCell align='left'>Asesor</TableCell>
                            <TableCell align='center'>Inicio</TableCell>
                            <TableCell align='center'>Horario</TableCell>
                            <TableCell sx={{ width: '220px' }} align='center'>Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3, color: '#666' }}>
                                    No se encontraron registros
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, index) => {
                                const tieneMateriales = row.raw?.material_adicional && row.raw.material_adicional.length > 0;

                                return (
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
                                        <TableCell align='left'>{row.asesor}</TableCell>
                                        <TableCell align='center'>{row.inicio}</TableCell>
                                        <TableCell align='center'>{row.horario}</TableCell>
                                        <TableCell align='center'>
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="Información">
                                                    <IconButton color="primary" onClick={() => handleOpenInfo(row)}>
                                                        <InfoIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title={tieneMateriales ? "Ver material adicional" : "Sin material adicional"}>
                                                    <span>
                                                        <IconButton
                                                            disabled={!tieneMateriales}
                                                            sx={{ color: tieneMateriales ? '#cbcf0a' : 'inherit' }}
                                                            onClick={() => handleOpenMaterial(row)}
                                                        >
                                                            <MenuBookIcon />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>

                                                <Tooltip title="Aprobar asesoría">
                                                    <IconButton color="success" onClick={() => handleOpenAprobar(row)}>
                                                        <CheckCircleIcon />
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
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Renderizado de Modales con la propiedad showToast */}
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

            {/* Toast Global Flotante */}
            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </>
    );
}