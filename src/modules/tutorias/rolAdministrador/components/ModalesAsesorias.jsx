import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    Typography,
    TextField,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
    MenuItem,
    Autocomplete,
    createFilterOptions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Importamos la instancia de tu servicio de catálogos
import { catalogoService } from '../services/catalogoService';

// Servicios para el modal de crear asesoría (ajusta las rutas / nombres si son distintos)
import { getEstudiantes } from '../services/estudianteService';
import { getAsesoresPar } from '../services/asesoresParService';
import { getAsesoresDisciplinares } from '../services/asesoresDisciplinaresService';

// --- 1. MODAL INFORMACIÓN ---
export function ModalInfoAsesoria({ open, onClose, data, onSave, showToast }) {
    const [formData, setFormData] = useState({
        estudiante: '',
        asesor: '',
        licenciatura: '',
        gradoGrupo: '3-1',
        materia: '',
        materiaId: '',
        horario: '',
        horarioId: '',
        modalidad: '',
        modalidadId: '',
        inicio: '',
        razonAsesoria: '',
        razonId: '',
        sesionesTomadas: '1',
        observaciones: ''
    });

    const [initialFormData, setInitialFormData] = useState(null);

    // Cargar y normalizar los datos al abrir el modal, asegurando los valores por defecto desde el servicio/data
    useEffect(() => {
        if (data) {
            const rawFecha = data.raw?.fecha_inicio || data.inicio;
            const fechaValida = rawFecha && dayjs(rawFecha).isValid()
                ? dayjs(rawFecha).format('YYYY-MM-DD')
                : '';

            const normalizedData = {
                estudiante:
                    data.estudiante ||
                    data.raw?.estudiante_nombre ||
                    '',


                asesor:
                    data.asesor ||
                    data.raw?.asesor_nombre ||
                    '',


                licenciatura:
                    data.licenciatura ||
                    data.raw?.licenciatura_nombre ||
                    'Licenciatura en Informática',


                gradoGrupo:
                    data.gradoGrupo ||
                    data.raw?.grado_grupo ||
                    '3-1',

                // Nombre de la materia
                materia:
                    data.materia ||
                    data.raw?.materia_nombre ||
                    '',

                // ID de la materia
                materiaId: String(
                    data.materiaId ??
                    data.raw?.id_materia ??
                    ''
                ),

                horarioId: String(
                    data.horarioId ??
                    data.raw?.id_horario ??
                    ''
                ),

                modalidad:
                    data.modalidad ||
                    data.raw?.modalidad_nombre ||
                    '',

                modalidadId: String(
                    data.modalidadId ??
                    data.raw?.id_modalidad ??
                    ''
                ),


                inicio: fechaValida,


                razonAsesoria:
                    data.razonAsesoria ||
                    data.raw?.razon_texto ||
                    '',

                razonId: String(
                    data.razonId ??
                    data.raw?.id_razon ??
                    ''
                ),


                sesionesTomadas:
                    String(
                        data.sesionesTomadas ??
                        data.raw?.sesiones_tomadas ??
                        '1'
                    ),


                observaciones:
                    data.observaciones ||
                    data.raw?.observaciones ||
                    ''
            };

            setFormData(normalizedData);
            setInitialFormData(normalizedData);
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isModified = initialFormData ? Object.keys(formData).some(
        (key) => formData[key] !== initialFormData[key]
    ) : false;

    const handleApply = () => {
        if (!isModified) return;
        if (onSave) onSave({ ...data, ...formData });
        if (showToast) showToast('Cambios aplicados correctamente', 'info');
        onClose();
    };

    const parsedDate = formData.inicio && dayjs(formData.inicio).isValid()
        ? dayjs(formData.inicio)
        : null;

    // Obtenemos los catálogos directamente desde la instancia de catalogoService
    const materiasList = catalogoService.getMaterias();
    const horariosList = catalogoService.getHorarios();
    const modalidadesList = catalogoService.getModalidades();
    const razonesList = catalogoService.getRazonesAsesoria();

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog
                open={open}
                onClose={onClose}
                sx={{
                    '& .MuiPaper-root': {
                        width: '550px',
                        maxWidth: '550px',
                        maxHeight: '90vh',
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
                        <TextField
                            label="Nombre del Estudiante"
                            name="estudiante"
                            size="small"
                            fullWidth
                            value={formData.estudiante}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <TextField
                            label="Nombre Asesor"
                            name="asesor"
                            size="small"
                            fullWidth
                            value={formData.asesor}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <TextField
                            label="Licenciatura del Estudiante"
                            name="licenciatura"
                            size="small"
                            fullWidth
                            value={formData.licenciatura}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <TextField
                            label="Grado y Grupo"
                            name="gradoGrupo"
                            size="small"
                            fullWidth
                            value={formData.gradoGrupo}
                            slotProps={{ input: { readOnly: true } }}
                            onChange={handleChange}
                        />

                        {/* Campo Materia como Select utilizando el valor por defecto de cada asesoría */}
                        <TextField
                            select
                            label="Materia"
                            name="materiaId"
                            size="small"
                            fullWidth
                            value={formData.materiaId}
                            onChange={handleChange}
                        >
                            {materiasList.map((item) => (
                                <MenuItem
                                    key={item.id_materia}
                                    value={String(item.id_materia)}
                                >
                                    {item.materia}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Campo Horario como Select utilizando el valor por defecto de cada asesoría */}
                        <TextField
                            select
                            label="Horario"
                            name="horarioId"
                            size="small"
                            fullWidth
                            value={formData.horarioId}
                            onChange={handleChange}
                        >
                            {horariosList.map((item) => (
                                <MenuItem
                                    key={item.id_horario}
                                    value={String(item.id_horario)}
                                >
                                    {item.horario}
                                </MenuItem>
                            ))}
                        </TextField>

                        <DatePicker
                            label="Fecha de Inicio"
                            value={parsedDate}
                            disabled
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true
                                }
                            }}
                        />

                        <TextField
                            select
                            label="Modalidad"
                            name="modalidadId"
                            size="small"
                            fullWidth
                            value={formData.modalidadId}
                            onChange={handleChange}
                        >
                            {modalidadesList.map((item) => (
                                <MenuItem
                                    key={item.id_modalidad}
                                    value={String(item.id_modalidad)}
                                >
                                    {item.modalidad}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Razón de Asesoría"
                            name="razonId"
                            size="small"
                            fullWidth
                            value={formData.razonId}
                            onChange={handleChange}
                        >
                            {razonesList.map((item) => (
                                <MenuItem
                                    key={item.id_razon}
                                    value={String(item.id_razon)}
                                >
                                    {item.razon}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Sesiones Tomadas"
                            name="sesionesTomadas"
                            size="small"
                            fullWidth
                            value={formData.sesionesTomadas}
                            onChange={handleChange}
                        >
                            {[...Array(10)].map((_, i) => (
                                <MenuItem key={i + 1} value={String(i + 1)}>
                                    {i + 1}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Observaciones"
                            name="observaciones"
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.observaciones}
                            onChange={handleChange}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApply}
                        disabled={!isModified}
                        fullWidth
                    >
                        Aplicar Cambios
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}

// --- 2. MODAL CONFIRMAR APROBACIÓN ---
export function ModalConfirmarAsesoria({ open, onClose, onConfirm, showToast }) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        if (showToast) showToast('Asesoría confirmada con éxito', 'success');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '450px',
                    borderRadius: '12px',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Confirmación</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas aprobar esta asesoría?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="success" onClick={handleConfirm}>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --- 3. MODAL ELIMINAR ASESORÍA ---
export function ModalEliminarAsesoria({ open, onClose, onConfirm, showToast }) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        if (showToast) showToast('Asesoría eliminada correctamente', 'error');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '450px',
                    borderRadius: '12px',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminación</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas eliminar esta asesoría? Esta acción no se puede deshacer.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="error" onClick={handleConfirm}>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --- MODAL AUXILIAR: CONFIRMAR ELIMINACIÓN DE MATERIAL ---
function ModalConfirmarEliminarMaterial({ open, onClose, onConfirm, nombreArchivo }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '420px',
                    borderRadius: '12px',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminar archivo</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    ¿Estás seguro de que deseas eliminar el archivo <strong>{nombreArchivo}</strong>?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="error" onClick={onConfirm}>
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --- 4. MODAL MATERIAL ADICIONAL ---
export function ModalMaterialAdicional({ open, onClose, data, onSave, showToast }) {
    const [listaMateriales, setListaMateriales] = useState([]);
    const [archivoAEliminar, setArchivoAEliminar] = useState(null);
    const [modalConfirmEliminarOpen, setModalConfirmEliminarOpen] = useState(false);

    useEffect(() => {
        if (data?.raw?.material_adicional) {
            setListaMateriales(data.raw.material_adicional);
        } else {
            setListaMateriales([]);
        }
    }, [data, open]);

    const getFileIcon = (mimeType) => {
        if (mimeType?.includes('pdf')) return <PictureAsPdfIcon color="error" />;
        return <InsertDriveFileIcon color="primary" />;
    };

    const handleOpenConfirmEliminar = (archivo) => {
        setArchivoAEliminar(archivo);
        setModalConfirmEliminarOpen(true);
    };

    const handleConfirmarEliminacion = () => {
        if (archivoAEliminar) {
            setListaMateriales((prev) =>
                prev.filter((item) => item.id_material !== archivoAEliminar.id_material)
            );
        }
        setModalConfirmEliminarOpen(false);
        setArchivoAEliminar(null);
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const nuevosArchivos = files.map((file, index) => ({
            id_material: Date.now() + index,
            nombre_archivo: file.name,
            mime_type: file.type || 'application/octet-stream',
            url_archivo: URL.createObjectURL(file)
        }));

        setListaMateriales((prev) => [...prev, ...nuevosArchivos]);
        event.target.value = null;
    };

    const handleSave = () => {
        if (onSave) {
            onSave(listaMateriales);
        }
        if (showToast) {
            showToast('Material adicional guardado correctamente', 'success');
        }
        onClose();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                sx={{
                    '& .MuiPaper-root': {
                        width: '550px',
                        maxWidth: '550px',
                        height: '520px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justify: 'space-between',
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Material: {data?.materia || 'Asesoría'}
                </DialogTitle>

                <DialogContent dividers sx={{ overflowY: 'auto' }}>
                    <Box className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors" sx={{ mb: 2 }}>
                        <input
                            type="file"
                            id="file-material-input"
                            onChange={handleFileUpload}
                            className="hidden"
                            multiple
                        />
                        <label
                            htmlFor="file-material-input"
                            className="cursor-pointer flex flex-col items-center gap-2 w-full text-center"
                        >
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <Typography variant="body2" color="textSecondary">
                                Haz clic para seleccionar o cargar un documento
                            </Typography>
                        </label>
                    </Box>

                    {listaMateriales.length === 0 ? (
                        <Typography color="text.secondary" align="center" mt={2} mb={2}>
                            No hay archivos disponibles.
                        </Typography>
                    ) : (
                        <List disablePadding sx={{ mb: 2 }}>
                            {listaMateriales.map((archivo) => (
                                <ListItem
                                    key={archivo.id_material}
                                    sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        mb: 1,
                                        py: 0.5
                                    }}
                                    secondaryAction={
                                        <Stack direction="row" spacing={0.5}>
                                            <Tooltip title="Descargar / Abrir">
                                                <IconButton
                                                    component="a"
                                                    href={archivo.url_archivo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    color="primary"
                                                    size="small"
                                                >
                                                    <DownloadIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Eliminar archivo">
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleOpenConfirmEliminar(archivo)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    }
                                >
                                    <ListItemIcon>{getFileIcon(archivo.mime_type)}</ListItemIcon>
                                    <ListItemText
                                        primary={archivo.nombre_archivo}
                                        secondary={`Tipo: ${archivo.mime_type || 'Desconocido'}`}
                                        sx={{ pr: 6 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 1.5, gap: 1 }}>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <ModalConfirmarEliminarMaterial
                open={modalConfirmEliminarOpen}
                onClose={() => setModalConfirmEliminarOpen(false)}
                onConfirm={handleConfirmarEliminacion}
                nombreArchivo={archivoAEliminar?.nombre_archivo || ''}
            />
        </>
    );
}

// --- 5. MODAL CREAR ASESORÍA ---

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

// Unifica los asesores de ambos servicios en una misma forma: { key, id, tipo, tipoTexto, nombre }
// Si cambia la forma de los datos de un servicio, solo hay que ajustar su función.
const adaptarAsesoresPar = (lista) =>
    sinDuplicados(lista, (item) => claveNombre(item.asesor)).map((item) => ({
        key: `par-${item.id}`,
        id: item.id,
        tipo: 'par',
        tipoTexto: 'Asesor par',
        nombre: item.asesor
    }));

const adaptarAsesoresDisciplinares = (lista) =>
    sinDuplicados(lista, (item) => item.numeroCuenta || claveNombre(item.nombre)).map((item) => ({
        key: `disciplinar-${item.id}`,
        id: item.id,
        tipo: 'disciplinar',
        tipoTexto: 'Asesor disciplinar',
        nombre: item.nombre
    }));

const buscarNombreEnLista = (lista, campoId, campoNombre, id) => {
    const encontrado = lista.find((item) => String(item[campoId]) === String(id));
    return encontrado ? encontrado[campoNombre] : undefined;
};

// Permite buscar por nombre, número de cuenta o correo
const filtrarEstudiantes = createFilterOptions({
    stringify: (estudiante) => `${estudiante.nombre} ${estudiante.numeroCuenta ?? ''} ${estudiante.correo ?? ''}`
});

const filtrarAsesores = createFilterOptions({
    stringify: (asesor) => `${asesor.nombre} ${asesor.tipoTexto}`
});

const FORMULARIO_CREAR_INICIAL = {
    estudiante: null,
    asesor: null,
    materiaId: '',
    horarioId: '',
    modalidadId: '',
    razonId: '',
    inicio: null
};

export function ModalCrearAsesoria({ open, onClose, onSave, showToast, materiasAsesor }) {
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

                // Se ordenan por tipo para que queden agrupados en la lista
                setAsesores([...pares, ...disciplinares]);
            })
            .finally(() => {
                if (!cancelado) setCargandoListas(false);
            });

        return () => {
            cancelado = true;
        };
    }, [open]);

    // Materias del asesor (de prueba mientras no se pase la prop) y catálogos desde catalogoService
    const materiasList =
        materiasAsesor ??
        catalogoService.getMaterias().filter((item) => IDS_MATERIAS_DEMO.includes(item.id_materia));
    const horariosList = catalogoService.getHorarios();
    const modalidadesList = catalogoService.getModalidades();
    const razonesList = catalogoService.getRazonesAsesoria();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Se quita el foco del campo antes de abrir el calendario. Si el calendario se abre como su propio
    // diálogo, el modal de abajo queda con aria-hidden y no debe tener ningún elemento enfocado.
    const abrirCalendario = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setCalendarioOpen(true);
    };

    // El botón de crear se habilita solo cuando todos los campos están llenos
    const formularioCompleto =
        Boolean(formData.estudiante) &&
        Boolean(formData.asesor) &&
        Boolean(formData.materiaId) &&
        Boolean(formData.horarioId) &&
        Boolean(formData.modalidadId) &&
        Boolean(formData.razonId) &&
        Boolean(formData.inicio?.isValid());

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
                sx={{
                    '& .MuiPaper-root': {
                        width: '550px',
                        maxWidth: '550px',
                        maxHeight: '90vh',
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
                            onChange={(_, nuevoEstudiante) =>
                                setFormData((prev) => ({ ...prev, estudiante: nuevoEstudiante }))
                            }
                            getOptionLabel={(option) => option.nombre}
                            getOptionKey={(option) => option.id}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            filterOptions={filtrarEstudiantes}
                            loading={cargandoListas}
                            loadingText="Cargando alumnos..."
                            noOptionsText="No se encontraron alumnos"
                            renderInput={(params) => (
                                <TextField {...params} label="Alumno" placeholder="Buscar alumno" />
                            )}
                        />

                        {/* Buscador de asesor: asesores par y disciplinares, agrupados por tipo */}
                        <Autocomplete
                            fullWidth
                            size="small"
                            openOnFocus
                            options={asesores}
                            value={formData.asesor}
                            onChange={(_, nuevoAsesor) =>
                                setFormData((prev) => ({ ...prev, asesor: nuevoAsesor }))
                            }
                            groupBy={(option) => option.tipoTexto}
                            getOptionLabel={(option) => option.nombre}
                            getOptionKey={(option) => option.key}
                            isOptionEqualToValue={(option, value) => option.key === value.key}
                            filterOptions={filtrarAsesores}
                            loading={cargandoListas}
                            loadingText="Cargando asesores..."
                            noOptionsText="No se encontraron asesores"
                            renderInput={(params) => (
                                <TextField {...params} label="Asesor" placeholder="Buscar asesor" />
                            )}
                        />

                        <TextField
                            select
                            label="Materia"
                            name="materiaId"
                            size="small"
                            fullWidth
                            value={formData.materiaId}
                            onChange={handleChange}
                        >
                            {materiasList.map((item) => (
                                <MenuItem key={item.id_materia} value={String(item.id_materia)}>
                                    {item.materia}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Horario"
                            name="horarioId"
                            size="small"
                            fullWidth
                            value={formData.horarioId}
                            onChange={handleChange}
                        >
                            {horariosList.map((item) => (
                                <MenuItem key={item.id_horario} value={String(item.id_horario)}>
                                    {item.horario}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Modalidad"
                            name="modalidadId"
                            size="small"
                            fullWidth
                            value={formData.modalidadId}
                            onChange={handleChange}
                        >
                            {modalidadesList.map((item) => (
                                <MenuItem key={item.id_modalidad} value={String(item.id_modalidad)}>
                                    {item.modalidad}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Razón de Asesoría"
                            name="razonId"
                            size="small"
                            fullWidth
                            value={formData.razonId}
                            onChange={handleChange}
                        >
                            {razonesList.map((item) => (
                                <MenuItem key={item.id_razon} value={String(item.id_razon)}>
                                    {item.razon}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Al hacer clic en el campo se abre el calendario y la fecha elegida se muestra en el campo */}
                        <DatePicker
                            label="Fecha de Inicio"
                            value={formData.inicio}
                            onChange={(nuevaFecha) => setFormData((prev) => ({ ...prev, inicio: nuevaFecha }))}
                            format="DD/MM/YYYY"
                            open={calendarioOpen}
                            onOpen={abrirCalendario}
                            onClose={() => setCalendarioOpen(false)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    onClick: abrirCalendario
                                }
                            }}
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
