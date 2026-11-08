import { useCallback, useEffect, useRef, useState } from 'react';
import { enviarMensaje, marcarLeidos, traerMensajes } from '../Services/chatService';
import { mensajesDeError } from '../Services/errores';

// Cada cuántos milisegundos se pregunta por mensajes nuevos mientras el chat está abierto
const CADA_MS = 3000;

// Los mensajes recién escritos que el servidor aún no confirma llevan un id tipo "tmp-123"
const esTemporal = (mensaje) => typeof mensaje.id === 'string';

// Une los mensajes que ya hay con los recién llegados, sin repetir ninguno (se compara por id).
// Los temporales (enviando...) se quedan siempre al final.
const unir = (actuales, nuevos) => {
  const reales = actuales.filter((m) => !esTemporal(m));
  const pendientes = actuales.filter(esTemporal);
  const ids = new Set(reales.map((m) => m.id));
  const sinRepetir = nuevos.filter((m) => !ids.has(m.id));
  if (sinRepetir.length === 0) return actuales; // misma referencia: React no vuelve a pintar
  return [...reales, ...sinRepetir, ...pendientes];
};

// Lógica del chat de una asesoría (la comparten el modal del estudiante y el del asesor).
//  - asesoriaId: id de la asesoría
//  - abierto:    el modal está abierto (solo entonces se consulta)
//  - enCurso:    false = historial, solo lectura: se carga una vez y no se consulta más
//  - showToast:  para avisar si falla un envío
export default function useChatAsesoria({ asesoriaId, abierto, enCurso, showToast }) {
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState(null);
  const [leidosHasta, setLeidosHasta] = useState(0);
  const mensajesRef = useRef([]);

  useEffect(() => {
    mensajesRef.current = mensajes;
  }, [mensajes]);

  useEffect(() => {
    if (!abierto || !asesoriaId) return undefined;

    let vigente = true; // false al cerrar o cambiar de asesoría: se ignoran respuestas tardías
    let consultando = false; // evita dos consultas encimadas

    setMensajes([]);
    setErrorCarga(null);
    setCargando(true);
    setLeidosHasta(0);

    // Id del último mensaje confirmado por el servidor (los temporales no cuentan)
    const ultimoId = () => {
      const reales = mensajesRef.current.filter((m) => !esTemporal(m));
      return reales.length ? reales[reales.length - 1].id : null;
    };

    const consultar = async (primera) => {
      if (consultando) return;
      consultando = true;
      try {
        const respuesta = await traerMensajes(asesoriaId, primera ? null : ultimoId());
        const nuevos = respuesta.mensajes;
        if (!vigente) return;

        // Las palomitas dobles solo avanzan: una consulta atrasada no las quita
        setLeidosHasta((prev) => Math.max(prev, respuesta.leidosHasta));

        if (primera) setMensajes(nuevos);
        else if (nuevos.length) setMensajes((prev) => unir(prev, nuevos));
        setErrorCarga(null);

        // Si hay mensajes de la otra persona, se avisa que ya se vieron
        if (nuevos.some((m) => !m.propio)) marcarLeidos(asesoriaId).catch(() => {});
      } catch (error) {
        // Una consulta periódica que falla se ignora: la siguiente lo intenta de nuevo
        if (vigente && primera) setErrorCarga(mensajesDeError(error)[0]);
      } finally {
        consultando = false;
        if (vigente && primera) setCargando(false);
      }
    };

    consultar(true);

    // Solo se consulta con la pestaña a la vista (ahorra peticiones y batería en el celular)
    const intervalo = enCurso
      ? setInterval(() => {
          if (!document.hidden) consultar(false);
        }, CADA_MS)
      : null;

    const alVolver = () => {
      if (enCurso && !document.hidden) consultar(false);
    };
    document.addEventListener('visibilitychange', alVolver);

    return () => {
      vigente = false;
      if (intervalo) clearInterval(intervalo);
      document.removeEventListener('visibilitychange', alVolver);
    };
  }, [abierto, asesoriaId, enCurso]);

  // Envía un mensaje: aparece al instante (temporal) y se cambia por el real cuando el servidor responde.
  // Regresa true si se envió, false si falló (el temporal se quita para que el modal devuelva el texto).
  const enviar = useCallback(
    async (texto) => {
      const temporal = { id: `tmp-${Date.now()}`, texto, propio: true, fecha: new Date().toISOString() };
      setMensajes((prev) => [...prev, temporal]);

      try {
        const real = await enviarMensaje(asesoriaId, texto);
        // unir no repite: si la consulta periódica ya trajo este mensaje, solo se quita el temporal
        setMensajes((prev) => unir(prev.filter((m) => m.id !== temporal.id), [real]));
        return true;
      } catch (error) {
        setMensajes((prev) => prev.filter((m) => m.id !== temporal.id));
        if (showToast) showToast(mensajesDeError(error)[0], 'error');
        return false;
      }
    },
    [asesoriaId, showToast],
  );

  return { mensajes, cargando, errorCarga, leidosHasta, enviar };
}
