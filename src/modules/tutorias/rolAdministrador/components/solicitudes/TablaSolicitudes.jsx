import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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

import { formatearFechaVisible } from '../../../rolEstudiante/utils/fechaSolicitud';
// El modal de rechazar es el mismo del asesor: pide el motivo y espera el resultado de la API (true = salió bien)
import ModalRechazarSolicitud from '../../../rolAsesor/components/solicitudes/modales/ModalRechazarSolicitud';
import { COLOR_ESTATUS, ETIQUETA_ESTATUS } from './estatusSolicitud';
import ModalAprobarSolicitud from './modales/ModalAprobarSolicitud';
import ModalInfoSolicitud from './modales/ModalInfoSolicitud';
import TarjetaSolicitudAdmin from './TarjetaSolicitudAdmin';

// Estilo del encabezado de la tabla: azul sólido, letras chicas, mayúsculas y en negritas
// TODO: compartir con TablaAsesorias cuando se haga la limpieza de duplicados
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
// onAceptar(solicitud) y onRechazar(solicitud, motivo): la vista las ejecuta contra la API,
// muestra el toast y regresa true si salió bien.
export default function TablaSolicitudes({ rows = [], onAceptar, onRechazar }) {
    // Mismo corte que "md" de Tailwind: menos de 768px = móvil
    const esMovil = useMediaQuery('(max-width:767px)');

    // Estados para modales
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalAprobarOpen, setModalAprobarOpen] = useState(false);
    const [modalRechazarOpen, setModalRechazarOpen] = useState(false);

    // Quita el foco del elemento activo antes de abrir un modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    // Handlers para abrir modales (los usan la tabla y las tarjetas)
    const handleOpenInfo = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalInfoOpen(true);
    };

    const handleOpenAprobar = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalAprobarOpen(true);
    };

    const handleOpenRechazar = (row, event) => {
        clearFocus(event);
        setSelectedRow(row);
        setModalRechazarOpen(true);
    };

    // El modal de aprobar se cierra solo; la vista muestra el toast de éxito o de error
    const handleConfirmAprobar = () => onAceptar?.(selectedRow);

    // El de rechazar se cierra aquí solo si salió bien (si falla, el motivo escrito se conserva)
    const handleConfirmRechazar = async (motivo) => {
        const ok = await onRechazar?.(selectedRow, motivo);
        if (ok) setModalRechazarOpen(false);
        return ok;
    };

    return (
        <>
            {esMovil ? (
                /* ---------- Vista móvil: tarjetas ---------- */
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {rows.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', py: 4, color: '#666666' }}>
                            No se encontraron solicitudes
                        </Typography>
                    ) : (
                        <Box className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4">
                            {rows.map((row) => (
                                <TarjetaSolicitudAdmin
                                    key={row.id}
                                    row={row}
                                    onInfo={handleOpenInfo}
                                    onAprobar={handleOpenAprobar}
                                    onRechazar={handleOpenRechazar}
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
                        <Table stickyHeader sx={{ minWidth: 900 }}>
                            <TableHead>
                                <TableRow sx={{ '& th': ESTILO_ENCABEZADO, '& th:first-of-type': { pl: 3 }, '& th:last-child': { pr: 3 } }}>
                                    <TableCell sx={{ width: '70px' }} align="center">ID</TableCell>
                                    <TableCell align="left">Materia</TableCell>
                                    <TableCell align="left">Estudiante</TableCell>
                                    <TableCell align="left">Asesor</TableCell>
                                    <TableCell align="center">Fecha</TableCell>
                                    <TableCell align="center">Horario</TableCell>
                                    <TableCell align="center">Modalidad</TableCell>
                                    <TableCell align="center">Estatus</TableCell>
                                    <TableCell sx={{ width: '160px' }} align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center" sx={{ py: 5, color: '#6B7280', border: 0 }}>
                                            No se encontraron solicitudes
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rows.map((row) => {
                                        const pendiente = row.estatus === 'pendiente';
                                        const colorEstatus = COLOR_ESTATUS[row.estatus];

                                        return (
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

                                                <TableCell align="center">
                                                    {row.horario && (
                                                        <Chip
                                                            size="small"
                                                            label={row.horario_con_dia}
                                                            sx={{
                                                                backgroundColor: '#E8EEF9',
                                                                color: '#08338F',
                                                                fontWeight: 600,
                                                                fontSize: '12.5px'
                                                            }}
                                                        />
                                                    )}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {row.modalidad && (
                                                        <Chip
                                                            size="small"
                                                            variant="outlined"
                                                            label={row.modalidad}
                                                            sx={{ borderColor: '#08338F', color: '#08338F', fontWeight: 600, fontSize: '12.5px' }}
                                                        />
                                                    )}
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Chip
                                                        size="small"
                                                        label={ETIQUETA_ESTATUS[row.estatus] ?? row.estatus}
                                                        sx={{
                                                            backgroundColor: colorEstatus?.fondo,
                                                            color: colorEstatus?.texto,
                                                            fontWeight: 700,
                                                            fontSize: '12.5px'
                                                        }}
                                                    />
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

                                                        {/* Solo las pendientes se pueden responder */}
                                                        {pendiente && (
                                                            <>
                                                                <Tooltip title="Aprobar solicitud">
                                                                    <IconButton
                                                                        size="small"
                                                                        sx={estiloAccion('#2E7D32', 'rgba(46, 125, 50, 0.10)')}
                                                                        onClick={(e) => handleOpenAprobar(row, e)}
                                                                    >
                                                                        <CheckCircleOutlinedIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>

                                                                <Tooltip title="Rechazar solicitud">
                                                                    <IconButton
                                                                        size="small"
                                                                        sx={estiloAccion('#C62828', 'rgba(198, 40, 40, 0.10)')}
                                                                        onClick={(e) => handleOpenRechazar(row, e)}
                                                                    >
                                                                        <HighlightOffOutlinedIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Modales (compartidos por la tabla y las tarjetas) */}
            <ModalInfoSolicitud
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedRow}
            />

            <ModalAprobarSolicitud
                open={modalAprobarOpen}
                onClose={() => setModalAprobarOpen(false)}
                onConfirm={handleConfirmAprobar}
                data={selectedRow}
            />

            <ModalRechazarSolicitud
                open={modalRechazarOpen}
                onClose={() => setModalRechazarOpen(false)}
                onConfirm={handleConfirmRechazar}
            />
        </>
    );
}
