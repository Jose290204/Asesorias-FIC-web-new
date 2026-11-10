import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import ModalCancelarSolicitud from './modales/ModalCancelarSolicitud';
import ModalEditarSolicitud from './modales/ModalEditarSolicitud';
import ModalInfoSolicitud from './modales/ModalInfoSolicitud';
import ModalNotaAsesor from './modales/ModalNotaAsesor';
import TarjetaSolicitud from './TarjetaSolicitud';

// Cuadrícula de tarjetas de solicitudes (también en escritorio: aquí no hay tabla).
// Las solicitudes y sus cambios los maneja la vista contra la API; esto las muestra y maneja los modales.
// onEditar(id, cambios) y onCancelar(solicitud) regresan true si salió bien (el modal se cierra).
export default function ListaSolicitudesEnRevision({ solicitudes = [], onEditar, onCancelar, showToast }) {
    // Qué modal está abierto y con qué solicitud
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [modalNotaOpen, setModalNotaOpen] = useState(false);
    const [modalCancelarOpen, setModalCancelarOpen] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

    const abrir = (setOpen) => (solicitud) => {
        document.activeElement?.blur();
        setSolicitudSeleccionada(solicitud);
        setOpen(true);
    };

    const handleOpenInfo = abrir(setModalInfoOpen);
    const handleOpenEditar = abrir(setModalEditarOpen);
    const handleOpenNota = abrir(setModalNotaOpen);
    const handleOpenCancelar = abrir(setModalCancelarOpen);

    return (
        <>
            <Box className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
                {solicitudes.length === 0 ? (
                    <Typography sx={{ py: 5, color: 'text.secondary', fontWeight: 'bold', gridColumn: '1 / -1' }}>
                        No hay solicitudes con este estado.
                    </Typography>
                ) : (
                    solicitudes.map((solicitud) => (
                        <TarjetaSolicitud
                            key={solicitud.id}
                            solicitud={solicitud}
                            onInfo={handleOpenInfo}
                            onEditar={handleOpenEditar}
                            onCancelar={handleOpenCancelar}
                            onNota={handleOpenNota}
                        />
                    ))
                )}
            </Box>

            {/* Modales */}
            <ModalInfoSolicitud
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                solicitud={solicitudSeleccionada}
            />

            <ModalEditarSolicitud
                open={modalEditarOpen}
                onClose={() => setModalEditarOpen(false)}
                solicitud={solicitudSeleccionada}
                onSave={onEditar}
                showToast={showToast}
            />

            <ModalCancelarSolicitud
                open={modalCancelarOpen}
                onClose={() => setModalCancelarOpen(false)}
                onConfirm={() => onCancelar?.(solicitudSeleccionada)}
            />

            <ModalNotaAsesor
                open={modalNotaOpen}
                onClose={() => setModalNotaOpen(false)}
                nota={solicitudSeleccionada?.motivo_rechazo}
            />
        </>
    );
}
