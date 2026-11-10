// src/Services/asesoresService.js
import api from './api';

export const asesoresService = {

    // Trae el perfil completo del asesor logueado: nombre, número de cuenta, correo,
    // materias que asesora, y horarios disponibles.
    obtenerPerfilAsesor: async () => {
        const response = await api.get('/asesores/perfil-asesor');
        return response.data;
    },

    actualizarMateriasYHorarios: async (materias, horarios) => {
        const response = await api.put('/asesores/materias-horarios', {
            Materias: materias,
            Horarios: horarios
        });
        return response.data;
    }

};

