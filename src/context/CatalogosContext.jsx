// src/context/CatalogosContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { catalogosService } from '../Services/catalogosService';

const CatalogosContext = createContext();

export function CatalogosProvider({ children }) {
    const [catalogos, setCatalogos] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarCatalogos = async () => {
            try {
                setLoading(true);
                const datos = await catalogosService.obtenerCatalogos();
                setCatalogos(datos);
            } catch (error) {
                console.error('Error al cargar catálogos', error);
            } finally {
                setLoading(false);
            }
        };

        cargarCatalogos();
    }, []);

    return (
        <CatalogosContext.Provider value={{ catalogos, loading }}>
            {children}
        </CatalogosContext.Provider>
    );
}

export const useCatalogos = () => useContext(CatalogosContext);