import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import {
    ModalAceptarSolicitud,
    ModalRechazarSolicitud
} from './ModalesSolicitudPendiente';

function formatearFechaVisible(fechaISO) {
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

    const fecha = new Date(fechaISO);
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = meses[fecha.getUTCMonth()]; // getUTCMonth() regresa 0-11, así que indexa directo al array
    const anio = fecha.getUTCFullYear();

    return `${dia}/${mes}/${anio}`;
}

// Tarjeta presentacional: los datos y las llamadas a la API viven en la vista.
// onAceptar(solicitud) y onRechazar(id_solicitud, motivo) regresan true si salió bien.
export default function TarjetaSolicitudesPendientes({ solicitudes = [], onAceptar, onRechazar, showToast }) {
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
    };

    const handleConfirmRechazar = async (motivo) => {
        const ok = await onRechazar?.(selectedSolicitud.id_solicitud, motivo);
        if (ok) setModalRechazarOpen(false);
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
            <Box className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
                {solicitudes.map((solicitud) => ( // Recorre el arreglo de datos y los va imprimiendo

                    <Card key={solicitud.id_solicitud}
                        sx={{
                            // Si ocupas moverle a cualquier cosa de tamaño, margen o color de la tarjeta es aquí
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
                        <CardContent sx={{ padding: '24px 24px 10px 24px' }}> {/* La información de la tarjeta */}

                            {/* Contenedor principal de la img, nombre del alumno y email del alumno */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', mb: 3 }}>

                                <Avatar
                                    sx={{
                                        // Estilos de la foto de usuario
                                        backgroundColor: '#EBD9B4',
                                        color: '#8A6D2B',
                                        width: 50,
                                        height: 50,
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        flexShrink: 0
                                    }}
                                >
                                    {solicitud.nombre_estudiante?.charAt(0)}
                                </Avatar>

                                {/* Contenedor para separar nombre y email */}
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{ fontSize: '16px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere' }}>
                                        {solicitud.nombre_estudiante}
                                    </Typography>
                                    <Typography sx={{ fontSize: '13px', color: '#6A6A6A', overflowWrap: 'anywhere' }}>
                                        {solicitud.correo}
                                    </Typography>
                                </Box>

                            </Box>

                            {/* Contenedor principal de los datos */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', mb: '5px' }}>

                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Materia: </span> {solicitud.materia}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Fecha de inicio: </span> {formatearFechaVisible(solicitud.fecha_inicio)}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Horario: </span> {solicitud.horario}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Modalidad: </span> {solicitud.modalidad}
                                </Typography>

                            </Box>

                        </CardContent>

                        {/* Donde se ponen los botones que se ocupen, se pueden quitar o agregar más */}
                        <CardActions
                            sx={{
                                padding: '0px 24px 20px 24px',
                                justifyContent: 'flex-end',
                                flexWrap: 'wrap',
                                gap: '10px'
                            }}
                        >
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#C42525', color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                                size="small"
                                startIcon={<CloseOutlinedIcon />}
                                onClick={(e) => handleOpenRechazar(solicitud, e)}
                            >
                                Rechazar
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#2E7D32', color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                                size="small"
                                startIcon={<CheckOutlinedIcon />}
                                onClick={(e) => handleOpenAceptar(solicitud, e)}
                            >
                                Aceptar
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {/* Modales */}
            <ModalAceptarSolicitud
                open={modalAceptarOpen}
                onClose={() => setModalAceptarOpen(false)}
                onConfirm={handleConfirmAceptar}
                showToast={showToast}
            />

            <ModalRechazarSolicitud
                open={modalRechazarOpen}
                onClose={() => setModalRechazarOpen(false)}
                onConfirm={handleConfirmRechazar}
                showToast={showToast}
            />
        </>
    );
}