import { CircularProgress, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import { activarPush, desactivarPush, estadoPush } from '../../../Services/pushService';

// Interruptor "Avisos en este dispositivo" (va dentro del menú de la campana).
// Si el dispositivo no puede recibir push, explica por qué en vez de mostrar el interruptor.
export default function AvisosPush() {
  const [estado, setEstado] = useState(null); // null = consultando
  const [trabajando, setTrabajando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    estadoPush()
      .then((e) => vigente && setEstado(e))
      .catch(() => vigente && setEstado('no_soportado'));
    return () => {
      vigente = false;
    };
  }, []);

  if (estado === null || estado === 'no_soportado') return null;

  const alternar = async () => {
    setError('');
    setTrabajando(true);
    try {
      if (estado === 'activo') await desactivarPush();
      else await activarPush();
      setEstado(await estadoPush());
    } catch (e) {
      setEstado(await estadoPush().catch(() => 'inactivo'));
      const estatus = e?.response?.status;
      if (e?.message === 'permiso_denegado') setError('No se concedió el permiso de notificaciones.');
      else if (estatus) setError(`El servidor respondió ${estatus}${e.response?.data?.message ? `: ${e.response.data.message}` : ''}.`);
      else setError(`No se pudieron activar los avisos: ${e?.message ?? 'error desconocido'}.`);
    } finally {
      setTrabajando(false);
    }
  };

  let ayuda = null;
  if (estado === 'requiere_instalar') {
    ayuda = 'Para recibir avisos en tu iPhone, instala la app: Compartir → Agregar a pantalla de inicio.';
  } else if (estado === 'denegado') {
    ayuda = 'Bloqueaste los avisos. Actívalos desde los ajustes del navegador para este sitio.';
  }

  return (
    <div className="border-b border-gray-200 bg-[#F5F8FD] px-4 py-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-[#244B91]">Avisos en este dispositivo</p>
          <p className="text-[11px] text-gray-500">Recíbelos aunque tengas la app cerrada.</p>
        </div>
        {trabajando ? (
          <CircularProgress size={20} />
        ) : (
          <Switch
            size="small"
            checked={estado === 'activo'}
            onChange={alternar}
            disabled={Boolean(ayuda)}
            inputProps={{ 'aria-label': 'Avisos en este dispositivo' }}
          />
        )}
      </div>
      {ayuda && <p className="mt-1 text-[11px] text-gray-600">{ayuda}</p>}
      {error && <p className="mt-1 text-[11px] text-red-700">{error}</p>}
    </div>
  );
}
