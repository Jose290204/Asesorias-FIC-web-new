import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

// Ajusta estas rutas según dónde esté ubicado este archivo en tu proyecto
import ToastNotification from '../../../../components/ui/ToastNotification';
import {
    ModalInfoAsesoria,
    ModalCompletarAsesoria,
    ModalEliminarAsesoria,
    ModalMaterialAdicional
} from './ModalesAsesoriasEnCurso';

/**
 * Callbacks opcionales para que el componente padre (dueño de la lista) actualice sus datos / llame a la API:
 * - onGuardarInfo(asesoriaActualizada)
 * - onCompletar(asesoria)
 * - onEliminar(asesoria)
 * - onGuardarMaterial(idAsesoria, listaMateriales)
 */
export default function TarjetaAsesoriasEnCurso({
    asesorias = [],
    onGuardarInfo,
    onCompletar,
    onEliminar,
    onGuardarMaterial
}) {
    // Estados para Modales (los hooks van antes del return condicional)
    const [selectedAsesoria, setSelectedAsesoria] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalCompletarOpen, setModalCompletarOpen] = useState(false);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);
    const [modalEliminarOpen, setModalEliminarOpen] = useState(false);

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
    const openModal = (setOpen) => (asesoria, event) => {
        clearFocus(event);
        setSelectedAsesoria(asesoria);
        setOpen(true);
    };

    const handleOpenInfo = openModal(setModalInfoOpen);
    const handleOpenCompletar = openModal(setModalCompletarOpen);
    const handleOpenMaterial = openModal(setModalMaterialOpen);
    const handleOpenEliminar = openModal(setModalEliminarOpen);

    // Handlers de confirmación (aquí va la llamada a tu API cuando la tengas)
    // Los modales ya se encargan de mostrar el toast y de cerrarse.
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

    //mensaje si no aprecen busquedas
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
            <Box className="flex flex-row flex-wrap gap-7 justify-center">
                {asesorias.map((asesoria) => (
                    <Card key={asesoria.id}
                        sx={{
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
                        <CardContent sx={{ padding: '24px 24px 15px' }}>
                            <Box sx={{ marginBottom: '20px' }}>
                                <Typography sx={{ fontSize: '18px', fontWeight: "700", color: '#000000', lineHeight: 1.2 }}>
                                    {asesoria.materia}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Alumno: </span> {asesoria.alumno}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Inicio: </span> {asesoria.fecha}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Horario: </span> {asesoria.horario}
                                </Typography>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Modalidad: </span> {asesoria.modalidad}
                                </Typography>
                            </Box>
                        </CardContent>

                        <CardActions
                            sx={{
                                padding: '0px 24px 20px 24px',
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '10px',
                                    width: '100%'
                                }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{ borderRadius: '5px', textTransform: 'none' }}
                                    size="small"
                                    startIcon={<InfoOutlinedIcon />}
                                    onClick={(e) => handleOpenInfo(asesoria, e)}
                                >
                                    Informacion
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: '#2E7D32', color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                                    size="small"
                                    startIcon={<CheckOutlinedIcon />}
                                    onClick={(e) => handleOpenCompletar(asesoria, e)}
                                >
                                    Completar
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ borderRadius: '5px', textTransform: 'none', background: '#C49E0D' }}
                                    size="small"
                                    startIcon={<FileDownloadOutlinedIcon />}
                                    onClick={(e) => handleOpenMaterial(asesoria, e)}
                                >
                                    Material
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: '#C42525', color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                                    size="small"
                                    startIcon={<DeleteOutlineOutlinedIcon />}
                                    onClick={(e) => handleOpenEliminar(asesoria, e)}
                                >
                                    Eliminar
                                </Button>
                            </Box>
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {/* Modales */}
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
