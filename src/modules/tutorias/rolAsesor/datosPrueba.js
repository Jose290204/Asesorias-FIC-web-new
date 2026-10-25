// Interruptor: true = muestra datos falsos, false = usa el backend real
export const USAR_DATOS_PRUEBA = true;

// ---------------------------------------------------------------------------
// SOLICITUDES PENDIENTES (forma que usa TarjetaSolicitudesPendientes)
// ---------------------------------------------------------------------------
export const SOLICITUDES_PRUEBA = [
  {
    id_solicitud: 1,
    id_estudiante: 101,
    id_asesor: 1,
    id_materia: 11,
    nombre_estudiante: 'Alexander Israel Barrera Rodriguez',
    correo: 'ai.barrera@info.uas.edu.mx',
    materia: 'Introducción a la programación',
    fecha_inicio: '2026-11-03T00:00:00.000Z',
    horario: '13:00 - 14:00',
    modalidad: 'Presencial',
  },
  {
    id_solicitud: 2,
    id_estudiante: 102,
    id_asesor: 1,
    id_materia: 12,
    nombre_estudiante: 'Jenifer Guadalupe Tizoc Lopez',
    correo: 'jg.tizoc@info.uas.edu.mx',
    materia: 'Estructuras de datos',
    fecha_inicio: '2026-11-04T00:00:00.000Z',
    horario: '10:00 - 11:00',
    modalidad: 'Virtual',
  },
  {
    id_solicitud: 3,
    id_estudiante: 103,
    id_asesor: 1,
    id_materia: 13,
    nombre_estudiante: 'Luis Fernando Velazquez Araujo',
    correo: 'lf.velazquez@info.uas.edu.mx',
    materia: 'Análisis y diseño de sistemas de información orientados a objetos',
    fecha_inicio: '2026-11-05T00:00:00.000Z',
    horario: '16:00 - 17:00',
    modalidad: 'Presencial',
  },
  {
    id_solicitud: 4,
    id_estudiante: 104,
    id_asesor: 1,
    id_materia: 14,
    nombre_estudiante: 'María de los Ángeles Hernández Villaseñor de la Rocha',
    correo: 'ma.hernandez.villasenor.delarocha@info.uas.edu.mx',
    materia: 'Cálculo diferencial',
    fecha_inicio: '2026-11-06T00:00:00.000Z',
    horario: '09:00 - 10:00',
    modalidad: 'Virtual',
  },
];

// ---------------------------------------------------------------------------
// ASESORÍAS EN CURSO (forma que usa TarjetaAsesoriasEnCurso, ya adaptada
// igual que lo hace asesoriasService). Los id_horario coinciden con el
// catálogo de HORARIOS_CATALOGO de más abajo.
// ---------------------------------------------------------------------------
export const ASESORIAS_EN_CURSO_PRUEBA = [
  {
    id: 1,
    id_estudiante: 101,
    estudiante: 'Alexander Israel Barrera Rodriguez',
    id_asesor: 1,
    asesor: 'Asesor Prueba',
    id_licenciatura: 1,
    licenciatura: 'Licenciatura en Informática',
    id_grupo: 1,
    grupo: '3-1',
    id_materia: 11,
    materia: 'Introducción a la programación',
    id_horario: 7,
    horario: '13:00 - 14:00',
    fecha_inicio: '2026-10-27T00:00:00.000Z',
    fecha_inicio_formateada: '27/OCT/2026',
    fecha_fin: null,
    id_modalidad: 1,
    modalidad: 'Presencial',
    id_razon: 1,
    razon: 'Reprobó la materia',
    sesiones_tomadas: 2,
    observaciones: '',
    material_adicional: [],
  },
  {
    id: 2,
    id_estudiante: 102,
    estudiante: 'Jenifer Guadalupe Tizoc Lopez',
    id_asesor: 1,
    asesor: 'Asesor Prueba',
    id_licenciatura: 1,
    licenciatura: 'Licenciatura en Informática',
    id_grupo: 2,
    grupo: '2-1',
    id_materia: 12,
    materia: 'Estructuras de datos',
    id_horario: 4,
    horario: '10:00 - 11:00',
    fecha_inicio: '2026-10-28T00:00:00.000Z',
    fecha_inicio_formateada: '28/OCT/2026',
    fecha_fin: null,
    id_modalidad: 2,
    modalidad: 'Virtual',
    id_razon: 2,
    razon: 'Reforzamiento',
    sesiones_tomadas: 5,
    observaciones: 'Va avanzando bien con listas ligadas.',
    material_adicional: [],
  },
  {
    id: 3,
    id_estudiante: 103,
    estudiante: 'Luis Fernando Velazquez Araujo',
    id_asesor: 1,
    asesor: 'Asesor Prueba',
    id_licenciatura: 1,
    licenciatura: 'Licenciatura en Informática',
    id_grupo: 3,
    grupo: '4-1',
    id_materia: 13,
    materia: 'Análisis y diseño de sistemas de información orientados a objetos',
    id_horario: 10,
    horario: '16:00 - 17:00',
    fecha_inicio: '2026-10-29T00:00:00.000Z',
    fecha_inicio_formateada: '29/OCT/2026',
    fecha_fin: null,
    id_modalidad: 1,
    modalidad: 'Presencial',
    id_razon: 1,
    razon: 'Examen extraordinario',
    sesiones_tomadas: 0,
    observaciones: '',
    material_adicional: [],
  },
  {
    id: 4,
    id_estudiante: 104,
    estudiante: 'María de los Ángeles Hernández Villaseñor de la Rocha',
    id_asesor: 1,
    asesor: 'Asesor Prueba',
    id_licenciatura: 1,
    licenciatura: 'Licenciatura en Informática',
    id_grupo: 1,
    grupo: '3-1',
    id_materia: 14,
    materia: 'Cálculo diferencial',
    id_horario: 3,
    horario: '09:00 - 10:00',
    fecha_inicio: '2026-10-30T00:00:00.000Z',
    fecha_inicio_formateada: '30/OCT/2026',
    fecha_fin: null,
    id_modalidad: 2,
    modalidad: 'Virtual',
    id_razon: 2,
    razon: 'Reforzamiento',
    sesiones_tomadas: 1,
    observaciones: '',
    material_adicional: [],
  },
];

// ---------------------------------------------------------------------------
// PERFIL DEL ASESOR (forma que usa PerfilAsesor: solo datosAsesor)
// ---------------------------------------------------------------------------
export const PERFIL_ASESOR_PRUEBA = {
  datosAsesor: {
    nombre_completo: 'Asesor de Prueba Ramírez López',
    numero_cuenta: '19519958',
    correo: 'asesor.prueba@info.uas.edu.mx',
    facultad: 'Facultad de Informática Culiacán',
    estadisticas: { completadas: 12, en_curso: 3, solicitudes_pendientes: 4 },
  },
};

// ---------------------------------------------------------------------------
// DISPONIBILIDAD (forma que usa DisponibilidadAsesor)
// ---------------------------------------------------------------------------
const MATERIAS_PRUEBA = [
  { id_materia: 11, materia: 'Introducción a la programación' },
  { id_materia: 12, materia: 'Estructuras de datos' },
];

// Horarios de 1 hora, de 07:00 a 20:00 (ids 1 al 13)
const pad = (n) => String(n).padStart(2, '0');
const HORARIOS_CATALOGO = Array.from({ length: 13 }, (_, i) => {
  const inicio = 7 + i;
  return { id_horario: i + 1, horario: `${pad(inicio)}:00 - ${pad(inicio + 1)}:00` };
});

// Opciones que se pueden elegir (lo que regresaría GET /catalogos)
export const CATALOGOS_PRUEBA = {
  materias: [
    ...MATERIAS_PRUEBA,
    { id_materia: 13, materia: 'Análisis y diseño de sistemas' },
    { id_materia: 14, materia: 'Cálculo diferencial' },
    { id_materia: 15, materia: 'Bases de datos' },
    { id_materia: 16, materia: 'Programación orientada a objetos' },
  ],
  horarios: HORARIOS_CATALOGO,
};

// Lo que el asesor ya tiene guardado
export const DISPONIBILIDAD_PRUEBA = {
  materias: MATERIAS_PRUEBA,
  // cada horario lleva su día (1 = lunes ... 5 = viernes)
  horarios: [
    { dia: 1, id_horario: 7 },   // lunes 13:00 - 14:00
    { dia: 1, id_horario: 4 },   // lunes 10:00 - 11:00
    { dia: 3, id_horario: 7 },   // miércoles 13:00 - 14:00
    { dia: 4, id_horario: 10 },  // jueves 16:00 - 17:00
  ],
};