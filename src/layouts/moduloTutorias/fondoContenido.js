import fondoInicio from '../../assets/fondo_inicio.jpeg';

// Fondo del contenido de todos los roles: la imagen del login con un velo claro encima para que se lea
// lo que va sobre ella. Para ver más la imagen, baja el 0.3 (0 = sin velo, 1 = sin imagen).
const VELO = 'rgba(244, 247, 252, 0.3)';

export const FONDO_CONTENIDO = `linear-gradient(${VELO}, ${VELO}), url(${fondoInicio})`;

// Clases de Tailwind que acompañan al fondo (cubrir, centrar y no moverse al hacer scroll)
export const CLASES_FONDO_CONTENIDO = 'bg-gray-100 bg-cover bg-center bg-fixed';
