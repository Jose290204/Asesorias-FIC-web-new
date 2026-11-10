import { useEffect, useState } from 'react';
import { traerDisponibilidadDeAsesor } from '../../../../Services/asesoriasAdminService';

// Trae la disponibilidad de UN asesor (materias, horarios por día y modalidades) para que el admin
// ofrezca solo lo que ese asesor imparte. Se vuelve a pedir si cambia el id.
export default function useDisponibilidadDeAsesor(asesorId) {
  const [estado, setEstado] = useState({ id: null, disponibilidad: null, error: false });

  useEffect(() => {
    if (!asesorId) return undefined;

    let cancelado = false;

    traerDisponibilidadDeAsesor(asesorId)
      .then((datos) => {
        if (!cancelado) setEstado({ id: asesorId, disponibilidad: datos, error: false });
      })
      .catch((err) => {
        console.error('Error al cargar la disponibilidad del asesor', err);
        if (!cancelado) setEstado({ id: asesorId, disponibilidad: null, error: true });
      });

    return () => {
      cancelado = true;
    };
  }, [asesorId]);

  // Mientras el estado guardado sea de otro asesor, se considera que todavía está cargando
  const vigente = estado.id === asesorId;

  return {
    disponibilidad: vigente ? estado.disponibilidad : null,
    error: vigente && estado.error,
    cargando: Boolean(asesorId) && !vigente,
  };
}
