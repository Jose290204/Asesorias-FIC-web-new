// src/Services/catalogosService.js
import api from './api';

export const catalogosService = {
    obtenerCatalogos: async () => {
        const response = await api.get('/catalogos');
        // GET /catalogos responde { horarios, modalidades, razones, dias } sin envoltorio "data";
        // se acepta también la forma envuelta por si el backend la cambia
        return response.data?.data ?? response.data;
    }
};