import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../Services/authService'; // ajusta la ruta según tu proyecto

const AuthContext = createContext();

// Mismos números que el enum Rol del backend
const ROL_ASESOR = 3;

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [rol, setRol] = useState(null);       // rol ACTIVO (el que define la pantalla)
    const [loading, setLoading] = useState(true);

    // Guarda al usuario y decide qué rol queda activo (el rol activo solo existe en el front)
    const aplicarUsuario = (u) => {
        setUsuario(u);

        if (!u) {
            setRol(null);
            return;
        }

        const roles = (u.roles ?? []).map(Number);
        const guardado = Number(localStorage.getItem('rolActivo'));

        setRol(
            roles.includes(guardado) ? guardado
                : roles.includes(ROL_ASESOR) ? ROL_ASESOR
                : roles[0] ?? null
        );
    };

    useEffect(() => {
        // Al abrir la app: ¿hay sesión? Mientras /auth/me no exista en el backend,
        // responde 404, cae en el catch y se queda sin sesión (es lo esperado por ahora).
        const checkSession = async () => {
            try {
                aplicarUsuario(await authService.obtenerSesion());
            } catch (error) {
                aplicarUsuario(null);
                    // Sin sesión: se quita la marca que activa el skeleton al cargar
                localStorage.removeItem('_uix');
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // Si una petición da 401 a media app, se cierra la sesión del front
        const salir = () => aplicarUsuario(null);
        window.addEventListener('sesion-expirada', salir);
        return () => window.removeEventListener('sesion-expirada', salir);
    }, []);

    // Inicia sesión y devuelve el usuario, para que el login pueda redirigir con sus roles.
    // Si falla, lanza el error y el componente de login lo muestra.
    const login = async (correo, password) => {
        const u = await authService.login(correo, password);
        aplicarUsuario(u);
        localStorage.setItem('_uix', 'true');
        return u;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error al cerrar sesión', error);
        } finally {
            aplicarUsuario(null);
            localStorage.removeItem('_uix');
            localStorage.removeItem('rolActivo');
        }
    };

    // Para el selector del asesor par: solo cambia de pantalla
    const cambiarRol = (nuevoRol) => {
        if (!usuario?.roles?.map(Number).includes(Number(nuevoRol))) return;
        localStorage.setItem('rolActivo', nuevoRol);
        setRol(Number(nuevoRol));
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                rol,
                roles: (usuario?.roles ?? []).map(Number),
                loading,
                login,
                logout,
                cambiarRol,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);