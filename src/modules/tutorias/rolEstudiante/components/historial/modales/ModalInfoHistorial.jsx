import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Typography } from '@mui/material';

import CampoInfo from '../../compartidos/CampoInfo';
import useMediaQuery from '@mui/material/useMediaQuery';

const ETIQUETA_ESTATUS = { completada: 'Completada', cancelada: 'Cancelada', en_curso: 'En curso' };

// Información completa de una asesoría del historial (solo lectura)
export default function ModalInfoHistorial({ open, onClose, asesoria }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    if (!asesoria) return null;

    // Las canceladas no tienen fecha de finalización: solo se muestra la de inicio
    const periodo = asesoria.fecha_fin_formateada
        ? `${asesoria.fecha_inicio_formateada} - ${asesoria.fecha_fin_formateada}`
        : asesoria.fecha_inicio_formateada;

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
                    Información de la Asesoría
                </Typography>
                <IconButton onClick={onClose} sx={{ color: '#888888' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <hr style={{ border: '0', borderTop: '1px solid #EAEAEA', margin: '0 16px 16px 16px' }} />

            <DialogContent sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <CampoInfo label="Materia">{asesoria.materia}</CampoInfo>
                    <CampoInfo label="Asesor">{asesoria.asesor}</CampoInfo>
                    <CampoInfo label="Estado">{ETIQUETA_ESTATUS[asesoria.estatus] ?? asesoria.estatus}</CampoInfo>
                    <CampoInfo label="Periodo">{periodo}</CampoInfo>
                    <CampoInfo label="Horario">{asesoria.horario_con_dia}</CampoInfo>
                    <CampoInfo label="Modalidad">{asesoria.modalidad}</CampoInfo>
                    <CampoInfo label="Razón de la asesoría">{asesoria.razon}</CampoInfo>
                    <CampoInfo label="Sesiones registradas">{String(asesoria.sesiones_count ?? 0)}</CampoInfo>
                    {asesoria.estatus === 'cancelada' && asesoria.motivo_cancelacion && (
                        <CampoInfo label="Motivo de la cancelación">{asesoria.motivo_cancelacion}</CampoInfo>
                    )}
                    {asesoria.observaciones && <CampoInfo label="Observaciones">{asesoria.observaciones}</CampoInfo>}
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
