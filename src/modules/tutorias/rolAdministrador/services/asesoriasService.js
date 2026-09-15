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
            modalidad_nombre: "Presencial",
            fecha_inicio: "2026-09-15T00:00:00.000Z",
            fecha_fin: null,
            id_razon: 3,
            razon_texto: "Regularización y preparación para exámenes",
            id_licenciatura: 2,
            licenciatura_nombre: "Licenciatura en Informática",
            grado_grupo: "3-1",
            sesiones_tomadas: 2,
            observaciones:
                "El estudiante solicita apoyo con los temas de integrales triples.",
            id_estatus_asesoria: 3,
            id_horario: 10,
            horario_texto: "9:00 - 10:00 AM",
            material_adicional: [
                {
                    id_material: 1,
                    id_asesoria: 1,
                    nombre_archivo: "Guia_Ejercicios_Calculo.pdf",
                    drive_file_id: "1a2b3c4d5e6f7g8h9i0j",
                    url_archivo:
                        "https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view",
                    mime_type: "application/pdf",
                    tamano_archivo: 204800,
                    fecha_subida: "2026-09-10T13:23:38.000Z"
                }
            ]
        },

        {
            id_asesoria: 2,
            id_estudiante: 2,
            estudiante_nombre: "Crisoforo Ahuelican",
            id_asesor: 2,
            asesor_nombre: "Jose Angel Astorga Mejia",
            id_materia: 6,
            materia_nombre: "Matematicas discretas",
            id_modalidad: 1,
            modalidad_nombre: "Presencial",
            fecha_inicio: "2026-09-15T00:00:00.000Z",
            fecha_fin: null,
            id_razon: 3,
            razon_texto: "Dudas generales",
            id_licenciatura: 2,
            licenciatura_nombre: "Licenciatura en Informática",
            grado_grupo: "3-1",
            sesiones_tomadas: 1,
            observaciones:
                "El estudiante solicita apoyo con tablas de verdad.",
            id_estatus_asesoria: 3,
            id_horario: 10,
            horario_texto: "9:00 - 10:00 AM",
            material_adicional: [
                {
                    id_material: 1,
                    id_asesoria: 2,
                    nombre_archivo: "Guia_NAM.pdf",
                    drive_file_id: "1a2b3c4d5e6f7g8h9i0j",
                    url_archivo:
                        "https://docs.google.com/document/d/1HXPWIudO2KGPB5cAUV4bnPvYoI3gJ9LlMJYCrNYU7J8/edit?usp=drive_link",
                    mime_type: "application/pdf",
                    tamano_archivo: 204800,
                    fecha_subida: "2026-09-10T13:23:38.000Z"
                }
            ]
        },

        {
            id_asesoria: 3,
            id_estudiante: 3,
            estudiante_nombre: "Luis Fernando Velazquez",
            id_asesor: 2,
            asesor_nombre: "Jenifer Guadalupe Tizoc Lopez",
            id_materia: 7,
            materia_nombre: "Lenguajes de programacion",
            id_modalidad: 1,
            modalidad_nombre: "En línea",
            fecha_inicio: "2026-09-15T00:00:00.000Z",
            fecha_fin: null,
            id_razon: 3,
            razon_texto: "Proyecto final",
            id_licenciatura: 2,
            licenciatura_nombre: "Licenciatura en Informática",
            grado_grupo: "3-1",
            sesiones_tomadas: 0,
            observaciones:
                "El estudiante solicita apoyo con POO.",
            id_estatus_asesoria: 3,
            id_horario: 10,
            horario_texto: "9:00 - 10:00 AM",
            material_adicional: []
        },

        {
            id_asesoria: 4,
            id_estudiante: 4,
            estudiante_nombre: "Alexander Israel Barrera Herrera",
            id_asesor: 2,
            asesor_nombre: "Jenifer Guadalupe Tizoc Lopez",
            id_materia: 8,
            materia_nombre: "Sistemas distribuidos",
            id_modalidad: 1,
            modalidad_nombre: "Presencial",
            fecha_inicio: "2026-09-15T00:00:00.000Z",
            fecha_fin: null,
            id_razon: 3,
            razon_texto: "Asesoría continua",
            id_licenciatura: 2,
            licenciatura_nombre: "Licenciatura en Informática",
            grado_grupo: "3-1",
            sesiones_tomadas: 0,
            observaciones:
                "El estudiante solicita apoyo con sockets en Java.",
            id_estatus_asesoria: 3,
            id_horario: 12,
            horario_texto: "11:00 - 12:00 PM",
            material_adicional: []
        }
    ]
};


// Mapas opcionales para traducir IDs a nombres
// por si el backend no manda los textos

const MAP_MATERIAS = {
    5: "Taller Integrador",
    6: "Matemáticas Discretas",
    7: "Lenguajes de Programación",
    8: "Sistemas Distribuidos"
};

const MAP_HORARIOS = {
    10: "9:00 - 10:00 AM",
    12: "11:00 - 12:00 PM"
};


// Servicio para obtener asesorías mapeadas para la UI

export const getAsesorias = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {

            const filasAdaptadas = mockResponseAPI.data.map((item) => ({

                id: item.id_asesoria,

                materia:
                    item.materia_nombre ||
                    MAP_MATERIAS[item.id_materia] ||
                    "",

                // ID que utilizará el Select
                materiaId: item.id_materia,

                estudiante:
                    item.estudiante_nombre ||
                    `Estudiante #${item.id_estudiante}`,

                asesor:
                    item.asesor_nombre ||
                    `Asesor #${item.id_asesor}`,

                licenciatura:
                    item.licenciatura_nombre ||
                    "Licenciatura en Informática",

                gradoGrupo:
                    item.grado_grupo ||
                    "3-1",

                horario:
                    item.horario_texto ||
                    MAP_HORARIOS[item.id_horario] ||
                    "",

                horarioId: item.id_horario,


                modalidad:
                    item.modalidad_nombre ||
                    "Presencial",

                razonAsesoria:
                    item.razon_texto ||
                    "Asesoría académica",

                sesionesTomadas:
                    String(item.sesiones_tomadas || "1"),

                observaciones:
                    item.observaciones || "",

                inicio: item.fecha_inicio
                    ? new Date(item.fecha_inicio).toLocaleDateString(
                        "es-MX",
                        {
                            timeZone: "UTC"
                        }
                    )
                    : "Fecha no asignada",


                raw: item
            }));

            resolve(filasAdaptadas);

        }, 300);
    });
};