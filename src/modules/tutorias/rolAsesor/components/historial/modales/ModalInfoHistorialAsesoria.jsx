import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs from 'dayjs';
import { useState } from 'react';

import SeccionInfo from '../../../../rolEstudiante/components/compartidos/SeccionInfo';
import ModalSesionesAsesor from '../../compartidos/ModalSesionesAsesor';

const ICONO = { fontSize: 20 };

const ESTILO_ESTATUS = {
    completada: { label: 'Completada', color: '#2E7D32' },
    cancelada: { label: 'Cancelada', color: '#C62828' },
    en_curso: { label: 'En curso', color: '#2E7D32' }
};

// Una asesoría del historial ya está cerrada (completada o cancelada) y la API no deja editarla,
// así que este modal es solo de consulta. Desde aquí se pueden ver sus sesiones.
export default function ModalInfoHistorialAsesoria({ open, onClose, data, showToast }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    const [sesionesOpen, setSesionesOpen] = useState(false);

    if (!data) return null;

    const estatus = ESTILO_ESTATUS[data.estatus] ?? { label: data.estatus, color: '#555555' };
    const finalizada = data.finalizada_en ? dayjs(data.finalizada_en).format('DD/MM/YYYY') : '';
    // Las canceladas no tienen fecha de finalización: solo se muestra la de inicio
    const periodo = finalizada ? `${data.fecha_inicio_formateada} - ${finalizada}` : data.fecha_inicio_formateada;

    const texto = (valor) => (
        <Typography variant="body2" sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{valor || 'N/A'}</Typography>
    );

    return (
        <>
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
                fullScreen={esCelular}
                sx={{
                    '& .MuiPaper-root': esCelular ? { borderRadius: 0 } : {
                        width: '520px',
                        maxWidth: '90vw',
                        maxHeight: '90dvh',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1.5
                    }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, pr: 7 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', lineHeight: 1.2, overflowWrap: 'anywhere' }}>
                        {data.materia}
                    </Typography>

                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            mt: '10px',
                            px: '10px',
                            py: '3px',
                            borderRadius: '999px',
                            border: `1px solid ${estatus.color}`,
                            backgroundColor: '#FFFFFF'
                        }}
                    >
                        <FiberManualRecordIcon sx={{ fontSize: 12, color: estatus.color }} />
                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: estatus.color, lineHeight: 1.4 }}>
                            {estatus.label}
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

                <DialogContent dividers sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <SeccionInfo icono={<PersonOutlineOutlinedIcon sx={ICONO} />} etiqueta="Estudiante">
                            {texto(data.estudiante)}
                        </SeccionInfo>

                        <SeccionInfo icono={<HelpOutlineOutlinedIcon sx={ICONO} />} etiqueta="Razón de la asesoría">
                            {texto(data.razon)}
                        </SeccionInfo>

                        <SeccionInfo icono={<CalendarMonthOutlinedIcon sx={ICONO} />} etiqueta="Periodo">
                            {texto(periodo)}
                        </SeccionInfo>

                        <SeccionInfo icono={<AccessTimeOutlinedIcon sx={ICONO} />} etiqueta="Horario">
                            {texto(data.horario_con_dia || data.horario)}
                        </SeccionInfo>

                        <SeccionInfo icono={<LaptopOutlinedIcon sx={ICONO} />} etiqueta="Modalidad">
                            {texto(data.modalidad)}
                        </SeccionInfo>

                        <SeccionInfo icono={<EventNoteOutlinedIcon sx={ICONO} />} etiqueta="Sesiones registradas">
                            {texto(String(data.sesiones_count ?? 0))}
                        </SeccionInfo>

                        {data.estatus === 'cancelada' && data.motivo_cancelacion && (
                            <SeccionInfo icono={<HelpOutlineOutlinedIcon sx={ICONO} />} etiqueta="Motivo de la cancelación" tono="alerta">
                                {texto(data.motivo_cancelacion)}
                            </SeccionInfo>
                        )}

                        {data.observaciones && (
                            <SeccionInfo icono={<NotesOutlinedIcon sx={ICONO} />} etiqueta="Observaciones">
                                {texto(data.observaciones)}
                            </SeccionInfo>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setSesionesOpen(true)}
                        startIcon={<EventNoteOutlinedIcon />}
                        sx={{ textTransform: 'none', borderRadius: '8px', color: '#08338F', borderColor: '#08338F' }}
                    >
                        Ver sesiones
                    </Button>
                    <Button variant="contained" onClick={onClose} sx={{ backgroundColor: '#08338F', '&:hover': { backgroundColor: '#062568' } }}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            <ModalSesionesAsesor
                open={sesionesOpen}
                onClose={() => setSesionesOpen(false)}
                data={data}
                soloLectura
                showToast={showToast}
            />
        </>
    );
}
