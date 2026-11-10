// src/Services/asesoriasService.js
import api from './api';

// Convierte "2026-10-20T00:00:00.000Z" a "20/OCT/2026" para mostrarla bonita, sin desfase de zona horaria
function formatearFechaVisible(fechaISO) {
    if (!fechaISO) return '';
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getUTCDate()).padStart(2, '0');   // getUTCDate, no getDate
    const mes = meses[fecha.getUTCMonth()];                     // getUTCMonth, no getMonth
    const anio = fecha.getUTCFullYear();                        // getUTCFullYear, no getFullYear
    return `${dia}/${mes}/${anio}`;
}

export const asesoriasService = {

    // Trae las asesorías en curso del asesor logueado y las adapta
    // a la forma que espera la UI
    obtenerAsesoriasAsesor: async () => {
        const response = await api.get('/asesorias/asesor');

        const filasAdaptadas = response.data.data.map((item) => ({
            id: item.id_asesoria,
            id_estudiante: item.id_estudiante,
            estudiante: item.estudiante,
            id_asesor: item.id_asesor,
            asesor: item.asesor,
            id_licenciatura: item.id_licenciatura,
            licenciatura: item.licenciatura || '',
            id_grupo: item.id_grupo,
            grupo: item.grupo,
            id_materia: item.id_materia,
            materia: item.materia,
            id_horario: item.id_horario,
            horario: item.horario,
            fecha_inicio: item.fecha_inicio, // se conserva tal cual (ISO), para mandarla de vuelta al backend
            fecha_inicio_formateada: formatearFechaVisible(item.fecha_inicio), // solo para mostrar en la UI
            fecha_fin: item.fecha_fin,
            id_modalidad: item.id_modalidad,
            modalidad: item.modalidad || '',
            id_razon: item.id_razon,
            razon: item.razon || '',
            sesiones_tomadas: Number(item.sesiones_tomadas) || 0,
            observaciones: item.observaciones || '',
            material_adicional: item.material_adicional || []
        }));

        return filasAdaptadas;
    }

};