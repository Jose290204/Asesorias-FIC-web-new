import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
    Autocomplete,
    Box,
    Button,
    createFilterOptions,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    MenuItem,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useRef, useState } from 'react';

import { getAsesoresDisciplinares } from '../../../services/asesoresDisciplinaresService';
import { getAsesoresPar } from '../../../services/asesoresParService';
import { catalogoService } from '../../../services/catalogoService';
import { getEstudiantes } from '../../../services/estudianteService';

// Materias de prueba (ids del catálogo).
// Sustitúyelas pasando la prop materiasAsesor con las materias reales: [{ id_materia, materia }]
const IDS_MATERIAS_DEMO = [94, 95, 96];

const claveNombre = (texto) => String(texto ?? '').trim().toLowerCase();

// Quita elementos repetidos según la clave que devuelva obtenerClave (los mocks traen filas duplicadas)
const sinDuplicados = (lista, obtenerClave) => {
    const vistos = new Set();
    return lista.filter((item) => {
        const clave = obtenerClave(item);
        if (!clave || vistos.has(clave)) return false;
        vistos.add(clave);
        return true;
    });
};

// Unifica los asesores de ambos servicios en una misma forma: { key, id, tipo, nombre, materias, horarios }
// "materias" y "horarios" son lo que ofrece ese asesor (lista de ids, nombres u objetos; ver filtrarPorAsesor).
// Si el servicio no los manda (undefined), el modal usa el catálogo de respaldo.
// Si cambia la forma de los datos de un servicio, solo hay que ajustar su función.
const adaptarAsesoresPar = (lista) =>
    sinDuplicados(lista, (item) => claveNombre(item.asesor)).map((item) => ({
        key: `par-${item.id}`,
        id: item.id,
        tipo: 'par',
        nombre: item.asesor,
        materias: item.materias,
        horarios: item.horarios
    }));

const adaptarAsesoresDisciplinares = (lista) =>
    sinDuplicados(lista, (item) => item.numeroCuenta || claveNombre(item.nombre)).map((item) => ({
        key: `disciplinar-${item.id}`,
        id: item.id,
        tipo: 'disciplinar',
        nombre: item.nombre,
        materias: item.materias ?? item.raw?.materias,
        horarios: item.horarios ?? item.raw?.horarios
    }));

const buscarNombreEnLista = (lista, campoId, campoNombre, id) => {
    const encontrado = lista.find((item) => String(item[campoId]) === String(id));
    return encontrado ? encontrado[campoNombre] : undefined;
};

// Permite buscar por nombre, número de cuenta o correo
const filtrarEstudiantes = createFilterOptions({
    stringify: (estudiante) => `${estudiante.nombre} ${estudiante.numeroCuenta ?? ''} ${estudiante.correo ?? ''}`
});

// Quita espacios y pasa a minúsculas para comparar textos ("7:00 - 8:00 AM" == "7:00-8:00 AM")
const normalizar = (texto) => String(texto ?? '').replace(/\s+/g, '').toLowerCase();

// Deja solo las opciones del catálogo que ofrece el asesor (igual que en el modal del asesor).
// asesorLista puede traer objetos ({ id_materia, materia }), ids o nombres.
// Si el asesor no trae esa lista (undefined), devuelve null para que el modal use su catálogo de respaldo.
// TODO: cuando se haga la limpieza de duplicados, moverla a un utils compartido
const filtrarPorAsesor = (catalogo, asesorLista, campoId, campoNombre) => {
    if (!Array.isArray(asesorLista)) return null;

    return catalogo.filter((item) =>
        asesorLista.some((a) => {
            if (a && typeof a === 'object') {
                return (
                    String(a[campoId] ?? '') === String(item[campoId]) ||
                    normalizar(a[campoNombre]) === normalizar(item[campoNombre])
                );
            }
            return String(a) === String(item[campoId]) || normalizar(a) === normalizar(item[campoNombre]);
        })
    );
};

// Select cuya lista desplegable mide lo mismo que el campo (con scroll interno y texto largo en varias líneas).
// Es el mismo que usa el modal de crear asesoría del asesor.
// TODO: cuando se haga la limpieza de duplicados, moverlo a src/components/ui/CampoSelect.jsx
function CampoSelect({ children, ...props }) {
    const campoRef = useRef(null);
    const [ancho, setAncho] = useState(undefined);

    return (
        <TextField
            select
            ref={campoRef}
            {...props}
            slotProps={{
                select: {
                    // Se mide el campo justo antes de abrir la lista
                    onOpen: () => setAncho(campoRef.current?.offsetWidth),
                    MenuProps: {
                        slotProps: {
                            paper: { sx: { maxHeight: 240, width: ancho, maxWidth: ancho } }
                        }
                    }
                }
            }}
        >
            {children}
        </TextField>
    );
}

// Campo de texto de un Autocomplete con la lupa a la izquierda (igual que el del asesor)
const campoConLupa = (params, label, placeholder) => {
    const inputProps = params.slotProps?.input ?? params.InputProps;
    return (
        <TextField
            {...params}
            label={label}
            placeholder={placeholder}
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
};

const FORMULARIO_CREAR_INICIAL = {
    estudiante: null,
    asesor: null,
    materiaId: '',
    horarioId: '',
    modalidadId: '',
    razonId: '',
    inicio: null
};

export default function ModalCrearAsesoria({ open, onClose, onSave, showToast, materiasAsesor }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const [formData, setFormData] = useState(FORMULARIO_CREAR_INICIAL);
    const [estudiantes, setEstudiantes] = useState([]);
    const [asesores, setAsesores] = useState([]);
    const [cargandoListas, setCargandoListas] = useState(false);
    const [calendarioOpen, setCalendarioOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // Al abrir: se limpia el formulario y se cargan estudiantes y asesores (par + disciplinar)
    useEffect(() => {
        if (!open) return;

        setFormData(FORMULARIO_CREAR_INICIAL);
        setCalendarioOpen(false);

        let cancelado = false;
        setCargandoListas(true);

        Promise.allSettled([getEstudiantes(), getAsesoresPar(), getAsesoresDisciplinares()])
            .then(([resEstudiantes, resPar, resDisciplinares]) => {
                if (cancelado) return;

                if (resEstudiantes.status === 'fulfilled') {
                    setEstudiantes(resEstudiantes.value);
                } else {
                    console.error('Error al cargar estudiantes:', resEstudiantes.reason);
                }

                if (resPar.status === 'rejected') {
                    console.error('Error al cargar asesores par:', resPar.reason);
                }
                if (resDisciplinares.status === 'rejected') {
                    console.error('Error al cargar asesores disciplinares:', resDisciplinares.reason);
                }

                const pares = resPar.status === 'fulfilled' ? adaptarAsesoresPar(resPar.value) : [];
                const disciplinares =
                    resDisciplinares.status === 'fulfilled'
                        ? adaptarAsesoresDisciplinares(resDisciplinares.value)
                        : [];

                // Una sola lista de nombres, en orden alfabético
                setAsesores(
                    [...pares, ...disciplinares].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
                );
            })
            .finally(() => {
                if (!cancelado) setCargandoListas(false);
            });

        return () => {
            cancelado = true;
        };
    }, [open]);

    // Materias y horarios: son los del asesor elegido. Si ese asesor aún no trae sus listas
    // (el endpoint no existe todavía), se usan las de respaldo: materiasAsesor / materias de prueba y todos los horarios.
    const asesorSeleccionado = formData.asesor;
    const materiasRespaldo =
        materiasAsesor ??
        catalogoService.getMaterias().filter((item) => IDS_MATERIAS_DEMO.includes(item.id_materia));
    const materiasList =
        filtrarPorAsesor(catalogoService.getMaterias(), asesorSeleccionado?.materias, 'id_materia', 'materia') ??
        materiasRespaldo;
    const horariosList =
        filtrarPorAsesor(catalogoService.getHorarios(), asesorSeleccionado?.horarios, 'id_horario', 'horario') ??
        catalogoService.getHorarios();
    const modalidadesList = catalogoService.getModalidades();
    const razonesList = catalogoService.getRazonesAsesoria();

    // Los demás campos quedan bloqueados hasta que se elijan el alumno Y el asesor
    const alumnoElegido = Boolean(formData.estudiante);
    const asesorElegido = Boolean(formData.asesor);
    const camposHabilitados = alumnoElegido && asesorElegido;

    // Texto de la leyenda según lo que falte
    const leyendaFaltante = !alumnoElegido && !asesorElegido
        ? 'Selecciona un alumno y un asesor para habilitar el resto de los campos.'
        : !alumnoElegido
            ? 'Selecciona un alumno para habilitar el resto de los campos.'
            : 'Selecciona un asesor para habilitar el resto de los campos.';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Si se quita el alumno o el asesor, los campos de abajo se bloquean y se limpian,
    // pero la otra persona que ya se había elegido se conserva.
    const handleCambiarEstudiante = (_, nuevoEstudiante) => {
        if (!nuevoEstudiante) {
            setFormData((prev) => ({ ...FORMULARIO_CREAR_INICIAL, asesor: prev.asesor }));
            setCalendarioOpen(false);
            return;
        }
        setFormData((prev) => ({ ...prev, estudiante: nuevoEstudiante }));
    };

    const handleCambiarAsesor = (_, nuevoAsesor) => {
        if (!nuevoAsesor) {
            setFormData((prev) => ({ ...FORMULARIO_CREAR_INICIAL, estudiante: prev.estudiante }));
            setCalendarioOpen(false);
            return;
        }
        // Al cambiar de asesor se limpian materia y horario, porque cada asesor ofrece los suyos
        setFormData((prev) => ({ ...prev, asesor: nuevoAsesor, materiaId: '', horarioId: '' }));
    };

    // No se permite una fecha anterior a hoy
    const handleCambiarFecha = (nuevaFecha) => {
        if (nuevaFecha?.isValid() && nuevaFecha.isBefore(dayjs(), 'day')) {
            if (showToast) showToast('Elige una fecha de hoy en adelante', 'error');
            return;
        }
        setFormData((prev) => ({ ...prev, inicio: nuevaFecha }));
    };

    // Se quita el foco del campo antes de abrir el calendario. Si el calendario se abre como su propio
    // diálogo, el modal de abajo queda con aria-hidden y no debe tener ningún elemento enfocado.
    const abrirCalendario = () => {
        if (!camposHabilitados) return;
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setCalendarioOpen(true);
    };

    // El botón de crear se habilita solo cuando todos los campos están llenos
    const formularioCompleto =
        camposHabilitados &&
        Boolean(formData.materiaId) &&
        Boolean(formData.horarioId) &&
        Boolean(formData.modalidadId) &&
        Boolean(formData.razonId) &&
        Boolean(formData.inicio?.isValid()) &&
        !formData.inicio.isBefore(dayjs(), 'day');

    const handleCrear = async () => {
        if (!formularioCompleto || guardando) return;

        setGuardando(true);
        try {
            const { estudiante, asesor } = formData;

            // Misma forma de datos que lee el modal de información (ids + nombres)
            const nuevaAsesoria = {
                estudianteId: estudiante.id,
                estudiante: estudiante.nombre,
                alumno: estudiante.nombre,
                email: estudiante.correo,
                licenciatura: estudiante.licenciatura,
                gradoGrupo: estudiante.grupo,
                asesorId: asesor.id,
                tipoAsesor: asesor.tipo,
                asesor: asesor.nombre,
                materiaId: formData.materiaId,
                materia: buscarNombreEnLista(materiasList, 'id_materia', 'materia', formData.materiaId),
                horarioId: formData.horarioId,
                horario: buscarNombreEnLista(horariosList, 'id_horario', 'horario', formData.horarioId),
                modalidadId: formData.modalidadId,
                modalidad: buscarNombreEnLista(modalidadesList, 'id_modalidad', 'modalidad', formData.modalidadId),
                razonId: formData.razonId,
                razonAsesoria: buscarNombreEnLista(razonesList, 'id_razon', 'razon', formData.razonId),
                inicio: formData.inicio.format('YYYY-MM-DD'),
                fecha: formData.inicio.format('DD/MM/YYYY')
            };

            if (onSave) await onSave(nuevaAsesoria);
            if (showToast) showToast('Asesoría creada correctamente', 'success');
            if (onClose) onClose();
        } catch (error) {
            if (showToast) showToast('Ocurrió un error al crear la asesoría', 'error');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
                fullScreen={esCelular}
                sx={{
                    '& .MuiPaper-root': esCelular
                        ? { borderRadius: 0 }
                        : {
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
                        {/* Buscador de alumno: al hacer clic se despliega la lista y al escribir se filtra */}
                        <Autocomplete
                            fullWidth
                            size="small"
                            openOnFocus
                            options={estudiantes}
                            value={formData.estudiante}
                            onChange={handleCambiarEstudiante}
                            getOptionLabel={(option) => option.nombre}
                            getOptionKey={(option) => option.id}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            filterOptions={filtrarEstudiantes}
                            loading={cargandoListas}
                            loadingText="Cargando alumnos..."
                            noOptionsText="No se encontraron alumnos"
                            renderInput={(params) => campoConLupa(params, 'Alumno', 'Escribe nombre del alumno')}
                        />

                        {/* Buscador de asesor: lista de nombres (asesores par y disciplinares juntos) */}
                        <Autocomplete
                            fullWidth
                            size="small"
                            openOnFocus
                            options={asesores}
                            value={formData.asesor}
                            onChange={handleCambiarAsesor}
                            getOptionLabel={(option) => option.nombre}
                            getOptionKey={(option) => option.key}
                            isOptionEqualToValue={(option, value) => option.key === value.key}
                            loading={cargandoListas}
                            loadingText="Cargando asesores..."
                            noOptionsText="No se encontraron asesores"
                            renderInput={(params) => campoConLupa(params, 'Asesor', 'Escribe nombre del asesor')}
                        />

                        {/* Leyenda: se muestra mientras falte el alumno o el asesor */}
                        {!camposHabilitados && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                <InfoOutlinedIcon fontSize="small" />
                                <Typography variant="body2">{leyendaFaltante}</Typography>
                            </Box>
                        )}

                        <CampoSelect
                            label="Materia"
                            name="materiaId"
                            size="small"
                            fullWidth
                            disabled={!camposHabilitados}
                            value={formData.materiaId}
                            onChange={handleChange}
                            helperText={camposHabilitados && materiasList.length === 0 ? 'Este asesor no tiene materias registradas' : undefined}
                        >
                            {materiasList.map((item) => (
                                <MenuItem key={item.id_materia} sx={{ whiteSpace: 'normal' }} value={String(item.id_materia)}>
                                    {item.materia}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        <CampoSelect
                            label="Horario"
                            name="horarioId"
                            size="small"
                            fullWidth
                            disabled={!camposHabilitados}
                            value={formData.horarioId}
                            onChange={handleChange}
                            helperText={camposHabilitados && horariosList.length === 0 ? 'Este asesor no tiene horarios registrados' : undefined}
                        >
                            {horariosList.map((item) => (
                                <MenuItem key={item.id_horario} sx={{ whiteSpace: 'normal' }} value={String(item.id_horario)}>
                                    {item.horario}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        <CampoSelect
                            label="Modalidad"
                            name="modalidadId"
                            size="small"
                            fullWidth
                            disabled={!camposHabilitados}
                            value={formData.modalidadId}
                            onChange={handleChange}
                        >
                            {modalidadesList.map((item) => (
                                <MenuItem key={item.id_modalidad} sx={{ whiteSpace: 'normal' }} value={String(item.id_modalidad)}>
                                    {item.modalidad}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        <CampoSelect
                            label="Razón de Asesoría"
                            name="razonId"
                            size="small"
                            fullWidth
                            disabled={!camposHabilitados}
                            value={formData.razonId}
                            onChange={handleChange}
                        >
                            {razonesList.map((item) => (
                                <MenuItem key={item.id_razon} sx={{ whiteSpace: 'normal' }} value={String(item.id_razon)}>
                                    {item.razon}
                                </MenuItem>
                            ))}
                        </CampoSelect>

                        {/* Al hacer clic en el campo se abre el calendario y la fecha elegida se muestra en el campo */}
                        <DatePicker
                            label="Fecha de Inicio"
                            value={formData.inicio}
                            onChange={handleCambiarFecha}
                            format="DD/MM/YYYY"
                            disablePast
                            disabled={!camposHabilitados}
                            open={calendarioOpen && camposHabilitados}
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
                    </Box>
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 2,
                        pt: 1.5,
                        justifyContent: 'flex-end',
                        gap: 1,
                        pb: esCelular ? 'calc(16px + env(safe-area-inset-bottom))' : 2,
                        '& > button': { flex: esCelular ? 1 : 'none', minHeight: 40 }
                    }}
                >
                    <Button variant="outlined" color="inherit" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCrear}
                        disabled={!formularioCompleto || guardando}
                    >
                        Crear asesoría
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}