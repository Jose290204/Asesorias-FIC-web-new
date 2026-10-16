// src/Services/catalogosService.js
import api from './api';

export const catalogosService = {
    obtenerCatalogos: async () => {
        const response = await api.get('/catalogos');
        return response.data.data;
    }
};