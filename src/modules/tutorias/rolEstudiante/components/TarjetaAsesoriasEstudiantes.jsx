import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import ToastNotification from '../../../../components/ui/ToastNotification';
import ModalChatAsesoriaEstudiante from '../components/ModalChatAsesoriaEstudiante';
import ModalMaterialEstudiante from '../components/ModalMaterialEstudiante';

// Las asesorías las carga la vista; la tarjeta solo las muestra.
export default function TarjetaAsesoriasEstudiantes({ asesorias = [] }) {


    // Estados para Modales
    const [selectedAsesoria, setSelectedAsesoria] = useState(null);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);
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
    const handleOpenMaterial = (asesoria, event) => {
        clearFocus(event);
        setSelectedAsesoria(asesoria);
        setModalMaterialOpen(true);
    };

    const handleOpenChat = (asesoria, event) => {
        clearFocus(event);
        setSelectedAsesoria(asesoria);
        setModalChatOpen(true);
    };

    // Si esta función lanza un error, el chat quita el mensaje y muestra un toast de error.
    const handleSendMessage = async (asesoria, mensaje) => {
        console.log('Mensaje enviado en la asesoría', asesoria?.id, mensaje);
    };

    if (asesorias.length === 0) {
        return (
            <Box className="w-full text-center py-10">
                <Typography sx={{ fontSize: '16px', color: '#666666' }}>
                    No tienes asesorías en curso.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Box className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
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
                                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#08338F', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1.2 }}>
                                        Asesor
                                    </Typography>
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
                                    <span className="font-bold">Materia: </span> {asesoria.materia}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Horario: </span> {asesoria.horario || "N/A"}
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
                                flexWrap: 'wrap',
                                gap: '10px'
                            }}
                        >
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#C49E0D', color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                                size="small"
                                startIcon={<FileDownloadOutlinedIcon />}
                                onClick={(e) => handleOpenMaterial(asesoria, e)}
                            >
                                Material adicional
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
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
            <ModalMaterialEstudiante
                open={modalMaterialOpen}
                onClose={() => setModalMaterialOpen(false)}
                data={selectedAsesoria}
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