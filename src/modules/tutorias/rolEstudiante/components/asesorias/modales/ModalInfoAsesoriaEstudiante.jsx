import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import SeccionInfo from '../../compartidos/SeccionInfo';

const ICONO = { fontSize: 20 };

// Información completa de una asesoría en curso (solo lectura)
export default function ModalInfoAsesoriaEstudiante({ open, onClose, asesoria }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    if (!asesoria) return null;

    const texto = (valor) => (
        <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{valor || 'N/A'}</Typography>
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
                        border: '1px solid #2E7D32',
                        backgroundColor: '#FFFFFF'
                    }}
                >
                    <FiberManualRecordIcon sx={{ fontSize: 12, color: '#2E7D32' }} />
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#2E7D32', lineHeight: 1.4 }}>
                        En curso
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

                    <SeccionInfo icono={<CalendarMonthOutlinedIcon sx={ICONO} />} etiqueta="Fecha de inicio">
                        {texto(asesoria.fecha_inicio_formateada)}
                    </SeccionInfo>

                    <SeccionInfo icono={<AccessTimeOutlinedIcon sx={ICONO} />} etiqueta="Horario">
                        {texto(asesoria.horario_con_dia)}
                    </SeccionInfo>

                    <SeccionInfo icono={<LaptopOutlinedIcon sx={ICONO} />} etiqueta="Modalidad">
                        {texto(asesoria.modalidad)}
                    </SeccionInfo>
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
