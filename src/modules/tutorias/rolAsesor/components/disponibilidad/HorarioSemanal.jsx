import CalendarViewWeekOutlinedIcon from '@mui/icons-material/CalendarViewWeekOutlined';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useMediaQuery } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

import useRefrescoPorAvisos from '../../../../../hooks/useRefrescoPorAvisos';
import { editarAsesoria, traerAsesorias } from '../../../../../Services/asesoriasAsesorService';
import { mensajesDeError } from '../../../../../Services/errores';
import { diaDeFecha } from '../../utils/horarios';
import ModalInfoAsesoria from '../asesorias/modales/ModalInfoAsesoria';

const MAX_PAGINAS = 10; // tope de seguridad: la API pagina de 10 en 10

// Todas las asesorías en curso del asesor (recorre las páginas)
const traerTodasEnCurso = async () => {
    const todas = [];
    for (let pagina = 1; pagina <= MAX_PAGINAS; pagina++) {
        const { asesorias, meta } = await traerAsesorias({ estatus: 'en_curso', page: pagina });
        todas.push(...asesorias);
        if (!meta || pagina >= meta.last_page) break;
    }
    return todas;
};

// Botón "Mi horario" que abre un modal con la semana del asesor: cada horario que ofrece aparece "Disponible" u "Ocupado" (si tiene una asesoría en curso
// en ese día y horario). Solo para ver: "Info" abre la asesoría. Refleja lo que está guardado, no los cambios sin guardar.
// horarios = [{ dia: 'miercoles', horarioId }], slots = catálogo de horarios [{ id, etiqueta }], dias = [{ valor, etiqueta }]
export default function HorarioSemanal({ horarios, slots, dias, showToast }) {
    const [asesorias, setAsesorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [abierta, setAbierta] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const cargar = useCallback(async () => {
        try {
            setAsesorias(await traerTodasEnCurso());
            setError(false);
        } catch (err) {
            console.error('Error al cargar las asesorías del horario', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    // Se carga al abrir el modal (así siempre está al día)
    const abrirModal = () => {
        setModalOpen(true);
        cargar();
    };

    // Si llega un aviso (por ejemplo, una asesoría nueva) o se vuelve a la app, se actualiza solo con el modal abierto
    useRefrescoPorAvisos(() => {
        if (modalOpen) cargar();
    });

    // Una asesoría ocupa el día de la semana de su fecha de inicio y su horario
    const ocupadas = useMemo(() => {
        const mapa = new Map();
        asesorias.forEach((a) => mapa.set(`${diaDeFecha(a.fecha_inicio)}-${a.id_horario}`, a));
        return mapa;
    }, [asesorias]);

    // Por día: lo que ofrece más lo que está ocupado (aunque ya no lo ofrezca), en orden de horario
    const filasPorDia = useMemo(() => {
        const etiquetas = new Map(slots.map((s) => [s.id, s.etiqueta]));
        return dias
            .map((dia) => {
                const ids = new Set(horarios.filter((h) => h.dia === dia.valor).map((h) => h.horarioId));
                ocupadas.forEach((_, k) => {
                    const [d, id] = k.split('-');
                    if (d === dia.valor) ids.add(Number(id));
                });
                const filas = [...ids]
                    .sort((a, b) => a - b)
                    .map((id) => ({
                        id,
                        etiqueta: etiquetas.get(id) ?? `Horario ${id}`,
                        asesoria: ocupadas.get(`${dia.valor}-${id}`) ?? null,
                    }));
                return { dia, filas };
            })
            .filter((d) => d.filas.length > 0);
    }, [dias, slots, horarios, ocupadas]);

    const guardarInfo = async (id, cambios) => {
        try {
            await editarAsesoria(id, cambios);
            showToast('Cambios aplicados correctamente', 'success');
            cargar();
            return true;
        } catch (err) {
            showToast(mensajesDeError(err)[0], 'error');
            return false;
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<CalendarViewWeekOutlinedIcon />}
                onClick={abrirModal}
                sx={{ textTransform: 'none', borderRadius: '5px', color: '#244B91', borderColor: '#244B91', fontWeight: 600 }}
            >
                Mi horario
            </Button>

            <Dialog
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                fullWidth
                maxWidth="sm"
                fullScreen={esCelular}
                scroll="paper"
            >
                <DialogTitle sx={{ pr: 6 }}>
                    <span className="block text-lg font-bold text-gray-900">Mi horario de la semana</span>
                    <span className="block text-sm font-normal text-gray-600">
                        Tus horarios libres y ocupados. Toca Info para ver la asesoría.
                    </span>
                    <IconButton
                        aria-label="Cerrar"
                        onClick={() => setModalOpen(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
            {loading ? (
                <div className="flex justify-center py-4">
                    <CircularProgress size={24} sx={{ color: '#244B91' }} />
                </div>
            ) : error ? (
                <p className="text-sm text-gray-600">
                    No se pudo cargar tu horario.{' '}
                    <button onClick={cargar} className="font-semibold text-blue-700 underline cursor-pointer">
                        Reintentar
                    </button>
                </p>
            ) : filasPorDia.length === 0 ? (
                <p className="text-sm italic text-gray-500">Aún no tienes horarios guardados.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {filasPorDia.map(({ dia, filas }) => (
                        <div key={dia.valor} className="flex flex-col gap-2">
                            <p className="text-sm font-bold text-gray-800">{dia.etiqueta}</p>
                            {filas.map((fila) => {
                                const a = fila.asesoria;
                                return (
                                    <div
                                        key={fila.id}
                                        className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900">{fila.etiqueta}</p>
                                            {a && (
                                                <p className="truncate text-xs text-gray-600">
                                                    {a.materia} · {a.estudiante}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            <span
                                                className="rounded-full px-3 py-1 text-xs font-semibold"
                                                style={
                                                    a
                                                        ? { color: '#B26A00', backgroundColor: '#FDEBD0' }
                                                        : { color: '#2E7D32', backgroundColor: '#E3F2E4' }
                                                }
                                            >
                                                {a ? 'Ocupado' : 'Disponible'}
                                            </span>
                                            {a && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<InfoOutlinedIcon />}
                                                    onClick={() => setAbierta(a)}
                                                    sx={{ textTransform: 'none', borderRadius: '5px', color: '#244B91', borderColor: '#244B91' }}
                                                >
                                                    Info
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setModalOpen(false)} sx={{ textTransform: 'none', color: '#555555' }}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            <ModalInfoAsesoria
                open={Boolean(abierta)}
                onClose={() => setAbierta(null)}
                data={abierta}
                onSave={guardarInfo}
                showToast={showToast}
            />
        </>
    );
}
