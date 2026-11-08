import CloseIcon from '@mui/icons-material/Close';
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
                    maxHeight: '85dvh',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1.5
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>
                Sesiones: {data?.materia}
                {data?.asesor && (
                    <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', fontWeight: 'normal' }}>
                        Asesor: {data.asesor}
                    </Typography>
                )}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Typography sx={{ fontWeight: 'bold', mb: 1.5 }}>
                    Sesiones registradas ({sesiones.length})
                </Typography>

                {cargando ? (
                    <Box className="flex justify-center py-4"><CircularProgress size={28} /></Box>
                ) : sesiones.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                        Todavía no hay sesiones registradas.
                    </Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {sesiones.map((sesion) => (
                            <Box key={sesion.id} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', p: 1.5 }}>
                                <Typography sx={{ fontWeight: 600 }}>
                                    {dayjs(sesion.fecha).format('DD/MM/YYYY')} · {sesion.horario?.etiqueta}
                                </Typography>
                                {sesion.tema && (
                                    <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                                        <strong>Tema: </strong>{sesion.tema}
                                    </Typography>
                                )}
                                {sesion.notas && (
                                    <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                                        {sesion.notas}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1.5 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
}
