import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useState } from 'react';

import { useCatalogos } from '../../../../../../context/CatalogosContext';
import useDisponibilidadAsesor from '../../../hooks/useDisponibilidadAsesor';
import CampoSelect from '../../compartidos/CampoSelect';
import { claveHorario, diaDeFecha, fechaCoincideConDia, opcionesDeHorario } from '../../../utils/horarios';
import { PAPER_MODAL, PAPER_MODAL_CELULAR, CAMPO_BLOQUEADO } from '../../compartidos/estilosModales';
import useMediaQuery from '@mui/material/useMediaQuery';

// "lunes" -> "Lunes" usando el catálogo de días (si no está, se capitaliza el valor)
const etiquetaDeDia = (catalogos, dia) =>
    catalogos?.dias?.find((d) => d.valor === dia)?.etiqueta ?? `${dia.charAt(0).toUpperCase()}${dia.slice(1)}`;

// Solo lectura: estudiante, materia y sesiones registradas.
// Editable: horario (día + hora), fecha de inicio, modalidad, razón y observaciones.
// Solo se mandan a la API los campos que cambiaron. onSave(id, cambios) regresa true si salió bien.
// El formulario vive en un componente interno que solo existe mientras el modal está abierto:
// así el estado se inicia solo con los datos de la asesoría elegida, sin efectos.
export default function ModalInfoAsesoria({ open, onClose, data, onSave, showToast }) {
    if (!open || !data) return null;
    return <ContenidoInfoAsesoria key={data.id} onClose={onClose} data={data} onSave={onSave} showToast={showToast} />;
}

function ContenidoInfoAsesoria({ onClose, data, onSave, showToast }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    const { catalogos } = useCatalogos();
    const { disponibilidad, cargando } = useDisponibilidadAsesor(true);

    // Valores con los que arranca el formulario (los de la asesoría)
    const [inicial] = useState(() => ({
        horarioClave: claveHorario(diaDeFecha(data.fecha_inicio), data.id_horario),
        fecha: data.fecha_inicio,
        modalidad: data.modalidad_valor,
        razon: data.razon_valor,
        observaciones: data.observaciones ?? ''
    }));

    const [formData, setFormData] = useState(inicial);
    const [calendarioOpen, setCalendarioOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // Opciones: solo lo que el asesor imparte, más el valor actual de la asesoría (aunque ya no lo ofrezca)
    const opcionesHorario = opcionesDeHorario(disponibilidad);
    if (!opcionesHorario.some((o) => o.clave === inicial.horarioClave)) {
        const [diaActual] = inicial.horarioClave.split('|');
        opcionesHorario.unshift({
            clave: inicial.horarioClave,
            dia: diaActual,
            horarioId: data.id_horario,
            etiqueta: `${etiquetaDeDia(catalogos, diaActual)} · ${data.horario}`
        });
    }

    const opcionesModalidad = [...(disponibilidad?.modalidades ?? [])];
    if (!opcionesModalidad.some((m) => m.valor === inicial.modalidad)) {
        opcionesModalidad.unshift({ valor: inicial.modalidad, etiqueta: data.modalidad });
    }

    const razones = catalogos?.razones ?? [];

    const opcionElegida = opcionesHorario.find((o) => o.clave === formData.horarioClave);
    const diaElegido = opcionElegida?.dia;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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

    const handleCambiarFecha = (nuevaFecha) => {
        setFormData((prev) => ({ ...prev, fecha: nuevaFecha?.isValid() ? nuevaFecha.format('YYYY-MM-DD') : '' }));
    };

    // Se quita el foco del campo antes de abrir el calendario
    const abrirCalendario = () => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        setCalendarioOpen(true);
    };

    const isModified = Object.keys(formData).some((key) => formData[key] !== inicial[key]);

    const handleApply = async () => {
        if (!isModified || guardando) return;

        if (!formData.fecha) {
            showToast?.('Elige la fecha de inicio', 'error');
            return;
        }

        // Solo lo que cambió. El día de la semana sale de la fecha, así que horario y fecha viajan juntos.
        const cambios = {};
        if (formData.horarioClave !== inicial.horarioClave || formData.fecha !== inicial.fecha) {
            cambios.fecha_inicio = formData.fecha;
            cambios.horario_id = opcionElegida.horarioId;
        }
        if (formData.modalidad !== inicial.modalidad) cambios.modalidad = formData.modalidad;
        if (formData.razon !== inicial.razon) cambios.razon = formData.razon;
        if (formData.observaciones !== inicial.observaciones) cambios.observaciones = formData.observaciones;

        setGuardando(true);
        try {
            const ok = await onSave?.(data.id, cambios);
            if (ok) onClose?.();
        } finally {
            setGuardando(false);
        }
    };

    const parsedDate = formData.fecha && dayjs(formData.fecha).isValid() ? dayjs(formData.fecha) : null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Dialog open onClose={onClose} fullScreen={esCelular} sx={esCelular ? PAPER_MODAL_CELULAR : PAPER_MODAL}>
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
                        {/* --- Solo lectura --- */}
                        <TextField label="Nombre del Estudiante" size="small" fullWidth value={data.estudiante} {...CAMPO_BLOQUEADO} />
                        <TextField label="Materia" size="small" fullWidth value={data.materia} {...CAMPO_BLOQUEADO} />
                        <TextField
                            label="Sesiones registradas"
                            size="small"
                            fullWidth
                            value={String(data.sesiones_count ?? 0)}
                            {...CAMPO_BLOQUEADO}
                        />

                        {/* --- Editable --- */}
                        <CampoSelect
                            label="Horario"
                            size="small"
                            fullWidth
                            disabled={cargando}
                            value={formData.horarioClave}
                            onChange={handleCambiarHorario}
                        >
                            {opcionesHorario.map((o) => (
                                <MenuItem key={o.clave} sx={{ whiteSpace: 'normal' }} value={o.clave}>
                                    {o.etiqueta}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        {/* Al hacer clic en el campo se abre el calendario; solo deja elegir el día del horario */}
                        <DatePicker
                            label="Fecha de Inicio"
                            value={parsedDate}
                            onChange={handleCambiarFecha}
                            format="DD/MM/YYYY"
                            shouldDisableDate={(fecha) => !fechaCoincideConDia(fecha, diaElegido)}
                            open={calendarioOpen}
                            onOpen={abrirCalendario}
                            onClose={() => setCalendarioOpen(false)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    // La fecha original puede ser anterior a hoy: no se marca en rojo
                                    error: false,
                                    InputLabelProps: { shrink: true },
                                    onClick: abrirCalendario
                                }
                            }}
                        />

                        <CampoSelect
                            label="Modalidad"
                            name="modalidad"
                            size="small"
                            fullWidth
                            disabled={cargando}
                            value={formData.modalidad}
                            onChange={handleChange}
                        >
                            {opcionesModalidad.map((m) => (
                                <MenuItem key={m.valor} sx={{ whiteSpace: 'normal' }} value={m.valor}>
                                    {m.etiqueta}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        <CampoSelect
                            label="Razón de Asesoría"
                            name="razon"
                            size="small"
                            fullWidth
                            value={formData.razon}
                            onChange={handleChange}
                        >
                            {razones.map((r) => (
                                <MenuItem key={r.valor} sx={{ whiteSpace: 'normal' }} value={r.valor}>
                                    {r.etiqueta}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        <TextField
                            label="Observaciones"
                            name="observaciones"
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.observaciones}
                            onChange={handleChange}
                            slotProps={{ htmlInput: { maxLength: 1000 } }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5 }}>
                    <Button variant="contained" color="primary" onClick={handleApply} disabled={!isModified || guardando} fullWidth>
                        Aplicar Cambios
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
