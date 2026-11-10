import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import { useCallback, useEffect, useState } from 'react';
import InputBuscar from '../../../../components/ui/InputBuscar';
import ToastNotification from '../../../../components/ui/ToastNotification';
import { mensajesDeError } from '../../../../Services/errores';
import {
  aceptarSolicitudAdmin,
  rechazarSolicitudAdmin,
  traerSolicitudesAdmin
} from '../../../../Services/solicitudesAdminService';
import { ETIQUETA_ESTATUS } from '../components/solicitudes/estatusSolicitud';
import TablaSolicitudes from '../components/solicitudes/TablaSolicitudes';

// Al entrar se muestran las pendientes: son las únicas que se pueden aceptar o rechazar
const ESTATUS_INICIAL = 'pendiente';

export default function Solicitudes() {
  // Lo que se escribe en el buscador, y el texto que ya se mandó a la API (con una pausa al escribir)
  const [busqueda, setBusqueda] = useState('');
  const [buscar, setBuscar] = useState('');

  // La API pagina de 10 en 10: "meta" trae la última página y el total
  const [pagina, setPagina] = useState(1);
  const [meta, setMeta] = useState(null);

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Estatus elegido en el select ("" = todas)
  const [estatus, setEstatus] = useState(ESTATUS_INICIAL);

  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ open: true, message, type });
  }, []);

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Al dejar de escribir 400 ms se busca en la API y se vuelve a la página 1
  useEffect(() => {
    const temporizador = setTimeout(() => {
      setBuscar(busqueda.trim());
      setPagina(1);
    }, 400);

    return () => clearTimeout(temporizador);
  }, [busqueda]);

  // silencioso = recarga sin quitar la lista (se usa después de aceptar o rechazar)
  const cargarSolicitudes = useCallback(async ({ silencioso = false } = {}) => {
    try {
      if (!silencioso) setCargando(true);
      setError(false);

      const { solicitudes: lista, meta: metaNueva } = await traerSolicitudesAdmin({
        buscar,
        page: pagina,
        estatus
      });

      // Si se atendió la última solicitud de esta página, la página queda vacía:
      // se regresa a la anterior (el efecto de abajo vuelve a cargar solo)
      if (lista.length === 0 && pagina > 1) {
        setPagina(pagina - 1);
        return;
      }

      setSolicitudes(lista);
      setMeta(metaNueva);
    } catch (err) {
      console.error('Error al obtener las solicitudes:', err);
      if (!silencioso) {
        setError(true);
        showToast(mensajesDeError(err)[0], 'error');
      }
    } finally {
      setCargando(false);
    }
  }, [buscar, pagina, estatus, showToast]);

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  // Las acciones regresan true si salió bien (el modal se cierra) y false si falló (el modal sigue abierto).
  // Aquí caen los errores de la API, por ejemplo 409 solicitud_no_pendiente u horario_ocupado.
  const ejecutar = async (accion, mensajeExito) => {
    try {
      await accion();
      showToast(mensajeExito, 'success');
      cargarSolicitudes({ silencioso: true });
      return true;
    } catch (err) {
      showToast(mensajesDeError(err)[0], 'error');
      // Si ya la respondió otra persona, se recarga para que la lista refleje el estado real
      cargarSolicitudes({ silencioso: true });
      return false;
    }
  };

  const handleAceptar = (solicitud) =>
    ejecutar(() => aceptarSolicitudAdmin(solicitud.id), 'Solicitud aceptada: se creó la asesoría');

  const handleRechazar = (solicitud, motivo) =>
    ejecutar(() => rechazarSolicitudAdmin(solicitud.id, motivo), 'Solicitud rechazada');

  // Al cambiar el estatus se vuelve a la página 1
  const handleCambiarEstatus = (e) => {
    setEstatus(e.target.value);
    setPagina(1);
  };

  const hayFiltros = estatus !== ESTATUS_INICIAL;
  const total = meta?.total ?? solicitudes.length;

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-transparent px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
      <p className="text-2xl font-bold">Solicitudes</p>

      {/* Barra de herramientas: en celular el filtro va arriba y el buscador abajo */}
      <div className="w-full flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
        <TextField
          select
          size="small"
          label="Estatus"
          value={estatus}
          onChange={handleCambiarEstatus}
          sx={{ width: { xs: '100%', sm: 200 }, flexShrink: 0, backgroundColor: '#FFFFFF' }}
          slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
        >
          <MenuItem value="">
            <em>Todas</em>
          </MenuItem>
          {Object.entries(ETIQUETA_ESTATUS).map(([valor, etiqueta]) => (
            <MenuItem key={valor} value={valor}>
              {etiqueta}
            </MenuItem>
          ))}
        </TextField>

        <div className="w-full min-w-0 sm:flex-1">
          <InputBuscar
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por estudiante o asesor..."
          />
        </div>
      </div>

      {/* Leyenda de resultados */}
      {!cargando && !error && (
        <p className="-mt-3 text-sm text-gray-600 md:-mt-4">
          {total} {total === 1 ? 'solicitud' : 'solicitudes'}
          {buscar || hayFiltros ? ' encontradas' : ' pendientes'}
        </p>
      )}

      <div className="w-full flex flex-1 flex-col pb-5">
        {cargando ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
            <CircularProgress sx={{ color: '#244B91' }} />
            <p className="text-sm text-gray-600">Cargando solicitudes...</p>
          </div>
        ) : error ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
            <p className="text-sm text-gray-600">No se pudieron cargar las solicitudes.</p>
            <Button
              variant="contained"
              size="small"
              onClick={() => cargarSolicitudes()}
              sx={{ textTransform: 'none', borderRadius: '5px', backgroundColor: '#244B91' }}
            >
              Reintentar
            </Button>
          </div>
        ) : (
          <>
            <TablaSolicitudes
              rows={solicitudes}
              onAceptar={handleAceptar}
              onRechazar={handleRechazar}
            />

            {/* Paginación: solo aparece si hay más de una página */}
            {meta && meta.last_page > 1 && (
              <div className="mt-6 flex w-full justify-center">
                <Pagination
                  count={meta.last_page}
                  page={pagina}
                  onChange={(_, nueva) => setPagina(nueva)}
                />
              </div>
            )}
          </>
        )}
      </div>

      <ToastNotification
        open={toast.open}
        onClose={handleCloseToast}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}
