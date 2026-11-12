import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';

import ModalAceptarSolicitud from './modales/ModalAceptarSolicitud';
import ModalRechazarSolicitud from './modales/ModalRechazarSolicitud';
import TarjetaSolicitudPendiente from './TarjetaSolicitudPendiente';
import { ESTILO_FILA, ESTILO_FILA_ENCABEZADO, ESTILO_PAPER_TABLA, estiloAccion } from '../compartidos/estilosTabla';

// Presentacional: los datos y las llamadas a la API viven en la vista.
// onAceptar(solicitud) y onRechazar(id_solicitud, motivo) regresan true si salió bien.
// Formato igual al del administrador: tabla en escritorio y tarjetas en móvil.
export default function TablaSolicitudesPendientes({ solicitudes = [], onAceptar, onRechazar }) {
    // Mismo corte que "md" de Tailwind: menos de 768px = móvil
    const esMovil = useMediaQuery('(max-width:767px)');

    // Estados para Modales
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [modalAceptarOpen, setModalAceptarOpen] = useState(false);
    const [modalRechazarOpen, setModalRechazarOpen] = useState(false);

    // Helper para desenfocar elementos activos antes de abrir el modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    // Handlers para Abrir Modales
    const handleOpenAceptar = (solicitud, event) => {
        clearFocus(event);
        setSelectedSolicitud(solicitud);
        setModalAceptarOpen(true);
    };

    const handleOpenRechazar = (solicitud, event) => {
        clearFocus(event);
        setSelectedSolicitud(solicitud);
        setModalRechazarOpen(true);
    };

    // Handlers de confirmación: llaman a la vista y cierran el modal solo si salió bien
    const handleConfirmAceptar = async () => {
        const ok = await onAceptar?.(selectedSolicitud);
        if (ok) setModalAceptarOpen(false);
        return ok;
    };

    const handleConfirmRechazar = async (motivo) => {
        const ok = await onRechazar?.(selectedSolicitud.id_solicitud, motivo);
        if (ok) setModalRechazarOpen(false);
        return ok;
    };

    if (solicitudes.length === 0) {
        return (
            <p className="py-10 text-center text-sm text-gray-600">
                No tienes solicitudes pendientes por revisar.
            </p>
        );
    }

    return (
        <>
            {esMovil ? (
                /* ---------- Vista móvil: tarjetas ---------- */
                <Box className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
                    {solicitudes.map((solicitud) => (
                        <TarjetaSolicitudPendiente
                            key={solicitud.id_solicitud}
                            solicitud={solicitud}
                            onAceptar={handleOpenAceptar}
                            onRechazar={handleOpenRechazar}
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
                        <Table stickyHeader sx={{ minWidth: 900 }}>
                            <TableHead>
                                <TableRow sx={ESTILO_FILA_ENCABEZADO}>
                                    <TableCell sx={{ width: '70px' }} align="center">ID</TableCell>
                                    <TableCell align="left">Materia</TableCell>
                                    <TableCell align="left">Estudiante</TableCell>
                                    <TableCell align="center">Fecha de inicio</TableCell>
                                    <TableCell align="center">Horario</TableCell>
                                    <TableCell align="left">Razón</TableCell>
                                    <TableCell align="center">Modalidad</TableCell>
                                    <TableCell sx={{ width: '130px' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {solicitudes.map((solicitud) => (
                                    <TableRow
                                        key={solicitud.id_solicitud}
                                        hover
                                        sx={ESTILO_FILA}
                                    >
                                        <TableCell align="center" sx={{ color: '#6B7280 !important', fontWeight: 600 }}>
                                            #{solicitud.id_solicitud}
                                        </TableCell>

                                        <TableCell align="left" sx={{ fontWeight: 600, color: '#111827 !important' }}>
                                            {solicitud.materia}
                                        </TableCell>

                                        <TableCell align="left">{solicitud.nombre_estudiante}</TableCell>

                                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                            {solicitud.fecha_inicio_formateada}
                                        </TableCell>

                                        <TableCell align="center">
                                            {solicitud.horario_con_dia && (
                                                <Chip
                                                    size="small"
                                                    label={solicitud.horario_con_dia}
                                                    sx={{
                                                        backgroundColor: '#E8EEF9',
                                                        color: '#08338F',
                                                        fontWeight: 600,
                                                        fontSize: '12.5px'
                                                    }}
                                                />
                                            )}
                                        </TableCell>

                                        <TableCell align="left">{solicitud.razon}</TableCell>

                                        <TableCell align="center">
                                            {solicitud.modalidad && (
                                                <Chip
                                                    size="small"
                                                    variant="outlined"
                                                    label={solicitud.modalidad}
                                                    sx={{ borderColor: '#08338F', color: '#08338F', fontWeight: 600, fontSize: '12.5px' }}
                                                />
                                            )}
                                        </TableCell>

                                        <TableCell align="center">
                                            <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                                                <Tooltip title="Aceptar solicitud">
                                                    <IconButton
                                                        size="small"
                                                        sx={estiloAccion('#2E7D32', 'rgba(46, 125, 50, 0.10)')}
                                                        onClick={(e) => handleOpenAceptar(solicitud, e)}
                                                    >
                                                        <CheckCircleOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Rechazar solicitud">
                                                    <IconButton
                                                        size="small"
                                                        sx={estiloAccion('#C62828', 'rgba(198, 40, 40, 0.10)')}
                                                        onClick={(e) => handleOpenRechazar(solicitud, e)}
                                                    >
                                                        <HighlightOffOutlinedIcon fontSize="small" />
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

            {/* Modales */}
            <ModalAceptarSolicitud
                open={modalAceptarOpen}
                onClose={() => setModalAceptarOpen(false)}
                onConfirm={handleConfirmAceptar}
            />

            <ModalRechazarSolicitud
                open={modalRechazarOpen}
                onClose={() => setModalRechazarOpen(false)}
                onConfirm={handleConfirmRechazar}
            />
        </>
    );
}
