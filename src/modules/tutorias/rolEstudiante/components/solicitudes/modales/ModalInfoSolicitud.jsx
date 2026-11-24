import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import SeccionInfo from '../../compartidos/SeccionInfo';

// Cómo se ve cada estatus en la pastilla (igual que en la tarjeta)
const ESTILO_ESTATUS = {
    pendiente: { etiqueta: 'Pendiente', color: '#8A6D00', borde: '#C49E0D' },
    aceptada: { etiqueta: 'Aceptada', color: '#2E7D32', borde: '#2E7D32' },
    rechazada: { etiqueta: 'Rechazada', color: '#C62828', borde: '#C62828' },
    cancelada: { etiqueta: 'Cancelada', color: '#555555', borde: '#9E9E9E' }
};

const ICONO = { fontSize: 20 };

// Información completa de una solicitud (solo lectura)
export default function ModalInfoSolicitud({ open, onClose, solicitud }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    if (!solicitud) return null;

    const estilo = ESTILO_ESTATUS[solicitud.estatus] ?? { etiqueta: solicitud.estatus, color: '#555555', borde: '#BDBDBD' };
    const texto = (valor) => (
        <Typography variant="body2" sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-line' }}>{valor || 'N/A'}</Typography>
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
                    p: 1.5,
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 8px 24px rgba(0,0,0,0.15)'
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, pr: 7 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', lineHeight: 1.2 }}>
                    Información de la Solicitud
                </Typography>

                {/* Estatus: igual que en la tarjeta */}
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        mt: '10px',
                        px: '10px',
                        py: '3px',
                        borderRadius: '999px',
                        border: `1px solid ${estilo.borde}`,
                        backgroundColor: '#FFFFFF'
                    }}
                >
                    <FiberManualRecordIcon sx={{ fontSize: 12, color: estilo.color }} />
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: estilo.color, lineHeight: 1.4 }}>
                        {estilo.etiqueta}
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
                    <SeccionInfo icono={<MenuBookOutlinedIcon sx={ICONO} />} etiqueta="Materia">
                        {texto(solicitud.materia)}
                    </SeccionInfo>

                    <SeccionInfo icono={<BadgeOutlinedIcon sx={ICONO} />} etiqueta="Asesor">
                        {texto(solicitud.asesor)}
                        {solicitud.asesor_correo && (
                            <Typography variant="body2" sx={{ color: '#6A6A6A', overflowWrap: 'anywhere' }}>
                                {solicitud.asesor_correo}
                            </Typography>
                        )}
                    </SeccionInfo>

                    <SeccionInfo icono={<CalendarMonthOutlinedIcon sx={ICONO} />} etiqueta="Fecha">
                        {texto(solicitud.fecha_formateada)}
                    </SeccionInfo>

                    <SeccionInfo icono={<AccessTimeOutlinedIcon sx={ICONO} />} etiqueta="Horario">
                        {texto(solicitud.horario_con_dia)}
                    </SeccionInfo>

                    <SeccionInfo icono={<LaptopOutlinedIcon sx={ICONO} />} etiqueta="Modalidad">
                        {texto(solicitud.modalidad)}
                    </SeccionInfo>

                    <SeccionInfo icono={<HelpOutlineOutlinedIcon sx={ICONO} />} etiqueta="Razón de la asesoría">
                        {texto(solicitud.razon)}
                    </SeccionInfo>

                    {solicitud.nota && (
                        <SeccionInfo icono={<ChatBubbleOutlineOutlinedIcon sx={ICONO} />} etiqueta="Tu nota">
                            {texto(solicitud.nota)}
                        </SeccionInfo>
                    )}

                    {solicitud.estatus === 'rechazada' && solicitud.motivo_rechazo && (
                        <SeccionInfo icono={<SpeakerNotesOutlinedIcon sx={ICONO} />} etiqueta="Notas del asesor" tono="alerta">
                            {texto(solicitud.motivo_rechazo)}
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
