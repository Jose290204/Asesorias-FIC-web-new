import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import ToastNotification from '../../../../components/ui/ToastNotification';
import ModalChatAsesoriaAsesor from './ModalChatAsesoriaAsesor';
import {
    ModalCompletarAsesoria,
    ModalEliminarAsesoria,
    ModalInfoAsesoria,
    ModalMaterialAdicional
} from './ModalesAsesoriasEnCurso';

export default function TarjetaAsesoriasEnCurso({
    asesorias = [],
    onGuardarInfo,
    onCompletar,
    onEliminar,
    onGuardarMaterial,
    onEnviarMensaje,
}) {
    const [selectedAsesoria, setSelectedAsesoria] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalCompletarOpen, setModalCompletarOpen] = useState(false);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);
    const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
    const [modalChatOpen, setModalChatOpen] = useState(false);

    // Menú ⋮ de la tarjeta (Completar / Editar / Eliminar)
    const [menuAnchor, setMenuAnchor] = useState(null);

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

    const openModal = (setOpen) => (asesoria, event) => {
        clearFocus(event);
        setSelectedAsesoria(asesoria);
        setOpen(true);
    };

    const handleOpenInfo = openModal(setModalInfoOpen);
    const handleOpenCompletar = openModal(setModalCompletarOpen);
    const handleOpenMaterial = openModal(setModalMaterialOpen);
    const handleOpenEliminar = openModal(setModalEliminarOpen);

    const handleOpenChat = openModal(setModalChatOpen);

    // Abre el menú ⋮ guardando de qué tarjeta vino
    const handleOpenMenu = (asesoria, event) => {
        setSelectedAsesoria(asesoria);
        setMenuAnchor(event.currentTarget);
    };

    const closeMenu = () => setMenuAnchor(null);

    // Cierra el menú y abre el modal que corresponda
    const handleMenuAccion = (abrirModal) => (event) => {
        closeMenu();
        abrirModal(selectedAsesoria, event);
    };

    // Si esta función lanza un error, el chat quita el mensaje y muestra un toast de error.
    const handleSendMessage = async (asesoria, mensaje) => {
        console.log('Mensaje enviado en la asesoría', asesoria?.id, mensaje);
        if (onEnviarMensaje) await onEnviarMensaje(asesoria, mensaje);
    };

    const handleGuardarInfo = async (asesoriaActualizada) => {
        console.log('Información actualizada:', asesoriaActualizada);
        if (onGuardarInfo) await onGuardarInfo(asesoriaActualizada);
    };

    const handleConfirmCompletar = async () => {
        console.log('Asesoría completada:', selectedAsesoria?.id);
        if (onCompletar) await onCompletar(selectedAsesoria);
    };

    const handleConfirmEliminar = async () => {
        console.log('Asesoría eliminada:', selectedAsesoria?.id);
        if (onEliminar) await onEliminar(selectedAsesoria);
    };

    const handleGuardarMaterial = async (listaMateriales) => {
        console.log('Material guardado para la asesoría', selectedAsesoria?.id, listaMateriales);
        if (onGuardarMaterial) await onGuardarMaterial(selectedAsesoria?.id, listaMateriales);
    };

    if (asesorias.length === 0) {
        return (
            <Box className="w-full text-center py-10">
                <Typography sx={{ fontSize: '16px', color: '#666666' }}>
                    No se encontraron asesorías que coincidan con la búsqueda.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Box className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
                {asesorias.map((asesoria) => (
                    <Card key={asesoria.id}
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
                        <CardContent sx={{ padding: '24px 24px 15px' }}>
                            <Box sx={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                                <Typography sx={{ fontSize: '18px', fontWeight: "700", color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0 }}>
                                    {asesoria.materia}
                                </Typography>

                                {/* Un solo botón ⋮ con las acciones poco frecuentes */}
                                <IconButton
                                    aria-label="Más acciones"
                                    aria-haspopup="true"
                                    onClick={(e) => handleOpenMenu(asesoria, e)}
                                    sx={{ flexShrink: 0, mr: '-12px', mt: '-10px', color: '#555555' }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Alumno: </span> {asesoria.estudiante}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Inicio: </span> {asesoria.fecha_inicio_formateada}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Horario: </span> {asesoria.horario}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Modalidad: </span> {asesoria.modalidad}
                                </Typography>
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

            {/* Menú ⋮ compartido por todas las tarjetas */}
            <Menu
                disableScrollLock
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleMenuAccion(handleOpenCompletar)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><CheckOutlinedIcon fontSize="small" sx={{ color: '#2E7D32' }} /></ListItemIcon>
                    Completar asesoría
                </MenuItem>
                <MenuItem onClick={handleMenuAccion(handleOpenInfo)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><EditOutlinedIcon fontSize="small" sx={{ color: '#08338F' }} /></ListItemIcon>
                    Editar información
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuAccion(handleOpenEliminar)} sx={{ minHeight: 44, color: '#C42525' }}>
                    <ListItemIcon><DeleteOutlineOutlinedIcon fontSize="small" sx={{ color: '#C42525' }} /></ListItemIcon>
                    Eliminar asesoría
                </MenuItem>
            </Menu>

            <ModalInfoAsesoria
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedAsesoria}
                onSave={handleGuardarInfo}
                showToast={showToast}
            />

            <ModalCompletarAsesoria
                open={modalCompletarOpen}
                onClose={() => setModalCompletarOpen(false)}
                onConfirm={handleConfirmCompletar}
                showToast={showToast}
            />

            <ModalMaterialAdicional
                open={modalMaterialOpen}
                onClose={() => setModalMaterialOpen(false)}
                data={selectedAsesoria}
                onSave={handleGuardarMaterial}
                showToast={showToast}
            />

            <ModalEliminarAsesoria
                open={modalEliminarOpen}
                onClose={() => setModalEliminarOpen(false)}
                onConfirm={handleConfirmEliminar}
                showToast={showToast}
            />

            <ModalChatAsesoriaAsesor
                open={modalChatOpen}
                onClose={() => setModalChatOpen(false)}
                data={selectedAsesoria}
                onSendMessage={handleSendMessage}
                showToast={showToast}
            />

            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </>
    );
}