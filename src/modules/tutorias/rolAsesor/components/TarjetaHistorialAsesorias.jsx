import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
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

import ToastNotification from '../../../../components/ui/ToastNotification';
// Chat del asesor con el estudiante (el mismo que usa Asesorías en curso)
import ModalChatAsesoriaAsesor from './ModalChatAsesoriaAsesor';
import { ModalInfoHistorialAsesoria } from './ModalesHistorialAsesorias';
// Material de la asesoría: se descarga siempre; subir y eliminar solo con la asesoría completada
import ModalMaterialAsesoria from './ModalMaterialAsesoria';
import ModalSesionesAsesor from './ModalSesionesAsesor';

// Estilo del encabezado de la tabla: azul sólido, letras chicas, mayúsculas y en negritas
// (el mismo que la tabla de asesorías del administrador)
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

// El historial son asesorías cerradas: completadas o canceladas
const ESTILO_ESTATUS = {
    completada: { label: 'Completada', color: '#2E7D32', fondo: '#E8F5E9' },
    cancelada: { label: 'Cancelada', color: '#C62828', fondo: '#FDECEA' }
};

function ChipEstatus({ estatus }) {
    const estilo = ESTILO_ESTATUS[estatus] ?? { label: estatus, color: '#555555', fondo: '#F3F4F6' };
    return (
        <Chip
            size="small"
            label={estilo.label}
            sx={{ backgroundColor: estilo.fondo, color: estilo.color, fontWeight: 600, fontSize: '12.5px' }}
        />
    );
}

// Las asesorías del historial las carga la vista; esto solo las muestra.
// Formato igual al del administrador: tabla en escritorio y tarjetas en móvil.
export default function TarjetaHistorialAsesorias({ historial = [] }) {
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

    // Si esta función lanza un error, el chat quita el mensaje y muestra un toast de error.
    const handleSendMessage = async (asesoria, mensaje) => {
        console.log('Mensaje enviado en la asesoría', asesoria?.id, mensaje);
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
                        <Card key={asesoria.id}
                            sx={{
                                width: '100%',
                                maxWidth: '410px',
                                background: '#FFFFFF',
                                borderLeft: '20px solid #08338F',
                                borderRadius: '5px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.20)',
                            }}
                        >
                            <CardContent sx={{ padding: '24px 24px 15px' }}>
                                <Box sx={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0 }}>
                                        {asesoria.materia}
                                    </Typography>

                                    {/* Un solo botón ⋮ con las acciones poco frecuentes */}
                                    <IconButton
                                        aria-label="Más acciones"
                                        aria-haspopup="true"
                                        onClick={(e) => handleOpenMenu(asesoria, e)}
                                        sx={{ flexShrink: 0, mr: '-12px', mt: '-10px', color: '#555555' }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                                        <span className="font-bold">Estudiante: </span> {asesoria.estudiante}
                                    </Typography>
                                    <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                                        <span className="font-bold">Razón: </span> {asesoria.razon}
                                    </Typography>

                                    {/* Fecha de inicio y horario en una sola línea */}
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: '#08338F', mt: '1px', flexShrink: 0 }} />
                                        <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                            {asesoria.fecha_inicio_formateada}
                                            {asesoria.fecha_fin_formateada && ` – ${asesoria.fecha_fin_formateada}`}
                                            {asesoria.horario_con_dia && ` · ${asesoria.horario_con_dia}`}
                                        </Typography>
                                    </Box>

                                    {/* Chips: estatus, modalidad y número de asesoría */}
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        <ChipEstatus estatus={asesoria.estatus} />
                                        {asesoria.modalidad && (
                                            <Chip
                                                size="small"
                                                variant="outlined"
                                                label={asesoria.modalidad}
                                                sx={{ borderColor: '#08338F', color: '#08338F', fontWeight: 600 }}
                                            />
                                        )}
                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            label={`Asesoría #${asesoria.id}`}
                                            sx={{ borderColor: '#BDBDBD', color: '#555555', fontWeight: 600 }}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>

                            {/* Botones: dos columnas iguales; Chat con relleno y Material solo con borde */}
                            <CardActions
                                sx={{
                                    padding: '0px 24px 20px 24px',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '10px',
                                    // CardActions mete margen izquierdo a los botones; aquí lo anulamos por el grid
                                    '& > :not(:first-of-type)': { marginLeft: 0 }
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        minHeight: 40,
                                        color: '#8A6D2B',
                                        borderColor: '#C49E0D',
                                        borderRadius: '5px',
                                        textTransform: 'none',
                                        '&:hover': { borderColor: '#8A6D2B', backgroundColor: 'rgba(196, 158, 13, 0.08)' }
                                    }}
                                    startIcon={<FileDownloadOutlinedIcon />}
                                    onClick={(e) => handleOpenMaterial(asesoria, e)}
                                >
                                    Material
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ minHeight: 40, color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                                    startIcon={<ChatOutlinedIcon />}
                                    onClick={(e) => handleOpenChat(asesoria, e)}
                                >
                                    Chat
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
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
                        <Table stickyHeader sx={{ minWidth: 1200 }}>
                            <TableHead>
                                <TableRow sx={{ '& th': ESTILO_ENCABEZADO, '& th:first-of-type': { pl: 3 }, '& th:last-child': { pr: 3 } }}>
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
                onSendMessage={handleSendMessage}
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
