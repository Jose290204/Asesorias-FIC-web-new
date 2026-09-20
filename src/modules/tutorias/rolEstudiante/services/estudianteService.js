const mockResponseAPI ={
    success: true,
    data: [
        {
            id: 1,
            nombre: "Elias Cuadras Rodriguez",
            materias: ["Bases de Datos", "Redes"],
            modalidad: "Presencial / Virtual",
        },
        {
            id: 2,
            nombre: "Norma Sarahi Vegas Sauceda",
            materias: ["Matemáticas I"],
            modalidad: "Presencial / Virtual",
        },
        {
            id: 3,
            nombre: "Derek Benjamin Cruz Guebara",
            materias: ["Estructuras de Datos"],
            modalidad: "Presencial / Virtual",
        },
        {
            id: 4,
            nombre: "Josue Manuel Medina Lopez",
            materias: ["Estructuras de Datos"],
            modalidad: "Presencial / Virtual",
        },
        {
            id: 5,
            nombre: "Luis Fernando Velazquez Araujo",
            materias: ["Bases de Datos", "Matemáticas I"],
            modalidad: "Presencial / Virtual",
        },
        {
            id: 6,
            nombre: "Jenifer Guadalupe Tizoc Lopez",
            materias: ["Redes", "Programación I"],
            modalidad: "Presencial / Virtual",
        },
        {
            id: 7,
            nombre: "Jose Angel Astorga Mejia",
            materias: ["Redes", "Ingeniería de Software"],
            modalidad: "Presencial / Virtual",
        },
        {
            id: 8,
            nombre: "Lizbeth Mayram Barrera Rodriguez",
            materias: ["Programación II"],
            modalidad: "Presencial / Virtual",
        },
        {
            id: 9,
            nombre: "Crisoforo Ahuelican Ahuejote",
            materias: ["Base de Datos"],
            modalidad: "Presencial / Virtual",
        },
    ],
};

export const getAsesores = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockResponseAPI.data);
        }, 300);
    });
};