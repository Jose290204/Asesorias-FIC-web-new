import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField, Typography } from '@mui/material';
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
import { PAPER_MODAL, PAPER_MODAL_CELULAR } from '../../compartidos/estilosModales';
import SeccionInfo from '../../../../rolEstudiante/components/compartidos/SeccionInfo';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDiasInhabiles } from '../../../../compartidos/diasInhabiles';

const ICONO = { fontSize: 20 };

// Título pequeño que separa cada parte del modal
const ETIQUETA_SECCION = {
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '#6A6A6A',
    mb: 1.5
};

// Bloque con los campos que sí se pueden editar: cuadrito con ícono + título y los campos debajo
function BloqueEditable({ icono, titulo, children }) {
    return (
        <Box
            sx={{
                p: '14px 16px',
                borderRadius: '12px',
                backgroundColor: '#F7F9FD',
                border: '1px solid #EEF1F7',
                '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF' }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: 2 }}>
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        borderRadius: '10px',
                        backgroundColor: '#E6ECF8',
                        color: '#08338F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {icono}
                </Box>
                <Typography sx={{ fontWeight: 'bold', color: '#6A6A6A', fontSize: '0.8125rem' }}>{titulo}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</Box>
        </Box>
    );
}

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
    // Vacaciones y suspensiones de la facultad: esos días no se pueden elegir
    const { esInhabil } = useDiasInhabiles();

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

        // Si la fecha cambió, no puede ser anterior a hoy (la original de una asesoría en curso sí puede serlo)
        if (formData.fecha !== inicial.fecha && dayjs(formData.fecha).isBefore(dayjs(), 'day')) {
            showToast?.('La fecha de inicio no puede ser anterior a hoy', 'error');
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
                <DialogTitle sx={{ m: 0, p: 2, pr: 7, display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            flexShrink: 0,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #1E4DB7 0%, #08338F 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <InfoOutlinedIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1.2 }}>
                            Información de la asesoría
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px', overflowWrap: 'anywhere' }}>
                            {data.materia}
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
                    <Typography sx={ETIQUETA_SECCION}>Datos de la asesoría</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                        <SeccionInfo icono={<PersonOutlineOutlinedIcon sx={ICONO} />} etiqueta="Estudiante">
                            <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{data.estudiante}</Typography>
                        </SeccionInfo>
                        <SeccionInfo icono={<MenuBookOutlinedIcon sx={ICONO} />} etiqueta="Materia">
                            <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{data.materia}</Typography>
                        </SeccionInfo>
                        <SeccionInfo icono={<EventNoteOutlinedIcon sx={ICONO} />} etiqueta="Sesiones registradas">
                            <Typography variant="body2">{String(data.sesiones_count ?? 0)}</Typography>
                        </SeccionInfo>
                    </Box>

                    <Typography sx={ETIQUETA_SECCION}>Se puede editar</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <BloqueEditable icono={<AccessTimeOutlinedIcon sx={ICONO} />} titulo="Horario y fecha de inicio">
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
                                disablePast
                                shouldDisableDate={(fecha) => !fechaCoincideConDia(fecha, diaElegido) || esInhabil(fecha)}
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
                        </BloqueEditable>

                        <BloqueEditable icono={<LaptopOutlinedIcon sx={ICONO} />} titulo="Modalidad y razón">
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
                        </BloqueEditable>

                        <BloqueEditable icono={<NotesOutlinedIcon sx={ICONO} />} titulo="Observaciones">
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
                        </BloqueEditable>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5 }}>
                    <Button
                        variant="contained"
                        onClick={handleApply}
                        disabled={!isModified || guardando}
                        fullWidth
                        sx={{
                            minHeight: 42,
                            fontWeight: 700,
                            borderRadius: '8px',
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #1E4DB7 0%, #08338F 55%, #052466 100%)',
                            boxShadow: '0 4px 12px rgba(8, 51, 143, 0.35)',
                            '&:hover': { background: 'linear-gradient(135deg, #08338F 0%, #052466 100%)' },
                            '&.Mui-disabled': { background: '#E0E0E0', boxShadow: 'none', color: '#9E9E9E' }
                        }}
                    >
                        Aplicar cambios
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
