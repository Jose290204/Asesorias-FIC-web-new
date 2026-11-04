import { useEffect, useState } from 'react';
import { traerDisponibilidad } from '../../../../Services/asesoriasAsesorService';

// Trae la disponibilidad del asesor logueado (materias, horarios por día y modalidades)
// cada vez que "abierto" pasa a true. Los modales la usan para ofrecer solo lo que el asesor imparte.
export default function useDisponibilidadAsesor(abierto) {
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!abierto) return undefined;

    let cancelado = false;

    traerDisponibilidad()
      .then((datos) => {
        if (cancelado) return;
        setDisponibilidad(datos);
        setError(false);
      })
      .catch((err) => {
        console.error('Error al cargar la disponibilidad', err);
        if (!cancelado) setError(true);
      });

    return () => {
      cancelado = true;
    };
  }, [abierto]);

  return { disponibilidad, cargando: abierto && !disponibilidad && !error, error };
}
