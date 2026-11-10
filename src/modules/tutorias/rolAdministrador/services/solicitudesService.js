const mockResponseAPI = {
    success: true,
    data: [
        {
            id_solicitud: 1,
            materia: "Taller integrador",
            estudiante: "Crisoforo Ahuelican Ahuejote",
            fecha: "2026-09-15T00:00:00.000Z",
            horario: "9:00 - 10:00 AM",
            modalidad: "Virtual"
        },
        {
            id_solicitud: 2,
            materia: "Matematicas discretas",
            estudiante: "Jenifer Guadalupe Tizoc Lopez",
            fecha: "2026-09-15T00:00:00.000Z",
            horario: "9:00 - 10:00 AM",
            modalidad: "Virtual"
        },
        {
            id_solicitud: 3,
            materia: "Lenguajes de programacion",
            estudiante: "Jose Angel Astorga Mejia",
            fecha: "2026-09-15T00:00:00.000Z",
            horario: "9:00 - 10:00 AM",
            modalidad: "Virtual"
        },
        {
            id_solicitud: 4,
            materia: "Taller integrador",
            estudiante: "Crisoforo Ahuelican Ahuejote",
            fecha: "2026-09-15T00:00:00.000Z",
            horario: "9:00 - 10:00 AM",
            modalidad: "Virtual"
        },
        {
            id_solicitud: 5,
            materia: "Matematicas discretas",
            estudiante: "Jenifer Guadalupe Tizoc Lopez",
            fecha: "2026-09-15T00:00:00.000Z",
            horario: "9:00 - 10:00 AM",
            modalidad: "Virtual"
        },
        {
            id_solicitud: 6,
            materia: "Lenguajes de programacion",
            estudiante: "Jose Angel Astorga Mejia",
            fecha: "2026-09-15T00:00:00.000Z",
            horario: "9:00 - 10:00 AM",
            modalidad: "Virtual"
        },
        {
            id_solicitud: 7,
            materia: "Taller integrador",
            estudiante: "Crisoforo Ahuelican Ahuejote",
            fecha: "2026-09-15T00:00:00.000Z",
            horario: "9:00 - 10:00 AM",
            modalidad: "Virtual"
        },
        {
            id_solicitud: 8,
            materia: "Matematicas discretas",
            estudiante: "Jenifer Guadalupe Tizoc Lopez",
            fecha: "2026-09-15T00:00:00.000Z",
            horario: "9:00 - 10:00 AM",
            modalidad: "Virtual"
        },
        {
            id_solicitud: 9,
            materia: "Lenguajes de programacion",
            estudiante: "Jose Angel Astorga Mejia",
            fecha: "2026-09-15T00:00:00.000Z",
            horario: "9:00 - 10:00 AM",
            modalidad: "Virtual"
        }
    ]
};

export const getSolicitudes = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filasAdaptadas = mockResponseAPI.data.map((item) => ({
                id: item.id_solicitud,
                materia: item.materia,
                estudiante: item.estudiante,
                fecha: item.fecha
                    ? new Date(item.fecha).toLocaleDateString("es-MX", { timeZone: "UTC" }) // Corregido: item.fecha_inicio -> item.fecha
                    : "Fecha no asignada",
                horario: item.horario,
                modalidad: item.modalidad,
                raw: item
            }));

            resolve(filasAdaptadas);
        }, 300);
    });
};