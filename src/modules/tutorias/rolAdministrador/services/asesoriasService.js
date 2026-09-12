// Mock estático que simula la respuesta de la API real
const mockResponseAPI = {
    success: true,
    data: [
        {
            id_asesoria: 1,
            id_estudiante: 1,
            estudiante_nombre: "Leslie Mayram Barrera Rodriguez",
            id_asesor: 2,
            asesor_nombre: "Jenifer Guadalupe Tizoc Lopez",
            id_materia: 5,
            materia_nombre: "Taller integrador",
            id_modalidad: 1,
            fecha_inicio: "2026-09-15T00:00:00.000Z",
            fecha_fin: null,
            id_razon: 3,
            id_licenciatura: 2,
            sesiones_tomadas: 0,
            observaciones: "El estudiante solicita apoyo con los temas de integrales triples.",
            id_estatus_asesoria: 3,
            id_horario: 10,
            horario_texto: "9:00 - 10:00 AM",
            material_adicional: [
                {
                    id_material: 1,
                    id_asesoria: 1,
                    nombre_archivo: "Guia_Ejercicios_Calculo.pdf",
                    drive_file_id: "1a2b3c4d5e6f7g8h9i0j",
                    url_archivo: "https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view",
                    mime_type: "application/pdf",
                    tamano_archivo: 204800,
                    fecha_subida: "2026-09-10T13:23:38.000Z"
                }
            ]
        },
        {
            id_asesoria: 2,
            id_estudiante: 1,
            estudiante_nombre: "Crisoforo Ahuelican",
            id_asesor: 2,
            asesor_nombre: "Jose Angel Astorga Mejia",
            id_materia: 5,
            materia_nombre: "Matematicas discretas",
            id_modalidad: 1,
            fecha_inicio: "2026-09-15T00:00:00.000Z",
            fecha_fin: null,
            id_razon: 3,
            id_licenciatura: 2,
            sesiones_tomadas: 0,
            observaciones: "El estudiante solicita apoyo con los temas de integrales triples.",
            id_estatus_asesoria: 3,
            id_horario: 10,
            horario_texto: "9:00 - 10:00 AM",
            material_adicional: [
                {
                    id_material: 1,
                    id_asesoria: 1,
                    nombre_archivo: "Guia_NAM.pdf",
                    drive_file_id: "1a2b3c4d5e6f7g8h9i0j",
                    url_archivo: "https://docs.google.com/document/d/1HXPWIudO2KGPB5cAUV4bnPvYoI3gJ9LlMJYCrNYU7J8/edit?usp=drive_link",
                    mime_type: "application/pdf",
                    tamano_archivo: 204800,
                    fecha_subida: "2026-09-10T13:23:38.000Z"
                }
            ]
        },
        {
            id_asesoria: 3,
            id_estudiante: 1,
            estudiante_nombre: "Luis Fernando Velazquez",
            id_asesor: 2,
            asesor_nombre: "Jenifer Guadalupe Tizoc Lopez",
            id_materia: 5,
            materia_nombre: "Lenguajes de programacion",
            id_modalidad: 1,
            fecha_inicio: "2026-09-15T00:00:00.000Z",
            fecha_fin: null,
            id_razon: 3,
            id_licenciatura: 2,
            sesiones_tomadas: 0,
            observaciones: "El estudiante solicita apoyo.",
            id_estatus_asesoria: 3,
            id_horario: 10,
            horario_texto: "9:00 - 10:00 AM",
            material_adicional: []
        },
        {
            id_asesoria: 4,
            id_estudiante: 1,
            estudiante_nombre: "Alexander Israel Barrera Herrera",
            id_asesor: 2,
            asesor_nombre: "Jenifer Guadalupe Tizoc Lopez",
            id_materia: 5,
            materia_nombre: "Sistemas distribuidos",
            id_modalidad: 1,
            fecha_inicio: "2026-09-15T00:00:00.000Z",
            fecha_fin: null,
            id_razon: 3,
            id_licenciatura: 2,
            sesiones_tomadas: 0,
            observaciones: "El estudiante solicita apoyo.",
            id_estatus_asesoria: 3,
            id_horario: 12,
            horario_texto: "11:00 - 12:00 PM",
            material_adicional: []
        },
        {
            id_asesoria: 2,
            id_estudiante: 1,
            estudiante_nombre: "Crisoforo Ahuelican",
            id_asesor: 2,
            asesor_nombre: "Jose Angel Astorga Mejia",
            id_materia: 5,
            materia_nombre: "Matematicas discretas",
            id_modalidad: 1,
            fecha_inicio: "2026-09-15T00:00:00.000Z",
            fecha_fin: null,
            id_razon: 3,
            id_licenciatura: 2,
            sesiones_tomadas: 0,
            observaciones: "El estudiante solicita apoyo con los temas de integrales triples.",
            id_estatus_asesoria: 3,
            id_horario: 10,
            horario_texto: "9:00 - 10:00 AM",
            material_adicional: [
                {
                    id_material: 1,
                    id_asesoria: 1,
                    nombre_archivo: "Guia_NAM.pdf",
                    drive_file_id: "1a2b3c4d5e6f7g8h9i0j",
                    url_archivo: "https://docs.google.com/document/d/1HXPWIudO2KGPB5cAUV4bnPvYoI3gJ9LlMJYCrNYU7J8/edit?usp=drive_link",
                    mime_type: "application/pdf",
                    tamano_archivo: 204800,
                    fecha_subida: "2026-09-10T13:23:38.000Z"
                }
            ]
        },
        {
            id_asesoria: 3,
            id_estudiante: 1,
            estudiante_nombre: "Luis Fernando Velazquez",
            id_asesor: 2,
            asesor_nombre: "Jenifer Guadalupe Tizoc Lopez",
            id_materia: 5,
            materia_nombre: "Lenguajes de programacion",
            id_modalidad: 1,
            fecha_inicio: "2026-09-15T00:00:00.000Z",
            fecha_fin: null,
            id_razon: 3,
            id_licenciatura: 2,
            sesiones_tomadas: 0,
            observaciones: "El estudiante solicita apoyo.",
            id_estatus_asesoria: 3,
            id_horario: 10,
            horario_texto: "9:00 - 10:00 AM",
            material_adicional: []
        },
        {
            id_asesoria: 4,
            id_estudiante: 1,
            estudiante_nombre: "Alexander Israel Barrera Herrera",
            id_asesor: 2,
            asesor_nombre: "Jenifer Guadalupe Tizoc Lopez",
            id_materia: 5,
            materia_nombre: "Sistemas distribuidos",
            id_modalidad: 1,
            fecha_inicio: "2026-09-15T00:00:00.000Z",
            fecha_fin: null,
            id_razon: 3,
            id_licenciatura: 2,
            sesiones_tomadas: 0,
            observaciones: "El estudiante solicita apoyo.",
            id_estatus_asesoria: 3,
            id_horario: 12,
            horario_texto: "11:00 - 12:00 PM",
            material_adicional: []
        }
    ]
};

// Mapas opcionales para traducir IDs a nombres por si el backend no manda los textos
const MAP_MATERIAS = {
    5: "Taller Integrador",
    6: "Matemáticas Discretas",
    7: "Lenguajes de Programación"
};

const MAP_HORARIOS = {
    10: "9:00 - 10:00 AM",
    12: "11:00 - 12:00 PM"
};

// Servicio para obtener asesorías
export const getAsesorias = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filasAdaptadas = mockResponseAPI.data.map((item) => ({
                id: item.id_asesoria,
                materia: item.materia_nombre || MAP_MATERIAS[item.id_materia] || `Materia #${item.id_materia}`,
                estudiante: item.estudiante_nombre || `Estudiante #${item.id_estudiante}`,
                asesor: item.asesor_nombre || `Asesor #${item.id_asesor}`,
                inicio: item.fecha_inicio
                    ? new Date(item.fecha_inicio).toLocaleDateString("es-MX", { timeZone: "UTC" })
                    : "Fecha no asignada",
                horario: item.horario_texto || MAP_HORARIOS[item.id_horario] || `Horario #${item.id_horario}`,
                raw: item // Datos completos originales por si los necesitas en modales
            }));

            resolve(filasAdaptadas);
        }, 300);
    });
};