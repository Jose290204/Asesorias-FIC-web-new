import { createContext, useContext, useEffect, useState } from 'react';
import usuariosService from '../Services/usuariosService'; // ajusta la ruta según tu proyecto

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [rol, setRol] = useState(null);
    const [loading, setLoading] = useState(true);

    // Al montar la app (o al recargar), preguntamos al backend si la cookie sigue viva
    useEffect(() => {
        const checkSession = async () => {
            try {

                 await new Promise((resolve) => setTimeout(resolve, 500));
                const response = await usuariosService.get('/perfil');
                setUsuario(response.data.usuario);
                setRol(response.data.usuario?.id_rol != null ? Number(response.data.usuario.id_rol) : null);
            } catch (error) {
                console.error('Error en sesion', error)
                setUsuario(null);
                setRol(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    // login recibe directo los datos que ya te regresó el endpoint /login
    const login = (usuarioData) => {
        setUsuario(usuarioData);
        setRol(usuarioData?.id_rol != null ? Number(usuarioData.id_rol) : null);
    };

    const logout = async () => {
        try {
            await usuariosService.post('/logout');
        } catch (error) {
            console.error('Error al cerrar sesión', error);
        } finally {
            setUsuario(null);
            setRol(null);
        }
    };

    return (
        <AuthContext.Provider value={{ usuario, rol, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);