import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Typography } from '@mui/material';

import CampoInfo from '../../compartidos/CampoInfo';
import useMediaQuery from '@mui/material/useMediaQuery';

const ETIQUETA_ESTATUS = { pendiente: 'Pendiente', aceptada: 'Aceptada', rechazada: 'Rechazada', cancelada: 'Cancelada' };

// Información completa de una solicitud (solo lectura)
export default function ModalInfoSolicitud({ open, onClose, solicitud }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    if (!solicitud) return null;

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
                    borderRadius: '10px',
                    p: 2,
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 8px 24px rgba(0,0,0,0.15)'
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '12px 16px 8px 16px' }}>
                <Box sx={{ width: 40 }} />
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                    Información de la Solicitud
                </Typography>
                <IconButton onClick={onClose} sx={{ color: '#888888' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <hr style={{ border: '0', borderTop: '1px solid #EAEAEA', margin: '0 16px 16px 16px' }} />

            <DialogContent sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <CampoInfo label="Asesor">{solicitud.asesor}</CampoInfo>
                    <CampoInfo label="Materia">{solicitud.materia}</CampoInfo>
                    <CampoInfo label="Fecha">{solicitud.fecha_formateada}</CampoInfo>
                    <CampoInfo label="Horario">{solicitud.horario_con_dia}</CampoInfo>
                    <CampoInfo label="Modalidad">{solicitud.modalidad}</CampoInfo>
                    <CampoInfo label="Razón de la asesoría">{solicitud.razon}</CampoInfo>
                    <CampoInfo label="Estado">{ETIQUETA_ESTATUS[solicitud.estatus] ?? solicitud.estatus}</CampoInfo>
                    {solicitud.nota && <CampoInfo label="Tu nota">{solicitud.nota}</CampoInfo>}
                    {solicitud.estatus === 'rechazada' && solicitud.motivo_rechazo && (
                        <CampoInfo label="Notas del asesor">{solicitud.motivo_rechazo}</CampoInfo>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'end', borderTop: '1px solid #E0E0E0' }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
