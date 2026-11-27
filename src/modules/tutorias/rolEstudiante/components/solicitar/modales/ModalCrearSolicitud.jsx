import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, TextField, Typography, createFilterOptions } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/es';
import { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDiasInhabiles } from '../../../../compartidos/diasInhabiles';

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

// Lista desplegable de los select: altura máxima con scroll interno
const MENU_CON_SCROLL = {
    slotProps: { paper: { sx: { maxHeight: 240 } } }
};

const filtrarAsesores = createFilterOptions({
    stringify: (asesor) => `${asesor.asesor || asesor.nombre || ''} ${asesor.email ?? ''}`
});

// Convierte el día del enum ("lunes".."viernes") al número que usa dayjs (lunes=1 ... viernes=5)
const DIA_A_NUMERO = { lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5 };

// Encabezado pequeño que agrupa campos relacionados
function Seccion({ titulo }) {
    return (
        <Typography
            sx={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#6A6A6A', mt: 0.5 }}
        >
            {titulo}
        </Typography>
    );
}

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
// Flujo en cadena: asesor -> materia -> horario -> fecha (restringida al día del horario) -> modalidad.
// Razón y nota no dependen de nada: siempre están disponibles.
// ==========================================
export default function ModalCrearSolicitud({ open, onClose, onSave, showToast, asesores = [], asesorFijo = null, razones = []}) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    // asesorFijo: si viene (desde la tarjeta), el asesor ya está elegido y bloqueado
    const [formData, setFormData] = useState({ ...FORMULARIO_CREAR_INICIAL, asesor: asesorFijo });
    const [calendarioOpen, setCalendarioOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);
    // Vacaciones y suspensiones de la facultad: esos días no se pueden elegir
    const { esInhabil } = useDiasInhabiles();

    // Se reinicia solo al abrir o si cambia de asesor. Se compara por id y no por objeto: el refresco
    // automático de la lista trae objetos nuevos del mismo asesor, y eso borraba lo que el estudiante ya había llenado.
    const idAsesorFijo = asesorFijo?.id;
    useEffect(() => {
        if (!open) return;
        setFormData({ ...FORMULARIO_CREAR_INICIAL, asesor: asesorFijo });
        setCalendarioOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, idAsesorFijo]);

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

    // Cadena: cada campo se habilita cuando el anterior ya tiene valor, y mientras tanto dice qué le falta
    const sinAsesor = !formData.asesor;
    const sinMateria = !formData.materiaId;
    const sinHorario = !formData.horarioKey;
    const sinFecha = !formData.inicio?.isValid();
    const leyendaMateria = sinAsesor ? 'Elige primero un asesor' : '';
    const leyendaHorario = sinMateria ? 'Elige primero una materia' : '';
    const leyendaFecha = sinHorario ? 'Elige primero un horario' : '';
    const leyendaModalidad = sinFecha ? 'Elige primero una fecha de inicio' : '';

    // Día (lunes..viernes) del horario elegido, usado para bloquear el calendario
    const diaElegido = horariosList.find((h) => h.key === formData.horarioKey)?.dia;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Al cambiar de horario, una fecha ya elegida puede quedar en un día que ya no corresponde:
    // se borran la fecha y la modalidad, que dependen de ella
    const handleChangeHorario = (e) => {
        setFormData((prev) => ({ ...prev, horarioKey: e.target.value, inicio: null, modalidadId: '' }));
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
                fullScreen={esCelular}
                sx={{
                    '& .MuiPaper-root': esCelular ? { borderRadius: 0 } : {
                        width: '550px',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1.5
                    }
                }}
            >
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
                        <AssignmentOutlinedIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1.2 }}>
                            Solicitar Asesoría
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px' }}>
                            Completa los datos en orden
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

                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
                        <Seccion titulo="Asesor y materia" />

                        {/* 1. ASESOR: lo primero que se elige */}
                        <Autocomplete
                            fullWidth
                            size="small"
                            openOnFocus
                            disabled={Boolean(asesorFijo)}
                            options={asesoresList}
                            value={formData.asesor}
                            onChange={(_, nuevoAsesor) =>
                                // Al cambiar de asesor se limpia la cadena (razón y nota no dependen de él)
                                setFormData((prev) => ({ ...FORMULARIO_CREAR_INICIAL, razon: prev.razon, nota: prev.nota, asesor: asesorFijo ?? nuevoAsesor }))
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

                        <Seccion titulo="Fecha y modalidad" />

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
                                label="Fecha de inicio"
                                value={formData.inicio}
                                onChange={(nuevaFecha) => setFormData((prev) => ({ ...prev, inicio: nuevaFecha }))}
                                format="DD/MM/YYYY"
                                disabled={sinHorario}
                                disablePast
                                shouldDisableDate={(fecha) => soloEseDia(fecha) || esInhabil(fecha)}
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

                        {/* 5. MODALIDAD: se habilita al elegir fecha */}
                        <Box>
                            <TextField
                                select
                                slotProps={{ select: { MenuProps: MENU_CON_SCROLL } }}
                                label="Modalidad"
                                name="modalidadId"
                                size="small"
                                fullWidth
                                disabled={sinFecha}
                                helperText={leyendaModalidad}
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

                        <Seccion titulo="Detalles" />

                        {/* 6. RAZÓN: independiente, siempre disponible */}
                        <Box>
                            <TextField
                                select
                                slotProps={{ select: { MenuProps: MENU_CON_SCROLL } }}
                                label="Razón"
                                name="razon"
                                size="small"
                                fullWidth
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

                        {/* 7. NOTA: independiente, siempre disponible */}
                        <Box>
                            <TextField
                                label="Nota para el asesor (opcional)"
                                name="nota"
                                placeholder="Agrega un comentario..."
                                size="small"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.nota}
                                onChange={handleChange}
                            />
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5, justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={onClose} sx={{ borderRadius: '8px', textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCrear}
                        disabled={!formularioCompleto || guardando}
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 700,
                            letterSpacing: '0.3px',
                            background: 'linear-gradient(135deg, #1E4DB7 0%, #08338F 55%, #052466 100%)',
                            boxShadow: '0 4px 12px rgba(8, 51, 143, 0.35)',
                            '&:hover': { background: 'linear-gradient(135deg, #08338F 0%, #052466 100%)' },
                            '&.Mui-disabled': { background: '#E0E0E0', boxShadow: 'none', color: 'rgba(0,0,0,0.26)' }
                        }}
                    >
                        {guardando ? 'Enviando...' : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
