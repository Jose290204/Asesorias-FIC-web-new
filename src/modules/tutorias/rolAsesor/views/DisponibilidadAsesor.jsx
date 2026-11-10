import CheckIcon from '@mui/icons-material/Check';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Button, Chip, CircularProgress, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import ToastNotification from '../../../../components/ui/ToastNotification';
import { useCatalogos } from '../../../../context/CatalogosContext';
import {
    guardarDisponibilidad,
    traerDisponibilidad,
    traerMaterias
} from '../../../../Services/asesoriasAsesorService';
import { mensajesDeError } from '../../../../Services/errores';
import ModalMaterias from '../components/disponibilidad/ModalMaterias';
import TarjetaSeccion from '../components/disponibilidad/TarjetaSeccion';

// Respaldo por si el catálogo de días aún no llega (los valores son los mismos que usa la API, sin acento)
const DIAS_RESPALDO = [
    { valor: 'lunes', etiqueta: 'Lunes' },
    { valor: 'martes', etiqueta: 'Martes' },
    { valor: 'miercoles', etiqueta: 'Miércoles' },
    { valor: 'jueves', etiqueta: 'Jueves' },
    { valor: 'viernes', etiqueta: 'Viernes' },
];

// Clave única de un horario seleccionado: "día-idHorario"
const clave = (h) => `${h.dia}-${h.horarioId}`;

// La API entrega lo guardado así: materias [{id, nombre, ...}], horarios agrupados por día
// [{ dia, etiqueta, horarios: [{ id, etiqueta }] }] y modalidades [{ valor, etiqueta }].
// Aquí se aplana a lo que maneja la pantalla.
const aEstadoPantalla = (datos) => ({
    materias: datos.materias.map((m) => ({ id: m.id, nombre: m.nombre })),
    horarios: datos.horarios.flatMap((grupo) => grupo.horarios.map((h) => ({ dia: grupo.dia, horarioId: h.id }))),
    modalidades: datos.modalidades.map((m) => m.valor),
});

// --- PÁGINA ---
export default function DisponibilidadAsesor() {
    // Catálogos que ya carga el layout del asesor: horarios, modalidades y días
    const { catalogos } = useCatalogos();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // lo que el asesor está editando
    const [materias, setMaterias] = useState([]);       // [{ id, nombre }]
    const [horarios, setHorarios] = useState([]);       // [{ dia: 'lunes', horarioId }]
    const [modalidades, setModalidades] = useState([]); // ['presencial', 'virtual']

    // lo que está guardado en el back (para saber si hay cambios y poder descartar)
    const [guardado, setGuardado] = useState({ materias: [], horarios: [], modalidades: [] });

    // todas las materias de la facultad (opciones del diálogo)
    const [catalogoMaterias, setCatalogoMaterias] = useState([]);

    const [dialogMateriasOpen, setDialogMateriasOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    const showToast = useCallback((message, type = 'info') => {
        setToast({ open: true, message, type });
    }, []);

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    const aplicarEstado = (estado) => {
        setMaterias(estado.materias);
        setHorarios(estado.horarios);
        setModalidades(estado.modalidades);
        setGuardado(estado);
    };

    const cargarDisponibilidad = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const datos = await traerDisponibilidad();
            const estado = aEstadoPantalla(datos);

            setMaterias(estado.materias);
            setHorarios(estado.horarios);
            setModalidades(estado.modalidades);
            setGuardado(estado);
        } catch (err) {
            console.error('Error al cargar la disponibilidad', err);
            setError(true);
            showToast(mensajesDeError(err)[0], 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const cargarMaterias = useCallback(async () => {
        try {
            setCatalogoMaterias(await traerMaterias());
        } catch (err) {
            console.error('Error al cargar las materias', err);
            showToast('No se pudieron cargar las materias', 'error');
        }
    }, [showToast]);

    useEffect(() => {
        cargarDisponibilidad();
        cargarMaterias();
    }, [cargarDisponibilidad, cargarMaterias]);

    // ¿Hay cambios? Se comparan ids y valores (sin importar el orden)
    const firmaMaterias = (lista) => lista.map((m) => m.id).sort((a, b) => a - b).join(',');
    const firmaHorarios = (lista) => lista.map(clave).sort().join(',');
    const firmaModalidades = (lista) => [...lista].sort().join(',');

    const hasChanges =
        firmaMaterias(materias) !== firmaMaterias(guardado.materias) ||
        firmaHorarios(horarios) !== firmaHorarios(guardado.horarios) ||
        firmaModalidades(modalidades) !== firmaModalidades(guardado.modalidades);

    // --- Materias ---
    const handleQuitarMateria = (id) =>
        setMaterias((prev) => prev.filter((m) => m.id !== id));

    // --- Modalidades (tocar para activar/desactivar) ---
    const toggleModalidad = (valor) =>
        setModalidades((prev) => (prev.includes(valor) ? prev.filter((v) => v !== valor) : [...prev, valor]));

    // --- Horarios (tocar para activar/desactivar) ---
    const seleccionados = new Set(horarios.map(clave));

    const toggleHorario = (dia, horarioId) => {
        const k = `${dia}-${horarioId}`;
        setHorarios((prev) =>
            seleccionados.has(k)
                ? prev.filter((h) => clave(h) !== k)
                : [...prev, { dia, horarioId }]
        );
    };

    const slots = [...(catalogos?.horarios ?? [])].sort((a, b) => a.id - b.id);
    const dias = catalogos?.dias ?? DIAS_RESPALDO;
    const opcionesModalidad = catalogos?.modalidades ?? [];

    // "Todos / Ninguno" de un día
    const toggleDia = (dia) => {
        const delDia = slots.map((s) => ({ dia, horarioId: s.id }));
        const todos = delDia.every((h) => seleccionados.has(clave(h)));

        setHorarios((prev) => {
            const sinEseDia = prev.filter((h) => h.dia !== dia);
            return todos ? sinEseDia : [...sinEseDia, ...delDia];
        });
    };

    const handleDescartar = () => {
        setMaterias(guardado.materias);
        setHorarios(guardado.horarios);
        setModalidades(guardado.modalidades);
    };

    const handleApply = async () => {
        if (!hasChanges || guardando) return;

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        // La API exige al menos una materia, un horario y una modalidad (así todo asesor guardado es contactable)
        if (materias.length === 0) return showToast('Elige al menos una materia', 'error');
        if (horarios.length === 0) return showToast('Elige al menos un horario', 'error');
        if (modalidades.length === 0) return showToast('Elige al menos una modalidad', 'error');

        try {
            setGuardando(true);
            // El PUT recibe los horarios planos y responde con el estado nuevo: no hace falta otro GET
            const respuesta = await guardarDisponibilidad({
                materias: materias.map((m) => m.id),
                horarios: horarios.map((h) => ({ dia: h.dia, horario_id: h.horarioId })),
                modalidades,
            });

            aplicarEstado(aEstadoPantalla(respuesta));
            showToast('Cambios aplicados correctamente', 'success');
        } catch (err) {
            showToast(mensajesDeError(err)[0], 'error');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className={`min-h-[calc(100dvh-3.5rem)] w-full bg-transparent px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8 ${hasChanges ? 'pb-28' : ''}`}>
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
                        <TarjetaSeccion
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
                                            key={m.id}
                                            label={m.nombre}
                                            onDelete={() => handleQuitarMateria(m.id)}
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
                        </TarjetaSeccion>

                        {/* MODALIDADES */}
                        <TarjetaSeccion
                            titulo="Modalidades"
                            subtitulo="Toca una modalidad para activarla o desactivarla."
                        >
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {opcionesModalidad.map((m) => {
                                    const activa = modalidades.includes(m.valor);
                                    return (
                                        <Chip
                                            key={m.valor}
                                            label={m.etiqueta}
                                            clickable
                                            onClick={() => toggleModalidad(m.valor)}
                                            icon={activa ? <CheckIcon sx={{ fontSize: 16 }} /> : undefined}
                                            variant={activa ? 'filled' : 'outlined'}
                                            sx={{
                                                height: 36,
                                                fontWeight: 600,
                                                borderColor: activa ? '#2e7d32' : '#BDBDBD',
                                                backgroundColor: activa ? '#2e7d32' : 'transparent',
                                                color: activa ? '#ffffff' : '#555555',
                                                '& .MuiChip-icon': { color: '#ffffff' },
                                                '&:hover': { backgroundColor: activa ? '#1b5e20' : 'rgba(0,0,0,0.04)' }
                                            }}
                                        />
                                    );
                                })}
                            </Box>
                        </TarjetaSeccion>

                        {/* HORARIOS POR DÍA */}
                        <TarjetaSeccion
                            titulo="Horarios disponibles"
                            subtitulo="Toca un horario para activarlo o desactivarlo en cada día."
                        >
                            <div className="flex flex-col gap-5">
                                {dias.map((dia) => {
                                    const activosDelDia = slots.filter((s) => seleccionados.has(`${dia.valor}-${s.id}`)).length;
                                    const todos = slots.length > 0 && activosDelDia === slots.length;

                                    return (
                                        <div key={dia.valor} className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-gray-800">
                                                    {dia.etiqueta}
                                                    {activosDelDia > 0 && (
                                                        <span className="ml-2 text-xs font-medium text-gray-500">
                                                            {activosDelDia} {activosDelDia === 1 ? 'horario' : 'horarios'}
                                                        </span>
                                                    )}
                                                </p>
                                                <Button
                                                    size="small"
                                                    onClick={() => toggleDia(dia.valor)}
                                                    sx={{ textTransform: 'none', minWidth: 0, color: '#244B91', fontSize: '12px' }}
                                                >
                                                    {todos ? 'Ninguno' : 'Todos'}
                                                </Button>
                                            </div>

                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {slots.map((s) => {
                                                    const activo = seleccionados.has(`${dia.valor}-${s.id}`);
                                                    return (
                                                        <Chip
                                                            key={s.id}
                                                            label={s.etiqueta}
                                                            clickable
                                                            onClick={() => toggleHorario(dia.valor, s.id)}
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
                        </TarjetaSeccion>
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

            <ModalMaterias
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
