import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

// Ajusta estas rutas según dónde estén los archivos en tu proyecto
import ToastNotification from '../../../../components/ui/ToastNotification';
import {
    ModalInfoAsesoriaEstudiante,
    ModalChatAsesoriaEstudiante
} from '../components/ModalesAsesoriasEstudiantes';

// Datos de prueba
const ASESORIAS_PRUEBA = [
    { id: 12, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Base de Datos", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 13, asesor: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 14, asesor: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 15, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 16, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 17, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 18, asesor: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 19, asesor: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 20, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 21, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" }
];

export default function TarjetaAsesoriasEstudiantes() {

    // La lista es un estado para que los cambios del modal de información se vean en la tarjeta
    const [asesorias, setAsesorias] = useState(ASESORIAS_PRUEBA);

    // Estados para Modales
    const [selectedAsesoria, setSelectedAsesoria] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalChatOpen, setModalChatOpen] = useState(false);

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

    // Helper para desenfocar elementos activos antes de abrir el modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    // Handlers para Abrir Modales
    const handleOpenInfo = (asesoria, event) => {
        clearFocus(event);
        setSelectedAsesoria(asesoria);
        setModalInfoOpen(true);
    };

    const handleOpenChat = (asesoria, event) => {
        clearFocus(event);
        setSelectedAsesoria(asesoria);
        setModalChatOpen(true);
    };

    // Guardar cambios del modal de información (aquí va tu llamada a la API)
    // El modal ya se encarga de mostrar el toast y de cerrarse.
    const handleGuardarInfo = (asesoriaActualizada) => {
        console.log('Información actualizada:', asesoriaActualizada);
        setAsesorias((prev) =>
            prev.map((item) =>
                item.id === asesoriaActualizada.id ? { ...item, ...asesoriaActualizada } : item
            )
        );
    };

    // Aquí va tu llamada a la API / socket para enviar el mensaje.
    // Si esta función lanza un error, el chat quita el mensaje y muestra un toast de error.
    const handleSendMessage = async (asesoria, mensaje) => {
        console.log('Mensaje enviado en la asesoría', asesoria?.id, mensaje);
    };

    return (
        <>
            <Box className="flex flex-row flex-wrap gap-7 justify-center">
                {asesorias.map((asesoria) => (
                    <Card
                    key={asesoria.id}
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
                                    {asesoria.asesor ? asesoria.asesor.charAt(0) : "A"}
                                </Avatar>

                                <Box>
                                    <Typography sx={{ fontSize: '16px', fontWeight: "700", color: '#000000', lineHeight: 1.2 }}>
                                        {asesoria.asesor}
                                    </Typography>
                                    <Typography sx={{ fontSize: '13px', color: '#6A6A6A' }}>
                                        {asesoria.email}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', mb: '5px' }}>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Materias: </span> {asesoria.materia}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Modalidad: </span> {asesoria.modalidad || "N/A"}
                                </Typography>
                            </Box>
                        </CardContent>

                        <CardActions
                            sx={{
                                padding: '0px 24px 20px 24px',
                                justifyContent: 'flex-end',
                                gap: '10px'
                            }}
                        >
                            <Button
                                variant="contained"
                                sx={{ color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                                size="small"
                                startIcon={<InfoOutlinedIcon />}
                                onClick={(e) => handleOpenInfo(asesoria, e)}
                            >
                                Informacion
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#C49E0D', color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                                size="small"
                                startIcon={<ChatOutlinedIcon />}
                                onClick={(e) => handleOpenChat(asesoria, e)}
                            >
                                Chat
                            </Button>
                        </CardActions>
                    </Card>

                ))}

            </Box>

            {/* Modales */}
            <ModalInfoAsesoriaEstudiante
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedAsesoria}
                onSave={handleGuardarInfo}
                showToast={showToast}
            />

            <ModalChatAsesoriaEstudiante
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
