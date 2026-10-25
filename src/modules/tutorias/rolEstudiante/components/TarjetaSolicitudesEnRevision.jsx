import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';

// Importa tus modales desde el archivo correspondiente (ajusta la ruta si es necesario)
import { EditarSolicitud, ModalInformacion, ModalNotaAsesor } from '../components/ModalesSolicitudesRevicion';
import { parsearFechaSolicitud } from '../utils/fechaSolicitud';

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

// Mismo formato que Solicitudes pendientes del asesor: 27/OCT/2026
function formatearFechaVisible(valor) {
    const fecha = parsearFechaSolicitud(valor);
    if (!fecha) return valor || 'N/A';
    return `${String(fecha.date()).padStart(2, '0')}/${MESES[fecha.month()]}/${fecha.year()}`;
}

// Cómo se ve cada estado en el chip (el estado "real" sigue siendo el texto en mayúsculas)
const ESTILO_ESTADO = {
    'EN REVISION': { etiqueta: 'En revisión', color: '#8A6D00', borde: '#C49E0D' },
    'RECHAZADA': { etiqueta: 'Rechazada', color: '#C62828', borde: '#C62828' },
};

// Las solicitudes y sus cambios (editar / eliminar) los maneja la vista; la tarjeta solo las muestra.
export default function TarjetaSolicitudesEnRevision({ solicitudes = [], onActualizar, onEliminar, showToast }) {
    // Estados para controlar qué modal se abre y con qué solicitud
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [modalNotaOpen, setModalNotaOpen] = useState(false);
    const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

    const handleOpenInfo = (solicitud) => {
        document.activeElement?.blur();
        setSolicitudSeleccionada(solicitud);
        setModalInfoOpen(true);
    };

    const handleOpenEditar = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setModalEditarOpen(true);
    };

    const handleOpenEliminar = (solicitud) => {
        document.activeElement?.blur();
        setSolicitudSeleccionada(solicitud);
        setModalEliminarOpen(true);
    };

    const handleConfirmEliminar = () => {
        if (onEliminar) onEliminar(solicitudSeleccionada);
        setModalEliminarOpen(false);
        if (showToast) showToast('Solicitud eliminada correctamente', 'error');
    };

    const handleOpenNota = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setModalNotaOpen(true);
    };

    return (
        <>
        <Box className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
            {solicitudes.length === 0 ? (
                <Typography sx={{ py: 5, color: 'text.secondary', fontWeight: 'bold', gridColumn: '1 / -1' }}>
                    No hay solicitudes con este estado.
                </Typography>
            ) : (
                solicitudes.map((solicitud) => {
                    const estilo = ESTILO_ESTADO[solicitud.estado] ?? {
                        etiqueta: solicitud.estado,
                        color: '#555555',
                        borde: '#BDBDBD'
                    };

                    return (
                    <Card key={solicitud.id}
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
                        <CardContent sx={{ padding: '24px 24px 10px 24px' }}>
                            {/* ENCABEZADO: avatar arriba, nombre y correo, y botón de información a la derecha */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '16px', mb: 2.5, minHeight: '64px' }}>
                                <Avatar
                                    sx={{
                                        backgroundColor: '#EBD9B4',
                                        color: '#8A6D2B',
                                        width: 50,
                                        height: 50,
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        flexShrink: 0
                                    }}
                                >
                                    {solicitud.alumno.charAt(0)}
                                </Avatar>

                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography
                                        title={solicitud.alumno}
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            color: '#000000',
                                            lineHeight: 1.2,
                                            overflowWrap: 'anywhere',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {solicitud.alumno}
                                    </Typography>
                                    <Typography
                                        noWrap
                                        title={solicitud.email}
                                        sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px' }}
                                    >
                                        {solicitud.email}
                                    </Typography>
                                </Box>

                                <Tooltip title="Información">
                                    <IconButton
                                        size="small"
                                        aria-label="Información"
                                        sx={{ color: '#08338F', p: '3px', mr: '-6px', mt: '-4px', flexShrink: 0 }}
                                        onClick={() => handleOpenInfo(solicitud)}
                                    >
                                        <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            {/* DATOS */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mb: '5px' }}>
                                {/* Materia: el dato principal */}
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Materia: </span>
                                    <span style={{ color: '#08338F', fontWeight: 600 }}>{solicitud.materia}</span>
                                </Typography>

                                {/* Fecha y horario juntos */}
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                    <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: '#08338F', mt: '1px', flexShrink: 0 }} />
                                    <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                        {formatearFechaVisible(solicitud.fecha)} · {solicitud.horario || 'N/A'}
                                    </Typography>
                                </Box>


                                {/* Chips: modalidad y estado */}
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
                                        label={estilo.etiqueta}
                                        sx={{ borderColor: estilo.borde, color: estilo.color, fontWeight: 600 }}
                                    />
                                </Box>
                            </Box>
                        </CardContent>

                        {/* BOTONES: dos columnas iguales; con una sola acción ocupa todo el ancho */}
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
                            {solicitud.estado === "EN REVISION" && (
                                <Button
                                    variant="outlined"
                                    startIcon={<DeleteOutlineOutlinedIcon />}
                                    onClick={() => handleOpenEliminar(solicitud)}
                                    sx={{
                                        minHeight: 40,
                                        color: '#C42525',
                                        borderColor: '#C42525',
                                        borderRadius: '5px',
                                        textTransform: 'none',
                                        '&:hover': { borderColor: '#9B1C1C', backgroundColor: 'rgba(196, 37, 37, 0.08)' }
                                    }}
                                >
                                    Eliminar
                                </Button>
                            )}

                            {solicitud.estado === "EN REVISION" && (
                                <Button
                                    variant="contained"
                                    startIcon={<EditOutlinedIcon />}
                                    onClick={() => handleOpenEditar(solicitud)}
                                    sx={{
                                        minHeight: 40,
                                        backgroundColor: '#2E7D32',
                                        color: '#FFFFFF',
                                        borderRadius: '5px',
                                        textTransform: 'none',
                                        '&:hover': { backgroundColor: '#1B5E20' }
                                    }}
                                >
                                    Editar
                                </Button>
                            )}

                            {solicitud.estado === "RECHAZADA" && (
                                <Button
                                    variant="contained"
                                    startIcon={<NotesOutlinedIcon />}
                                    onClick={() => handleOpenNota(solicitud)}
                                    sx={{
                                        gridColumn: '1 / -1',
                                        minHeight: 40,
                                        color: '#FFFFFF',
                                        borderRadius: '5px',
                                        textTransform: 'none'
                                    }}
                                >
                                    Notas del asesor
                                </Button>
                            )}
                        </CardActions>
                    </Card>
                    );
                })
            )}
        </Box>

            {/* MODALES */}
            <ModalInformacion
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                solicitud={solicitudSeleccionada}
            />

            <EditarSolicitud
                open={modalEditarOpen}
                onClose={() => setModalEditarOpen(false)}
                solicitud={solicitudSeleccionada}
                onSave={onActualizar}
                showToast={showToast}
            />

            <Dialog
                open={modalEliminarOpen}
                onClose={() => setModalEliminarOpen(false)}
                sx={{ '& .MuiPaper-root': { width: '450px', maxWidth: '90vw', borderRadius: '12px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminar solicitud</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        ¿Estás seguro de que deseas eliminar esta solicitud? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={() => setModalEliminarOpen(false)}>
                        Cancelar
                    </Button>
                    <Button variant="contained" color="error" onClick={handleConfirmEliminar}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <ModalNotaAsesor
                open={modalNotaOpen}
                onClose={() => setModalNotaOpen(false)}
                nota={solicitudSeleccionada?.nota}
            />
        </>
    );
}