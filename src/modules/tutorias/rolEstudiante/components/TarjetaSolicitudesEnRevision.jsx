import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';

// Importa tus modales desde el archivo correspondiente (ajusta la ruta si es necesario)
import { ModalInformacion, EditarSolicitud, ModalNotaAsesor } from '../components/ModalesSolicitudesRevicion';

export default function TarjetaSolicitudesEnRevision({ filtroEstado, showToast}) {
    // Estados para controlar qué modal se abre y con qué solicitud
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [modalNotaOpen, setModalNotaOpen] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

    // Datos de prueba
    const solicitudesEnRevision = [
        { id: 30, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Programacion", fecha: "Lunes 27/09/26", horario: "18:00 - 19:00", modalidad: "Presencial", estado: "EN REVISION", asesor: "Josue Manuel Medina Lopez", nota: "Esa fecha ya no esta disponible" },
        { id: 31, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Programacion", fecha: "Lunes 27/09/26", horario: "18:00 - 19:00", modalidad: "Presencial", estado: "EN REVISION", asesor: "Josue Manuel Medina Lopez", nota: "Esa fecha ya no esta disponible" },
        { id: 32, alumno: "Luis Fernando Velazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Programacion", fecha: "Lunes 27/09/26", horario: "18:00 - 19:00", modalidad: "Presencial", estado: "EN REVISION", asesor: "Josue Manuel Medina Lopez", nota: "Esa fecha ya no esta disponible" },
        { id: 33, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Programacion", fecha: "Lunes 27/09/26", horario: "18:00 - 19:00", modalidad: "Presencial", estado: "RECHAZADA", asesor: "Josue Manuel Medina Lopez", nota: "Esa fecha ya no esta disponible" },
        { id: 34, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Programacion", fecha: "Lunes 27/09/26", horario: "18:00 - 19:00", modalidad: "Presencial", estado: "RECHAZADA", asesor: "Josue Manuel Medina Lopez", nota: "Esa fecha ya no esta disponible" }
    ];

    // Filtrar las solicitudes según el valor seleccionado
    const solicitudesFiltradas = solicitudesEnRevision.filter((solicitud) => {
        if (filtroEstado === "TODO") return true;
        return solicitud.estado === filtroEstado;
    });

    const handleOpenInfo = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setModalInfoOpen(true);
    };

    const handleOpenEditar = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setModalEditarOpen(true);
    };

    const handleOpenNota = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setModalNotaOpen(true);
    };

    return (
        <Box className="flex flex-row flex-wrap gap-7 justify-center">
            {solicitudesFiltradas.length === 0 ? (
                <Typography sx={{ py: 5, color: 'text.secondary', fontWeight: 'bold' }}>
                    No hay solicitudes con este estado.
                </Typography>
            ) : (
                solicitudesFiltradas.map((solicitud) => (
                    <Card key={solicitud.id}
                        sx={{
                            width: '400px',
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
                            {/* ALUMNO */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', mb: 3 }}>
                                <Avatar
                                    sx={{
                                        backgroundColor: '#EBD9B4',
                                        color: '#8A6D2B',
                                        width: 63,
                                        height: 63,
                                        fontSize: '30px',
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
                                    <span className="font-bold">Fecha:</span> {solicitud.fecha}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#222222' }}>
                                    <span className="font-bold">Modalidad:</span> {solicitud.modalidad}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#222222' }}>
                                    <span className="font-bold text-black">ESTADO:</span>{' '}
                                    <span
                                        style={{
                                            color: solicitud.estado === "EN REVISION" ? "#E0B400" : "#F44336",
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {solicitud.estado}
                                    </span>
                                </Typography>
                            </Box>
                        </CardContent>

                        {/* BOTONES */}
                        <CardActions sx={{ padding: '0px 30px 24px 30px', justifyContent: 'flex-end', gap: '18px' }}>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<InfoOutlinedIcon />}
                                onClick={() => handleOpenInfo(solicitud)}
                                sx={{
                                    color: '#FFFFFF',
                                    borderRadius: '5px',
                                    textTransform: 'none',
                                    fontWeight: '600',
                                }}
                            >
                                Informacion
                            </Button>

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
                        </CardActions>
                    </Card>
                ))
            )}

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
                showToast={showToast}
            />

            <ModalNotaAsesor
                open={modalNotaOpen}
                onClose={() => setModalNotaOpen(false)}
                nota={solicitudSeleccionada?.nota}
            />
        </Box>
    );
}