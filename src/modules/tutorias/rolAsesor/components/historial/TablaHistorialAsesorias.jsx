import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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
// Chat del asesor con el estudiante (el mismo que usa Asesorías en curso)
import ModalChatAsesoriaAsesor from '../compartidos/ModalChatAsesoriaAsesor';
import ModalInfoHistorialAsesoria from './modales/ModalInfoHistorialAsesoria';
import ChipEstatus from './ChipEstatus';
// Material de la asesoría: se descarga siempre; subir y eliminar solo con la asesoría completada
import ModalMaterialAsesoria from '../compartidos/ModalMaterialAsesoria';
import ModalSesionesAsesor from '../compartidos/ModalSesionesAsesor';
import TarjetaHistorialAsesoria from './TarjetaHistorialAsesoria';
import { ESTILO_FILA, ESTILO_FILA_ENCABEZADO, ESTILO_PAPER_TABLA, estiloAccion } from '../compartidos/estilosTabla';

// Las asesorías del historial las carga la vista; esto solo las muestra.
// Formato igual al del administrador: tabla en escritorio y tarjetas en móvil.
export default function TablaHistorialAsesorias({ historial = [] }) {
    // Mismo corte que "md" de Tailwind: menos de 768px = móvil
    const esMovil = useMediaQuery('(max-width:767px)');

    // Estados para Modales
    const [selectedAsesoria, setSelectedAsesoria] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalChatOpen, setModalChatOpen] = useState(false);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);
    const [modalSesionesOpen, setModalSesionesOpen] = useState(false);

    // Menú ⋮ de la tarjeta móvil (Información / Sesiones)
    const [menuAnchor, setMenuAnchor] = useState(null);

    // Estado para el Toast Global
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
    const handleOpenMaterial = openModal(setModalMaterialOpen);
    const handleOpenChat = openModal(setModalChatOpen);
    const handleOpenSesiones = openModal(setModalSesionesOpen);

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

    if (historial.length === 0) {
        return (
            <Box className="w-full text-center py-10">
                <Typography sx={{ fontSize: '16px', color: '#666666' }}>
                    No tienes asesorías en tu historial.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {esMovil ? (
                /* ---------- Vista móvil: tarjetas ---------- */
                <Box className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
                    {historial.map((asesoria) => (
                        <TarjetaHistorialAsesoria
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
                        <Table stickyHeader sx={{ minWidth: 1200 }}>
                            <TableHead>
                                <TableRow sx={ESTILO_FILA_ENCABEZADO}>
                                    <TableCell sx={{ width: '70px' }} align="center">ID</TableCell>
                                    <TableCell align="left">Materia</TableCell>
                                    <TableCell align="left">Estudiante</TableCell>
                                    <TableCell align="center">Inicio</TableCell>
                                    <TableCell align="center">Final</TableCell>
                                    <TableCell align="center">Horario</TableCell>
                                    <TableCell align="left">Razón</TableCell>
                                    <TableCell align="center">Modalidad</TableCell>
                                    <TableCell align="center">Estatus</TableCell>
                                    <TableCell sx={{ width: '190px' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {historial.map((asesoria) => (
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

                                        {/* Solo las completadas tienen fecha final */}
                                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                            {asesoria.fecha_fin_formateada || '—'}
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
                                            <ChipEstatus estatus={asesoria.estatus} />
                                        </TableCell>

                                        <TableCell align="center">
                                            <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                                                <Tooltip title="Información">
                                                    <IconButton
                                                        size="small"
                                                        sx={estiloAccion('#08338F', 'rgba(8, 51, 143, 0.08)')}
                                                        onClick={(e) => handleOpenInfo(asesoria, e)}
                                                    >
                                                        <InfoOutlinedIcon fontSize="small" />
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

                                                <Tooltip title="Chat">
                                                    <IconButton
                                                        size="small"
                                                        sx={estiloAccion('#1565C0', 'rgba(21, 101, 192, 0.10)')}
                                                        onClick={(e) => handleOpenChat(asesoria, e)}
                                                    >
                                                        <ChatOutlinedIcon fontSize="small" />
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
                <MenuItem onClick={handleMenuAccion(handleOpenInfo)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><InfoOutlinedIcon fontSize="small" sx={{ color: '#08338F' }} /></ListItemIcon>
                    Información
                </MenuItem>
                <MenuItem onClick={handleMenuAccion(handleOpenSesiones)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><EventNoteOutlinedIcon fontSize="small" sx={{ color: '#6A1B9A' }} /></ListItemIcon>
                    Sesiones{selectedAsesoria ? ` (${selectedAsesoria.sesiones_count ?? 0})` : ''}
                </MenuItem>
            </Menu>

            {/* Modales */}
            <ModalInfoHistorialAsesoria
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedAsesoria}
                showToast={showToast}
            />

            <ModalMaterialAsesoria
                soloLectura={selectedAsesoria?.estatus === 'cancelada'}
                showToast={showToast}
                open={modalMaterialOpen}
                onClose={() => setModalMaterialOpen(false)}
                data={selectedAsesoria}
            />

            {/* El historial solo consulta las sesiones (la API no deja cambiarlas en una asesoría cerrada) */}
            <ModalSesionesAsesor
                open={modalSesionesOpen}
                onClose={() => setModalSesionesOpen(false)}
                data={selectedAsesoria}
                soloLectura
                showToast={showToast}
            />

            <ModalChatAsesoriaAsesor
                open={modalChatOpen}
                onClose={() => setModalChatOpen(false)}
                data={selectedAsesoria}
                showToast={showToast}
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
