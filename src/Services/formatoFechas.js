const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// "2026-11-09" -> "09/NOV/2026". Se parte el texto (sin usar Date) para evitar desfases de zona horaria.
export const formatearFechaVisible = (fecha) => {
  if (!fecha) return '';
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${MESES[Number(mes) - 1]}/${anio}`;
};

// "2026-11-09" -> "Lunes". Se arma la fecha con año, mes y día (sin zona horaria) para que no se corra un día.
export const etiquetaDia = (fecha) => {
  if (!fecha) return '';
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return DIAS[new Date(anio, mes - 1, dia).getDay()];
};

// "2026-11-11T20:15:00-07:00" -> "hace 5 min", "hace 3 h", "ayer" o "09/NOV/2026" (ya con la hora local del navegador).
export const tiempoRelativo = (iso) => {
  if (!iso) return '';
  const fecha = new Date(iso);
  const minutos = Math.floor((Date.now() - fecha.getTime()) / 60000);

  if (minutos < 1) return 'ahora';
  if (minutos < 60) return `hace ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;

  const dias = Math.floor(horas / 24);
  if (dias === 1) return 'ayer';
  if (dias < 7) return `hace ${dias} días`;

  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  return formatearFechaVisible(`${fecha.getFullYear()}-${mes}-${String(fecha.getDate()).padStart(2, '0')}`);
};
