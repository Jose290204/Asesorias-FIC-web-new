import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { traerDiasInhabiles } from '../../../Services/diasInhabilesService';

const FORMATO = 'YYYY-MM-DD';
const VIGENCIA_MS = 10 * 60 * 1000; // el calendario casi no cambia: se consulta una vez cada 10 min

// El inhábil que cubre esa fecha (dayjs) dentro de una lista de rangos, o null
export const buscarInhabil = (rangos, fecha) => {
  const f = fecha.format(FORMATO);
  return rangos.find((r) => r.fecha_inicio <= f && f <= r.fecha_fin) ?? null;
};

// Una sola consulta compartida por todos los selectores de fecha. Cubre desde hace 4 meses (el asesor puede
// registrar asesorías que ya empezaron) hasta 9 meses adelante.
let cache = null; // { cuando, promesa }

const cargarRangos = () => {
  if (cache && Date.now() - cache.cuando < VIGENCIA_MS) return cache.promesa;

  const hoy = dayjs();
  const promesa = traerDiasInhabiles({
    desde: hoy.subtract(120, 'day').format(FORMATO),
    hasta: hoy.add(270, 'day').format(FORMATO),
  });
  cache = { cuando: Date.now(), promesa };
  // Si falla no se guarda: el siguiente selector que se abra lo intenta otra vez
  promesa.catch(() => {
    if (cache?.promesa === promesa) cache = null;
  });
  return promesa;
};

// Para los DatePicker: shouldDisableDate={(f) => ... || esInhabil(f)}
// Si la consulta falla, no se deshabilita nada (el backend igual rechaza esos días).
export const useDiasInhabiles = () => {
  const [rangos, setRangos] = useState([]);

  useEffect(() => {
    let vigente = true;
    cargarRangos()
      .then((r) => vigente && setRangos(r))
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, []);

  const esInhabil = useCallback((fecha) => Boolean(buscarInhabil(rangos, fecha)), [rangos]);

  return { esInhabil, rangos };
};
