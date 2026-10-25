import CheckIcon from '@mui/icons-material/Check';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import ToastNotification from '../../../../components/ui/ToastNotification';
import { asesoresService } from '../../../../Services/asesoresService';
import { catalogosService } from '../../../../Services/catalogosService';
import { CATALOGOS_PRUEBA, DISPONIBILIDAD_PRUEBA, USAR_DATOS_PRUEBA } from '../datosPrueba';

// Mismos números que el enum de días del backend (ajusta si tu enum es distinto)
const DIAS = [
    { id: 1, nombre: 'Lunes' },
    { id: 2, nombre: 'Martes' },
    { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' },
    { id: 5, nombre: 'Viernes' },
];

// Clave única de un horario seleccionado: "día-idHorario"
const clave = (h) => `${h.dia}-${h.id_horario}`;

// --- DIÁLOGO: ELEGIR VARIAS MATERIAS A LA VEZ ---
function DialogMaterias({ open, onClose, catalogo, seleccionadas, onConfirm }) {
    const [busqueda, setBusqueda] = useState('');
    const [ids, setIds] = useState([]);

    // Al abrir, parte de lo que ya estaba seleccionado
    useEffect(() => {
        if (open) {
            setIds(seleccionadas.map((m) => m.id_materia));
            setBusqueda('');
        }
    }, [open, seleccionadas]);

    const toggle = (id) =>
        setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const filtradas = catalogo.filter((m) =>
        String(m.materia).toLowerCase().includes(busqueda.toLowerCase().trim())
    );

    const handleConfirm = () => {
        onConfirm(catalogo.filter((m) => ids.includes(m.id_materia)));
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableRestoreFocus>
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                Materias que asesoras
            </DialogTitle>
            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, py: 2 }}>
                <TextField
                    size="small"
                    placeholder="Buscar materia..."
                    fullWidth
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <Box sx={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {filtradas.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                            No se encontraron resultados.
                        </Typography>
                    ) : (
                        filtradas.map((m) => (
                            <ListItemButton
                                key={m.id_materia}
                                dense
                                onClick={() => toggle(m.id_materia)}
                                sx={{ borderRadius: '6px' }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Checkbox
                                        edge="start"
                                        size="small"
                                        checked={ids.includes(m.id_materia)}
                                        tabIndex={-1}
                                        disableRipple
                                        sx={{ color: '#9e9e9e', '&.Mui-checked': { color: '#2e7d32' } }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={m.materia} slotProps={{ primary: { sx: { fontSize: '14px' } } }} />
                            </ListItemButton>
                        ))
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 1.5 }}>
                <Button onClick={onClose} sx={{ textTransform: 'none', color: '#555' }}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    sx={{ textTransform: 'none', backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
                >
                    Listo ({ids.length})
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --- TARJETA CON TÍTULO Y SUBTÍTULO ---
function SeccionTarjeta({ titulo, subtitulo, accion, children }) {
    return (
        <div className="w-full max-w-xl bg-white border border-gray-200 rounded-[10px] shadow-sm p-5 md:p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-base font-bold text-gray-900">{titulo}</p>
                    {subtitulo && <p className="mt-0.5 text-sm text-gray-600">{subtitulo}</p>}
                </div>
                {accion}
            </div>
            {children}
        </div>
    );
}

// --- PÁGINA ---
export default function DisponibilidadAsesor() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // lo que el asesor está editando
    const [materias, setMaterias] = useState([]);     // [{ id_materia, materia }]
    const [horarios, setHorarios] = useState([]);     // [{ dia, id_horario }]

    // lo que está guardado en el back (para saber si hay cambios y poder descartar)
    const [guardado, setGuardado] = useState({ materias: [], horarios: [] });

    // catálogos (opciones disponibles)
    const [catalogoMaterias, setCatalogoMaterias] = useState([]);
    const [catalogoHorarios, setCatalogoHorarios] = useState([]);

    const [dialogMateriasOpen, setDialogMateriasOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    const showToast = useCallback((message, type = 'info') => {
        setToast({ open: true, message, type });
    }, []);

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    const cargarDisponibilidad = useCallback(async () => {
        if (USAR_DATOS_PRUEBA) {
            setMaterias(DISPONIBILIDAD_PRUEBA.materias);
            setHorarios(DISPONIBILIDAD_PRUEBA.horarios);
            setGuardado({ materias: DISPONIBILIDAD_PRUEBA.materias, horarios: DISPONIBILIDAD_PRUEBA.horarios });
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(false);
            const datos = await asesoresService.obtenerDisponibilidad();

            setMaterias(datos.materias);
            setHorarios(datos.horarios);
            setGuardado({ materias: datos.materias, horarios: datos.horarios });
        } catch (err) {
            console.error('Error al cargar la disponibilidad', err);
            setError(true);
            showToast('No se pudo cargar la disponibilidad', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const cargarCatalogos = useCallback(async () => {
        if (USAR_DATOS_PRUEBA) {
            setCatalogoMaterias(CATALOGOS_PRUEBA.materias);
            setCatalogoHorarios(CATALOGOS_PRUEBA.horarios);
            return;
        }

        try {
            const datos = await catalogosService.obtenerCatalogos();
            setCatalogoMaterias(datos.materias);
            setCatalogoHorarios(datos.horarios);
        } catch (err) {
            console.error('Error al cargar catálogos', err);
            showToast('No se pudieron cargar los catálogos', 'error');
        }
    }, [showToast]);

    useEffect(() => {
        cargarDisponibilidad();
        cargarCatalogos();
    }, [cargarDisponibilidad, cargarCatalogos]);

    // ¿Hay cambios? Se comparan ids (sin importar el orden)
    const firmaMaterias = (lista) => lista.map((m) => m.id_materia).sort((a, b) => a - b).join(',');
    const firmaHorarios = (lista) => lista.map(clave).sort().join(',');

    const hasChanges =
        firmaMaterias(materias) !== firmaMaterias(guardado.materias) ||
        firmaHorarios(horarios) !== firmaHorarios(guardado.horarios);

    // --- Materias ---
    const handleQuitarMateria = (id) =>
        setMaterias((prev) => prev.filter((m) => m.id_materia !== id));

    // --- Horarios (tocar para activar/desactivar) ---
    const seleccionados = new Set(horarios.map(clave));

    const toggleHorario = (dia, id_horario) => {
        const k = `${dia}-${id_horario}`;
        setHorarios((prev) =>
            seleccionados.has(k)
                ? prev.filter((h) => clave(h) !== k)
                : [...prev, { dia, id_horario }]
        );
    };

    // "Todos / Ninguno" de un día
    const toggleDia = (dia) => {
        const delDia = catalogoHorarios.map((h) => ({ dia, id_horario: h.id_horario }));
        const todos = delDia.every((h) => seleccionados.has(clave(h)));

        setHorarios((prev) => {
            const sinEseDia = prev.filter((h) => h.dia !== dia);
            return todos ? sinEseDia : [...sinEseDia, ...delDia];
        });
    };

    const handleDescartar = () => {
        setMaterias(guardado.materias);
        setHorarios(guardado.horarios);
    };

    const handleApply = async () => {
        if (!hasChanges || guardando) return;

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        // Modo prueba: no hay backend, solo simula que se guardó
        if (USAR_DATOS_PRUEBA) {
            setGuardado({ materias, horarios });
            showToast('Cambios aplicados (modo prueba)', 'success');
            return;
        }

        try {
            setGuardando(true);
            await asesoresService.actualizarDisponibilidad(materias, horarios);

            setGuardado({ materias, horarios });
            showToast('Cambios aplicados correctamente', 'success');
        } catch (err) {
            const mensaje = err.response?.data?.message || 'Error al guardar los cambios';
            showToast(mensaje, 'error');
        } finally {
            setGuardando(false);
        }
    };

    const slots = [...catalogoHorarios].sort((a, b) => a.id_horario - b.id_horario);

    return (
        <div className={`min-h-[calc(100dvh-3.5rem)] w-full bg-gray-100 px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8 ${hasChanges ? 'pb-28' : ''}`}>
            <div>
                <p className="text-2xl font-bold">Disponibilidad</p>
                {!loading && !error && (
                    <p className="mt-1 text-sm text-gray-600">
                        {materias.length} {materias.length === 1 ? 'materia' : 'materias'} · {horarios.length} {horarios.length === 1 ? 'horario' : 'horarios'}
                        {hasChanges && <span className="ml-2 font-semibold text-[#C49E0D]">· Cambios sin guardar</span>}
                    </p>
                )}
            </div>

            <div className="w-full flex flex-1 flex-col items-center gap-5">
                {loading ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <CircularProgress sx={{ color: '#244B91' }} />
                        <p className="text-sm text-gray-600">Cargando disponibilidad...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <p className="text-sm text-gray-600">No se pudo cargar la disponibilidad.</p>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => cargarDisponibilidad()}
                            sx={{ textTransform: 'none', borderRadius: '5px', backgroundColor: '#244B91' }}
                        >
                            Reintentar
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* MATERIAS */}
                        <SeccionTarjeta
                            titulo="Materias que asesoras"
                            subtitulo="Los alumnos solo podrán pedirte asesoría de estas materias."
                            accion={
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditOutlinedIcon />}
                                    onClick={() => setDialogMateriasOpen(true)}
                                    sx={{
                                        flexShrink: 0,
                                        textTransform: 'none',
                                        borderRadius: '5px',
                                        color: '#244B91',
                                        borderColor: '#244B91'
                                    }}
                                >
                                    {materias.length === 0 ? 'Añadir' : 'Editar'}
                                </Button>
                            }
                        >
                            {materias.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    Aún no has añadido materias.
                                </Typography>
                            ) : (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {materias.map((m) => (
                                        <Chip
                                            key={m.id_materia}
                                            label={m.materia}
                                            onDelete={() => handleQuitarMateria(m.id_materia)}
                                            sx={{
                                                height: 'auto',
                                                py: 0.5,
                                                backgroundColor: '#E8EEF9',
                                                color: '#08338F',
                                                fontWeight: 600,
                                                '& .MuiChip-label': { whiteSpace: 'normal', overflowWrap: 'anywhere' }
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </SeccionTarjeta>

                        {/* HORARIOS POR DÍA */}
                        <SeccionTarjeta
                            titulo="Horarios disponibles"
                            subtitulo="Toca un horario para activarlo o desactivarlo en cada día."
                        >
                            <div className="flex flex-col gap-5">
                                {DIAS.map((dia) => {
                                    const activosDelDia = slots.filter((s) => seleccionados.has(`${dia.id}-${s.id_horario}`)).length;
                                    const todos = slots.length > 0 && activosDelDia === slots.length;

                                    return (
                                        <div key={dia.id} className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-gray-800">
                                                    {dia.nombre}
                                                    {activosDelDia > 0 && (
                                                        <span className="ml-2 text-xs font-medium text-gray-500">
                                                            {activosDelDia} {activosDelDia === 1 ? 'horario' : 'horarios'}
                                                        </span>
                                                    )}
                                                </p>
                                                <Button
                                                    size="small"
                                                    onClick={() => toggleDia(dia.id)}
                                                    sx={{ textTransform: 'none', minWidth: 0, color: '#244B91', fontSize: '12px' }}
                                                >
                                                    {todos ? 'Ninguno' : 'Todos'}
                                                </Button>
                                            </div>

                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {slots.map((s) => {
                                                    const activo = seleccionados.has(`${dia.id}-${s.id_horario}`);
                                                    return (
                                                        <Chip
                                                            key={s.id_horario}
                                                            label={s.horario}
                                                            clickable
                                                            onClick={() => toggleHorario(dia.id, s.id_horario)}
                                                            icon={activo ? <CheckIcon sx={{ fontSize: 16 }} /> : undefined}
                                                            variant={activo ? 'filled' : 'outlined'}
                                                            sx={{
                                                                height: 36,
                                                                fontWeight: 600,
                                                                borderColor: activo ? '#2e7d32' : '#BDBDBD',
                                                                backgroundColor: activo ? '#2e7d32' : 'transparent',
                                                                color: activo ? '#ffffff' : '#555555',
                                                                '& .MuiChip-icon': { color: '#ffffff' },
                                                                '&:hover': { backgroundColor: activo ? '#1b5e20' : 'rgba(0,0,0,0.04)' }
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </Box>
                                        </div>
                                    );
                                })}
                            </div>
                        </SeccionTarjeta>
                    </>
                )}
            </div>

            {/* Barra fija de guardado: solo aparece cuando hay cambios */}
            {hasChanges && (
                <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
                    <div className="mx-auto flex w-full max-w-xl gap-3">
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleDescartar}
                            disabled={guardando}
                            sx={{ minHeight: 42, textTransform: 'none', borderRadius: '5px', color: '#555555', borderColor: '#BDBDBD' }}
                        >
                            Descartar
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleApply}
                            disabled={guardando}
                            sx={{
                                minHeight: 42,
                                textTransform: 'none',
                                borderRadius: '5px',
                                backgroundColor: '#2e7d32',
                                '&:hover': { backgroundColor: '#1b5e20' }
                            }}
                        >
                            {guardando ? 'Guardando...' : 'Guardar cambios'}
                        </Button>
                    </div>
                </div>
            )}

            <DialogMaterias
                open={dialogMateriasOpen}
                onClose={() => setDialogMateriasOpen(false)}
                catalogo={catalogoMaterias}
                seleccionadas={materias}
                onConfirm={setMaterias}
            />

            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}