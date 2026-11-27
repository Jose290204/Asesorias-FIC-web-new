import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Badge, Button, Chip, CircularProgress, Tooltip, Typography } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickerDay } from '@mui/x-date-pickers/PickerDay';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ToastNotification from '../../../components/ui/ToastNotification';
import TituloVista from '../../../components/ui/TituloVista';
import useRefrescoPorAvisos from '../../../hooks/useRefrescoPorAvisos';
import { traerCalendario } from '../../../Services/calendarioService';
import { buscarInhabil } from './diasInhabiles';
import { mensajesDeError } from '../../../Services/errores';
import { conTiempoMinimo, MINIMO_CARGA_MS } from '../../../utils/tiempoMinimo';
import {
    cuentaRegresiva,
    DIAS_CONSULTA,
    estadoDe,
    etiquetaDiaAgenda,
    fechaLarga,
    FORMATO_FECHA,
} from './calendarioUtils';

const COLOR_ESTADO = {
    futura: { color: '#244B91', fondo: '#E8EEF9' },
    en_curso: { color: '#2E7D32', fondo: '#E8F5E9' },
    terminada: { color: '#6B7280', fondo: '#F3F4F6' },
};

// Día del calendario con un punto dorado si ese día hay sesión
function DiaMarcado({ day, outsideCurrentMonth, diasConSesion, ...resto }) {
    const marcado = !outsideCurrentMonth && Boolean(diasConSesion?.has(day.format(FORMATO_FECHA)));
    return (
        <Badge
            overlap="circular"
            variant="dot"
            invisible={!marcado}
            sx={{ '& .MuiBadge-badge': { backgroundColor: '#d4b03c' } }}
        >
            <PickerDay {...resto} day={day} outsideCurrentMonth={outsideCurrentMonth} />
        </Badge>
    );
}

// Tarjeta destacada con la siguiente sesión
function TarjetaProxima({ sesion, ahora, etiquetaOtro }) {
    return (
        <div
            className="w-full rounded-2xl p-5 md:p-6 text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #2a529b 0%, #244B91 55%, #162f66 100%)' }}
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#f3d77a]">Próxima sesión</span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                    {cuentaRegresiva(sesion, ahora)}
                </span>
            </div>

            <h2 className="mt-2 text-xl font-bold md:text-2xl">{sesion.materia}</h2>

            <div className="mt-3 flex flex-col gap-1.5 text-sm text-blue-50">
                <span className="flex items-center gap-2">
                    <EventAvailableOutlinedIcon fontSize="small" />
                    {fechaLarga(sesion.fecha)}
                </span>
                <span className="flex items-center gap-2">
                    <AccessTimeOutlinedIcon fontSize="small" />
                    {sesion.horario} · {sesion.modalidad}
                </span>
                <span className="flex items-center gap-2">
                    <PersonOutlinedIcon fontSize="small" />
                    {etiquetaOtro}: {sesion.con}
                </span>
            </div>
        </div>
    );
}

// Una sesión dentro de la agenda
function FilaSesion({ sesion, ahora, etiquetaOtro }) {
    const estado = estadoDe(sesion, ahora);
    const estilo = COLOR_ESTADO[estado];

    return (
        <div
            className="flex w-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            style={{ borderLeft: `5px solid ${estilo.color}`, opacity: estado === 'terminada' ? 0.7 : 1 }}
        >
            <div className="flex flex-wrap items-start justify-between gap-2">
                <Typography sx={{ fontWeight: 700, color: '#08338F', fontSize: 16 }}>{sesion.materia}</Typography>
                <Chip
                    size="small"
                    label={cuentaRegresiva(sesion, ahora)}
                    sx={{ fontWeight: 600, color: estilo.color, backgroundColor: estilo.fondo }}
                />
            </div>

            <div className="flex flex-col gap-1 text-sm text-gray-700">
                <span className="flex items-center gap-2">
                    <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                    {sesion.horario} · {sesion.modalidad}
                </span>
                <span className="flex items-center gap-2">
                    <PersonOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                    {etiquetaOtro}: {sesion.con}
                </span>
                {sesion.registrada && (
                    <Tooltip title="Ya se registró la sesión de este día">
                        <span className="flex items-center gap-2 text-green-700">
                            <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />
                            Sesión registrada
                        </span>
                    </Tooltip>
                )}
            </div>
        </div>
    );
}

// Calendario de sesiones programadas. Lo usan el estudiante y el asesor ("como").
// No hay sesiones agendadas en la base de datos: la API repite cada semana las asesorías en curso
// (mismo día y horario de su fecha de inicio) hasta el fin del ciclo.
export default function CalendarioSesiones({ como }) {
    const etiquetaOtro = como === 'asesor' ? 'Estudiante' : 'Asesor';

    const [sesiones, setSesiones] = useState([]);
    const [inhabiles, setInhabiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [ahora, setAhora] = useState(() => dayjs());
    const [diaElegido, setDiaElegido] = useState(null);
    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    // La cuenta regresiva se actualiza sola cada 30 s
    useEffect(() => {
        const id = setInterval(() => setAhora(dayjs()), 30000);
        return () => clearInterval(id);
    }, []);

    const cargar = useCallback(async ({ silencioso = false } = {}) => {
        try {
            if (!silencioso) setLoading(true);
            setError(false);
            const hoy = dayjs();
            const datos = await conTiempoMinimo(
                traerCalendario({
                    como,
                    desde: hoy.format(FORMATO_FECHA),
                    hasta: hoy.add(DIAS_CONSULTA, 'day').format(FORMATO_FECHA),
                }),
                silencioso ? 0 : MINIMO_CARGA_MS
            );
            setSesiones(datos.sesiones);
            setInhabiles(datos.inhabiles);
            setAhora(dayjs());
        } catch (err) {
            console.error('Error al cargar el calendario', err);
            if (!silencioso) setError(true);
            setToast({ open: true, message: mensajesDeError(err)[0], type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [como]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargar();
    }, [cargar]);

    // Si llega un aviso (por ejemplo, una asesoría nueva) o se vuelve a la app, se actualiza solo
    useRefrescoPorAvisos(() => cargar({ silencioso: true }));

    // Solo la SIGUIENTE sesión de cada asesoría en curso (no toda la serie de semanas): así nadie cree
    // que tiene que cumplir todas las fechas al pie de la letra. Cuando pasa la fecha y la asesoría
    // sigue en curso, la sesión se recorre sola a la semana siguiente. La API ya manda las sesiones
    // ordenadas por fecha y hora, así que la primera que no ha terminado de cada asesoría es la que toca.
    const vigentes = useMemo(() => {
        const vistas = new Set();
        return sesiones.filter((s) => {
            if (estadoDe(s, ahora) === 'terminada' || vistas.has(s.asesoria_id)) return false;
            vistas.add(s.asesoria_id);
            return true;
        });
    }, [sesiones, ahora]);
    const proxima = vigentes[0] ?? null;

    // Los próximos días sin asesorías (que no hayan terminado), para explicar por qué están en gris
    const proximosInhabiles = useMemo(
        () => inhabiles.filter((r) => !dayjs(r.fecha_fin).isBefore(ahora, 'day')).slice(0, 3),
        [inhabiles, ahora]
    );

    const diasConSesion = useMemo(() => new Set(vigentes.map((s) => s.fecha)), [vigentes]);

    // Agenda agrupada por día: todas las pendientes, o solo las del día elegido en el calendario
    const grupos = useMemo(() => {
        const base = diaElegido ? vigentes.filter((s) => s.fecha === diaElegido) : vigentes;
        const mapa = new Map();
        base.forEach((s) => {
            if (!mapa.has(s.fecha)) mapa.set(s.fecha, []);
            mapa.get(s.fecha).push(s);
        });
        return [...mapa.entries()];
    }, [vigentes, diaElegido]);

    const subtitulo = loading
        ? null
        : error
          ? ''
          : vigentes.length === 0
            ? 'Sin sesiones pendientes'
            : `${vigentes.length} ${vigentes.length === 1 ? 'sesión pendiente' : 'sesiones pendientes'}`;

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full px-4 md:px-17 py-6 md:py-10 flex flex-col items-start justify-start gap-6 md:gap-8 bg-transparent">
            <TituloVista titulo="Calendario de sesiones" subtitulo={subtitulo} />

            {loading ? (
                <div className="w-full min-h-[40vh] flex flex-col items-center justify-center gap-3">
                    <CircularProgress />
                    <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>Cargando calendario...</Typography>
                </div>
            ) : error ? (
                <div className="w-full text-center py-10">
                    <Typography sx={{ color: 'text.secondary', mb: 1 }}>No se pudo cargar el calendario.</Typography>
                    <button onClick={() => cargar()} className="text-blue-700 font-semibold underline cursor-pointer">
                        Reintentar
                    </button>
                </div>
            ) : vigentes.length === 0 ? (
                <div className="w-full rounded-xl border border-dashed border-gray-300 bg-white/60 p-8 text-center">
                    <EventAvailableOutlinedIcon sx={{ fontSize: 40, color: '#9CA3AF' }} />
                    <Typography sx={{ mt: 1, color: '#4B5563', fontWeight: 600 }}>
                        No tienes sesiones pendientes.
                    </Typography>
                    <Typography sx={{ color: '#6B7280', fontSize: 14 }}>
                        Aquí aparece la siguiente sesión de cada asesoría que tengas en curso.
                    </Typography>
                </div>
            ) : (
                <>
                    {proxima && <TarjetaProxima sesion={proxima} ahora={ahora} etiquetaOtro={etiquetaOtro} />}

                    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-[340px_1fr] md:items-start">
                        {/* Calendario del mes (en celular va arriba de la agenda, a lo ancho) */}
                        <div className="w-full rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                <DateCalendar
                                    sx={{ width: '100%', maxWidth: 360, mx: 'auto' }}
                                    value={diaElegido ? dayjs(diaElegido) : null}
                                    onChange={(valor) => setDiaElegido(valor ? valor.format(FORMATO_FECHA) : null)}
                                    shouldDisableDate={(d) => Boolean(buscarInhabil(inhabiles, d))}
                                    minDate={dayjs().startOf('day')}
                                    maxDate={dayjs().add(DIAS_CONSULTA, 'day')}
                                    slots={{ day: DiaMarcado }}
                                    slotProps={{ day: { diasConSesion } }}
                                />
                            </LocalizationProvider>
                            <p className="px-3 pb-2 text-xs text-gray-500">
                                El punto dorado marca la siguiente sesión de cada asesoría. Si pasa la fecha y la asesoría sigue en curso, se recorre a la semana siguiente.
                            </p>
                            {proximosInhabiles.length > 0 && (
                                <div className="px-3 pb-2 text-xs text-gray-500">
                                    <p className="font-semibold text-gray-600">Días sin asesorías (en gris en el calendario):</p>
                                    <ul className="mt-1 list-disc pl-4">
                                        {proximosInhabiles.map((r) => (
                                            <li key={`${r.fecha_inicio}-${r.fecha_fin}`}>
                                                {r.fecha_inicio === r.fecha_fin
                                                    ? dayjs(r.fecha_inicio).locale('es').format('D [de] MMMM')
                                                    : `${dayjs(r.fecha_inicio).locale('es').format('D MMM')} al ${dayjs(r.fecha_fin).locale('es').format('D MMM')}`}
                                                : {r.motivo}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Agenda por día */}
                        <div className="flex w-full flex-col gap-5">
                            {diaElegido && (
                                <div className="flex items-center justify-between gap-2">
                                    <Typography sx={{ fontWeight: 600, color: '#08338F' }}>
                                        {fechaLarga(diaElegido)}
                                    </Typography>
                                    <Button size="small" onClick={() => setDiaElegido(null)} sx={{ textTransform: 'none' }}>
                                        Ver todas
                                    </Button>
                                </div>
                            )}

                            {grupos.length === 0 ? (
                                <Typography sx={{ color: '#6B7280' }}>No tienes sesiones ese día.</Typography>
                            ) : (
                                grupos.map(([fecha, lista]) => (
                                    <section key={fecha} className="flex flex-col gap-2">
                                        {!diaElegido && (
                                            <h3 className="text-sm font-bold uppercase tracking-wide text-[#244B91]">
                                                {etiquetaDiaAgenda(fecha, ahora)}
                                            </h3>
                                        )}
                                        {lista.map((s) => (
                                            <FilaSesion
                                                key={`${s.asesoria_id}-${s.fecha}`}
                                                sesion={s}
                                                ahora={ahora}
                                                etiquetaOtro={etiquetaOtro}
                                            />
                                        ))}
                                    </section>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}

            <ToastNotification
                open={toast.open}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}
