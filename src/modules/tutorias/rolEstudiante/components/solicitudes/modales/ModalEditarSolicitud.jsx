import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useState } from 'react';

import { traerAsesores } from '../../../../../../Services/asesoresEstudianteService';
import { claveHorario, diaDeFecha, fechaCoincideConDia, opcionesDeHorario } from '../../../utils/horarios';
import useMediaQuery from '@mui/material/useMediaQuery';

// Lista desplegable de los select: altura máxima con scroll interno
const MENU_CON_SCROLL = {
    slotProps: { paper: { sx: { maxHeight: 240 } } }
};

// Campos de solo lectura: se ven sombreados en gris, no se enfocan, no muestran cursor de escritura ni se pueden seleccionar
const CAMPO_BLOQUEADO_SX = {
    pointerEvents: 'none',
    '& .MuiInputBase-root': { backgroundColor: '#EEEEEE' },
    '& .MuiInputBase-input': { cursor: 'default', caretColor: 'transparent', userSelect: 'none', color: '#757575', WebkitTextFillColor: '#757575' },
    '& .MuiInputLabel-root': { color: '#9E9E9E' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' }
};

const SOLO_LECTURA = { input: { readOnly: true }, htmlInput: { tabIndex: -1 } };

// Modificar una solicitud pendiente: solo se puede cambiar la fecha, el horario y la nota.
// onSave(id, cambios) regresa true si salió bien (el modal se cierra); la vista muestra el toast.
// El formulario vive en un componente interno que solo existe mientras el modal está abierto:
// así el estado arranca con los datos de la solicitud elegida, sin efectos.
export default function ModalEditarSolicitud({ open, onClose, solicitud, onSave, showToast }) {
    if (!open || !solicitud) return null;
    return <ContenidoEditar key={solicitud.id} onClose={onClose} solicitud={solicitud} onSave={onSave} showToast={showToast} />;
}

function ContenidoEditar({ onClose, solicitud, onSave, showToast }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    // Lo que el asesor imparte (horarios por día). null = todavía cargando o no se pudo traer
    const [disponibilidad, setDisponibilidad] = useState(null);

    // Valores con los que arranca el formulario (los de la solicitud)
    const [inicial] = useState(() => ({
        horarioClave: claveHorario(diaDeFecha(solicitud.fecha), solicitud.id_horario),
        fecha: solicitud.fecha,
        nota: solicitud.nota ?? ''
    }));

    const [formData, setFormData] = useState(inicial);
    const [calendarioOpen, setCalendarioOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // No hay un endpoint para un solo asesor: se busca por nombre y se toma el que tenga el mismo id.
    // Así el horario solo ofrece lo que ese asesor realmente imparte.
    useEffect(() => {
        let cancelado = false;

        traerAsesores({ buscar: solicitud.asesor })
            .then(({ asesores }) => {
                if (cancelado) return;
                setDisponibilidad(asesores.find((a) => a.id === solicitud.id_asesor)?.disponibilidad ?? null);
            })
            .catch((error) => {
                console.error('Error al cargar la disponibilidad del asesor', error);
                showToast?.('No se pudieron cargar los horarios del asesor', 'error');
            });

        return () => {
            cancelado = true;
        };
    }, [solicitud.asesor, solicitud.id_asesor, showToast]);

    // Opciones: los horarios del asesor, más el actual de la solicitud si ya no estuviera en la lista
    const opciones = opcionesDeHorario(disponibilidad);
    if (!opciones.some((o) => o.clave === inicial.horarioClave)) {
        opciones.unshift({
            clave: inicial.horarioClave,
            dia: inicial.horarioClave.split('|')[0],
            horarioId: solicitud.id_horario,
            etiqueta: solicitud.horario_con_dia
        });
    }

    const opcionElegida = opciones.find((o) => o.clave === formData.horarioClave);

    // Un horario va ligado a su día: si la fecha elegida no cae en ese día, se borra para elegirla de nuevo
    const handleCambiarHorario = (e) => {
        const clave = e.target.value;
        const dia = clave.split('|')[0];
        setFormData((prev) => ({
            ...prev,
            horarioClave: clave,
            fecha: prev.fecha && fechaCoincideConDia(prev.fecha, dia) ? prev.fecha : ''
        }));
    };

    const handleCambiarFecha = (nueva) => {
        setFormData((prev) => ({ ...prev, fecha: nueva?.isValid() ? nueva.format('YYYY-MM-DD') : '' }));
    };

    // Se quita el foco del campo antes de abrir el calendario
    const abrirCalendario = () => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        setCalendarioOpen(true);
    };

    const hasChanged = Object.keys(formData).some((key) => formData[key] !== inicial[key]);

    const handleGuardar = async () => {
        if (!hasChanged || guardando) return;

        if (!formData.fecha) {
            showToast?.('Elige la fecha de la asesoría', 'error');
            return;
        }

        // Solo lo que cambió. El día de la semana sale de la fecha, así que horario y fecha viajan juntos.
        const cambios = {};
        if (formData.horarioClave !== inicial.horarioClave || formData.fecha !== inicial.fecha) {
            cambios.fecha = formData.fecha;
            cambios.horario_id = opcionElegida.horarioId;
        }
        if (formData.nota !== inicial.nota) {
            // Una nota vacía la borra
            cambios.nota = formData.nota.trim() === '' ? null : formData.nota.trim();
        }

        setGuardando(true);
        try {
            const ok = await onSave?.(solicitud.id, cambios);
            if (ok) onClose?.();
        } finally {
            setGuardando(false);
        }
    };

    const parsedDate = formData.fecha && dayjs(formData.fecha).isValid() ? dayjs(formData.fecha) : null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Dialog
                open
                onClose={onClose}
                fullScreen={esCelular}
                sx={{
                    '& .MuiPaper-root': esCelular ? { borderRadius: 0 } : {
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
                        {/* Asesor, materia, modalidad y razón no se pueden cambiar */}
                        <TextField label="Asesor" size="small" fullWidth value={solicitud.asesor} slotProps={SOLO_LECTURA} sx={CAMPO_BLOQUEADO_SX} />
                        <TextField label="Materia" size="small" fullWidth value={solicitud.materia} slotProps={SOLO_LECTURA} sx={CAMPO_BLOQUEADO_SX} />

                        {/* Horario: solo los del asesor */}
                        <TextField
                            select
                            slotProps={{ select: { MenuProps: MENU_CON_SCROLL } }}
                            label="Horario"
                            size="small"
                            fullWidth
                            value={formData.horarioClave}
                            onChange={handleCambiarHorario}
                        >
                            {opciones.map((o) => (
                                <MenuItem key={o.clave} sx={{ whiteSpace: 'normal' }} value={o.clave}>{o.etiqueta}</MenuItem>
                            ))}
                        </TextField>

                        {/* Fecha: solo deja elegir el día de la semana del horario */}
                        <DatePicker
                            label="Fecha"
                            value={parsedDate}
                            onChange={handleCambiarFecha}
                            format="DD/MM/YYYY"
                            disablePast
                            shouldDisableDate={(fecha) => !fechaCoincideConDia(fecha, opcionElegida?.dia)}
                            open={calendarioOpen}
                            onOpen={abrirCalendario}
                            onClose={() => setCalendarioOpen(false)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    // La fecha original puede haber pasado: no se marca en rojo
                                    error: false,
                                    InputLabelProps: { shrink: true },
                                    onClick: abrirCalendario
                                }
                            }}
                        />

                        <TextField label="Modalidad" size="small" fullWidth value={solicitud.modalidad} slotProps={SOLO_LECTURA} sx={CAMPO_BLOQUEADO_SX} />
                        <TextField label="Razón de la asesoría" size="small" fullWidth value={solicitud.razon} slotProps={SOLO_LECTURA} sx={CAMPO_BLOQUEADO_SX} />

                        {/* Nota para el asesor (editable) */}
                        <TextField
                            label="Nota para el asesor (opcional)"
                            placeholder="Agrega un comentario..."
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.nota}
                            onChange={(e) => setFormData((prev) => ({ ...prev, nota: e.target.value }))}
                            slotProps={{ htmlInput: { maxLength: 500 } }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5, justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleGuardar} disabled={!hasChanged || guardando}>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
