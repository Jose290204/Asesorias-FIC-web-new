import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import SeccionInfo from '../../compartidos/SeccionInfo';

const ICONO = { fontSize: 20 };

const ESTILO_ESTATUS = {
    completada: { label: 'Completada', color: '#2E7D32', fondo: '#E8F5E9' },
    cancelada: { label: 'Cancelada', color: '#C62828', fondo: '#FDECEA' },
    en_curso: { label: 'En curso', color: '#2E7D32', fondo: '#E8F5E9' }
};

// Información completa de una asesoría del historial (solo lectura)
export default function ModalInfoHistorial({ open, onClose, asesoria }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    if (!asesoria) return null;

    const estatus = ESTILO_ESTATUS[asesoria.estatus] ?? { label: asesoria.estatus, color: '#555555', fondo: '#F3F4F6' };

    // Las canceladas no tienen fecha de finalización: solo se muestra la de inicio
    const periodo = asesoria.fecha_fin_formateada
        ? `${asesoria.fecha_inicio_formateada} - ${asesoria.fecha_fin_formateada}`
        : asesoria.fecha_inicio_formateada;

    const texto = (valor) => (
        <Typography variant="body2" sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{valor || 'N/A'}</Typography>
    );

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullScreen={esCelular}
            sx={{
                '& .MuiPaper-root': esCelular ? { borderRadius: 0 } : {
                    width: '480px',
                    maxWidth: '90vw',
                    maxHeight: '90dvh',
                    borderRadius: '16px',
                    p: 1.5
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, pr: 7 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', lineHeight: 1.2, overflowWrap: 'anywhere' }}>
                    {asesoria.materia}
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
                    <SeccionInfo icono={<BadgeOutlinedIcon sx={ICONO} />} etiqueta="Asesor">
                        {texto(asesoria.asesor)}
                        {asesoria.asesor_correo && (
                            <Typography variant="body2" sx={{ color: '#6A6A6A', overflowWrap: 'anywhere' }}>
                                {asesoria.asesor_correo}
                            </Typography>
                        )}
                    </SeccionInfo>

                    <SeccionInfo icono={<HelpOutlineOutlinedIcon sx={ICONO} />} etiqueta="Razón de la asesoría">
                        {texto(asesoria.razon)}
                    </SeccionInfo>

                    <SeccionInfo icono={<CalendarMonthOutlinedIcon sx={ICONO} />} etiqueta="Periodo">
                        {texto(periodo)}
                    </SeccionInfo>

                    <SeccionInfo icono={<AccessTimeOutlinedIcon sx={ICONO} />} etiqueta="Horario">
                        {texto(asesoria.horario_con_dia)}
                    </SeccionInfo>

                    <SeccionInfo icono={<LaptopOutlinedIcon sx={ICONO} />} etiqueta="Modalidad">
                        {texto(asesoria.modalidad)}
                    </SeccionInfo>

                    <SeccionInfo icono={<EventNoteOutlinedIcon sx={ICONO} />} etiqueta="Sesiones registradas">
                        {texto(String(asesoria.sesiones_count ?? 0))}
                    </SeccionInfo>

                    {asesoria.estatus === 'cancelada' && asesoria.motivo_cancelacion && (
                        <SeccionInfo icono={<HelpOutlineOutlinedIcon sx={ICONO} />} etiqueta="Motivo de la cancelación" tono="alerta">
                            {texto(asesoria.motivo_cancelacion)}
                        </SeccionInfo>
                    )}

                    {asesoria.observaciones && (
                        <SeccionInfo icono={<NotesOutlinedIcon sx={ICONO} />} etiqueta="Observaciones">
                            {texto(asesoria.observaciones)}
                        </SeccionInfo>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={onClose} sx={{ backgroundColor: '#08338F', '&:hover': { backgroundColor: '#062568' } }}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
