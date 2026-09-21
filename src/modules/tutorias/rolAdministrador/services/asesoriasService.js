// src/Services/asesoriasService.js
import api from './api';

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
            fecha_inicio: item.fecha_inicio,
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