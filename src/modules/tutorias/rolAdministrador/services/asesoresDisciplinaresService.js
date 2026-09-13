const mockAsesores = [
    {
        id_asesor: 1,
        nombre: "Crisoforo Ahuelican Ahuejote",
        correo: "crisoforoahuelican@info.uas.edu.mx",
        telefono: "6678921230",
        numero_cuenta: "22116834",
        estado: "ACTIVO"
    },
    {
        id_asesor: 2,
        nombre: "Jenifer Guadalupe Tizoc Lopez",
        correo: "jenifer.tizoc@info.uas.edu.mx",
        telefono: "6671234567",
        numero_cuenta: "22116835",
        estado: "ACTIVO"
    },
    {
        id_asesor: 3,
        nombre: "Jose Angel Astorga Mejia",
        correo: "jose.astorga@info.uas.edu.mx",
        telefono: "6679876543",
        numero_cuenta: "22116836",
        estado: "INACTIVO"
    }
];

export const getAsesoresDisciplinares = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filasAdaptadas = mockAsesores.map((item) => ({
                id: item.id_asesor,
                nombre: item.nombre,
                correo: item.correo,
                telefono: item.telefono,
                numeroCuenta: item.numero_cuenta,
                estado: item.estado,
                raw: item
            }));

            resolve(filasAdaptadas);
        }, 300);
    });
};