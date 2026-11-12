import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Badge, ButtonBase, CircularProgress, IconButton, Popover, useMediaQuery } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { tiempoRelativo } from '../../../Services/formatoFechas';
import {
  marcarNotificacionLeida,
  marcarTodasLeidas,
  destinoDe,
  traerNotificaciones,
} from '../../../Services/notificacionesService';

// Ícono y color de cada tipo (los mismos códigos de TIPOS en notificacionesService.js)
const AZUL = { color: '#244B91', fondo: '#E3EBF8' };
const VERDE = { color: '#2E7D32', fondo: '#E3F2E4' };
const ROJO = { color: '#C62828', fondo: '#FBE4E4' };
const NARANJA = { color: '#B26A00', fondo: '#FDEBD0' };

const ESTILO_TIPO = {
  'solicitud.nueva': { Icono: MarkEmailUnreadOutlinedIcon, ...AZUL },
  'solicitud.aceptada': { Icono: CheckCircleOutlinedIcon, ...VERDE },
  'solicitud.rechazada': { Icono: HighlightOffIcon, ...ROJO },
  'solicitud.rechazada_por_cupo': { Icono: EventBusyIcon, ...NARANJA },
  'solicitud.cancelada': { Icono: CancelOutlinedIcon, ...NARANJA },
  'solicitud.editada': { Icono: EditOutlinedIcon, ...AZUL },

  'asesoria.creada': { Icono: EventAvailableIcon, ...VERDE },
  'asesoria.editada': { Icono: EditCalendarOutlinedIcon, ...AZUL },
  'asesoria.completada': { Icono: TaskAltIcon, ...VERDE },
  'asesoria.cancelada': { Icono: EventBusyIcon, ...ROJO },
  'sesion.registrada': { Icono: EventNoteIcon, ...AZUL },
  'material.subido': { Icono: AttachFileIcon, ...AZUL },
  'chat.mensaje': { Icono: ChatBubbleOutlinedIcon, ...AZUL },
};
const ESTILO_DEFECTO = { Icono: NotificationsNoneIcon, color: '#5f6b7a', fondo: '#ECEFF3' };

const CADA_MS = 30000;

// Campanita con la lista de avisos del usuario (estudiante o asesor).
// La cabecera del celular y la franja del escritorio son dos lugares distintos: "soloEn" decide
// en cuál se dibuja, así solo hay una campanita montada (y una sola consulta cada 30 s).
export default function CampanaNotificaciones({ soloEn, color = 'inherit' }) {
  const esEscritorio = useMediaQuery('(min-width:1024px)', { noSsr: true });

  if ((soloEn === 'escritorio') !== esEscritorio) return null;

  return <Campana color={color} />;
}

function Campana({ color }) {
  const navigate = useNavigate();
  const { rol, roles, cambiarRol } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [items, setItems] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [ultimaPagina, setUltimaPagina] = useState(1);
  const [cargandoMas, setCargandoMas] = useState(false);

  const abierto = Boolean(anchorEl);

  // Aplica la primera página de la consulta al estado
  const aplicarPrimera = useCallback((r) => {
    setItems(r.notificaciones);
    setNoLeidas(r.noLeidas);
    setPagina(1);
    setUltimaPagina(r.ultimaPagina);
  }, []);

  // Consulta cada 30 s mientras la lista está cerrada y la pestaña a la vista.
  // Abierta no se refresca sola: así no pisa lo que ya cargaste con "Ver más".
  // Si falla (sin conexión, sesión vencida), se queda con lo que ya tenía.
  useEffect(() => {
    if (abierto) return undefined;

    let vigente = true;
    const consultar = () =>
      traerNotificaciones(1)
        .then((r) => vigente && aplicarPrimera(r))
        .catch(() => {});

    consultar();
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') consultar();
    }, CADA_MS);

    return () => {
      vigente = false;
      clearInterval(id);
    };
  }, [abierto, aplicarPrimera]);

  // Al abrir se trae lo más reciente en ese momento
  const handleAbrir = (e) => {
    setAnchorEl(e.currentTarget);
    traerNotificaciones(1).then(aplicarPrimera).catch(() => {});
  };
  const handleCerrar = () => setAnchorEl(null);

  const abrirNotificacion = (n) => {
    handleCerrar();

    // Se marca de inmediato en pantalla; si el servidor falla, la siguiente consulta lo corrige
    if (!n.leida) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, leida: true } : x)));
      setNoLeidas((c) => Math.max(0, c - 1));
      marcarNotificacionLeida(n.id).catch(() => {});
    }

    const destino = destinoDe(n);
    if (!destino) return;

    // Un asesor par puede recibir un aviso del otro rol: se cambia de pantalla antes de ir
    if (destino.rol !== rol && roles.includes(destino.rol)) cambiarRol(destino.rol);
    navigate(destino.ruta);
  };

  const marcarTodas = async () => {
    try {
      await marcarTodasLeidas();
      setItems((prev) => prev.map((x) => ({ ...x, leida: true })));
      setNoLeidas(0);
    } catch {
      /* se reintenta al volver a tocar el botón */
    }
  };

  const cargarMas = async () => {
    setCargandoMas(true);
    try {
      const r = await traerNotificaciones(pagina + 1);
      setItems((prev) => [...prev, ...r.notificaciones]);
      setPagina((p) => p + 1);
      setUltimaPagina(r.ultimaPagina);
      setNoLeidas(r.noLeidas);
    } catch {
      /* el botón sigue ahí para reintentar */
    } finally {
      setCargandoMas(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleAbrir}
        aria-label={noLeidas > 0 ? `Notificaciones, ${noLeidas} sin leer` : 'Notificaciones'}
        aria-haspopup="true"
        aria-expanded={abierto ? 'true' : undefined}
        sx={{ color }}
      >
        <Badge badgeContent={noLeidas} color="error" max={99}>
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>

      <Popover
        disableScrollLock
        open={abierto}
        anchorEl={anchorEl}
        onClose={handleCerrar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 'min(380px, calc(100vw - 24px))',
              maxHeight: '70vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22)',
            },
          },
        }}
      >
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-3">
          <p className="text-base font-bold text-[#08338F]">Notificaciones</p>
          {noLeidas > 0 && (
            <button
              type="button"
              onClick={marcarTodas}
              className="flex items-center gap-1 text-xs font-semibold text-[#244B91] hover:underline"
            >
              <DoneAllIcon sx={{ fontSize: 16 }} />
              Marcar todas como leídas
            </button>
          )}
        </div>

        <div className="overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-gray-500">
              <NotificationsNoneIcon sx={{ fontSize: 40, color: '#b8c2d1' }} />
              <p className="text-sm">No tienes notificaciones.</p>
            </div>
          ) : (
            items.map((n) => {
              const { Icono, color: colorIcono, fondo } = ESTILO_TIPO[n.tipo] ?? ESTILO_DEFECTO;

              return (
                <ButtonBase
                  key={n.id}
                  onClick={() => abrirNotificacion(n)}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    px: 2,
                    py: 1.5,
                    textAlign: 'left',
                    borderBottom: '1px solid #eef0f4',
                    bgcolor: n.leida ? '#fff' : '#EEF3FB',
                    '&:hover': { bgcolor: n.leida ? '#f6f7f9' : '#E3EBF8' },
                  }}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: fondo, color: colorIcono }}
                  >
                    <Icono sx={{ fontSize: 20 }} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm leading-tight text-gray-900 ${n.leida ? 'font-medium' : 'font-bold'}`}>
                      {n.titulo}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-gray-600">{n.mensaje}</span>
                    <span className="mt-1 block text-[11px] text-gray-400">{tiempoRelativo(n.fecha)}</span>
                  </span>

                  {!n.leida && (
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#244B91]" aria-label="Sin leer" />
                  )}
                </ButtonBase>
              );
            })
          )}

          {pagina < ultimaPagina && (
            <div className="flex justify-center p-2">
              <button
                type="button"
                onClick={cargarMas}
                disabled={cargandoMas}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold text-[#244B91] hover:bg-[#EEF3FB] disabled:opacity-60"
              >
                {cargandoMas && <CircularProgress size={14} />}
                Ver más
              </button>
            </div>
          )}
        </div>
      </Popover>
    </>
  );
}
