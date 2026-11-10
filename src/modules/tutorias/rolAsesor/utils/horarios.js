import dayjs from 'dayjs';

// dayjs().day() devuelve 0 (domingo) a 6 (sábado); la API usa estos valores sin acento
const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

// Día de la semana ("lunes"...) de una fecha 'AAAA-MM-DD' o de un objeto dayjs
export const diaDeFecha = (fecha) => DIAS_SEMANA[dayjs(fecha).day()];

// Un horario siempre va ligado a un día: la clave junta los dos ("lunes|5")
export const claveHorario = (dia, horarioId) => `${dia}|${horarioId}`;

// La disponibilidad del asesor trae los horarios agrupados por día:
// [{ dia: 'lunes', etiqueta: 'Lunes', horarios: [{ id, etiqueta }] }]
// Se aplana a una lista de opciones para un select: "Lunes · 11:00-12:00 PM"
export const opcionesDeHorario = (disponibilidad) =>
  (disponibilidad?.horarios ?? []).flatMap((grupo) =>
    grupo.horarios.map((h) => ({
      clave: claveHorario(grupo.dia, h.id),
      dia: grupo.dia,
      horarioId: h.id,
      etiqueta: `${grupo.etiqueta} · ${h.etiqueta}`,
    }))
  );

// Para que el calendario solo deje elegir fechas del día de la semana del horario elegido
export const fechaCoincideConDia = (fecha, dia) => Boolean(dia) && diaDeFecha(fecha) === dia;
