// Mock estático que simula la respuesta de la API real para Estudiantes
const mockResponseAPI = {
    success: true,
    data: [
        {
            id_estudiante: 1,
            nombre: "Crisoforo Ahuelican Ahuejote",
            correo: "crisoforoahuelican@info.uas.edu.mx",
            licenciatura:"Licenciatura en Informatica",
            numero_cuenta: "22116834",
            grupo: "4-1",
            id_estatus: 1,
            estatus_texto: "ACTIVO"
        },
        {
            id_estudiante: 2,
            nombre: "Leslie Mayram Barrera Rodriguez",
            correo: "leslie.barrera@info.uas.edu.mx",
            licenciatura:"Licenciatura en Informatica",
            numero_cuenta: "22116835",
            grupo: "4-1",
            id_estatus: 1,
            estatus_texto: "ACTIVO"
        },
        {
            id_estudiante: 3,
            nombre: "Jenifer Guadalupe Tizoc Lopez",
            correo: "jenifer.tizoc@info.uas.edu.mx",
            licenciatura:"Licenciatura en Informatica",
            numero_cuenta: "22116836",
            grupo: "4-2",
            id_estatus: 2,
            estatus_texto: "INACTIVO"
        },
        {
            id_estudiante: 4,
            nombre: "Alexander Israel Barrera Herrera",
            correo: "alexander.barrera@info.uas.edu.mx",
            licenciatura:"Licenciatura en Informatica",
            numero_cuenta: "22116837",
            grupo: "4-2",
            id_estatus: 1,
            estatus_texto: "ACTIVO"
        },
        {
            id_estudiante: 5,
            nombre: "Crisoforo Ahuelican Ahuejote",
            correo: "crisoforoahuelican@info.uas.edu.mx",
            licenciatura:"Licenciatura en Informatica",
            numero_cuenta: "22116834",
            grupo: "4-1",
            id_estatus: 1,
            estatus_texto: "ACTIVO"
        },
        {
            id_estudiante: 6,
            nombre: "Leslie Mayram Barrera Rodriguez",
            correo: "leslie.barrera@info.uas.edu.mx",
            licenciatura:"Licenciatura en Informatica",
            numero_cuenta: "22116835",
            grupo: "4-1",
            id_estatus: 1,
            estatus_texto: "ACTIVO"
        },
        {
            id_estudiante: 7,
            nombre: "Jenifer Guadalupe Tizoc Lopez",
            correo: "jenifer.tizoc@info.uas.edu.mx",
            licenciatura:"Licenciatura en Informatica",
            numero_cuenta: "22116836",
            grupo: "4-2",
            id_estatus: 2,
            estatus_texto: "INACTIVO"
        },
        {
            id_estudiante: 8,
            nombre: "Alexander Israel Barrera Herrera",
            correo: "alexander.barrera@info.uas.edu.mx",
            licenciatura:"Licenciatura en Informatica",
            numero_cuenta: "22116837",
            grupo: "4-2",
            id_estatus: 1,
            estatus_texto: "ACTIVO"
        }
    ]
};

const MAP_ESTATUS = {
    1: "ACTIVO",
    2: "INACTIVO"
};

// Servicio para obtener estudiantes
export const getEstudiantes = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filasAdaptadas = mockResponseAPI.data.map((item) => ({
                id: item.id_estudiante,
                nombre: item.nombre,
                correo: item.correo,
                licenciatura: item.licenciatura,
                numeroCuenta: item.numero_cuenta,
                grupo: item.grupo,
                estado: item.estatus_texto || MAP_ESTATUS[item.id_estatus] || "DESCONOCIDO",
                raw: item
            }));

            resolve(filasAdaptadas);
        }, 300);
    });
};

// Servicio para actualizar estudiante
export const updateEstudiante = async (id, data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: "Estudiante actualizado correctamente" });
        }, 300);
    });
};

// Servicio para eliminar estudiante
export const deleteEstudiante = async (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: "Estudiante eliminado correctamente" });
        }, 300);
    });
};

// Servicio para carga masiva de estudiantes
export const uploadEstudiantes = async (file) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: "Archivo procesado exitosamente" });
        }, 500);
    });
};