import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

// Modal de material adicional del estudiante (solo consulta y descarga)
import ModalMaterialEstudiante from '../components/ModalMaterialEstudiante';

// Las asesorías las carga la vista; la tarjeta solo las muestra.
export default function TarjetaHistorialEstudiante({ historial = [] }) {

    // Estados para Modales
    const [selectedAsesoria, setSelectedAsesoria] = useState(null);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);

    // Helper para desenfocar elementos activos antes de abrir el modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    // Handlers para Abrir Modales
    // Handler para abrir el modal
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
                {historial.map((asesoria) => ( // Recorre el arreglo de datos y los va imprimiendo


                    <Card key={asesoria.id}
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
                        <CardContent
                            sx={{
                                padding: '24px 24px 15px 24px'
                            }}
                        >

                            <Box sx={{ marginBottom: '20px' }}>
                                <Typography sx={{ fontSize: '18px', fontWeight: "700", color: '#000000', lineHeight: 1.2 }}>
                                    {asesoria.materia}
                                </Typography>
                            </Box>

                            {/* Información de la asesoría */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',

                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: '#333333'
                                    }}
                                >
                                    <span className="font-bold">
                                        Asesor:
                                    </span>{' '}
                                    {asesoria.asesor}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: '#333333'
                                    }}
                                >
                                    <span className="font-bold">
                                        Materia:
                                    </span>{' '}
                                    {asesoria.materia}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: '#333333'
                                    }}
                                >
                                    <span className="font-bold">
                                        Modalidad:
                                    </span>{' '}
                                    {asesoria.modalidad}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: '#333333'
                                    }}
                                >
                                    <span className="font-bold">
                                        Horario:
                                    </span>{' '}
                                    {asesoria.horario}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: '#333333'
                                    }}
                                >
                                    <span className="font-bold">
                                        Periodo:
                                    </span>{' '}
                                    {asesoria.fechaInicio && asesoria.fechaFin ? `${asesoria.fechaInicio} - ${asesoria.fechaFin}` : asesoria.fecha}
                                </Typography>

                            </Box>

                        </CardContent>

                        {/* Botones */}
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
                                sx={{
                                    backgroundColor: '#C49E0D',
                                    color: '#fff',
                                    borderRadius: '5px',
                                    textTransform: 'none'
                                }}
                                size="small"
                                startIcon={<FileDownloadOutlinedIcon />}
                                onClick={(e) => handleOpenMaterial(asesoria, e)}
                            >
                                Material
                            </Button>

                        </CardActions>

                    </Card>

                ))}

            </Box>

            {/* Modal de material adicional (el modal ya adapta la lista a lo que lee) */}
            <ModalMaterialEstudiante
                open={modalMaterialOpen}
                onClose={() => setModalMaterialOpen(false)}
                data={selectedAsesoria}
            />
        </>
    );
}