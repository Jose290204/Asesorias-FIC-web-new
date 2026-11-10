import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import ToastNotification from '../../../../../components/ui/ToastNotification';
import ModalMaterialEstudiante from '../compartidos/ModalMaterialEstudiante';
import ModalSesionesEstudiante from '../compartidos/ModalSesionesEstudiante';
import ModalInfoHistorial from './modales/ModalInfoHistorial';
import TarjetaHistorialEstudiante from './TarjetaHistorialEstudiante';

// Cuadrícula de tarjetas del historial (también en escritorio: aquí no hay tabla).
// Las asesorías las carga la vista; esto las muestra y maneja los modales de cada tarjeta.
export default function ListaHistorialEstudiante({ historial = [] }) {
    // Estados para Modales
    const [selectedAsesoria, setSelectedAsesoria] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);
    const [modalSesionesOpen, setModalSesionesOpen] = useState(false);

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

    const handleOpenInfo = openModal(setModalInfoOpen);
    const handleOpenMaterial = openModal(setModalMaterialOpen);
    const handleOpenSesiones = openModal(setModalSesionesOpen);

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
            <Box className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
                {historial.map((asesoria) => (
                    <TarjetaHistorialEstudiante
                        key={asesoria.id}
                        asesoria={asesoria}
                        onInfo={handleOpenInfo}
                        onMaterial={handleOpenMaterial}
                        onSesiones={handleOpenSesiones}
                    />
                ))}
            </Box>

            {/* Modales */}
            <ModalInfoHistorial
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                asesoria={selectedAsesoria}
            />

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
