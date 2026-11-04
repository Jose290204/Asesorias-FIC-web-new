import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';

import ModalSesionesAsesor from './ModalSesionesAsesor';

// Campos que se muestran pero no se pueden modificar: fondo gris, sin cursor al hacer clic
const CAMPO_BLOQUEADO = {
    sx: {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#F3F4F6',
            cursor: 'not-allowed',
            '& fieldset': { borderColor: '#E0E0E0' },
            '&:hover fieldset': { borderColor: '#E0E0E0' }
        },
        '& .MuiInputBase-input': { pointerEvents: 'none', caretColor: 'transparent', color: '#6B7280' },
        '& .MuiInputLabel-root': { color: '#6B7280' }
    },
    slotProps: { input: { readOnly: true }, htmlInput: { tabIndex: -1 } }
};

const ETIQUETA_ESTATUS = { completada: 'Completada', cancelada: 'Cancelada', en_curso: 'En curso' };

// Una asesoría del historial ya está cerrada (completada o cancelada) y la API no deja editarla,
// así que este modal es solo de consulta. Desde aquí se pueden ver sus sesiones.
export function ModalInfoHistorialAsesoria({ open, onClose, data, showToast }) {
    const [sesionesOpen, setSesionesOpen] = useState(false);

    if (!data) return null;

    const finalizada = data.finalizada_en ? dayjs(data.finalizada_en).format('DD/MM/YYYY') : '';

    return (
        <>
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
                sx={{
                    '& .MuiPaper-root': {
                        width: '550px',
                        maxWidth: '90vw',
                        maxHeight: '90dvh',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1.5
                    }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Información Asesoría
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
                        <TextField label="Nombre del Estudiante" size="small" fullWidth value={data.estudiante ?? ''} {...CAMPO_BLOQUEADO} />
                        <TextField label="Materia" size="small" fullWidth value={data.materia ?? ''} {...CAMPO_BLOQUEADO} />
                        <TextField label="Estatus" size="small" fullWidth value={ETIQUETA_ESTATUS[data.estatus] ?? data.estatus ?? ''} {...CAMPO_BLOQUEADO} />
                        <TextField label="Fecha de Inicio" size="small" fullWidth value={data.fecha_inicio_formateada ?? ''} {...CAMPO_BLOQUEADO} />
                        {finalizada && (
                            <TextField label="Fecha de finalización" size="small" fullWidth value={finalizada} {...CAMPO_BLOQUEADO} />
                        )}
                        <TextField label="Horario" size="small" fullWidth value={data.horario ?? ''} {...CAMPO_BLOQUEADO} />
                        <TextField label="Modalidad" size="small" fullWidth value={data.modalidad ?? ''} {...CAMPO_BLOQUEADO} />
                        <TextField label="Razón de Asesoría" size="small" fullWidth value={data.razon ?? ''} {...CAMPO_BLOQUEADO} />
                        <TextField label="Sesiones registradas" size="small" fullWidth value={String(data.sesiones_count ?? 0)} {...CAMPO_BLOQUEADO} />
                        {data.estatus === 'cancelada' && data.motivo_cancelacion && (
                            <TextField
                                label="Motivo de la cancelación"
                                size="small"
                                fullWidth
                                multiline
                                rows={3}
                                value={data.motivo_cancelacion}
                                {...CAMPO_BLOQUEADO}
                            />
                        )}
                        {data.observaciones && (
                            <TextField label="Observaciones" size="small" fullWidth multiline rows={3} value={data.observaciones} {...CAMPO_BLOQUEADO} />
                        )}
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5, gap: 1 }}>
                    <Button variant="outlined" onClick={() => setSesionesOpen(true)} sx={{ textTransform: 'none' }}>
                        Ver sesiones
                    </Button>
                    <Button variant="contained" onClick={onClose} sx={{ textTransform: 'none' }}>
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
