import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Días que cubre la consulta (el backend acepta hasta 62)
export const DIAS_CONSULTA = 62;

export const FORMATO_FECHA = 'YYYY-MM-DD';

// Inicio y fin de una sesión como fechas con hora. Si la hora de fin no es mayor (12:00 AM = medianoche),
// termina al día siguiente.
export const inicioDe = (s) => dayjs(`${s.fecha}T${s.hora_inicio}`);
export const finDe = (s) => {
  const fin = dayjs(`${s.fecha}T${s.hora_fin}`);
  return s.hora_fin <= s.hora_inicio ? fin.add(1, 'day') : fin;
};

// 'futura' | 'en_curso' | 'terminada' según la hora actual
export const estadoDe = (s, ahora) => {
  if (ahora.isAfter(finDe(s))) return 'terminada';
  if (!ahora.isBefore(inicioDe(s))) return 'en_curso';
  return 'futura';
};

const mayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

// "Miércoles 2 de diciembre"
export const fechaLarga = (fecha) => mayuscula(dayjs(fecha).locale('es').format('dddd D [de] MMMM'));

// Cuenta regresiva por días de calendario: "Hoy · empieza en 2 h", "Mañana", "Faltan 3 días"
export const cuentaRegresiva = (s, ahora) => {
  const estado = estadoDe(s, ahora);
  if (estado === 'terminada') return 'Terminó';
  if (estado === 'en_curso') return 'En curso ahora';

  const dias = dayjs(s.fecha).startOf('day').diff(ahora.startOf('day'), 'day');
  if (dias === 0) {
    const minutos = Math.max(1, inicioDe(s).diff(ahora, 'minute'));
    if (minutos < 60) return `Hoy · empieza en ${minutos} min`;
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `Hoy · empieza en ${h} h${m ? ` ${m} min` : ''}`;
  }
  if (dias === 1) return 'Mañana';
  return `Faltan ${dias} días`;
};

// Encabezado de cada día de la agenda: "Hoy", "Mañana" o "Miércoles 2 de diciembre"
export const etiquetaDiaAgenda = (fecha, ahora) => {
  const dias = dayjs(fecha).startOf('day').diff(ahora.startOf('day'), 'day');
  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Mañana';
  return fechaLarga(fecha);
};
