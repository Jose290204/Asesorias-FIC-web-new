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
import 'dayjs/locale/es';
import { useEffect, useState } from 'react';

import { useCatalogos } from '../../../../../../context/CatalogosContext';
import { buscarAsesoresAdmin, buscarEstudiantesAdmin } from '../../../../../../Services/asesoriasAdminService';
import CampoSelect from '../../../../rolAsesor/components/compartidos/CampoSelect';
import { fechaCoincideConDia, opcionesDeHorario } from '../../../../rolAsesor/utils/horarios';
import { PAPER_MODAL, PAPER_MODAL_CELULAR } from '../../../../rolAsesor/components/compartidos/estilosModales';
import useMediaQuery from '@mui/material/useMediaQuery';

// El administrador da de alta una asesoría a nombre de un asesor. Primero se elige el asesor (de ahí salen
// las materias, horarios y modalidades que se ofrecen), luego el alumno y después el resto de los campos.
// Las fechas pasadas se permiten; el backend revisa que caiga dentro del ciclo vigente y que el asesor
// de verdad imparta lo elegido.
// onSave({ asesorId, estudianteId, materiaId, horarioId, fechaInicio, modalidad, razon, observaciones }) regresa true si salió bien.
export default function ModalCrearAsesoria({ open, onClose, onSave }) {
    if (!open) return null;
    return <ContenidoCrearAsesoria onClose={onClose} onSave={onSave} />;
}

// "Ana María Pérez López"
const nombreAsesor = (a) => [a.nombre, a.apellido_paterno, a.apellido_materno].filter(Boolean).join(' ');

const FORMULARIO_CREAR_INICIAL = {
    asesor: null,
    estudiante: null,
    materiaId: '',
    horarioClave: '',
    modalidad: '',
    razon: '',
    fecha: null,
    observaciones: ''
};

function ContenidoCrearAsesoria({ onClose, onSave }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    const { catalogos } = useCatalogos();

    const [formData, setFormData] = useState(FORMULARIO_CREAR_INICIAL);
    const [asesores, setAsesores] = useState([]);
    const [busquedaAsesor, setBusquedaAsesor] = useState('');
    const [cargandoAsesores, setCargandoAsesores] = useState(false);
    const [estudiantes, setEstudiantes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false);
    const [calendarioOpen, setCalendarioOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // Busca asesores en la API mientras se escribe (la lista ya trae la disponibilidad de cada uno)
    useEffect(() => {
        let cancelado = false;

        const temporizador = setTimeout(() => {
            setCargandoAsesores(true);
            buscarAsesoresAdmin({ buscar: busquedaAsesor })
                .then((lista) => {
                    if (!cancelado) setAsesores(lista);
                })
                .catch((error) => console.error('Error al cargar asesores:', error))
                .finally(() => {
                    if (!cancelado) setCargandoAsesores(false);
                });
        }, busquedaAsesor ? 300 : 0);

        return () => {
            cancelado = true;
            clearTimeout(temporizador);
        };
    }, [busquedaAsesor]);

    // Busca alumnos en la API mientras se escribe (con una pausa de 300 ms para no pedir en cada letra)
    useEffect(() => {
        let cancelado = false;

        const temporizador = setTimeout(() => {
            setCargandoEstudiantes(true);
            buscarEstudiantesAdmin({ buscar: busqueda })
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

    // Solo las opciones que el asesor elegido imparte
    const disponibilidad = formData.asesor?.disponibilidad ?? null;
    const materiasList = disponibilidad?.materias ?? [];
    const opcionesHorario = opcionesDeHorario(disponibilidad);
    const modalidadesList = disponibilidad?.modalidades ?? [];
    const razonesList = catalogos?.razones ?? [];

    const opcionElegida = opcionesHorario.find((o) => o.clave === formData.horarioClave);

    // El alumno se habilita al elegir asesor, y los demás campos al elegir alumno
    const asesorElegido = Boolean(formData.asesor);
    const alumnoElegido = asesorElegido && Boolean(formData.estudiante);

    // Un asesor par también es alumno: no puede ser su propio alumno
    const estudiantesDisponibles = estudiantes.filter((e) => e.id !== formData.asesor?.id);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Al cambiar de asesor cambian las materias, horarios y modalidades que se ofrecen: se limpian.
    // Si se quita el asesor, se bloquea todo y se limpia el formulario.
    const handleCambiarAsesor = (_, nuevoAsesor) => {
        setCalendarioOpen(false);
        if (!nuevoAsesor) {
            setFormData(FORMULARIO_CREAR_INICIAL);
            return;
        }
        setFormData((prev) => ({
            ...prev,
            asesor: nuevoAsesor,
            // El alumno no puede ser el mismo asesor
            estudiante: prev.estudiante?.id === nuevoAsesor.id ? null : prev.estudiante,
            materiaId: '',
            horarioClave: '',
            modalidad: '',
            fecha: null
        }));
    };

    // Al elegir alumno se desbloquean los campos. Si se quita el alumno, se bloquean y se limpian de nuevo
    // (el asesor se conserva).
    const handleCambiarEstudiante = (_, nuevoEstudiante) => {
        if (!nuevoEstudiante) {
            setFormData({ ...FORMULARIO_CREAR_INICIAL, asesor: formData.asesor });
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
                asesorId: formData.asesor.id,
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
            <Dialog open onClose={onClose} fullScreen={esCelular} sx={esCelular ? PAPER_MODAL_CELULAR : PAPER_MODAL}>
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
                        {/* Buscador de asesor: la API filtra por nombre mientras se escribe */}
                        <Autocomplete
                            fullWidth
                            size="small"
                            openOnFocus
                            options={asesores}
                            value={formData.asesor}
                            onChange={handleCambiarAsesor}
                            onInputChange={(_, texto, motivo) => {
                                if (motivo === 'input') setBusquedaAsesor(texto);
                            }}
                            getOptionLabel={nombreAsesor}
                            getOptionKey={(option) => option.id}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            // La API ya filtró: no se vuelve a filtrar en el navegador
                            filterOptions={(opciones) => opciones}
                            loading={cargandoAsesores}
                            loadingText="Cargando asesores..."
                            noOptionsText="No se encontraron asesores con disponibilidad"
                            renderOption={(props, option) => {
                                const { key, ...resto } = props;
                                return (
                                    <li key={key} {...resto}>
                                        <Box>
                                            <Typography variant="body2">{nombreAsesor(option)}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {option.correo}
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
                                        label="Asesor"
                                        placeholder="Escribe el nombre del asesor"
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

                        {/* Leyenda: mientras no haya asesor, el campo de alumno está bloqueado */}
                        {!asesorElegido && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                <InfoOutlinedIcon fontSize="small" />
                                <Typography variant="body2">
                                    Selecciona un asesor para habilitar el campo de alumno.
                                </Typography>
                            </Box>
                        )}

                        {/* Buscador de alumno: la API filtra por nombre o número de cuenta mientras se escribe */}
                        <Autocomplete
                            fullWidth
                            size="small"
                            openOnFocus
                            disabled={!asesorElegido}
                            options={estudiantesDisponibles}
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
                                        disabled={!asesorElegido}
                                        placeholder="Escribe nombre o número de cuenta"
                                        slotProps={{
                                            ...params.slotProps,
                                            input: {
                                                ...inputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <SearchIcon fontSize="small" color={asesorElegido ? 'inherit' : 'disabled'} />
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

                        {/* Leyenda: con asesor elegido, falta elegir alumno para habilitar el resto */}
                        {asesorElegido && !alumnoElegido && (
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
