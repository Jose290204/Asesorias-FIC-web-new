import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
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

import {
    ModalAceptarSolicitud,
    ModalRechazarSolicitud
} from './ModalesSolicitudPendiente';

// Estilo del encabezado de la tabla: azul sólido, letras chicas, mayúsculas y en negritas
// (el mismo que la tabla de solicitudes del administrador)
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

// Presentacional: los datos y las llamadas a la API viven en la vista.
// onAceptar(solicitud) y onRechazar(id_solicitud, motivo) regresan true si salió bien.
// Formato igual al del administrador: tabla en escritorio y tarjetas en móvil.
export default function TarjetaSolicitudesPendientes({ solicitudes = [], onAceptar, onRechazar }) {
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
                        <Card key={solicitud.id_solicitud}
                            sx={{
                                width: '100%',
                                maxWidth: '400px',
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
                                <Box sx={{ marginBottom: '20px' }}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0 }}>
                                        {solicitud.materia}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                                        <span className="font-bold">Estudiante: </span> {solicitud.nombre_estudiante}
                                    </Typography>
                                    <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere' }}>
                                        <span className="font-bold">Razón: </span> {solicitud.razon}
                                    </Typography>

                                    {/* Fecha y horario solicitados en una sola línea */}
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: '#08338F', mt: '1px', flexShrink: 0 }} />
                                        <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                            {solicitud.fecha_inicio_formateada}
                                            {solicitud.horario_con_dia && ` · ${solicitud.horario_con_dia}`}
                                        </Typography>
                                    </Box>

                                    {/* Chips: modalidad y número de solicitud */}
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {solicitud.modalidad && (
                                            <Chip
                                                size="small"
                                                variant="outlined"
                                                label={solicitud.modalidad}
                                                sx={{ borderColor: '#08338F', color: '#08338F', fontWeight: 600 }}
                                            />
                                        )}
                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            label={`Solicitud #${solicitud.id_solicitud}`}
                                            sx={{ borderColor: '#BDBDBD', color: '#555555', fontWeight: 600 }}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>

                            {/* Botones: dos columnas iguales; Rechazar solo con borde y Aceptar con relleno */}
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
                                        color: '#C42525',
                                        borderColor: '#C42525',
                                        borderRadius: '5px',
                                        textTransform: 'none',
                                        '&:hover': { borderColor: '#9B1C1C', backgroundColor: 'rgba(196, 37, 37, 0.08)' }
                                    }}
                                    startIcon={<CloseOutlinedIcon />}
                                    onClick={(e) => handleOpenRechazar(solicitud, e)}
                                >
                                    Rechazar
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        minHeight: 40,
                                        backgroundColor: '#2E7D32',
                                        color: '#ffffff',
                                        borderRadius: '5px',
                                        textTransform: 'none',
                                        '&:hover': { backgroundColor: '#1B5E20' }
                                    }}
                                    startIcon={<CheckOutlinedIcon />}
                                    onClick={(e) => handleOpenAceptar(solicitud, e)}
                                >
                                    Aceptar
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
                        <Table stickyHeader sx={{ minWidth: 900 }}>
                            <TableHead>
                                <TableRow sx={{ '& th': ESTILO_ENCABEZADO, '& th:first-of-type': { pl: 3 }, '& th:last-child': { pr: 3 } }}>
                                    <TableCell sx={{ width: '70px' }} align="center">ID</TableCell>
                                    <TableCell align="left">Materia</TableCell>
                                    <TableCell align="left">Estudiante</TableCell>
                                    <TableCell align="center">Fecha</TableCell>
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
