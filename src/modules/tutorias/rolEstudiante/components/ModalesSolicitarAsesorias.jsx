import CloseIcon from '@mui/icons-material/Close';
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
    Typography,
    createFilterOptions
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/es';
import { useEffect, useState } from 'react';

// --- HELPERS ---
const claveNombre = (texto) => String(texto ?? '').trim().toLowerCase();

const sinDuplicados = (lista, obtenerClave) => {
    const vistos = new Set();
    return lista.filter((item) => {
        const clave = obtenerClave(item);
        if (!clave || vistos.has(clave)) return false;
        vistos.add(clave);
        return true;
    });
};

// Convierte ["A, B", "C"] o "A / B" en ["A", "B", "C"]
const aLista = (valor) =>
    (Array.isArray(valor) ? valor : [valor])
        .flatMap((v) => String(v ?? '').split(/[,/]/))
        .map((v) => v.trim())
        .filter(Boolean);

// Datos de respaldo para ModalInformacion cuando un asesor no trae disponibilidad cargada
const MATERIAS_DEMO = [
    { id_materia: 9001, materia: 'Programación Web' },
    { id_materia: 9002, materia: 'Bases de Datos' },
    { id_materia: 9003, materia: 'Estructura de Datos' },
    { id_materia: 9004, materia: 'Cálculo Diferencial' },
    { id_materia: 9005, materia: 'Cálculo Integral' },
    { id_materia: 9006, materia: 'Álgebra Lineal' },
    { id_materia: 9007, materia: 'Redes de Computadoras' },
    { id_materia: 9008, materia: 'Sistemas Operativos' },
    { id_materia: 9009, materia: 'Ingeniería de Software' },
    { id_materia: 9010, materia: 'Programación Orientada a Objetos' },
    { id_materia: 9011, materia: 'Probabilidad y Estadística' },
    { id_materia: 9012, materia: 'Matemáticas Discretas' }
];
const HORARIOS_DEMO = [
    { id_horario: 9001, horario: '08:00 - 09:00' },
    { id_horario: 9002, horario: '09:00 - 10:00' },
    { id_horario: 9003, horario: '10:00 - 11:00' },
    { id_horario: 9004, horario: '11:00 - 12:00' },
    { id_horario: 9005, horario: '12:00 - 13:00' },
    { id_horario: 9006, horario: '13:00 - 14:00' },
    { id_horario: 9007, horario: '14:00 - 15:00' },
    { id_horario: 9008, horario: '15:00 - 16:00' },
    { id_horario: 9009, horario: '16:00 - 17:00' },
    { id_horario: 9010, horario: '17:00 - 18:00' },
    { id_horario: 9011, horario: '18:00 - 19:00' },
    { id_horario: 9012, horario: '19:00 - 20:00' }
];
const MODALIDADES_DEMO = [
    { id_modalidad: 9001, modalidad: 'Presencial' },
    { id_modalidad: 9002, modalidad: 'Virtual' }
];

// Lista desplegable de los select: altura máxima con scroll interno
const MENU_CON_SCROLL = {
    slotProps: { paper: { sx: { maxHeight: 240 } } }
};

const filtrarAsesores = createFilterOptions({
    stringify: (asesor) => `${asesor.asesor || asesor.nombre || ''} ${asesor.email ?? ''}`
});

// Convierte el día del enum ("lunes".."viernes") al número que usa dayjs (lunes=1 ... viernes=5)
const DIA_A_NUMERO = { lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5 };

const FORMULARIO_CREAR_INICIAL = {
    asesor: null,
    materiaId: '',
    horarioKey: '',   // "dia|horarioId", identifica un día y horario único dentro de la disponibilidad
    inicio: null,
    modalidadId: '',  // valor de la modalidad (ej. "presencial")
    razon: '',
    nota: ''
};

// ==========================================
// 1. MODAL CREAR SOLICITUD (buscador global o, con asesorFijo, desde la tarjeta)
// Flujo: asesor -> materia -> horario -> fecha (restringida al día del horario) -> modalidad -> nota
// ==========================================
export function ModalCrearSolicitud({ open, onClose, onSave, showToast, asesores = [], asesorFijo = null, razones = []}) {
    // asesorFijo: si viene (desde la tarjeta), el asesor ya está elegido y bloqueado
    const [formData, setFormData] = useState({ ...FORMULARIO_CREAR_INICIAL, asesor: asesorFijo });
    const [calendarioOpen, setCalendarioOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (!open) return;
        setFormData({ ...FORMULARIO_CREAR_INICIAL, asesor: asesorFijo });
        setCalendarioOpen(false);
    }, [open, asesorFijo]);

    const asesoresList = sinDuplicados(asesores, (item) => item.email || claveNombre(item.asesor));

    // Disponibilidad real del asesor elegido (viene en asesor.disponibilidad, armada por el adaptador)
    const asesorElegido = formData.asesor;
    const disponibilidad = asesorElegido?.disponibilidad;

    const materiasList = disponibilidad?.materias ?? [];

    // Cada fila es un día y horario concretos, por ejemplo "Lunes 7:00-8:00 AM"
    const horariosList = (disponibilidad?.horarios ?? []).flatMap((diaGrupo) =>
        diaGrupo.horarios.map((h) => ({
            key: `${diaGrupo.dia}|${h.id}`,
            dia: diaGrupo.dia,
            etiqueta: `${diaGrupo.etiqueta} ${h.etiqueta}`
        }))
    );

    const modalidadesList = disponibilidad?.modalidades ?? [];

    // Cadena: asesor -> materia -> horario -> fecha/modalidad/nota
    const sinAsesor = !formData.asesor;
    const sinMateria = !formData.materiaId;
    const sinHorario = !formData.horarioKey;
    const leyendaMateria = sinAsesor ? 'Elige primero al asesor' : '';
    const leyendaHorario = !sinAsesor && sinMateria ? 'Elige primero una materia' : '';
    const leyendaFecha = !sinMateria && sinHorario ? 'Elige primero un horario' : '';
    const leyendaResto = !sinMateria && !sinHorario ? '' : (leyendaHorario || leyendaFecha);

    // Día (lunes..viernes) del horario elegido, usado para bloquear el calendario
    const diaElegido = horariosList.find((h) => h.key === formData.horarioKey)?.dia;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Al cambiar de horario, una fecha ya elegida puede quedar en un día que ya no corresponde
    const handleChangeHorario = (e) => {
        setFormData((prev) => ({ ...prev, horarioKey: e.target.value, inicio: null }));
    };

    const abrirCalendario = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setCalendarioOpen(true);
    };

    const soloEseDia = (fecha) => !diaElegido || fecha.day() !== DIA_A_NUMERO[diaElegido];

    const formularioCompleto =
        Boolean(formData.asesor) &&
        Boolean(formData.materiaId) &&
        Boolean(formData.horarioKey) &&
        Boolean(formData.inicio?.isValid()) &&
        Boolean(formData.modalidadId) &&
        Boolean(formData.razon);


    const handleCrear = async () => {
        if (!formularioCompleto || guardando) return;

        setGuardando(true);
        try {
            const { asesor } = formData;
            const [, horarioIdTexto] = formData.horarioKey.split('|');

            const nuevaSolicitud = {
                asesorId: asesor.id,
                materiaId: Number(formData.materiaId),
                horarioId: Number(horarioIdTexto),
                dia: diaElegido,
                fecha: formData.inicio.format('YYYY-MM-DD'),
                modalidad: formData.modalidadId,
                razon: formData.razon,
                nota: formData.nota.trim()
            };

            if (onSave) await onSave(nuevaSolicitud);
            if (showToast) showToast('Solicitud creada correctamente', 'success');
            if (onClose) onClose();
        } catch (error) {
            if (showToast) showToast('Ocurrió un error al crear la solicitud', 'error');
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
                    Solicitar Asesoría
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
                        {/* 1. ASESOR: lo primero que se elige */}
                        <Autocomplete
                            fullWidth
                            size="small"
                            openOnFocus
                            disabled={Boolean(asesorFijo)}
                            options={asesoresList}
                            value={formData.asesor}
                            onChange={(_, nuevoAsesor) =>
                                // Al cambiar de asesor se limpia todo (menos la nota)
                                setFormData((prev) => ({ ...FORMULARIO_CREAR_INICIAL, nota: prev.nota, asesor: asesorFijo ?? nuevoAsesor }))
                            }
                            getOptionLabel={(option) => option.asesor || option.nombre || ''}
                            getOptionKey={(option) => option.id}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            filterOptions={filtrarAsesores}
                            noOptionsText="No se encontraron asesores"
                            renderInput={(params) => {
                                const inputProps = params.slotProps?.input ?? params.InputProps;
                                return (
                                    <TextField
                                        {...params}
                                        label="Asesor"
                                        placeholder="Escribe nombre del asesor"
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

                        {/* 2. MATERIA: se habilita al elegir asesor */}
                        <Box>
                            <TextField
                                select
                                slotProps={{ select: { MenuProps: MENU_CON_SCROLL } }}
                                label="Materia"
                                name="materiaId"
                                size="small"
                                fullWidth
                                disabled={sinAsesor}
                                helperText={leyendaMateria}
                                value={formData.materiaId}
                                onChange={handleChange}
                            >
                                {materiasList.map((item) => (
                                    <MenuItem key={item.id} value={String(item.id)}>
                                        {item.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {/* 3. HORARIO: se habilita al elegir materia. Cada opción ya trae su día */}
                        <Box>
                            <TextField
                                select
                                slotProps={{ select: { MenuProps: MENU_CON_SCROLL } }}
                                label="Horario"
                                name="horarioKey"
                                size="small"
                                fullWidth
                                disabled={sinMateria}
                                helperText={leyendaHorario}
                                value={formData.horarioKey}
                                onChange={handleChangeHorario}
                            >
                                {horariosList.map((item) => (
                                    <MenuItem key={item.key} value={item.key}>
                                        {item.etiqueta}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {/* 4. FECHA: se habilita al elegir horario; el calendario solo permite ese día de la semana */}
                        <Box>
                            <DatePicker
                                label="Fecha"
                                value={formData.inicio}
                                onChange={(nuevaFecha) => setFormData((prev) => ({ ...prev, inicio: nuevaFecha }))}
                                format="DD/MM/YYYY"
                                disabled={sinHorario}
                                disablePast
                                shouldDisableDate={soloEseDia}
                                open={calendarioOpen && !sinHorario}
                                onOpen={() => { if (!sinHorario) abrirCalendario(); }}
                                onClose={() => setCalendarioOpen(false)}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        helperText: leyendaFecha,
                                        fullWidth: true,
                                        InputLabelProps: { shrink: true },
                                        onClick: () => { if (!sinHorario) abrirCalendario(); }
                                    }
                                }}
                            />
                        </Box>

                        {/* 5. MODALIDAD */}
                        <Box>
                            <TextField
                                select
                                slotProps={{ select: { MenuProps: MENU_CON_SCROLL } }}
                                label="Modalidad"
                                name="modalidadId"
                                size="small"
                                fullWidth
                                disabled={sinMateria}
                                helperText={leyendaResto}
                                value={formData.modalidadId}
                                onChange={handleChange}
                            >
                                {modalidadesList.map((item) => (
                                    <MenuItem key={item.valor} value={item.valor}>
                                        {item.etiqueta}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {/* 6. RAZÓN */}
                        <Box>
                            <TextField
                                select
                                slotProps={{ select: { MenuProps: MENU_CON_SCROLL } }}
                                label="Razón"
                                name="razon"
                                size="small"
                                fullWidth
                                disabled={sinMateria}
                                value={formData.razon}
                                onChange={handleChange}
                            >
                                {razones.map((item) => (
                                    <MenuItem key={item.valor} value={item.valor}>
                                        {item.etiqueta}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {/*76. NOTA */}
                        <Box>
                            <TextField
                                label="Nota para el asesor (opcional)"
                                name="nota"
                                placeholder="Agrega un comentario..."
                                size="small"
                                fullWidth
                                multiline
                                rows={3}
                                disabled={sinMateria}
                                value={formData.nota}
                                onChange={handleChange}
                            />
                        </Box>
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
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}

// ==========================================
// 2. MODAL INFORMACIÓN
// ==========================================
export function ModalInformacion({ open, onClose, asesor }) {
    if (!asesor) return null;

    // Lo que trae el objeto del asesor (una línea por materia / horario).
    // Si no trae nada, se muestran datos de respaldo.
    const materiasAsesor = aLista(asesor.materias);
    const horariosAsesor = aLista(asesor.horarios ?? asesor.horario);
    const modalidadesAsesor = aLista(asesor.modalidad ?? asesor.modalidades);
    const materias = (materiasAsesor.length > 0 ? materiasAsesor : MATERIAS_DEMO.slice(0, 4).map((m) => m.materia)).join('\n');
    const horarios = (horariosAsesor.length > 0 ? horariosAsesor : HORARIOS_DEMO.slice(0, 4).map((h) => h.horario)).join('\n');
    const modalidades = (modalidadesAsesor.length > 0 ? modalidadesAsesor : MODALIDADES_DEMO.map((m) => m.modalidad)).join('\n');

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '450px',
                    maxWidth: '90vw',
                    borderRadius: '12px',
                    p: 1.5
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.25rem', textAlign: 'center', }}>
                {asesor.asesor || asesor.nombre}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Correo:</Typography>
                        <Typography variant="body2">{asesor.email || asesor.correo || 'N/A'}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Materias:</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{materias}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Horarios:</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{horarios}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Modalidad:</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{modalidades}</Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={onClose} sx={{ backgroundColor: '#08338F', '&:hover': { backgroundColor: '#062568' } }}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ==========================================
// 3. MODAL SOLICITAR (desde la tarjeta): mismo modal, con el asesor ya elegido
// ==========================================
export function ModalSolicitar({ asesor, ...props }) {
    return <ModalCrearSolicitud {...props} asesorFijo={asesor} asesores={asesor ? [asesor] : []} />;
}