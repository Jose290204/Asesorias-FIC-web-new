import { useState, useEffect, useRef } from 'react';
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
    Paper,
    Slide,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { catalogoService } from '../../rolAdministrador/services/catalogoService';

// --- HELPERS ---

// Se usa cuando el nombre que manda la tarjeta (ej. una materia) no existe en el catálogo:
// se agrega como opción temporal para que el select no se vea vacío.
const ACTUAL = '__actual__';

// Quita espacios y pasa a minúsculas para comparar textos ("7:00 - 8:00 AM" == "7:00-8:00 AM")
const normalizar = (texto) => String(texto ?? '').replace(/\s+/g, '').toLowerCase();

// Busca en un catálogo el id que corresponde a un nombre. Devuelve '' si no lo encuentra.
const buscarId = (lista, campoNombre, campoId, nombre) => {
    const objetivo = normalizar(nombre);
    if (!objetivo) return '';
    const encontrado = lista.find((item) => normalizar(item[campoNombre]) === objetivo);
    return encontrado ? String(encontrado[campoId]) : '';
};

// Igual que buscarId, pero si el nombre existe y no está en el catálogo devuelve ACTUAL.
const resolverId = (lista, campoNombre, campoId, nombre) => {
    const id = buscarId(lista, campoNombre, campoId, nombre);
    if (id) return id;
    return nombre ? ACTUAL : '';
};

// Agrega al inicio de la lista la opción "actual" cuando el valor original no estaba en el catálogo.
const conOpcionActual = (lista, campoId, campoNombre, nombreInicial, idInicial) =>
    idInicial === ACTUAL && nombreInicial
        ? [{ [campoId]: ACTUAL, [campoNombre]: nombreInicial }, ...lista]
        : lista;

// El id temporal nunca debe salir hacia el padre / API
const limpiarId = (id) => (id === ACTUAL ? '' : id);

// Busca en un catálogo el nombre que corresponde a un id.
const buscarNombre = (lista, campoId, campoNombre, id) => {
    if (id === undefined || id === null || id === '') return undefined;
    const encontrado = lista.find((item) => String(item[campoId]) === String(id));
    return encontrado ? encontrado[campoNombre] : undefined;
};

// La tarjeta muestra la fecha como DD/MM/YYYY. dayjs la leería como MM/DD/YYYY, así que se convierte a mano.
const parsearFecha = (valor) => {
    if (!valor) return null;
    if (typeof valor === 'string') {
        const match = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (match) {
            const [, dia, mes, anio] = match;
            const fecha = dayjs(`${anio}-${mes}-${dia}`);
            return fecha.isValid() ? fecha : null;
        }
    }
    const fecha = dayjs(valor);
    return fecha.isValid() ? fecha : null;
};

// --- 1. MODAL INFORMACIÓN (ASESORÍA DEL ESTUDIANTE) ---
// data: asesoría con la forma { id, asesor, email, materia, fecha, modalidad, horario, ... }
export function ModalInfoAsesoriaEstudiante({ open, onClose, data, onSave, showToast }) {
    const [formData, setFormData] = useState({
        asesor: '',
        email: '',
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

    // Cargar y normalizar los datos cada vez que se abre el modal.
    // Si data no trae los ids (como la tarjeta, que solo manda nombres), se buscan en catalogoService.
    useEffect(() => {
        if (!open || !data) return;

        const materias = catalogoService.getMaterias();
        const horarios = catalogoService.getHorarios();
        const modalidades = catalogoService.getModalidades();
        const razones = catalogoService.getRazonesAsesoria();

        const nombreMateria = data.materia || data.raw?.materia_nombre || '';
        const nombreHorario = data.horario || data.raw?.horario_nombre || '';
        const nombreModalidad = data.modalidad || data.raw?.modalidad_nombre || '';
        const nombreRazon = data.razonAsesoria || data.raw?.razon_texto || '';

        const fecha = parsearFecha(data.raw?.fecha_inicio || data.inicio || data.fecha);

        // Los ids se toman con || (no ??) para que un id vacío también caiga a la búsqueda por nombre
        const normalizedData = {
            asesor:
                data.asesor ||
                data.raw?.asesor_nombre ||
                '',

            email:
                data.email ||
                data.raw?.asesor_email ||
                '',

            materia: nombreMateria,
            materiaId: String(
                data.materiaId ||
                data.raw?.id_materia ||
                resolverId(materias, 'materia', 'id_materia', nombreMateria)
            ),

            horario: nombreHorario,
            horarioId: String(
                data.horarioId ||
                data.raw?.id_horario ||
                resolverId(horarios, 'horario', 'id_horario', nombreHorario)
            ),

            modalidad: nombreModalidad,
            modalidadId: String(
                data.modalidadId ||
                data.raw?.id_modalidad ||
                resolverId(modalidades, 'modalidad', 'id_modalidad', nombreModalidad)
            ),

            inicio: fecha ? fecha.format('YYYY-MM-DD') : '',

            razonAsesoria: nombreRazon,
            razonId: String(
                data.razonId ||
                data.raw?.id_razon ||
                resolverId(razones, 'razon', 'id_razon', nombreRazon)
            ),

            sesionesTomadas: String(
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
    }, [data, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isModified = initialFormData ? Object.keys(formData).some(
        (key) => formData[key] !== initialFormData[key]
    ) : false;

    // Catálogos desde catalogoService (con la opción "actual" si el valor de la tarjeta no está en el catálogo)
    const materiasCatalogo = catalogoService.getMaterias();
    const horariosCatalogo = catalogoService.getHorarios();
    const modalidadesCatalogo = catalogoService.getModalidades();
    const razonesCatalogo = catalogoService.getRazonesAsesoria();

    const materiasList = conOpcionActual(materiasCatalogo, 'id_materia', 'materia', initialFormData?.materia, initialFormData?.materiaId);
    const horariosList = conOpcionActual(horariosCatalogo, 'id_horario', 'horario', initialFormData?.horario, initialFormData?.horarioId);
    const modalidadesList = conOpcionActual(modalidadesCatalogo, 'id_modalidad', 'modalidad', initialFormData?.modalidad, initialFormData?.modalidadId);
    const razonesList = conOpcionActual(razonesCatalogo, 'id_razon', 'razon', initialFormData?.razonAsesoria, initialFormData?.razonId);

    const handleApply = () => {
        if (!isModified) return;

        // Se sincronizan los nombres con los ids elegidos para que la tarjeta muestre el valor nuevo
        const actualizado = {
            ...data,
            ...formData,
            materiaId: limpiarId(formData.materiaId),
            horarioId: limpiarId(formData.horarioId),
            modalidadId: limpiarId(formData.modalidadId),
            razonId: limpiarId(formData.razonId),
            materia: buscarNombre(materiasCatalogo, 'id_materia', 'materia', formData.materiaId) ?? formData.materia,
            horario: buscarNombre(horariosCatalogo, 'id_horario', 'horario', formData.horarioId) ?? formData.horario,
            modalidad: buscarNombre(modalidadesCatalogo, 'id_modalidad', 'modalidad', formData.modalidadId) ?? formData.modalidad,
            razonAsesoria: buscarNombre(razonesCatalogo, 'id_razon', 'razon', formData.razonId) ?? formData.razonAsesoria
        };

        if (onSave) onSave(actualizado);
        if (showToast) showToast('Cambios aplicados correctamente', 'info');
        onClose();
    };

    const parsedDate = formData.inicio && dayjs(formData.inicio).isValid()
        ? dayjs(formData.inicio)
        : null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                            label="Nombre Asesor"
                            name="asesor"
                            size="small"
                            fullWidth
                            value={formData.asesor}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <TextField
                            label="Correo del Asesor"
                            name="email"
                            size="small"
                            fullWidth
                            value={formData.email}
                            slotProps={{ input: { readOnly: true } }}
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
                                <MenuItem
                                    key={item.id_materia}
                                    value={String(item.id_materia)}
                                >
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
                            format="DD/MM/YYYY"
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

// --- 2. MODAL CHAT (CON EL ASESOR) ---
// Ventana anclada abajo a la derecha, sin fondo oscuro: la página sigue usable mientras el chat está abierto.
// Mensajes: { id, texto, propio } -> propio: true (mensajes del estudiante) se muestra a la derecha en azul.

const COLOR_PRINCIPAL = '#08338F';

// Conversación de prueba (quítala cuando conectes el chat real)
const MENSAJES_DEMO = [
    { id: 1, texto: '¿Buenas tardes maestro, me podría mandar el link?', propio: true },
    { id: 2, texto: 'Buenas tardes, claro que si ahorita te lo mando', propio: false },
    { id: 3, texto: 'www.zoom.com/j/123456', propio: false },
    { id: 4, texto: 'Muchas gracias maestro', propio: true }
];

export function ModalChatAsesoriaEstudiante({ open, onClose, data, onSendMessage, showToast }) {
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState('');
    const listaRef = useRef(null);

    // Al cambiar de conversación se cargan sus mensajes (data.mensajes o la conversación de prueba)
    useEffect(() => {
        setMensajes(data?.mensajes ?? MENSAJES_DEMO);
        setTexto('');
    }, [data?.id]);

    // Baja al último mensaje al abrir el chat o al llegar/enviar un mensaje
    useEffect(() => {
        if (listaRef.current) {
            listaRef.current.scrollTop = listaRef.current.scrollHeight;
        }
    }, [mensajes, open]);

    const handleEnviar = async () => {
        const contenido = texto.trim();
        if (!contenido) return;

        const nuevoMensaje = { id: Date.now(), texto: contenido, propio: true };
        setMensajes((prev) => [...prev, nuevoMensaje]);
        setTexto('');

        try {
            if (onSendMessage) await onSendMessage(data, nuevoMensaje);
        } catch (error) {
            // Si falla el envío se quita el mensaje, se devuelve el texto al campo y se avisa con un toast
            setMensajes((prev) => prev.filter((mensaje) => mensaje.id !== nuevoMensaje.id));
            setTexto(contenido);
            if (showToast) showToast('No se pudo enviar el mensaje', 'error');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleEnviar();
        }
    };

    // En esta vista el estudiante chatea con el asesor
    const nombreAsesor = data?.asesor || data?.raw?.asesor_nombre || '';

    return (
        <Slide direction="up" in={Boolean(open)} mountOnEnter unmountOnExit>
            <Paper
                role="dialog"
                aria-label="Chat"
                elevation={8}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    right: 24, // pon 0 si lo quieres pegado al borde derecho
                    width: { xs: 'calc(100vw - 32px)', sm: 340 },
                    height: 460,
                    maxHeight: 'calc(100vh - 32px)',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px 12px 0 0',
                    overflow: 'hidden',
                    zIndex: (theme) => theme.zIndex.modal
                }}
            >
                {/* Encabezado */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2,
                        py: 1.25,
                        backgroundColor: COLOR_PRINCIPAL,
                        color: '#ffffff'
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.2 }}>
                            Chat
                        </Typography>
                        <Typography noWrap sx={{ fontSize: '12px', opacity: 0.85 }}>
                            {nombreAsesor}
                        </Typography>
                    </Box>
                    <IconButton aria-label="Cerrar chat" onClick={onClose} size="small" sx={{ color: 'inherit' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Mensajes */}
                <Box
                    ref={listaRef}
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        p: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        backgroundColor: '#ffffff'
                    }}
                >
                    {mensajes.length === 0 ? (
                        <Typography sx={{ color: '#666666', fontSize: '14px', textAlign: 'center', mt: 4 }}>
                            Aún no hay mensajes.
                        </Typography>
                    ) : (
                        mensajes.map((mensaje) => (
                            <Box
                                key={mensaje.id}
                                sx={{
                                    alignSelf: mensaje.propio ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    px: 1.75,
                                    py: 1.1,
                                    borderRadius: '12px',
                                    backgroundColor: mensaje.propio ? COLOR_PRINCIPAL : '#EEEEEE',
                                    color: mensaje.propio ? '#ffffff' : '#333333',
                                    fontSize: '14px',
                                    lineHeight: 1.4,
                                    wordBreak: 'break-word'
                                }}
                            >
                                {mensaje.texto}
                            </Box>
                        ))
                    )}
                </Box>

                {/* Barra para escribir */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.5,
                        py: 1.25,
                        borderTop: '1px solid #e0e0e0',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <TextField
                        autoFocus
                        fullWidth
                        size="small"
                        placeholder="Escribe..."
                        autoComplete="off"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        onKeyDown={handleKeyDown}
                        slotProps={{
                            input: {
                                sx: {
                                    borderRadius: '999px',
                                    backgroundColor: '#F3F3F3',
                                    px: 1,
                                    '& fieldset': { border: 'none' }
                                }
                            }
                        }}
                    />
                    <IconButton
                        aria-label="Enviar mensaje"
                        onClick={handleEnviar}
                        disabled={!texto.trim()}
                        sx={{ color: COLOR_PRINCIPAL }}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Slide>
    );
}
