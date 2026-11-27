import { useNavigate } from 'react-router-dom';
import { ROL } from '../constants/roles';
import { useAuth } from '../context/AuthContext';

// Un estudiante que también es asesor (asesor par) tiene los dos paneles. Esto da el botón para pasar de uno
// al otro: { etiqueta, cambiar } o null si la persona solo tiene un panel.
export default function useCambioDePanel() {
  const navigate = useNavigate();
  const { rol, roles, cambiarRol } = useAuth();

  const tiene = (r) => roles.includes(r);

  let destino = null;
  if (rol === ROL.ESTUDIANTE && tiene(ROL.ASESOR)) {
    destino = { rol: ROL.ASESOR, etiqueta: 'Cambiar a panel asesor', ruta: '/asesor/solicitudes-pendientes' };
  } else if (rol === ROL.ASESOR && tiene(ROL.ESTUDIANTE)) {
    destino = { rol: ROL.ESTUDIANTE, etiqueta: 'Cambiar a panel estudiante', ruta: '/estudiante/solicitar-asesorias' };
  }

  if (!destino) return null;

  return {
    etiqueta: destino.etiqueta,
    cambiar: () => {
      cambiarRol(destino.rol);
      navigate(destino.ruta, { replace: true });
    },
  };
}
