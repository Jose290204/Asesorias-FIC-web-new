import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

function decodeToken(token) {
    
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error en token', error);
        return null;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [rol, setRol] = useState(null);
    const [loading, setLoading] = useState(true);

    

    useEffect(() => {
        const checkSession = () => {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                const payload = decodeToken(storedToken);

                if (!payload) {
                    localStorage.removeItem('token');
                    setToken(null);
                    setRol(null);
                } else if (payload.exp && payload.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setToken(null);
                    setRol(null);
                } else {
                    setToken(storedToken);
                    setRol(payload?.id_rol != null ? Number(payload.id_rol) : null);// ← sacamos el rol del token
                }
            } else {
                setToken(null);
                setRol(null);
            }
            setLoading(false);
        };

        checkSession();
    }, []);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        const payload = decodeToken(newToken);
        setRol(payload?.id_rol ? Number(payload.id_rol) : null);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setRol(null);
    };

    return (
        <AuthContext.Provider value={{ token, rol, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);