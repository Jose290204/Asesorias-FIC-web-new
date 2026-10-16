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
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';

// Importa tus modales desde el archivo correspondiente (ajusta la ruta si es necesario)
import { EditarSolicitud, ModalNotaAsesor } from '../components/ModalesSolicitudesRevicion';
import { formatearFechaSolicitud } from '../utils/fechaSolicitud';

// Las solicitudes y sus cambios (editar / eliminar) los maneja la vista; la tarjeta solo las muestra.
export default function TarjetaSolicitudesEnRevision({ solicitudes = [], onActualizar, onEliminar, showToast }) {
    // Estados para controlar qué modal se abre y con qué solicitud
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [modalNotaOpen, setModalNotaOpen] = useState(false);
    const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

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
                solicitudes.map((solicitud) => (
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
                            {/* ESTADO */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
                                <Chip
                                    label={solicitud.estado}
                                    size="small"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '11px',
                                        letterSpacing: '0.5px',
                                        backgroundColor: solicitud.estado === "EN REVISION" ? '#FFF4CC' : '#FDE2E0',
                                        color: solicitud.estado === "EN REVISION" ? '#8A6D00' : '#C62828'
                                    }}
                                />
                            </Box>

                            {/* ALUMNO */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', mb: 3 }}>
                                <Avatar
                                    sx={{
                                        backgroundColor: '#EBD9B4',
                                        color: '#8A6D2B',
                                        width: 50,
                                        height: 50,
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {solicitud.alumno.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography sx={{ fontSize: '16px', fontWeight: '700', color: '#000000', lineHeight: 1.2 }}>
                                        {solicitud.alumno}
                                    </Typography>
                                    <Typography sx={{ fontSize: '13px', color: '#333333', marginTop: '3px' }}>
                                        {solicitud.email}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* DATOS */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', mb: '5px' }}>
                                <Typography sx={{ fontSize: '15px', color: '#222222' }}>
                                    <span className="font-bold">Materia:</span> {solicitud.materia}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#222222' }}>
                                    <span className="font-bold">Fecha:</span> {formatearFechaSolicitud(solicitud.fecha)}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#222222' }}>
                                    <span className="font-bold">Modalidad:</span> {solicitud.modalidad}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#222222' }}>
                                    <span className="font-bold">Horario:</span> {solicitud.horario || 'N/A'}
                                </Typography>
                                {solicitud.notaEstudiante && (
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            color: '#222222',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        <span className="font-bold">Nota:</span> {solicitud.notaEstudiante}
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>

                        {/* BOTONES */}
                        <CardActions sx={{ padding: '0px 24px 20px 24px', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '10px' }}>
                            {solicitud.estado === "EN REVISION" && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<EditOutlinedIcon />}
                                    onClick={() => handleOpenEditar(solicitud)}
                                    sx={{
                                        backgroundColor: '#43B45C',
                                        color: '#FFFFFF',
                                        borderRadius: '5px',
                                        textTransform: 'none',
                                    }}
                                >
                                    Editar
                                </Button>
                            )}

                            {solicitud.estado === "RECHAZADA" && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<NotesOutlinedIcon />}
                                    onClick={() => handleOpenNota(solicitud)}
                                    sx={{
                                        backgroundColor: '#F44336',
                                        color: '#FFFFFF',
                                        borderRadius: '5px',
                                        textTransform: 'none',
                                        fontWeight: '600',
                                    }}
                                >
                                    Notas del asesor
                                </Button>
                            )}

                            {solicitud.estado === "EN REVISION" && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<DeleteOutlineOutlinedIcon />}
                                    onClick={() => handleOpenEliminar(solicitud)}
                                    sx={{
                                        backgroundColor: '#C42525',
                                        color: '#FFFFFF',
                                        borderRadius: '5px',
                                        textTransform: 'none',
                                        fontWeight: '600',
                                    }}
                                >
                                    Eliminar
                                </Button>
                            )}
                        </CardActions>
                    </Card>
                ))
            )}
        </Box>

            {/* MODALES */}
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