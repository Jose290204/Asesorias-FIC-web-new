import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SendIcon from '@mui/icons-material/Send';

import { ModalInformacion, ModalSolicitar } from './ModalesSolicitarAsesorias';

export default function TarjetaSolicitarAsesorias({ asesor, onSaveSolicitud, showToast, razones = [] }) {
    const [openInfo, setOpenInfo] = useState(false);
    const [openSolicitar, setOpenSolicitar] = useState(false);

    if (!asesor) return null;

    // Helper para quitar el foco activo del botón antes de abrir el modal
    const abrirModal = (setEstadoModal) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setEstadoModal(true);
    };

    const materias = Array.isArray(asesor.materias) 
        ? asesor.materias.join(", ") 
        : asesor.materias;

    return (
        <>
            <Card
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
                            {asesor.asesor ? asesor.asesor.charAt(0) : "A"}
                        </Avatar>

                        <Box>
                            <Typography sx={{ fontSize: '16px', fontWeight: "700", color: '#000000', lineHeight: 1.2 }}>
                                {asesor.asesor}
                            </Typography>
                            <Typography sx={{ fontSize: '13px', color: '#6A6A6A' }}>
                                {asesor.email}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', mb: '5px' }}>
                        <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                            <span className="font-bold">Materias: </span> {materias}
                        </Typography>
                        <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                            <span className="font-bold">Modalidad: </span> {asesor.modalidad || "N/A"}
                        </Typography>
                    </Box>
                </CardContent>

                {/* Botones: dos columnas iguales; Solicitar con relleno e Información solo con borde */}
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
                        sx={{ minHeight: 40, borderRadius: '5px', textTransform: 'none' }}
                        startIcon={<InfoOutlinedIcon />}
                        onClick={() => abrirModal(setOpenInfo)}
                    >
                        Información
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            minHeight: 40,
                            backgroundColor: '#2E7D32',
                            color: '#ffffff',
                            borderRadius: '5px',
                            textTransform: 'none',
                            '&:hover': { backgroundColor: '#1B5E20' }
                        }}
                        startIcon={<SendIcon />}
                        onClick={() => abrirModal(setOpenSolicitar)}
                    >
                        Solicitar
                    </Button>
                </CardActions>
            </Card>

            <ModalInformacion
                open={openInfo}
                onClose={() => setOpenInfo(false)}
                asesor={asesor}
            />

            <ModalSolicitar
                open={openSolicitar}
                onClose={() => setOpenSolicitar(false)}
                asesor={asesor}
                onSave={onSaveSolicitud}
                showToast={showToast}
                razones={razones}
            />
        </>
    );
}