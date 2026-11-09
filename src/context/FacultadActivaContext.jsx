import { createContext, useContext, useEffect, useState } from 'react';
import {
  guardarFacultadActiva,
  leerFacultadActiva,
  limpiarFacultadActiva,
} from '../Services/facultadActiva';
import { useAuth } from './AuthContext';

const FacultadActivaContext = createContext();

// Va DENTRO de AuthProvider: necesita saber si hay sesión.
export function FacultadActivaProvider({ children }) {
  const { usuario, loading } = useAuth();
  const [guardada, setGuardada] = useState(leerFacultadActiva);

  // Sin sesión (ya terminó de comprobarse) no puede quedar ninguna facultad activa.
  // Se espera a `loading` para no borrarla al recargar mientras se revisa la sesión.
  useEffect(() => {
    if (!loading && !usuario) {
      limpiarFacultadActiva();
      setGuardada(null);
    }
  }, [loading, usuario]);

  // api.js avisa cuando el backend rechaza la facultad elegida (inactiva o inexistente)
  useEffect(() => {
    const olvidar = () => {
      limpiarFacultadActiva();
      setGuardada(null);
    };
    window.addEventListener('facultad-invalida', olvidar);
    return () => window.removeEventListener('facultad-invalida', olvidar);
  }, []);

  const entrar = (facultad) => {
    guardarFacultadActiva(facultad);
    setGuardada({ id: facultad.id, nombre: facultad.nombre, siglas: facultad.siglas });
  };

  const salir = () => {
    limpiarFacultadActiva();
    setGuardada(null);
  };

  return (
    <FacultadActivaContext.Provider
      value={{ facultadActiva: usuario ? guardada : null, entrar, salir }}
    >
      {children}
    </FacultadActivaContext.Provider>
  );
}

export const useFacultadActiva = () => useContext(FacultadActivaContext);
