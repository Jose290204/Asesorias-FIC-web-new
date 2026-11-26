import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { mensajesDeError } from '../../../../../Services/errores';
import { traerSesiones } from '../../../../../Services/sesionesAsesorService';
import useMediaQuery from '@mui/material/useMediaQuery';

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

// Cuadrito con el día y el mes de la sesión
function FechaSesion({ fecha }) {
    const d = dayjs(fecha);

    return (
        <Box
            sx={{
                width: 52,
                flexShrink: 0,
                py: '6px',
                borderRadius: '10px',
                backgroundColor: '#E6ECF8',
                color: '#08338F',
                textAlign: 'center'
            }}
        >
            <Typography sx={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.1 }}>{d.format('DD')}</Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', lineHeight: 1.2 }}>{MESES[d.month()]}</Typography>
        </Box>
    );
}

// Sesiones de una asesoría para el estudiante: solo consulta (el asesor es quien las registra).
// data es la asesoría (usa data.id).
export default function ModalSesionesEstudiante({ open, onClose, data, showToast }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    const [sesiones, setSesiones] = useState([]);
    // Id de la asesoría cuya lista ya llegó (sirve para saber si todavía se está cargando)
    const [cargadoDe, setCargadoDe] = useState(null);

    const asesoriaId = data?.id;
    const cargando = Boolean(open && asesoriaId && cargadoDe !== asesoriaId);

    // Carga las sesiones cada vez que se abre el modal
    useEffect(() => {
        if (!open || !asesoriaId) return undefined;

        let cancelado = false;

        traerSesiones(asesoriaId)
            .then((lista) => {
                if (cancelado) return;
                setSesiones(lista);
                setCargadoDe(asesoriaId);
            })
            .catch((error) => {
                if (cancelado) return;
                setCargadoDe(asesoriaId);
                showToast?.(mensajesDeError(error)[0], 'error');
            });

        return () => {
            cancelado = true;
        };
    }, [open, asesoriaId, showToast]);

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullScreen={esCelular}
            sx={{
                '& .MuiPaper-root': esCelular ? { borderRadius: 0 } : {
                    width: '520px',
                    maxWidth: '90vw',
                    minHeight: '380px',
                    maxHeight: '85dvh',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1.5
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, pr: 7, display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #1E4DB7 0%, #08338F 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <EventNoteOutlinedIcon />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1.2 }}>
                        Sesiones
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px', overflowWrap: 'anywhere' }}>
                        {data?.materia}
                        {data?.asesor && ` · Asesor: ${data.asesor}`}
                    </Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column' }}>
                {cargando ? (
                    <Box className="flex justify-center py-4"><CircularProgress size={28} /></Box>
                ) : sesiones.length === 0 ? (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', textAlign: 'center', py: 4 }}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                backgroundColor: '#F1F4FA',
                                color: '#9AA7C4',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <EventNoteOutlinedIcon sx={{ fontSize: 34 }} />
                        </Box>
                        <Typography sx={{ fontWeight: 700, color: '#333333' }}>
                            Aún no hay sesiones
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Todavía no hay sesiones registradas.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Typography sx={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#6A6A6A', mb: 1.5 }}>
                            Sesiones registradas ({sesiones.length})
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {sesiones.map((sesion) => (
                                <Box
                                    key={sesion.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '14px',
                                        p: '12px 14px',
                                        borderRadius: '12px',
                                        backgroundColor: '#F7F9FD',
                                        border: '1px solid #EEF1F7'
                                    }}
                                >
                                    <FechaSesion fecha={sesion.fecha} />

                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#08338F' }}>
                                            <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />
                                            <Typography sx={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>
                                                {dayjs(sesion.fecha).format('DD/MM/YYYY')} · {sesion.horario?.etiqueta}
                                            </Typography>
                                        </Box>
                                        {sesion.tema && (
                                            <Typography variant="body2" sx={{ overflowWrap: 'anywhere', mt: '4px' }}>
                                                <strong>Tema: </strong>{sesion.tema}
                                            </Typography>
                                        )}
                                        {/* Las notas y las evidencias son del asesor: el estudiante no las ve */}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={onClose} sx={{ backgroundColor: '#08338F', '&:hover': { backgroundColor: '#062568' } }}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
