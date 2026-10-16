import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useState } from 'react';

import { parsearFechaSolicitud } from '../utils/fechaSolicitud';

// ==========================================
// 1. MODAL INFORMACIÓN
// ==========================================
export function ModalInformacion({ open, onClose, solicitud }) {
    if (!solicitud) return null;

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
                    Información de la Solicitud
                </Typography>
                <IconButton onClick={onClose} sx={{ color: '#888888' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <hr style={{ border: '0', borderTop: '1px solid #EAEAEA', margin: '0 16px 16px 16px' }} />

            <DialogContent sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Materia:</Typography>
                        <Typography variant="body1" sx={{ color: '#333333' }}>{solicitud.materia || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Asesor</Typography>
                        <Typography variant="body1" sx={{ color: '#333333' }}>{solicitud.asesor || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Fecha</Typography>
                        <Typography variant="body1" sx={{ color: '#333333' }}>{solicitud.fecha || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Horario</Typography>
                        <Typography variant="body1" sx={{ color: '#333333' }}>{solicitud.horario || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Estado</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333333' }}>{solicitud.estado || 'N/A'}</Typography>
                    </Box>
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

// ==========================================
// 2. MODAL EDITAR SOLICITUD
// ==========================================

// Lista desplegable de los select: altura máxima con scroll interno
const MENU_CON_SCROLL = {
    slotProps: { paper: { sx: { maxHeight: 240 } } }
};

// Campos de solo lectura: no se enfocan, no muestran cursor de escritura ni se pueden seleccionar
const CAMPO_BLOQUEADO_SX = {
    pointerEvents: 'none',
    '& .MuiInputBase-root': { backgroundColor: '#FAFAFA' },
    '& .MuiInputBase-input': { cursor: 'default', caretColor: 'transparent', userSelect: 'none' }
};

// Horarios de prueba del asesor (se usan solo si la solicitud no trae los suyos).
// Cuando haya backend, la solicitud debe traer los horarios del asesor en
// solicitud.horariosAsesor (arreglo o texto separado por comas).
const HORARIOS_ASESOR_DEMO = ['16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00'];

const aLista = (valor) => {
    if (Array.isArray(valor)) return valor.filter(Boolean);
    return String(valor ?? '').split(',').map((x) => x.trim()).filter(Boolean);
};

// Fecha inicial del formulario. Si la fecha de la solicitud ya pasó devuelve null:
// el usuario tiene que elegir una nueva.
const fechaInicialFormulario = (valor) => {
    const fecha = parsearFechaSolicitud(valor);
    return fecha && !fecha.isBefore(dayjs(), 'day') ? fecha : null;
};

export function EditarSolicitud({ open, onClose, solicitud, onSave, showToast }) {
    const [formData, setFormData] = useState({
        materia: '',
        asesor: '',
        fecha: null,
        horario: '',
        modalidad: '',
        nota: ''
    });
    const [initialFormData, setInitialFormData] = useState(null);
    const [calendarioOpen, setCalendarioOpen] = useState(false);

    useEffect(() => {
        if (solicitud) {
            const inicial = {
                materia: solicitud.materia || '',
                asesor: solicitud.asesor || '',
                fecha: fechaInicialFormulario(solicitud.fecha),
                horario: solicitud.horario || '',
                modalidad: solicitud.modalidad || '',
                nota: solicitud.notaEstudiante || ''
            };
            setFormData(inicial);
            setInitialFormData(inicial);
            setCalendarioOpen(false);
        }
    }, [solicitud, open]);

    const handleChangeHorario = (e) => {
        setFormData((prev) => ({ ...prev, horario: e.target.value }));
    };

    const handleChangeNota = (e) => {
        setFormData((prev) => ({ ...prev, nota: e.target.value }));
    };

    const handleChangeFecha = (nuevaFecha) => {
        // No se permiten fechas anteriores a hoy
        if (nuevaFecha?.isValid() && nuevaFecha.isBefore(dayjs(), 'day')) {
            if (showToast) showToast('Elija una fecha posterior', 'error');
            return;
        }
        setFormData((prev) => ({ ...prev, fecha: nuevaFecha }));
    };

    // Se quita el foco del campo antes de abrir el calendario (evita el aviso de aria-hidden)
    const abrirCalendario = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setCalendarioOpen(true);
    };

    // Hay cambios si cambió el horario o se eligió una fecha válida distinta a la inicial
    const fechaCambio =
        Boolean(formData.fecha?.isValid()) &&
        !(initialFormData?.fecha && formData.fecha.isSame(initialFormData.fecha, 'day'));
    const horarioCambio = formData.horario !== (initialFormData?.horario ?? '');
    const notaCambio = formData.nota.trim() !== (initialFormData?.nota ?? '').trim();
    const hasChanged = fechaCambio || horarioCambio || notaCambio;

    const handleGuardar = () => {
        if (!hasChanged) return;
        const actualizada = {
            ...solicitud,
            horario: formData.horario,
            notaEstudiante: formData.nota.trim(),
            ...(formData.fecha?.isValid() && { fecha: formData.fecha.format('YYYY-MM-DD') })
        };
        // Aquí va tu llamada a la API para actualizar la solicitud
        if (onSave) onSave(actualizada);
        if (showToast) showToast('Se guardó el cambio correctamente', 'info');
        if (onClose) onClose();
    };

    if (!solicitud) return null;

    // Solo los horarios de ese asesor (más el actual de la solicitud si no estuviera en la lista)
    const horariosBase = aLista(solicitud.horariosAsesor ?? solicitud.horarios_asesor);
    const horariosAsesor = horariosBase.length > 0 ? horariosBase : HORARIOS_ASESOR_DEMO;
    const horariosOpciones =
        formData.horario && !horariosAsesor.includes(formData.horario)
            ? [formData.horario, ...horariosAsesor]
            : horariosAsesor;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
                sx={{
                    '& .MuiPaper-root': {
                        width: '550px',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1.5
                    }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Modificar Solicitud
                </DialogTitle>

                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
                        {/* Asesor (no editable) */}
                        <TextField
                            label="Asesor"
                            size="small"
                            fullWidth
                            value={formData.asesor}
                            slotProps={{ input: { readOnly: true }, htmlInput: { tabIndex: -1 } }}
                            sx={CAMPO_BLOQUEADO_SX}
                        />

                        {/* Materia (no editable) */}
                        <TextField
                            label="Materia"
                            size="small"
                            fullWidth
                            value={formData.materia}
                            slotProps={{ input: { readOnly: true }, htmlInput: { tabIndex: -1 } }}
                            sx={CAMPO_BLOQUEADO_SX}
                        />

                        {/* Fecha */}
                        <DatePicker
                            label="Fecha"
                            value={formData.fecha}
                            onChange={handleChangeFecha}
                            format="DD/MM/YYYY"
                            open={calendarioOpen}
                            onOpen={abrirCalendario}
                            onClose={() => setCalendarioOpen(false)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    InputLabelProps: { shrink: true },
                                    onClick: abrirCalendario
                                }
                            }}
                        />

                        {/* Horario: solo los del asesor */}
                        <TextField
                            select
                            slotProps={{ select: { MenuProps: MENU_CON_SCROLL } }}
                            label="Horario"
                            size="small"
                            fullWidth
                            value={formData.horario}
                            onChange={handleChangeHorario}
                        >
                            {horariosOpciones.map((h) => (
                                <MenuItem key={h} value={h}>{h}</MenuItem>
                            ))}
                        </TextField>

                        {/* Modalidad (no editable) */}
                        <TextField
                            label="Modalidad"
                            size="small"
                            fullWidth
                            value={formData.modalidad}
                            slotProps={{ input: { readOnly: true }, htmlInput: { tabIndex: -1 } }}
                            sx={CAMPO_BLOQUEADO_SX}
                        />

                        {/* Nota para el asesor (editable) */}
                        <TextField
                            label="Nota para el asesor (opcional)"
                            placeholder="Agrega un comentario..."
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.nota}
                            onChange={handleChangeNota}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5, justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGuardar}
                        disabled={!hasChanged}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}

// ==========================================
// 3. MODAL NOTA ASESOR
// ==========================================
export function ModalNotaAsesor({ open, onClose, nota }) {
    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '420px',
                    maxWidth: '90vw',
                    borderRadius: '20px',
                    p: 2,
                    backgroundColor: '#FFFFFF',
                    textAlign: 'center',
                    boxShadow: '0px 8px 24px rgba(0,0,0,0.15)'
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#1C398B' }}>
                Notas del asesor
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
                <Typography variant="body1" sx={{ color: '#333333' }}>
                    {nota || 'Esa fecha ya no esta disponible'}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        backgroundColor: '#1C398B',
                        '&:hover': { backgroundColor: '#132863' },
                        textTransform: 'none',
                        borderRadius: '8px',
                        px: 4
                    }}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}