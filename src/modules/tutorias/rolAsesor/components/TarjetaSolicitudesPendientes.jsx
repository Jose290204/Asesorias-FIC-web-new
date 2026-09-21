import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';

import Loading from '../../../../components/ui/Loading';

// Ajusta estas rutas según dónde esté ubicado este archivo en tu proyecto
import ToastNotification from '../../../../components/ui/ToastNotification';
import { solicitudesService } from '../../../../Services/solicitudesService';
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

export default function TarjetaSolicitudesPendientes() {
    const { usuario } = useAuth();

    const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para Modales
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [modalAceptarOpen, setModalAceptarOpen] = useState(false);
    const [modalRechazarOpen, setModalRechazarOpen] = useState(false);

    // Estado para el Toast Global
    const [toast, setToast] = useState({
        open: false,
        message: '',
        type: 'info'
    });

    const showToast = (message, type = 'info') => {
        setToast({ open: true, message, type });
    };

    const cargarSolicitudes = async () => {
        try {
            setLoading(true);
            const response = await solicitudesService.obtenerTodas({
                id_asesor: usuario.id_usuario 
            });
            setSolicitudesPendientes(response.data);
            
        } catch (error) {
            console.error('Error al cargar solicitudes', error);
            showToast('No se pudieron cargar las solicitudes', 'error');
        } finally {
            setLoading(false);
        }
    }

    const rechazarSolicitudes = async (id_solicitud, razon) => {
        try {
            const response = await solicitudesService.rechazar(id_solicitud, razon);//hacemos la llamada al service
            showToast(response.message, 'success'); //mostramo el toast con el mensaje exitoso
            setModalRechazarOpen(false);//cerramos el modal de rechazar
            cargarSolicitudes(); //hacemos otra carga de las solicitudes

        } catch (error) {
            const message = error.response?.data?.message || 'No se pudo rechazar la solicitud'
            showToast(message, 'error'); // usa el message del error del backend, si existe
        }
    }

    const aceptarSolicitudes = async (solicitud) => {
        try {
            const response = await solicitudesService.aceptar(solicitud);//hacemos la llamada al service
            showToast(response.message, 'success'); //mostramo el toast con el mensaje exitoso
            setModalAceptarOpen(false);//cerramos el modal de aceptar
            cargarSolicitudes(); //hacemos otra carga de las solicitudes

        } catch (error) {
            const message = error.response?.data?.message || 'No se pudo rechazar la solicitud'
            showToast(message, 'error'); // usa el message del error del backend, si existe
        }
    }

    useEffect(() => {
    if (usuario) {
        cargarSolicitudes();
    }
}, [usuario]);

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

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

    // Handlers de confirmación (aquí va la llamada a tu API cuando la tengas)
    // Los modales ya se encargan de mostrar el toast y de cerrarse.
    const handleConfirmAceptar = async () => {
        aceptarSolicitudes(selectedSolicitud)
    };

    const handleConfirmRechazar = async (motivo) => {
        rechazarSolicitudes(selectedSolicitud.id_solicitud, motivo);//se manda al rechazar solicitudes el id y el motivo
    };

    if (loading) {
        return <Loading mensaje='cargando solicitudes...'/>
    }

    if (solicitudesPendientes.length === 0) {
        return <p>No tienes solicitudes pendientes por revisar.</p>;
    }

    return (
        <>
            <Box className="flex flex-row flex-wrap gap-7 justify-center">
                {solicitudesPendientes.map((solicitud) => ( //Este es apra que recorra el arreglo de datos y lso vaya imprimeindo

                    <Card key={solicitud.id}
                        sx={{
                            //Si ocupas moverle a cualquier cosa de tamaño, margen color de la taerjeta es aqui
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
                        <CardContent sx={{ padding: '24px 24px 10px 24px' }}> {/* La informacion de la tarjeta */}

                            {/* Contenedor principal de la img, nombre del alumno y email de alumno */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', mb: 3 }}>

                                <Avatar
                                    sx={{
                                        //Estilos de la foto de usuario
                                        backgroundColor: '#EBD9B4',
                                        color: '#8A6D2B',
                                        width: 50,
                                        height: 50,
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {solicitud.nombre_estudiante.charAt(0)}
                                </Avatar>

                                {/* contenedor para separar nombre y email */}
                                <Box>

                                    <Typography sx={{ fontSize: '16px', fontWeight: "700", color: '#000000', lineHeight: 1.2 }}>
                                        {solicitud.nombre_estudiante}
                                    </Typography>
                                    <Typography sx={{ fontSize: '13px', color: '#6A6A6A' }}>
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

                        {/* Donde se ponen los botones que se ocupen, se pueden quitar o agregar mas */}
                        <CardActions
                            sx={{
                                //Para poner los botones a un lado
                                padding: '0px 24px 20px 24px',
                                justifyContent: 'flex-end',
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
                )

                )}
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
