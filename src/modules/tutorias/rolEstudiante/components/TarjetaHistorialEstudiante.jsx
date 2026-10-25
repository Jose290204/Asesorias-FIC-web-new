import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

// Modal de información de la asesoría (solo lectura)
import ModalInformacionHistorial from '../components/ModalInformacionHistoria;';
// Modal de material adicional del estudiante (solo consulta y descarga)
import ModalMaterialEstudiante from '../components/ModalMaterialEstudiante';
import { formatearFechaVisible } from '../utils/fechaSolicitud';

// Las asesorías las carga la vista; la tarjeta solo las muestra.
export default function TarjetaHistorialEstudiante({ historial = [] }) {

    // Estados para Modales
    const [selectedAsesoria, setSelectedAsesoria] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);

    // Helper para desenfocar elementos activos antes de abrir el modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    // Handlers para abrir modales
    const handleOpenInfo = (asesoria, event) => {
        clearFocus(event);
        setSelectedAsesoria(asesoria);
        setModalInfoOpen(true);
    };

    const handleOpenMaterial = (asesoria, event) => {
        clearFocus(event);
        setSelectedAsesoria(asesoria);
        setModalMaterialOpen(true);
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
            <Box className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
                {historial.map((asesoria) => { // Recorre el arreglo de datos y los va imprimiendo
                    const finalizada = /finaliz/i.test(asesoria.estado ?? '');

                    return (
                    <Card key={asesoria.id}
                        sx={{
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
                        <CardContent sx={{ padding: '24px 24px 15px 24px' }}>

                            {/* Encabezado: materia y botón de información a la derecha */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', mb: 1.5 }}>
                                <Typography
                                    title={asesoria.materia}
                                    sx={{
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        color: '#000000',
                                        lineHeight: 1.2,
                                        minWidth: 0,
                                        overflowWrap: 'anywhere',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {asesoria.materia}
                                </Typography>

                                <Tooltip title="Información">
                                    <IconButton
                                        size="small"
                                        aria-label="Información"
                                        sx={{ color: '#08338F', p: '3px', mr: '-6px', mt: '-4px', flexShrink: 0 }}
                                        onClick={(e) => handleOpenInfo(asesoria, e)}
                                    >
                                        <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            {/* Datos principales; el detalle completo está en el modal */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                    <span className="font-bold">Asesor: </span> {asesoria.asesor}
                                </Typography>

                               {/* Fecha de inicio y fecha de fin */}
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                    <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: '#08338F', mt: '1px', flexShrink: 0 }} />
                                    <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                        {formatearFechaVisible(asesoria.fechaInicio ?? asesoria.fecha)}
                                        {asesoria.fechaFin && ` - ${formatearFechaVisible(asesoria.fechaFin)}`}
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
                                    {asesoria.estado && (
                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            label={asesoria.estado}
                                            sx={{
                                                borderColor: finalizada ? '#2E7D32' : '#BDBDBD',
                                                color: finalizada ? '#2E7D32' : '#555555',
                                                fontWeight: 600
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>

                        </CardContent>

                        {/* Botón: una sola acción, a todo el ancho */}
                        <CardActions
                            sx={{
                                padding: '0px 24px 20px 24px',
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '10px'
                            }}
                        >
                            <Button
                                variant="contained"
                                startIcon={<FileDownloadOutlinedIcon />}
                                onClick={(e) => handleOpenMaterial(asesoria, e)}
                                sx={{
                                    minHeight: 40,
                                    backgroundColor: '#C49E0D',
                                    color: '#ffffff',
                                    borderRadius: '5px',
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: '#A8860B' }
                                }}
                            >
                                Material adicional
                            </Button>
                        </CardActions>

                    </Card>
                    );
                })}

            </Box>

            {/* Modal de información */}
            <ModalInformacionHistorial
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                asesoria={selectedAsesoria}
            />

            {/* Modal de material adicional (el modal ya adapta la lista a lo que lee) */}
            <ModalMaterialEstudiante
                open={modalMaterialOpen}
                onClose={() => setModalMaterialOpen(false)}
                data={selectedAsesoria}
            />
        </>
    );
}