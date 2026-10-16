import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import ToastNotification from '../../../../components/ui/ToastNotification';
// Modal de material adicional (solo consulta y descarga), el mismo que usa el estudiante
import ModalMaterialEstudiante from '../../rolEstudiante/components/ModalMaterialEstudiante';
import { ModalInfoHistorialAsesoria } from './ModalesHistorialAsesorias';
// Chat del asesor con el estudiante (el mismo que usa Asesorías en curso)
import ModalChatAsesoriaAsesor from './ModalChatAsesoriaAsesor';


// Las asesorías del historial las carga la vista; la tarjeta solo las muestra.
export default function TarjetaHistorialAsesorias({ historial = [], onActualizar }) {

    // Estados para Modales
    const [selectedAsesoria, setSelectedAsesoria] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalChatOpen, setModalChatOpen] = useState(false);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);

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

    // Handlers para Abrir Modales
    const handleOpenInfo = (solicitud, event) => {
        clearFocus(event);
        setSelectedAsesoria(solicitud);
        setModalInfoOpen(true);
    };

    const handleOpenMaterial = (solicitud, event) => {
        clearFocus(event);
        setSelectedAsesoria(solicitud);
        setModalMaterialOpen(true);
    };

    const handleOpenChat = (solicitud, event) => {
        clearFocus(event);
        setSelectedAsesoria(solicitud);
        setModalChatOpen(true);
    };

    // La edición se guarda en la vista (que es la dueña de los datos)
    const handleGuardarInfo = (asesoriaActualizada) => {
        if (onActualizar) onActualizar(asesoriaActualizada);
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
            <Box className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
                {historial.map((solicitud) => ( // Recorre el arreglo de datos y los va imprimiendo

                    <Card key={solicitud.id}
                        sx={{
                            //Si ocupas moverle a cualquier cosa de tamaño, margen color de la taerjeta es aqui
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
                        <CardContent sx={{ padding: '24px 24px 15px 24px' }}> {/* La informacion de la tarjeta */}

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
                                        fontWeight: 'bold',
                                        flexShrink: 0
                                    }}
                                >
                                    {solicitud.alumno.charAt(0)}
                                </Avatar>

                                {/* contenedor para separar nombre y email */}
                                <Box sx={{ minWidth: 0 }}>

                                    {/* Nombre + icono chico de información al lado */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        <Typography sx={{ fontSize: '16px', fontWeight: "700", color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0 }}>
                                            {solicitud.alumno}
                                        </Typography>
                                        <Tooltip title="Información">
                                            <IconButton
                                                size="small"
                                                aria-label="Información"
                                                sx={{ color: '#08338F', p: '3px', flexShrink: 0 }}
                                                onClick={(e) => handleOpenInfo(solicitud, e)}
                                            >
                                                <InfoOutlinedIcon sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Typography sx={{ fontSize: '13px', color: '#6A6A6A', overflowWrap: 'anywhere' }}>
                                        {solicitud.email}
                                    </Typography>

                                </Box>


                            </Box>


                            {/* Contenedor principal de los datos */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Materia: </span> {solicitud.materia}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Fecha: </span> {solicitud.fecha}
                                </Typography>

                            </Box>

                        </CardContent>

                        {/* Donde se ponen los botones que se ocupen, se pueden quitar o agregar mas */}
                        <CardActions
                            sx={{
                                //Para poner los botones a un lado
                                padding: '0px 24px 20px 24px',
                                justifyContent: 'flex-end',
                                flexWrap: 'wrap',
                                gap: '10px'
                            }}
                        >
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#C49E0D', color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                                size="small"
                                startIcon={<FileDownloadOutlinedIcon />}
                                onClick={(e) => handleOpenMaterial(solicitud, e)}
                            >
                                Material
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                                size="small"
                                startIcon={<ChatOutlinedIcon />}
                                onClick={(e) => handleOpenChat(solicitud, e)}
                            >
                                Chat
                            </Button>
                        </CardActions>
                    </Card>
                )

                )}
            </Box>

            {/* Modales */}
            <ModalInfoHistorialAsesoria
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedAsesoria}
                onSave={handleGuardarInfo}
                showToast={showToast}
            />

            <ModalMaterialEstudiante
                open={modalMaterialOpen}
                onClose={() => setModalMaterialOpen(false)}
                data={selectedAsesoria}
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