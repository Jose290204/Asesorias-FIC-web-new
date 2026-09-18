import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = () => {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                try {
                    const payload = JSON.parse(atob(storedToken.split('.')[1]));
                    const isExpired = payload.exp * 1000 < Date.now();

                    if (isExpired) {
                        console.warn('Token expirado, cerrando sesión');
                        localStorage.removeItem('token');
                        setToken(null);
                    } else {
                        setToken(storedToken);
                    }
                } catch (error) {
                    console.error('Error al validar el token:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                }
            } else {
                console.info('No hay token guardado, usuario no autenticado');
                setToken(null);
            }
            setLoading(false);
        };

        checkSession();
    }, []);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);