import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
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
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';

import ModalMaterialAsesoria from '../../../rolAsesor/components/compartidos/ModalMaterialAsesoria';
import ToastNotification from '../../../../../components/ui/ToastNotification';
import { formatearFechaVisible } from '../../../rolEstudiante/utils/fechaSolicitud';
// Los modales de completar y cancelar son los mismos del asesor: esperan el resultado de la API
// (true = salió bien) y la vista muestra el toast de éxito o de error.
import ModalCancelarAsesoria from '../../../rolAsesor/components/asesorias/modales/ModalCancelarAsesoria';
import ModalCompletarAsesoria from '../../../rolAsesor/components/asesorias/modales/ModalCompletarAsesoria';
import TarjetaAsesoriaAdmin from '../../components/asesorias/TarjetaAsesoriaAdmin';
import ModalChatAsesoriaAdmin from './modales/ModalChatAsesoriaAdmin';
import ModalInfoAsesoria from './modales/ModalInfoAsesoria';
import ModalSesionesAsesor from '../../../rolAsesor/components/compartidos/ModalSesionesAsesor';
import {
    eliminarMaterialAdmin,
    eliminarSesionAdmin,
    registrarSesionAdmin,
    subirMaterialAdmin
} from '../../../../../Services/asesoriasAdminService';

// Sesiones: se usa el mismo modal del asesor, apuntando a las rutas /admin/...
const ACCIONES_SESIONES_ADMIN = { registrar: registrarSesionAdmin, eliminar: eliminarSesionAdmin };
// Material: el mismo modal del asesor, apuntando a /admin/... (el admin puede borrar cualquier archivo)
const ACCIONES_MATERIAL_ADMIN = { subir: subirMaterialAdmin, eliminar: eliminarMaterialAdmin };

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

// rows: la página actual que entrega la API (la paginación la hace la vista).
// onCompletar(asesoria) y onCancelar(asesoria, motivo): la vista las ejecuta contra la API y regresan true si salió bien.
// onGuardarInfo(id, cambios): edita la asesoría (PATCH) y regresa true si salió bien.
// onRefresh: recarga la lista (cambia el conteo de sesiones al registrar o eliminar una).
export default function TablaAsesorias({ rows = [], onCompletar, onCancelar, onGuardarInfo, onRefresh }) {
    // Mismo corte que "md" de Tailwind: menos de 768px = móvil
    const esMovil = useMediaQuery('(max-width:767px)');

    // Estados para Modales
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalCompletarOpen, setModalCompletarOpen] = useState(false);
    const [modalCancelarOpen, setModalCancelarOpen] = useState(false);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);
    const [modalChatOpen, setModalChatOpen] = useState(false);
    const [modalSesionesOpen, setModalSesionesOpen] = useState(false);

    // Estado para el Toast de los modales que todavía no se conectan (info, sesiones)
    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ open: true, message, type });
    };

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    const openModal = (setOpen) => (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setOpen(true);
    };

    // Handlers para abrir modales (los usan la tabla y las tarjetas)
    const handleOpenInfo = openModal(setModalInfoOpen);
    const handleOpenSesiones = openModal(setModalSesionesOpen);
    const handleOpenMaterial = openModal(setModalMaterialOpen);
    // El administrador solo puede leer el chat, no escribir
    const handleOpenChat = openModal(setModalChatOpen);
    const handleOpenCompletar = openModal(setModalCompletarOpen);
    const handleOpenCancelar = openModal(setModalCancelarOpen);

    const handleConfirmCompletar = () => onCompletar?.(selectedRow);

    const handleConfirmCancelar = (motivo) => onCancelar?.(selectedRow, motivo);

    return (
        <>
            {esMovil ? (
                /* ---------- Vista móvil: tarjetas ---------- */
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {rows.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', py: 4, color: '#666666' }}>
                            No se encontraron registros
                        </Typography>
                    ) : (
                        <Box className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4">
                            {rows.map((row) => (
                                <TarjetaAsesoriaAdmin
                                    key={row.id}
                                    row={row}
                                    onInfo={handleOpenInfo}
                                    onSesiones={handleOpenSesiones}
                                    onMaterial={handleOpenMaterial}
                                    onChat={handleOpenChat}
                                    onCompletar={handleOpenCompletar}
                                    onEliminar={handleOpenCancelar}
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
                                {rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 5, color: '#6B7280', border: 0 }}>
                                            No se encontraron registros
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
                                                {row.materia}
                                            </TableCell>

                                            <TableCell align="left">{row.estudiante}</TableCell>
                                            <TableCell align="left">{row.asesor}</TableCell>

                                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                                {formatearFechaVisible(row.fecha_inicio)}
                                            </TableCell>

                                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                                {/* Día + horario completos ("Lunes 2:00-3:00 PM"), sin recortar */}
                                                {(row.horario_con_dia || row.horario) && (
                                                    <Chip
                                                        size="small"
                                                        label={row.horario_con_dia || row.horario}
                                                        sx={{
                                                            backgroundColor: '#E8EEF9',
                                                            color: '#08338F',
                                                            fontWeight: 600,
                                                            fontSize: '12.5px',
                                                            maxWidth: 'none',
                                                            '& .MuiChip-label': { overflow: 'visible', textOverflow: 'clip', whiteSpace: 'nowrap' }
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
                                                            onClick={(e) => handleOpenCompletar(row, e)}
                                                        >
                                                            <CheckCircleOutlinedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Cancelar asesoría">
                                                        <IconButton
                                                            size="small"
                                                            sx={estiloAccion('#C62828', 'rgba(198, 40, 40, 0.10)')}
                                                            onClick={(e) => handleOpenCancelar(row, e)}
                                                        >
                                                            <CancelOutlinedIcon fontSize="small" />
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
            <ModalInfoAsesoria
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedRow}
                onSave={onGuardarInfo}
                showToast={showToast}
            />

            <ModalSesionesAsesor
                open={modalSesionesOpen}
                onClose={() => setModalSesionesOpen(false)}
                data={selectedRow}
                showToast={showToast}
                onCambio={onRefresh}
                acciones={ACCIONES_SESIONES_ADMIN}
            />

            <ModalCompletarAsesoria
                open={modalCompletarOpen}
                onClose={() => setModalCompletarOpen(false)}
                onConfirm={handleConfirmCompletar}
            />

            <ModalCancelarAsesoria
                open={modalCancelarOpen}
                onClose={() => setModalCancelarOpen(false)}
                onConfirm={handleConfirmCancelar}
            />

            <ModalMaterialAsesoria
                open={modalMaterialOpen}
                onClose={() => setModalMaterialOpen(false)}
                data={selectedRow}
                showToast={showToast}
                acciones={ACCIONES_MATERIAL_ADMIN}
            />

            <ModalChatAsesoriaAdmin
                open={modalChatOpen}
                onClose={() => setModalChatOpen(false)}
                data={selectedRow}
            />

            {/* Toast de los modales sin conectar */}
            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </>
    );
}
