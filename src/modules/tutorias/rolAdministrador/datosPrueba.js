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