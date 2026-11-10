import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useCatalogos } from '../../../../../context/CatalogosContext';
import { traerMaterias } from '../../../../../Services/asesoriasAsesorService';
import ModalMaterias from '../../../rolAsesor/components/disponibilidad/ModalMaterias';

// Respaldo por si el catálogo de días aún no llega (los valores son los mismos que usa la API, sin acento)
const DIAS_RESPALDO = [
    { valor: 'lunes', etiqueta: 'Lunes' },
    { valor: 'martes', etiqueta: 'Martes' },
    { valor: 'miercoles', etiqueta: 'Miércoles' },
    { valor: 'jueves', etiqueta: 'Jueves' },
    { valor: 'viernes', etiqueta: 'Viernes' }
];

// Clave única de un horario seleccionado: "día-idHorario"
const clave = (h) => `${h.dia}-${h.horarioId}`;

// De lo que entrega el servicio (horarios agrupados por día) a la lista plana que se edita
const aHorariosPlanos = (horariosPorDia) =>
    horariosPorDia.flatMap((grupo) => grupo.horarios.map((h) => ({ dia: grupo.dia, horarioId: h.id })));

// Título de cada bloque del editor; en rojo si falta algo al intentar guardar
function Etiqueta({ children, error }) {
    return (
        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: error ? '#d32f2f' : '#1F2937', mb: 1 }}>
            {children}
        </Typography>
    );
}

const estiloChip = (activo) => ({
    height: 36,
    fontWeight: 600,
    borderColor: activo ? '#2e7d32' : '#BDBDBD',
    backgroundColor: activo ? '#2e7d32' : 'transparent',
    color: activo ? '#ffffff' : '#555555',
    '& .MuiChip-icon': { color: '#ffffff' },
    '&:hover': { backgroundColor: activo ? '#1b5e20' : 'rgba(0,0,0,0.04)' }
});

/**
 * El administrador arma (o cambia) lo que imparte un asesor: materias, horarios por día y modalidades.
 * Sirve para disciplinares y pares. Reemplaza TODO lo anterior, así que pide al menos una de cada cosa
 * (igual que la API) para que el asesor quede contactable.
 *
 * Props:
 *  - open, onClose
 *  - asesor: asesor seleccionado (formato de asesoresAdminService; su "disponibilidad" es el punto de partida)
 *  - onGuardar: recibe { materias: [ids], horarios: [{dia, horario_id}], modalidades: ['virtual'] } y regresa una
 *    promesa con true si se guardó (el modal se cierra) o false si falló (el aviso lo da quien lo usa)
 */
export default function ModalDisponibilidadAsesor({ open, onClose, asesor, onGuardar }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    const { catalogos } = useCatalogos();

    const [materias, setMaterias] = useState([]);       // [{ id, nombre }]
    const [horarios, setHorarios] = useState([]);       // [{ dia, horarioId }]
    const [modalidades, setModalidades] = useState([]); // ['presencial', 'virtual']
    const [inicial, setInicial] = useState(null);

    const [catalogoMaterias, setCatalogoMaterias] = useState([]);
    const [cargandoMaterias, setCargandoMaterias] = useState(false);
    const [errorMaterias, setErrorMaterias] = useState(false);
    const [dialogMateriasOpen, setDialogMateriasOpen] = useState(false);

    const [intentoGuardar, setIntentoGuardar] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // Al abrir: parte de lo que el asesor ya tiene guardado y se piden las materias de la facultad
    useEffect(() => {
        if (!open || !asesor) return undefined;

        const d = asesor.disponibilidad;
        const estado = {
            materias: d.materias,
            horarios: aHorariosPlanos(d.horariosPorDia),
            modalidades: d.modalidades.map((m) => m.valor)
        };

        setMaterias(estado.materias);
        setHorarios(estado.horarios);
        setModalidades(estado.modalidades);
        setInicial(estado);
        setIntentoGuardar(false);
        setGuardando(false);
        setErrorMaterias(false);
        setCargandoMaterias(true);

        let cancelado = false;

        traerMaterias()
            .then((lista) => {
                if (!cancelado) setCatalogoMaterias(lista);
            })
            .catch((err) => {
                console.error('Error al cargar las materias', err);
                if (!cancelado) setErrorMaterias(true);
            })
            .finally(() => {
                if (!cancelado) setCargandoMaterias(false);
            });

        return () => {
            cancelado = true;
        };
    }, [open, asesor]);

    // ¿Hay cambios? Se comparan ids y valores (sin importar el orden)
    const firmaMaterias = (lista) => lista.map((m) => m.id).sort((a, b) => a - b).join(',');
    const firmaHorarios = (lista) => lista.map(clave).sort().join(',');
    const firmaModalidades = (lista) => [...lista].sort().join(',');

    const hayCambios =
        Boolean(inicial) &&
        (firmaMaterias(materias) !== firmaMaterias(inicial.materias) ||
            firmaHorarios(horarios) !== firmaHorarios(inicial.horarios) ||
            firmaModalidades(modalidades) !== firmaModalidades(inicial.modalidades));

    const seleccionados = new Set(horarios.map(clave));

    const slots = [...(catalogos?.horarios ?? [])].sort((a, b) => a.id - b.id);
    const dias = catalogos?.dias ?? DIAS_RESPALDO;
    const opcionesModalidad = catalogos?.modalidades ?? [];

    const handleQuitarMateria = (id) => setMaterias((prev) => prev.filter((m) => m.id !== id));

    const toggleModalidad = (valor) =>
        setModalidades((prev) => (prev.includes(valor) ? prev.filter((v) => v !== valor) : [...prev, valor]));

    const toggleHorario = (dia, horarioId) => {
        const k = `${dia}-${horarioId}`;
        setHorarios((prev) =>
            seleccionados.has(k) ? prev.filter((h) => clave(h) !== k) : [...prev, { dia, horarioId }]
        );
    };

    // "Todos / Ninguno" de un día
    const toggleDia = (dia) => {
        const delDia = slots.map((s) => ({ dia, horarioId: s.id }));
        const todos = delDia.every((h) => seleccionados.has(clave(h)));

        setHorarios((prev) => {
            const sinEseDia = prev.filter((h) => h.dia !== dia);
            return todos ? sinEseDia : [...sinEseDia, ...delDia];
        });
    };

    const sinMaterias = materias.length === 0;
    const sinHorarios = horarios.length === 0;
    const sinModalidades = modalidades.length === 0;

    const handleGuardar = async () => {
        if (!hayCambios) return;

        setIntentoGuardar(true);
        if (sinMaterias || sinHorarios || sinModalidades) return;

        setGuardando(true);
        document.activeElement?.blur();

        const guardado = await onGuardar?.({
            materias: materias.map((m) => m.id),
            horarios: horarios.map((h) => ({ dia: h.dia, horario_id: h.horarioId })),
            modalidades
        });

        setGuardando(false);
        if (guardado) onClose();
    };

    const handleCloseModal = () => {
        document.activeElement?.blur();
        onClose();
    };

    return (
        <Dialog
            open={Boolean(open)}
            onClose={handleCloseModal}
            fullScreen={esCelular}
            disableRestoreFocus
            sx={{
                '& .MuiPaper-root': esCelular
                    ? { borderRadius: 0 }
                    : { width: '640px', maxWidth: '92vw', maxHeight: '90dvh', borderRadius: '12px', p: 1.5 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, pr: 7, fontWeight: 'bold', fontSize: '1.2rem' }}>
                Disponibilidad
                {asesor?.nombre && (
                    <Typography component="span" sx={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#6B7280' }}>
                        {asesor.nombre}
                    </Typography>
                )}
                <IconButton
                    aria-label="close"
                    onClick={handleCloseModal}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 3 }}>
                {/* MATERIAS */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1 }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: intentoGuardar && sinMaterias ? '#d32f2f' : '#1F2937' }}>
                            Materias que asesora
                        </Typography>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={cargandoMaterias ? <CircularProgress size={14} /> : <EditOutlinedIcon />}
                            disabled={cargandoMaterias || errorMaterias}
                            onClick={() => setDialogMateriasOpen(true)}
                            sx={{ flexShrink: 0, textTransform: 'none', borderRadius: '5px', color: '#244B91', borderColor: '#244B91' }}
                        >
                            {sinMaterias ? 'Añadir' : 'Editar'}
                        </Button>
                    </Box>

                    {errorMaterias && (
                        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                            No se pudieron cargar las materias. Cierra y vuelve a abrir esta ventana.
                        </Typography>
                    )}

                    {sinMaterias ? (
                        <Typography variant="body2" sx={{ color: intentoGuardar ? '#d32f2f' : '#6B7280', fontStyle: 'italic' }}>
                            {intentoGuardar ? 'Elige al menos una materia.' : 'Aún no hay materias.'}
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
                </Box>

                {/* MODALIDADES */}
                <Box>
                    <Etiqueta error={intentoGuardar && sinModalidades}>
                        Modalidades{intentoGuardar && sinModalidades ? ' · elige al menos una' : ''}
                    </Etiqueta>
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
                                    sx={estiloChip(activa)}
                                />
                            );
                        })}
                    </Box>
                </Box>

                {/* HORARIOS POR DÍA */}
                <Box>
                    <Etiqueta error={intentoGuardar && sinHorarios}>
                        Horarios disponibles{intentoGuardar && sinHorarios ? ' · elige al menos uno' : ''}
                    </Etiqueta>
                    <div className="flex flex-col gap-4">
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
                                                    sx={estiloChip(activo)}
                                                />
                                            );
                                        })}
                                    </Box>
                                </div>
                            );
                        })}
                    </div>
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
                <Button variant="outlined" color="inherit" onClick={handleCloseModal}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    disabled={!hayCambios || guardando}
                    sx={{
                        backgroundColor: '#2e7d32',
                        '&:hover': { backgroundColor: '#1b5e20' },
                        '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' }
                    }}
                    onClick={handleGuardar}
                >
                    Guardar disponibilidad
                </Button>
            </DialogActions>

            <ModalMaterias
                open={dialogMateriasOpen}
                onClose={() => setDialogMateriasOpen(false)}
                catalogo={catalogoMaterias}
                seleccionadas={materias}
                onConfirm={setMaterias}
            />
        </Dialog>
    );
}
