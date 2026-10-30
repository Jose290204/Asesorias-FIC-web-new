// Datos de prueba para diseñar las pantallas del admin sin backend.
export const USAR_DATOS_PRUEBA_ADMIN = true;

const MATERIAL = [
    { id_material: 1, nombre_archivo: 'Guia_Base_de_Datos.pdf', mime_type: 'application/pdf', url_archivo: '#' },
    { id_material: 2, nombre_archivo: 'Ejercicios.docx', mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', url_archivo: '#' }
];

export const ASESORIAS_ADMIN_PRUEBA = [
    {
        id: 1, id_asesoria: 1, materia: 'Base de Datos', estudiante: 'Luis Fernando Pérez Gámez',
        asesor: 'Patricia Rentería Beltrán', fecha_inicio: '2026-10-20T00:00:00.000Z', horario: '10:00 - 11:00 AM',
        licenciatura: 'Licenciatura en Informática', gradoGrupo: '5-1', modalidad: 'Presencial', razonAsesoria: 'Parcial',
        raw: { material_adicional: MATERIAL }
    },
    {
        id: 2, id_asesoria: 2, materia: 'Introducción a la programación', estudiante: 'María Guadalupe Hernández Valenzuela',
        asesor: 'Alexander Israel Barrera Rodrígez', fecha_inicio: '2026-10-21T00:00:00.000Z', horario: '12:00 - 1:00 PM',
        licenciatura: 'Licenciatura en Informática', gradoGrupo: '1-1', modalidad: 'Virtual', razonAsesoria: 'Reforzamiento',
        raw: { material_adicional: [] }
    },
    {
        id: 3, id_asesoria: 3, materia: 'Estructura de Datos', estudiante: 'José Ángel Astorga Mejía',
        asesor: 'Luis Fernando Velázquez Araujo', fecha_inicio: '2026-10-22T00:00:00.000Z', horario: '4:00 - 5:00 PM',
        licenciatura: 'Licenciatura en Informática', gradoGrupo: '3-2', modalidad: 'Presencial', razonAsesoria: 'Ordinario',
        raw: { material_adicional: [MATERIAL[0]] }
    },
    {
        id: 4, id_asesoria: 4, materia: 'Cálculo Diferencial e Integral', estudiante: 'Ana Sofía Ramírez López',
        asesor: 'Jenifer Guadalupe Tizoc Lopez', fecha_inicio: '2026-10-23T00:00:00.000Z', horario: '7:00 - 8:00 AM',
        licenciatura: 'Ciencia de Datos', gradoGrupo: '2-1', modalidad: 'Virtual', razonAsesoria: 'Extraordinario',
        raw: { material_adicional: [] }
    },
    {
        id: 5, id_asesoria: 5, materia: 'Redes de Computadoras', estudiante: 'Carlos Eduardo Sánchez Ochoa',
        asesor: 'Patricia Rentería Beltrán', fecha_inicio: '2026-10-26T00:00:00.000Z', horario: '9:00 - 10:00 AM',
        licenciatura: 'Licenciatura en Informática', gradoGrupo: '4-1', modalidad: 'Presencial', razonAsesoria: 'Especial',
        raw: { material_adicional: MATERIAL }
    },
    {
        id: 6, id_asesoria: 6, materia: 'Programación Orientada a Objetos', estudiante: 'Daniela Itzel Cázares Bojórquez',
        asesor: 'Alexander Israel Barrera Rodrígez', fecha_inicio: '2026-10-27T00:00:00.000Z', horario: '6:00 - 7:00 PM',
        licenciatura: 'Licenciatura en Informática', gradoGrupo: '2-2', modalidad: 'Virtual', razonAsesoria: 'Parcial',
        raw: { material_adicional: [] }
    }
];

// Solicitudes pendientes que ve el administrador. Los textos de licenciatura, modalidad, horario y razón
// coinciden con el catálogo para que los filtros funcionen.

export const SOLICITUDES_ADMIN_PRUEBA = [
    {
        id: 1, id_solicitud: 1, materia: 'Taller Integrador', estudiante: 'Crisoforo Ahuelican Ahuejote',
        asesor: 'Patricia Rentería Beltrán', fecha_inicio: '2026-10-27T00:00:00.000Z', horario: '9:00 - 10:00 AM',
        licenciatura: 'Licenciatura en Informática', gradoGrupo: '5-1', modalidad: 'Virtual', razonAsesoria: 'Parcial',
        observaciones: 'Necesito repasar el diseño de la base de datos antes del examen parcial.'
    },
    {
        id: 2, id_solicitud: 2, materia: 'Matemáticas Discretas', estudiante: 'Jenifer Guadalupe Tizoc Lopez',
        asesor: 'Alexander Israel Barrera Rodrígez', fecha_inicio: '2026-10-27T00:00:00.000Z', horario: '11:00 - 12:00 PM',
        licenciatura: 'Licenciatura en Informática', gradoGrupo: '2-3', modalidad: 'Presencial', razonAsesoria: 'Reforzamiento',
        observaciones: 'Dudas con lógica proposicional y tablas de verdad.'
    },
    {
        id: 3, id_solicitud: 3, materia: 'Lenguajes de Programación', estudiante: 'José Ángel Astorga Mejía',
        asesor: 'Luis Fernando Velázquez Araujo', fecha_inicio: '2026-10-28T00:00:00.000Z', horario: '4:00 - 5:00 PM',
        licenciatura: 'Licenciatura en Informática', gradoGrupo: '3-2', modalidad: 'Virtual', razonAsesoria: 'Ordinario',
        observaciones: ''
    },
    {
        id: 4, id_solicitud: 4, materia: 'Cálculo Diferencial e Integral', estudiante: 'Ana Sofía Ramírez López',
        asesor: 'Jenifer Guadalupe Tizoc Lopez', fecha_inicio: '2026-10-29T00:00:00.000Z', horario: '7:00 - 8:00 AM',
        licenciatura: 'Licenciatura en Informática', gradoGrupo: '1-4', modalidad: 'Presencial', razonAsesoria: 'Extraordinario',
        observaciones: 'Repaso de derivadas e integrales para el extraordinario.'
    },
    {
        id: 5, id_solicitud: 5, materia: 'Redes de Computadoras', estudiante: 'Carlos Eduardo Sánchez Ochoa',
        asesor: 'Patricia Rentería Beltrán', fecha_inicio: '2026-10-30T00:00:00.000Z', horario: '9:00 - 10:00 AM',
        licenciatura: 'Licenciatura en Informática', gradoGrupo: '4-2', modalidad: 'Virtual', razonAsesoria: 'Especial',
        observaciones: ''
    },
    {
        id: 6, id_solicitud: 6, materia: 'Programación Orientada a Objetos', estudiante: 'Daniela Itzel Cázares Bojórquez',
        asesor: 'Alexander Israel Barrera Rodrígez', fecha_inicio: '2026-11-02T00:00:00.000Z', horario: '6:00 - 7:00 PM',
        licenciatura: 'Licenciatura en Informática', gradoGrupo: '3-1', modalidad: 'Presencial', razonAsesoria: 'Parcial',
        observaciones: 'Herencia y polimorfismo.'
    }
];

// ---------------------------------------------------------------------------
// PERFIL DEL ADMINISTRADOR (forma que usa PerfilAdministrador)
// ---------------------------------------------------------------------------
export const PERFIL_ADMIN_PRUEBA = {
    nombre_completo: 'Leslie Mayram Barrera Rodriguez',
    numero_cuenta: '19519958',
    correo: 'admin.prueba@info.uas.edu.mx',
    facultad: 'Facultad de Informática Culiacán'
};


// Sesiones activas para diseñar la pantalla "Usuarios en línea" sin backend.
// Las fechas se calculan respecto al momento de carga para que siempre haya gente "en línea" y "ausente".
const haceMinutos = (minutos) => new Date(Date.now() - minutos * 60000).toISOString();

export const SESIONES_ADMIN_PRUEBA = [
    { id: 1, usuario_id: 1, nombre: 'Leslie Mayram Barrera Rodriguez', correo: 'admin.prueba@info.uas.edu.mx', rol: 'Administrador', dispositivo: 'Web', ip: '189.203.10.21', inicio_sesion: haceMinutos(95), ultima_actividad: haceMinutos(0), es_actual: true },
    { id: 2, usuario_id: 2, nombre: 'Luis Fernando Pérez Gámez', correo: 'estudiante1@fic.test', rol: 'Estudiante', dispositivo: 'App móvil', ip: '189.203.44.8', inicio_sesion: haceMinutos(40), ultima_actividad: haceMinutos(1), es_actual: false },
    { id: 3, usuario_id: 3, nombre: 'Patricia Rentería Beltrán', correo: 'asesor.bd@fic.test', rol: 'Asesor disciplinar', dispositivo: 'Web', ip: '187.190.2.77', inicio_sesion: haceMinutos(120), ultima_actividad: haceMinutos(3), es_actual: false },
    { id: 4, usuario_id: 4, nombre: 'María Guadalupe Hernández Valenzuela', correo: 'estudiante2@fic.test', rol: 'Estudiante', dispositivo: 'Web', ip: '189.203.51.140', inicio_sesion: haceMinutos(180), ultima_actividad: haceMinutos(12), es_actual: false },
    { id: 5, usuario_id: 5, nombre: 'José Ángel Astorga Mejía', correo: 'asesor.par@fic.test', rol: 'Asesor par', dispositivo: 'App móvil', ip: '189.203.9.33', inicio_sesion: haceMinutos(300), ultima_actividad: haceMinutos(47), es_actual: false },
    { id: 6, usuario_id: 6, nombre: 'Alexander Israel Barrera Rodrígez', correo: 'asesor.ia@fic.test', rol: 'Asesor disciplinar', dispositivo: 'Web', ip: '187.190.8.120', inicio_sesion: haceMinutos(600), ultima_actividad: haceMinutos(130), es_actual: false }
];

// ===== Agregar al final de rolAdministrador/datosPrueba.js =====
// Reemplaza por completo el bloque anterior del reporte por asesor
// (CICLOS_REPORTE_PRUEBA y REPORTE_ASESORES_PRUEBA).
// Datos de prueba del reporte "Por asesor": ahora la base son las asesorías de cada asesor,
// y de ellas se calculan los totales, las materias y los grupos.

// Semestres (ciclos escolares) disponibles para filtrar los reportes
export const CICLOS_REPORTE_PRUEBA = [
    { id: 2, nombre: '2026-2027 · Agosto-Enero (vigente)' },
    { id: 1, nombre: '2025-2026 · Enero-Junio' }
];

// Asesores del reporte (los nombres coinciden con los de las listas de prueba de asesores par y disciplinares)
export const ASESORES_REPORTE_PRUEBA = [
    { id: 1, nombre: 'Jenifer Guadalupe Tizoc Lopez', tipo: 'Disciplinar' },
    { id: 2, nombre: 'Crisoforo Ahuelican Ahuejote', tipo: 'Disciplinar' },
    { id: 3, nombre: 'Jose Angel Astorga Mejia', tipo: 'Disciplinar' },
    { id: 4, nombre: 'María Fernanda López', tipo: 'Par' },
    { id: 5, nombre: 'Juan Pablo Sánchez', tipo: 'Par' }
];

// Materias que atendió cada asesor en el semestre vigente: [materia, cantidad de asesorías]
const MATERIAS_POR_ASESOR_PRUEBA = {
    1: [['Base de Datos', 8], ['Estructura de Datos', 5], ['Programación Web', 3], ['Matemáticas Discretas', 2], ['Redes de Computadoras', 2]],
    2: [['Introducción a la programación', 5], ['Programación Orientada a Objetos', 4], ['Estructura de Datos', 2]],
    3: [['Redes de Computadoras', 5], ['Sistemas Operativos', 3]],
    4: [['Matemáticas Discretas', 3], ['Cálculo', 2]],
    5: [] // sin asesorías: sirve para probar el estado vacío
};

const ESTUDIANTES_REPORTE_PRUEBA = [
    'Luis Fernando Pérez Gámez',
    'María Guadalupe Hernández Valenzuela',
    'Ana Sofía Ramírez López',
    'Carlos Eduardo Sánchez Ochoa',
    'Daniela Itzel Cázares Bojórquez',
    'Iván Alejandro Beltrán Cota'
];

const GRUPOS_REPORTE_PRUEBA = [
    { licenciatura: 'Licenciatura en Informática', grupo: '3-1' },
    { licenciatura: 'Licenciatura en Informática', grupo: '4-1' },
    { licenciatura: 'Licenciatura en Informática', grupo: '5-1' },
    { licenciatura: 'Ingeniería en Telecomunicaciones', grupo: '2-1' }
];

// Reparto de las asesorías entre los grupos (posiciones de GRUPOS_REPORTE_PRUEBA)
const REPARTO_GRUPOS_PRUEBA = [0, 0, 1, 2, 0, 1, 3, 0, 2, 1];
const HORARIOS_REPORTE_PRUEBA = ['7:00 - 8:00 AM', '9:00 - 10:00 AM', '11:00 - 12:00 PM', '4:00 - 5:00 PM'];
const RAZONES_REPORTE_PRUEBA = ['Parcial', 'Ordinario', 'Reforzamiento', 'Extraordinario'];

const sumarDias = (fechaIso, dias) => {
    const fecha = new Date(`${fechaIso}T00:00:00Z`);
    fecha.setUTCDate(fecha.getUTCDate() + dias);
    return fecha.toISOString().slice(0, 10);
};

// Fecha de término de una asesoría completada (sin pasar de ayer, porque no puede terminar en el futuro)
const finDePrueba = (inicio, dias) => {
    const fin = sumarDias(inicio, dias);
    return fin > '2026-10-27' ? '2026-10-27' : fin;
};

// Asesorías del semestre vigente, una por renglón (forma que entregaría el backend)
export const ASESORIAS_REPORTE_PRUEBA = ASESORES_REPORTE_PRUEBA.flatMap((asesor) => {
    const materias = (MATERIAS_POR_ASESOR_PRUEBA[asesor.id] || []).flatMap(([materia, cantidad]) =>
        Array.from({ length: cantidad }, () => materia)
    );

    return materias.map((materia, i) => {
        const grupo = GRUPOS_REPORTE_PRUEBA[REPARTO_GRUPOS_PRUEBA[(i + asesor.id) % REPARTO_GRUPOS_PRUEBA.length]];
        const estatus = i % 6 === 0 ? 'En curso' : i % 9 === 4 ? 'Cancelada' : 'Completada';
        const sesiones = estatus === 'Completada' ? 2 + (i % 4) : estatus === 'En curso' ? 1 + (i % 2) : i % 2;

        return {
            id: asesor.id * 100 + i + 1,
            asesor_id: asesor.id,
            asesor: asesor.nombre,
            tipo: asesor.tipo,
            materia,
            estudiante: ESTUDIANTES_REPORTE_PRUEBA[(i + asesor.id) % ESTUDIANTES_REPORTE_PRUEBA.length],
            licenciatura: grupo.licenciatura,
            grupo: grupo.grupo,
            fecha_inicio: sumarDias('2026-08-24', i * 3 + asesor.id),
            fecha_fin: estatus === 'Completada' ? finDePrueba(sumarDias('2026-08-24', i * 3 + asesor.id), 7 + (i % 4) * 3) : null,
            horario: HORARIOS_REPORTE_PRUEBA[i % HORARIOS_REPORTE_PRUEBA.length],
            modalidad: i % 3 === 0 ? 'Virtual' : 'Presencial',
            razon: RAZONES_REPORTE_PRUEBA[i % RAZONES_REPORTE_PRUEBA.length],
            estatus,
            sesiones
        };
    });
});


// Materias del reporte "Por materia": las que tienen asesorías en ASESORIAS_REPORTE_PRUEBA
// y dos sin actividad (sirven para probar el estado vacío y el ranking con ceros).
export const MATERIAS_REPORTE_PRUEBA = [
    { id: 1, nombre: 'Base de Datos', licenciatura: 'Licenciatura en Informática', semestre: 3 },
    { id: 2, nombre: 'Estructura de Datos', licenciatura: 'Licenciatura en Informática', semestre: 3 },
    { id: 3, nombre: 'Programación Web', licenciatura: 'Licenciatura en Informática', semestre: 5 },
    { id: 4, nombre: 'Matemáticas Discretas', licenciatura: 'Licenciatura en Informática', semestre: 1 },
    { id: 5, nombre: 'Redes de Computadoras', licenciatura: 'Licenciatura en Informática', semestre: 5 },
    { id: 6, nombre: 'Introducción a la programación', licenciatura: 'Licenciatura en Informática', semestre: 1 },
    { id: 7, nombre: 'Programación Orientada a Objetos', licenciatura: 'Licenciatura en Informática', semestre: 2 },
    { id: 8, nombre: 'Sistemas Operativos', licenciatura: 'Licenciatura en Informática', semestre: 4 },
    { id: 9, nombre: 'Cálculo', licenciatura: 'Licenciatura en Informática', semestre: 1 },
    { id: 10, nombre: 'Taller Integrador', licenciatura: 'Licenciatura en Informática', semestre: 6 },
    { id: 11, nombre: 'Inteligencia Artificial', licenciatura: 'Licenciatura en Informática', semestre: 7 }
];
