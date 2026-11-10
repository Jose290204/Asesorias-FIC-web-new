import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import ToastNotification from '../../../../../components/ui/ToastNotification';
import ModalChatAsesoriaEstudiante from '../compartidos/ModalChatAsesoriaEstudiante';
import ModalMaterialEstudiante from '../compartidos/ModalMaterialEstudiante';
import ModalSesionesEstudiante from '../compartidos/ModalSesionesEstudiante';
import TarjetaAsesoriaEstudiante from './TarjetaAsesoriaEstudiante';

// Cuadrícula de tarjetas de las asesorías en curso (también en escritorio: aquí no hay tabla).
// Las asesorías las carga la vista; esto las muestra y maneja los modales de cada tarjeta.
export default function ListaAsesoriasEstudiante({ asesorias = [], onChatLeido }) {
    // Estados para Modales
    const [selectedAsesoria, setSelectedAsesoria] = useState(null);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);
    const [modalSesionesOpen, setModalSesionesOpen] = useState(false);
    const [modalChatOpen, setModalChatOpen] = useState(false);

    // Estado para el Toast Global
    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

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

    const openModal = (setOpen) => (asesoria, event) => {
        clearFocus(event);
        setSelectedAsesoria(asesoria);
        setOpen(true);
    };

    const handleOpenMaterial = openModal(setModalMaterialOpen);
    const handleOpenSesiones = openModal(setModalSesionesOpen);
    // Al abrir el chat se quita el globito de mensajes sin leer (el chat los marca como leídos)
    const handleOpenChat = (asesoria, event) => {
        openModal(setModalChatOpen)(asesoria, event);
        if (onChatLeido) onChatLeido(asesoria.id);
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
                    <TarjetaAsesoriaEstudiante
                        key={asesoria.id}
                        asesoria={asesoria}
                        onSesiones={handleOpenSesiones}
                        onMaterial={handleOpenMaterial}
                        onChat={handleOpenChat}
                    />
                ))}
            </Box>

            {/* Modales */}
            <ModalMaterialEstudiante
                open={modalMaterialOpen}
                onClose={() => setModalMaterialOpen(false)}
                data={selectedAsesoria}
                showToast={showToast}
            />

            <ModalSesionesEstudiante
                open={modalSesionesOpen}
                onClose={() => setModalSesionesOpen(false)}
                data={selectedAsesoria}
                showToast={showToast}
            />

            <ModalChatAsesoriaEstudiante
                open={modalChatOpen}
                onClose={() => {
                    setModalChatOpen(false);
                    // Lo que se vio en el chat ya quedó leído
                    if (onChatLeido) onChatLeido(selectedAsesoria?.id);
                }}
                data={selectedAsesoria}
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
