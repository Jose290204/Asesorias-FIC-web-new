// Simulación de API / Datos locales para Asesores Par
let asesoresParData = [
  {
    id: 1,
    materia: "Programación Web",
    estudiante: "Crisoforo Ahuelican Ahuejote",
    asesor: "María Fernanda López",
    inicio: "2026-03-01",
    horario: "10:00 - 11:00 AM",
    correo: "crisoforoahuelican@info.uas.edu.mx",
    telefono: "6678921230",
    numeroCuenta: "22116834",
    estado: "ACTIVO",
    observaciones: "Asesoría semanal de reforzamiento"
  },
  {
    id: 2,
    materia: "Bases de Datos",
    estudiante: "Juan Pablo Sánchez",
    asesor: "María Fernanda López",
    inicio: "2026-03-05",
    horario: "11:00 - 12:00 PM",
    correo: "maria.lopez@info.uas.edu.mx",
    telefono: "6671234567",
    numeroCuenta: "22116835",
    estado: "ACTIVO",
    observaciones: "Dudas sobre normalización"
  },
  {
    id: 3,
    materia: "Estructura de Datos",
    estudiante: "Carlos Eduardo Gómez",
    asesor: "Juan Pablo Sánchez",
    inicio: "2026-03-10",
    horario: "8:00 - 9:00 AM",
    correo: "juan.sanchez@info.uas.edu.mx",
    telefono: "6679876543",
    numeroCuenta: "22116836",
    estado: "INACTIVO",
    observaciones: "Preparación para examen extraordinario"
  },
  {
    id: 4,
    materia: "Programación Web",
    estudiante: "Crisoforo Ahuelican Ahuejote",
    asesor: "María Fernanda López",
    inicio: "2026-03-01",
    horario: "10:00 - 11:00 AM",
    correo: "crisoforoahuelican@info.uas.edu.mx",
    telefono: "6678921230",
    numeroCuenta: "22116834",
    estado: "ACTIVO",
    observaciones: "Asesoría semanal de reforzamiento"
  },
  {
    id: 5,
    materia: "Bases de Datos",
    estudiante: "Juan Pablo Sánchez",
    asesor: "María Fernanda López",
    inicio: "2026-03-05",
    horario: "11:00 - 12:00 PM",
    correo: "maria.lopez@info.uas.edu.mx",
    telefono: "6671234567",
    numeroCuenta: "22116835",
    estado: "ACTIVO",
    observaciones: "Dudas sobre normalización"
  },
  {
    id: 6,
    materia: "Estructura de Datos",
    estudiante: "Carlos Eduardo Gómez",
    asesor: "Juan Pablo Sánchez",
    inicio: "2026-03-10",
    horario: "8:00 - 9:00 AM",
    correo: "juan.sanchez@info.uas.edu.mx",
    telefono: "6679876543",
    numeroCuenta: "22116836",
    estado: "INACTIVO",
    observaciones: "Preparación para examen extraordinario"
  },
  {
    id: 7,
    materia: "Programación Web",
    estudiante: "Crisoforo Ahuelican Ahuejote",
    asesor: "María Fernanda López",
    inicio: "2026-03-01",
    horario: "10:00 - 11:00 AM",
    correo: "crisoforoahuelican@info.uas.edu.mx",
    telefono: "6678921230",
    numeroCuenta: "22116834",
    estado: "ACTIVO",
    observaciones: "Asesoría semanal de reforzamiento"
  },
  {
    id: 8,
    materia: "Bases de Datos",
    estudiante: "Juan Pablo Sánchez",
    asesor: "María Fernanda López",
    inicio: "2026-03-05",
    horario: "11:00 - 12:00 PM",
    correo: "maria.lopez@info.uas.edu.mx",
    telefono: "6671234567",
    numeroCuenta: "22116835",
    estado: "ACTIVO",
    observaciones: "Dudas sobre normalización"
  },
  {
    id: 9,
    materia: "Estructura de Datos",
    estudiante: "Carlos Eduardo Gómez",
    asesor: "Juan Pablo Sánchez",
    inicio: "2026-03-10",
    horario: "8:00 - 9:00 AM",
    correo: "juan.sanchez@info.uas.edu.mx",
    telefono: "6679876543",
    numeroCuenta: "22116836",
    estado: "INACTIVO",
    observaciones: "Preparación para examen extraordinario"
  }
];

// Obtener la lista completa de Asesores Par
export const getAsesoresPar = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...asesoresParData]);
    }, 500);
  });
};

// Crear un nuevo Asesor Par
export const createAsesorPar = (nuevoAsesor) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const asesorCreado = {
        id: asesoresParData.length + 1,
        ...nuevoAsesor,
        estado: nuevoAsesor.estado || "ACTIVO"
      };
      asesoresParData.push(asesorCreado);
      resolve(asesorCreado);
    }, 400);
  });
};

// Eliminar/Inactivar un Asesor Par por ID
export const deleteAsesorPar = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      asesoresParData = asesoresParData.filter((item) => item.id !== id);
      resolve({ success: true, id });
    }, 300);
  });
};