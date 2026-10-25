import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Typography } from '@mui/material';

import { formatearFechaVisible } from '../utils/fechaSolicitud';

// Un dato del modal: etiqueta arriba y valor abajo
function Campo({ label, children }) {
    return (
        <Box>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>
                {label}
            </Typography>
            <Typography variant="body1" sx={{ color: '#333333', overflowWrap: 'anywhere' }}>
                {children || 'N/A'}
            </Typography>
        </Box>
    );
}

// Información completa de una asesoría del historial (solo lectura)
export default function ModalInformacionHistorial({ open, onClose, asesoria }) {
    if (!asesoria) return null;

    const periodo =
        asesoria.fechaInicio && asesoria.fechaFin
            ? `${formatearFechaVisible(asesoria.fechaInicio)} - ${formatearFechaVisible(asesoria.fechaFin)}`
            : formatearFechaVisible(asesoria.fecha);

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '480px',
                    maxWidth: '90vw',
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
                    <Campo label="Materia">{asesoria.materia}</Campo>
                    <Campo label="Asesor">{asesoria.asesor}</Campo>
                    <Campo label="Modalidad">{asesoria.modalidad}</Campo>
                    <Campo label="Horario">{asesoria.horario}</Campo>
                    <Campo label="Periodo">{periodo}</Campo>
                    <Campo label="Estado">{asesoria.estado}</Campo>
                    {asesoria.descripcion && <Campo label="Descripción">{asesoria.descripcion}</Campo>}
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