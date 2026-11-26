import { useEffect, useRef } from 'react';

// Nombre del evento que lanza la campanita cuando llega un aviso nuevo
export const EVENTO_AVISOS = 'avisos:nuevos';

// Cada cuánto se recarga la vista por su cuenta, aunque no llegue ningún aviso
const CADA_MS = 15000;

// Recarga una vista (en silencio) cuando llega un aviso nuevo, al volver a la app y cada 15 s
// mientras esté a la vista. Así no hace falta salir y entrar de la pantalla para ver lo nuevo.
// "recargar" debe ser la función de carga silenciosa de la vista; no hace falta que sea estable.
export default function useRefrescoPorAvisos(recargar, cadaMs = CADA_MS) {
  const ref = useRef(recargar);

  useEffect(() => {
    ref.current = recargar;
  });

  useEffect(() => {
    const ejecutar = () => ref.current?.();
    const alVolver = () => {
      if (document.visibilityState === 'visible') ejecutar();
    };

    window.addEventListener(EVENTO_AVISOS, ejecutar);
    document.addEventListener('visibilitychange', alVolver);
    window.addEventListener('focus', alVolver);
    const id = setInterval(alVolver, cadaMs);

    return () => {
      window.removeEventListener(EVENTO_AVISOS, ejecutar);
      document.removeEventListener('visibilitychange', alVolver);
      window.removeEventListener('focus', alVolver);
      clearInterval(id);
    };
  }, [cadaMs]);
}
