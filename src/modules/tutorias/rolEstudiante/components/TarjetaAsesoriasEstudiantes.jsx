import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import ToastNotification from '../../../../components/ui/ToastNotification';
import ModalChatAsesoriaEstudiante from '../components/ModalChatAsesoriaEstudiante';
import ModalMaterialEstudiante from '../components/ModalMaterialEstudiante';
import { formatearFechaVisible } from '../utils/fechaSolicitud';

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
                        <CardContent sx={{ padding: '24px 24px 16px 24px' }}>
                            {/* Encabezado con altura fija: así todas las tarjetas quedan alineadas aunque el nombre ocupe 1 o 2 líneas */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '16px', mb: 2, minHeight: '72px' }}>
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
                                    {asesoria.asesor ? asesoria.asesor.charAt(0) : "A"}
                                </Avatar>

                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#08338F', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1.2 }}>
                                        Asesor
                                    </Typography>
                                    <Typography
                                        title={asesoria.asesor}
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            color: '#000000',
                                            lineHeight: 1.2,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {asesoria.asesor}
                                    </Typography>
                                    <Typography noWrap sx={{ fontSize: '13px', color: '#6A6A6A' }}>
                                        {asesoria.email}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mb: '5px' }}>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Materia: </span> {asesoria.materia}
                                </Typography>

                                {/* Fecha de inicio y horario */}
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                    <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: '#08338F', mt: '1px', flexShrink: 0 }} />
                                    <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                        {formatearFechaVisible(asesoria.fechaInicio ?? asesoria.fecha)}
                                        {asesoria.horario && ` · ${asesoria.horario}`}
                                    </Typography>
                                </Box>

                                {/* Chips: modalidad y estado */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {asesoria.modalidad && (
                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            label={asesoria.modalidad}
                                            sx={{ borderColor: '#08338F', color: '#08338F', fontWeight: 600 }}
                                        />
                                    )}
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        label={asesoria.estado || 'En curso'}
                                        sx={{ borderColor: '#2E7D32', color: '#2E7D32', fontWeight: 600 }}
                                    />
                                </Box>
                            </Box>
                        </CardContent>

                                                {/* Botones: dos columnas iguales; Chat con relleno y Material solo con borde */}
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
                                    color: '#8A6D2B',
                                    borderColor: '#C49E0D',
                                    borderRadius: '5px',
                                    textTransform: 'none',
                                    '&:hover': { borderColor: '#8A6D2B', backgroundColor: 'rgba(196, 158, 13, 0.08)' }
                                }}
                                startIcon={<FileDownloadOutlinedIcon />}
                                onClick={(e) => handleOpenMaterial(asesoria, e)}
                            >
                                Material
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ minHeight: 40, color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
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