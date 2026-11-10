import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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

import ToastNotification from '../../../../../components/ui/ToastNotification';
import ModalChatAsesoriaAsesor from '../compartidos/ModalChatAsesoriaAsesor';
import ModalMaterialAsesoria from '../compartidos/ModalMaterialAsesoria';
import ModalSesionesAsesor from '../compartidos/ModalSesionesAsesor';
import ModalCancelarAsesoria from './modales/ModalCancelarAsesoria';
import ModalCompletarAsesoria from './modales/ModalCompletarAsesoria';
import ModalInfoAsesoria from './modales/ModalInfoAsesoria';
import TarjetaAsesoriaEnCurso from './TarjetaAsesoriaEnCurso';
import { ESTILO_FILA, ESTILO_FILA_ENCABEZADO, ESTILO_PAPER_TABLA, estiloAccion } from '../compartidos/estilosTabla';

// Las acciones (onGuardarInfo, onCompletar, onCancelar) las hace la vista contra la API y regresan
// true si salió bien; así el modal se cierra solo cuando corresponde.
// Formato igual al del administrador: tabla en escritorio y tarjetas en móvil.
export default function TablaAsesoriasEnCurso({
    asesorias = [],
    onGuardarInfo,
    onCompletar,
    onCancelar,
    onSesionesCambio,
    onChatLeido,
}) {
    // Mismo corte que "md" de Tailwind: menos de 768px = móvil
    const esMovil = useMediaQuery('(max-width:767px)');

    const [selectedAsesoria, setSelectedAsesoria] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalCompletarOpen, setModalCompletarOpen] = useState(false);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);
    const [modalCancelarOpen, setModalCancelarOpen] = useState(false);
    const [modalSesionesOpen, setModalSesionesOpen] = useState(false);
    const [modalChatOpen, setModalChatOpen] = useState(false);

    // Menú ⋮ de la tarjeta móvil (Completar / Sesiones / Editar / Cancelar)
    const [menuAnchor, setMenuAnchor] = useState(null);

    const [toast, setToast] = useState({
        open: false,
        message: '',
        type: 'info'
    });

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

    const openModal = (setOpen) => (asesoria, event) => {
        clearFocus(event);
        setSelectedAsesoria(asesoria);
        setOpen(true);
    };

    const handleOpenInfo = openModal(setModalInfoOpen);
    const handleOpenCompletar = openModal(setModalCompletarOpen);
    const handleOpenMaterial = openModal(setModalMaterialOpen);
    const handleOpenCancelar = openModal(setModalCancelarOpen);
    const handleOpenSesiones = openModal(setModalSesionesOpen);
    // Al abrir el chat se quita el globito de mensajes sin leer (el chat los marca como leídos)
    const handleOpenChat = (asesoria, event) => {
        openModal(setModalChatOpen)(asesoria, event);
        if (onChatLeido) onChatLeido(asesoria.id);
    };

    // Abre el menú ⋮ guardando de qué tarjeta vino
    const handleOpenMenu = (asesoria, event) => {
        setSelectedAsesoria(asesoria);
        setMenuAnchor(event.currentTarget);
    };

    const closeMenu = () => setMenuAnchor(null);

    // Cierra el menú y abre el modal que corresponda
    const handleMenuAccion = (abrirModal) => (event) => {
        closeMenu();
        abrirModal(selectedAsesoria, event);
    };

    // Los tres regresan true si salió bien (el modal se cierra) y false si falló
    const handleGuardarInfo = (id, cambios) => onGuardarInfo?.(id, cambios);

    const handleConfirmCompletar = () => onCompletar?.(selectedAsesoria);

    const handleConfirmCancelar = (motivo) => onCancelar?.(selectedAsesoria, motivo);

    if (asesorias.length === 0) {
        return (
            <Box className="w-full text-center py-10">
                <Typography sx={{ fontSize: '16px', color: '#666666' }}>
                    No se encontraron asesorías que coincidan con la búsqueda.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {esMovil ? (
                /* ---------- Vista móvil: tarjetas ---------- */
                <Box className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
                    {asesorias.map((asesoria) => (
                        <TarjetaAsesoriaEnCurso
                            key={asesoria.id}
                            asesoria={asesoria}
                            onMenu={handleOpenMenu}
                            onMaterial={handleOpenMaterial}
                            onChat={handleOpenChat}
                        />
                    ))}
                </Box>
            ) : (
                /* ---------- Vista escritorio: tabla ---------- */
                <Paper
                    variant="outlined"
                    sx={ESTILO_PAPER_TABLA}
                >
                    <TableContainer sx={{ maxHeight: '560px', overflowY: 'auto' }}>
                        <Table stickyHeader sx={{ minWidth: 960 }}>
                            <TableHead>
                                <TableRow sx={ESTILO_FILA_ENCABEZADO}>
                                    <TableCell sx={{ width: '70px' }} align="center">ID</TableCell>
                                    <TableCell align="left">Materia</TableCell>
                                    <TableCell align="left">Estudiante</TableCell>
                                    <TableCell align="center">Inicio</TableCell>
                                    <TableCell align="center">Horario</TableCell>
                                    <TableCell align="left">Razón</TableCell>
                                    <TableCell align="center">Modalidad</TableCell>
                                    <TableCell sx={{ width: '260px' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {asesorias.map((asesoria) => (
                                    <TableRow
                                        key={asesoria.id}
                                        hover
                                        sx={ESTILO_FILA}
                                    >
                                        <TableCell align="center" sx={{ color: '#6B7280 !important', fontWeight: 600 }}>
                                            #{asesoria.id}
                                        </TableCell>

                                        <TableCell align="left" sx={{ fontWeight: 600, color: '#111827 !important' }}>
                                            {asesoria.materia}
                                        </TableCell>

                                        <TableCell align="left">{asesoria.estudiante}</TableCell>

                                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                            {asesoria.fecha_inicio_formateada}
                                        </TableCell>

                                        <TableCell align="center">
                                            {asesoria.horario_con_dia && (
                                                <Chip
                                                    size="small"
                                                    label={asesoria.horario_con_dia}
                                                    sx={{
                                                        backgroundColor: '#E8EEF9',
                                                        color: '#08338F',
                                                        fontWeight: 600,
                                                        fontSize: '12.5px'
                                                    }}
                                                />
                                            )}
                                        </TableCell>

                                        <TableCell align="left">{asesoria.razon}</TableCell>

                                        <TableCell align="center">
                                            {asesoria.modalidad && (
                                                <Chip
                                                    size="small"
                                                    variant="outlined"
                                                    label={asesoria.modalidad}
                                                    sx={{ borderColor: '#08338F', color: '#08338F', fontWeight: 600, fontSize: '12.5px' }}
                                                />
                                            )}
                                        </TableCell>

                                        <TableCell align="center">
                                            <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                                                <Tooltip title="Editar información">
                                                    <IconButton
                                                        size="small"
                                                        sx={estiloAccion('#08338F', 'rgba(8, 51, 143, 0.08)')}
                                                        onClick={(e) => handleOpenInfo(asesoria, e)}
                                                    >
                                                        <EditOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title={`Sesiones (${asesoria.sesiones_count ?? 0})`}>
                                                    <IconButton
                                                        size="small"
                                                        sx={estiloAccion('#6A1B9A', 'rgba(106, 27, 154, 0.10)')}
                                                        onClick={(e) => handleOpenSesiones(asesoria, e)}
                                                    >
                                                        <EventNoteOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Material adicional">
                                                    <IconButton
                                                        size="small"
                                                        sx={estiloAccion('#A8860B', 'rgba(196, 158, 13, 0.12)')}
                                                        onClick={(e) => handleOpenMaterial(asesoria, e)}
                                                    >
                                                        <MenuBookOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                {/* Globito rojo con los mensajes sin leer; con 0 no se muestra */}
                                                <Badge badgeContent={asesoria.mensajes_sin_leer} max={99} color="error" overlap="circular">
                                                    <Tooltip title="Chat">
                                                        <IconButton
                                                            size="small"
                                                            sx={estiloAccion('#1565C0', 'rgba(21, 101, 192, 0.10)')}
                                                            onClick={(e) => handleOpenChat(asesoria, e)}
                                                        >
                                                            <ChatOutlinedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Badge>

                                                <Tooltip title="Completar asesoría">
                                                    <IconButton
                                                        size="small"
                                                        sx={estiloAccion('#2E7D32', 'rgba(46, 125, 50, 0.10)')}
                                                        onClick={(e) => handleOpenCompletar(asesoria, e)}
                                                    >
                                                        <CheckCircleOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Cancelar asesoría">
                                                    <IconButton
                                                        size="small"
                                                        sx={estiloAccion('#C62828', 'rgba(198, 40, 40, 0.10)')}
                                                        onClick={(e) => handleOpenCancelar(asesoria, e)}
                                                    >
                                                        <CancelOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Menú ⋮ de las tarjetas móviles */}
            <Menu
                disableScrollLock
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleMenuAccion(handleOpenCompletar)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><CheckOutlinedIcon fontSize="small" sx={{ color: '#2E7D32' }} /></ListItemIcon>
                    Completar asesoría
                </MenuItem>
                <MenuItem onClick={handleMenuAccion(handleOpenSesiones)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><EventNoteOutlinedIcon fontSize="small" sx={{ color: '#6A1B9A' }} /></ListItemIcon>
                    Sesiones{selectedAsesoria ? ` (${selectedAsesoria.sesiones_count ?? 0})` : ''}
                </MenuItem>
                <MenuItem onClick={handleMenuAccion(handleOpenInfo)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><EditOutlinedIcon fontSize="small" sx={{ color: '#08338F' }} /></ListItemIcon>
                    Editar información
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuAccion(handleOpenCancelar)} sx={{ minHeight: 44, color: '#C42525' }}>
                    <ListItemIcon><CancelOutlinedIcon fontSize="small" sx={{ color: '#C42525' }} /></ListItemIcon>
                    Cancelar asesoría
                </MenuItem>
            </Menu>

            <ModalInfoAsesoria
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedAsesoria}
                onSave={handleGuardarInfo}
                showToast={showToast}
            />

            <ModalCompletarAsesoria
                open={modalCompletarOpen}
                onClose={() => setModalCompletarOpen(false)}
                onConfirm={handleConfirmCompletar}
            />

            <ModalMaterialAsesoria
                open={modalMaterialOpen}
                onClose={() => setModalMaterialOpen(false)}
                data={selectedAsesoria}
                showToast={showToast}
            />

            <ModalSesionesAsesor
                open={modalSesionesOpen}
                onClose={() => setModalSesionesOpen(false)}
                data={selectedAsesoria}
                showToast={showToast}
                onCambio={onSesionesCambio}
            />

            <ModalCancelarAsesoria
                open={modalCancelarOpen}
                onClose={() => setModalCancelarOpen(false)}
                onConfirm={handleConfirmCancelar}
            />

            <ModalChatAsesoriaAsesor
                open={modalChatOpen}
                onClose={() => {
                    setModalChatOpen(false);
                    // Lo que se vio en el chat ya quedó leído
                    if (onChatLeido) onChatLeido(selectedAsesoria?.id);
                }}
                data={selectedAsesoria}
                showToast={showToast}
            />

            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </>
    );
}
