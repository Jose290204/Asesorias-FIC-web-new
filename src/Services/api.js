import axios from 'axios';

// Token temporal para pruebas proporcionado
const TOKEN_TEMPORAL = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxLCJ1c3VhcmlvIjoiamEuYXN0b3JnYTIyIiwiaWRfcm9sIjo0LCJub21icmVfY29tcGxldG8iOiJKb3NlIEFuZ2VsIEFzdG9yZ2EgTWVqaWEiLCJpYXQiOjE3ODk0ODkwMjYsImV4cCI6MTc4OTQ5NjIyNn0.CdDXmUWrMF1Y-tzimMqAG2ehRnFLdLZPv3lbab1o8s8";

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || TOKEN_TEMPORAL;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;