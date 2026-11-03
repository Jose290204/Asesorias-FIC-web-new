// rolAdministrador/components/usuariosEnLinea/tiempo.js

// Minutos sin actividad a partir de los cuales una sesión deja de contarse como "en línea"
export const MINUTOS_EN_LINEA = 5;

// Minutos transcurridos desde una fecha ISO
export const minutosDesde = (fechaIso) => {
    const marca = new Date(fechaIso).getTime();
    if (Number.isNaN(marca)) return null;
    return Math.max(0, Math.floor((Date.now() - marca) / 60000));
};

// La sesión tuvo actividad reciente
export const estaEnLinea = (fechaIso) => {
    const minutos = minutosDesde(fechaIso);
    return minutos !== null && minutos < MINUTOS_EN_LINEA;
};

// Texto relativo: "Ahora", "Hace 7 min", "Hace 2 h", "Hace 3 d"
export const textoHace = (fechaIso) => {
    const minutos = minutosDesde(fechaIso);
    if (minutos === null) return '';
    if (minutos < 1) return 'Ahora';
    if (minutos < 60) return `Hace ${minutos} min`;
    if (minutos < 60 * 24) return `Hace ${Math.floor(minutos / 60)} h`;
    return `Hace ${Math.floor(minutos / (60 * 24))} d`;
};