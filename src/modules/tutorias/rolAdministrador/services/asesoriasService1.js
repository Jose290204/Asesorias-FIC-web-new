import api from '../../../../Services/api'

export const asesoriasService = {

    getAsesoriasEnCurso: async () => {

        try {
            const response = await api.get('/asesorias');
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener asesorias', error);
            throw error;
        }

    },

    completarAsesoria: async (id) => {
        const response = await api.patch(`/asesorias/${id}/completar`);
        return response.data;
    },

    eliminarAsesoria: async (id) => {
        const response = await api.delete(`/asesorias/${id}/eliminar`);
        return response.data;
    }

};