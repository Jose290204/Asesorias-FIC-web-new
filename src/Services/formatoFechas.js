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
