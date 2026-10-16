import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Convierte una fecha de solicitud a dayjs. Acepta "YYYY-MM-DD", "DD/MM/YYYY", "DD/MM/YY"
// o textos como "Lunes 27/09/26". Devuelve null si no se puede interpretar.
export const parsearFechaSolicitud = (valor) => {
    if (!valor) return null;
    const texto = String(valor);
    let fecha = null;

    if (/^\d{4}-\d{2}-\d{2}/.test(texto)) {
        fecha = dayjs(texto.slice(0, 10));
    } else {
        const m = texto.match(/(\d{2})\/(\d{2})\/(\d{2,4})/);
        if (m) {
            const anio = m[3].length === 2 ? `20${m[3]}` : m[3];
            fecha = dayjs(`${anio}-${m[2]}-${m[1]}`);
        }
    }

    return fecha && fecha.isValid() ? fecha : null;
};

// Formato único para mostrar la fecha en toda la vista: "Martes 27/10/26"
export const formatearFechaSolicitud = (valor) => {
    const fecha = parsearFechaSolicitud(valor);
    if (!fecha) return valor || 'N/A';
    const texto = fecha.locale('es').format('dddd DD/MM/YY');
    return texto.charAt(0).toUpperCase() + texto.slice(1);
};