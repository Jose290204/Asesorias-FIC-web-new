import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    MenuItem,
    TextField,
    Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useState } from 'react';

import { useCatalogos } from '../../../../context/CatalogosContext';
import { buscarEstudiantes } from '../../../../Services/asesoriasAsesorService';
import useDisponibilidadAsesor from '../hooks/useDisponibilidadAsesor';
import CampoSelect from './CampoSelect';
import { claveHorario, diaDeFecha, fechaCoincideConDia, opcionesDeHorario } from '../utils/horarios';

// --- HELPERS ---

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

const PAPER_MODAL = {
    '& .MuiPaper-root': {
        width: '550px',
        maxWidth: '90vw',
        maxHeight: '90dvh',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        p: 1.5
    }
};

const PAPER_CONFIRMACION = {
    '& .MuiPaper-root': {
        width: '450px',
        borderRadius: '12px',
        p: 1
    }
};

// "lunes" -> "Lunes" usando el catálogo de días (si no está, se capitaliza el valor)
const etiquetaDeDia = (catalogos, dia) =>
    catalogos?.dias?.find((d) => d.valor === dia)?.etiqueta ?? `${dia.charAt(0).toUpperCase()}${dia.slice(1)}`;

// --- 1. MODAL COMPLETAR ASESORÍA ---
// onConfirm() regresa true si salió bien. La vista muestra el toast (éxito o error).
export function ModalCompletarAsesoria({ open, onClose, onConfirm }) {
    const [enviando, setEnviando] = useState(false);

    const handleConfirm = async () => {
        setEnviando(true);
        try {
            const ok = await onConfirm?.();
            if (ok) onClose?.();
        } finally {
            setEnviando(false);
        }
    };

    return (
        <Dialog open={Boolean(open)} onClose={onClose} disableAutoFocus disableEnforceFocus sx={PAPER_CONFIRMACION}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Completar asesoría</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas completar esta asesoría?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="success" onClick={handleConfirm} disabled={enviando}>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --- 2. MODAL CANCELAR ASESORÍA ---
// Ya no se "elimina": se cancela y queda en el historial como "Cancelada" con su motivo (obligatorio).
// onConfirm(motivo) regresa true si salió bien.
export function ModalCancelarAsesoria({ open, onClose, onConfirm }) {
    const [motivo, setMotivo] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleConfirm = async () => {
        setEnviando(true);
        try {
            const ok = await onConfirm?.(motivo.trim());
            if (ok) {
                setMotivo('');
                onClose?.();
            }
        } finally {
            setEnviando(false);
        }
    };

    const handleClose = () => {
        setMotivo('');
        onClose?.();
    };

    return (
        <Dialog open={Boolean(open)} onClose={handleClose} disableAutoFocus disableEnforceFocus sx={PAPER_CONFIRMACION}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Cancelar asesoría</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
                <Typography variant="body1">
                    ¿Estás seguro de que deseas cancelar esta asesoría? Quedará en el historial como cancelada y no se podrá reactivar.
                </Typography>

                <TextField
                    label="Motivo de la cancelación"
                    placeholder="Explica por qué se cancela la asesoría..."
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                    size="small"
                    slotProps={{ htmlInput: { maxLength: 500 } }}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={handleClose}>
                    Volver
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirm}
                    disabled={!motivo.trim() || enviando}
                >
                    Cancelar asesoría
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --- 3. MODAL INFORMACIÓN ASESORÍA (editar) ---
// Solo lectura: estudiante, materia y sesiones registradas.
// Editable: horario (día + hora), fecha de inicio, modalidad, razón y observaciones.
// Solo se mandan a la API los campos que cambiaron. onSave(id, cambios) regresa true si salió bien.
// El formulario vive en un componente interno que solo existe mientras el modal está abierto:
// así el estado se inicia solo con los datos de la asesoría elegida, sin efectos.
export function ModalInfoAsesoria({ open, onClose, data, onSave, showToast }) {
    if (!open || !data) return null;
    return <ContenidoInfoAsesoria key={data.id} onClose={onClose} data={data} onSave={onSave} showToast={showToast} />;
}

function ContenidoInfoAsesoria({ onClose, data, onSave, showToast }) {
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
            <Dialog open onClose={onClose} sx={PAPER_MODAL}>
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

// --- 4. MODAL CREAR ASESORÍA ---
// El asesor da de alta una asesoría directa (sin solicitud). Las fechas pasadas se permiten
// (puede registrar una asesoría que ya empezó); el backend revisa que caiga dentro del ciclo vigente.
// onSave({ estudianteId, materiaId, horarioId, fechaInicio, modalidad, razon, observaciones }) regresa true si salió bien.
export function ModalCrearAsesoria({ open, onClose, onSave }) {
    if (!open) return null;
    return <ContenidoCrearAsesoria onClose={onClose} onSave={onSave} />;
}

const FORMULARIO_CREAR_INICIAL = {
    estudiante: null,
    materiaId: '',
    horarioClave: '',
    modalidad: '',
    razon: '',
    fecha: null,
    observaciones: ''
};

function ContenidoCrearAsesoria({ onClose, onSave }) {
    const { catalogos } = useCatalogos();
    const { disponibilidad, cargando: cargandoDisponibilidad } = useDisponibilidadAsesor(true);

    const [formData, setFormData] = useState(FORMULARIO_CREAR_INICIAL);
    const [estudiantes, setEstudiantes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false);
    const [calendarioOpen, setCalendarioOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // Busca alumnos en la API mientras se escribe (con una pausa de 300 ms para no pedir en cada letra)
    useEffect(() => {
        let cancelado = false;

        const temporizador = setTimeout(() => {
            setCargandoEstudiantes(true);
            buscarEstudiantes({ buscar: busqueda })
                .then((lista) => {
                    if (!cancelado) setEstudiantes(lista);
                })
                .catch((error) => console.error('Error al cargar estudiantes:', error))
                .finally(() => {
                    if (!cancelado) setCargandoEstudiantes(false);
                });
        }, busqueda ? 300 : 0);

        return () => {
            cancelado = true;
            clearTimeout(temporizador);
        };
    }, [busqueda]);

    // Solo las opciones que el asesor imparte
    const materiasList = disponibilidad?.materias ?? [];
    const opcionesHorario = opcionesDeHorario(disponibilidad);
    const modalidadesList = disponibilidad?.modalidades ?? [];
    const razonesList = catalogos?.razones ?? [];

    const opcionElegida = opcionesHorario.find((o) => o.clave === formData.horarioClave);

    // Los demás campos quedan bloqueados hasta que se elija un alumno
    const alumnoElegido = Boolean(formData.estudiante);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Al elegir alumno se desbloquean los campos. Si se quita el alumno, se bloquean y se limpian de nuevo.
    const handleCambiarEstudiante = (_, nuevoEstudiante) => {
        if (!nuevoEstudiante) {
            setFormData(FORMULARIO_CREAR_INICIAL);
            setCalendarioOpen(false);
            return;
        }
        setFormData((prev) => ({ ...prev, estudiante: nuevoEstudiante }));
    };

    // Un horario va ligado a su día: si la fecha elegida no cae en ese día, se borra para elegirla de nuevo
    const handleCambiarHorario = (e) => {
        const clave = e.target.value;
        const dia = clave.split('|')[0];
        setFormData((prev) => ({
            ...prev,
            horarioClave: clave,
            fecha: prev.fecha && fechaCoincideConDia(prev.fecha, dia) ? prev.fecha : null
        }));
    };

    // Se quita el foco del campo antes de abrir el calendario. Si el calendario se abre como su propio
    // diálogo, el modal de abajo queda con aria-hidden y no debe tener ningún elemento enfocado.
    const abrirCalendario = () => {
        if (!alumnoElegido || !opcionElegida) return;
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        setCalendarioOpen(true);
    };

    // El botón de crear se habilita solo cuando todos los campos obligatorios están llenos
    const formularioCompleto =
        alumnoElegido &&
        Boolean(formData.materiaId) &&
        Boolean(opcionElegida) &&
        Boolean(formData.modalidad) &&
        Boolean(formData.razon) &&
        Boolean(formData.fecha?.isValid());

    const handleCrear = async () => {
        if (!formularioCompleto || guardando) return;

        setGuardando(true);
        try {
            const ok = await onSave?.({
                estudianteId: formData.estudiante.id,
                materiaId: Number(formData.materiaId),
                horarioId: opcionElegida.horarioId,
                fechaInicio: formData.fecha.format('YYYY-MM-DD'),
                modalidad: formData.modalidad,
                razon: formData.razon,
                observaciones: formData.observaciones.trim()
            });
            if (ok) onClose?.();
        } finally {
            setGuardando(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Dialog open onClose={onClose} sx={PAPER_MODAL}>
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Crear Asesoría
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
                        {/* Buscador de alumno: la API filtra por nombre o número de cuenta mientras se escribe */}
                        <Autocomplete
                            fullWidth
                            size="small"
                            openOnFocus
                            options={estudiantes}
                            value={formData.estudiante}
                            onChange={handleCambiarEstudiante}
                            onInputChange={(_, texto, motivo) => {
                                if (motivo === 'input') setBusqueda(texto);
                            }}
                            getOptionLabel={(option) => option.nombre}
                            getOptionKey={(option) => option.id}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            // La API ya filtró: no se vuelve a filtrar en el navegador
                            filterOptions={(opciones) => opciones}
                            loading={cargandoEstudiantes}
                            loadingText="Cargando alumnos..."
                            noOptionsText="No se encontraron alumnos"
                            renderOption={(props, option) => {
                                const { key, ...resto } = props;
                                return (
                                    <li key={key} {...resto}>
                                        <Box>
                                            <Typography variant="body2">{option.nombre}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {[option.numero_cuenta, option.grupo].filter(Boolean).join(' · ')}
                                            </Typography>
                                        </Box>
                                    </li>
                                );
                            }}
                            renderInput={(params) => {
                                const inputProps = params.slotProps?.input ?? params.InputProps;
                                return (
                                    <TextField
                                        {...params}
                                        label="Alumno"
                                        placeholder="Escribe nombre o número de cuenta"
                                        slotProps={{
                                            ...params.slotProps,
                                            input: {
                                                ...inputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <SearchIcon fontSize="small" />
                                                        </InputAdornment>
                                                        {inputProps?.startAdornment}
                                                    </>
                                                )
                                            }
                                        }}
                                    />
                                );
                            }}
                        />

                        {/* Mientras llega lo que el asesor imparte, los selects todavía no tienen opciones */}
                        {cargandoDisponibilidad && (
                            <Typography variant="body2" color="text.secondary">
                                Cargando tu disponibilidad...
                            </Typography>
                        )}

                        {/* Leyenda: se muestra mientras no haya alumno elegido */}
                        {!alumnoElegido && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                <InfoOutlinedIcon fontSize="small" />
                                <Typography variant="body2">
                                    Selecciona un alumno para habilitar el resto de los campos.
                                </Typography>
                            </Box>
                        )}

                        <CampoSelect
                            label="Materia"
                            name="materiaId"
                            size="small"
                            fullWidth
                            disabled={!alumnoElegido}
                            value={formData.materiaId}
                            onChange={handleChange}
                        >
                            {materiasList.map((m) => (
                                <MenuItem key={m.id} sx={{ whiteSpace: 'normal' }} value={String(m.id)}>
                                    {m.nombre}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        <CampoSelect
                            label="Horario"
                            size="small"
                            fullWidth
                            disabled={!alumnoElegido}
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
                            value={formData.fecha}
                            onChange={(nueva) => setFormData((prev) => ({ ...prev, fecha: nueva }))}
                            format="DD/MM/YYYY"
                            shouldDisableDate={(fecha) => !fechaCoincideConDia(fecha, opcionElegida?.dia)}
                            disabled={!alumnoElegido || !opcionElegida}
                            open={calendarioOpen && alumnoElegido}
                            onOpen={abrirCalendario}
                            onClose={() => setCalendarioOpen(false)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    InputLabelProps: { shrink: true },
                                    onClick: abrirCalendario,
                                    helperText: alumnoElegido && !opcionElegida ? 'Elige primero el horario' : undefined
                                }
                            }}
                        />

                        <CampoSelect
                            label="Modalidad"
                            name="modalidad"
                            size="small"
                            fullWidth
                            disabled={!alumnoElegido}
                            value={formData.modalidad}
                            onChange={handleChange}
                        >
                            {modalidadesList.map((m) => (
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
                            disabled={!alumnoElegido}
                            value={formData.razon}
                            onChange={handleChange}
                        >
                            {razonesList.map((r) => (
                                <MenuItem key={r.valor} sx={{ whiteSpace: 'normal' }} value={r.valor}>
                                    {r.etiqueta}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        <TextField
                            label="Observaciones (opcional)"
                            name="observaciones"
                            size="small"
                            fullWidth
                            multiline
                            rows={2}
                            disabled={!alumnoElegido}
                            value={formData.observaciones}
                            onChange={handleChange}
                            slotProps={{ htmlInput: { maxLength: 1000 } }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5, justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleCrear} disabled={!formularioCompleto || guardando}>
                        Crear asesoría
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
