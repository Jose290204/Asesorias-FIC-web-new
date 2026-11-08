import { useEffect, useState } from 'react';
import LogoFic from '../../../assets/fic_logo.png';
import { ROL } from '../../../constants/roles';
import { useAuth } from '../../../context/AuthContext';
import { useFacultadActiva } from '../../../context/FacultadActivaContext';
import { catalogosService } from '../../../Services/catalogosService';

// Franja superior del contenido (solo escritorio): logo de la facultad, su nombre y el ciclo escolar vigente.
// - La facultad sale de la sesión (usuario.facultad); si el super admin está dentro del panel
//   de una facultad, se muestra esa.
// - El ciclo sale de GET /catalogos (campo ciclo_escolar). Si el backend aún no lo manda, no se muestra.
export default function BarraContexto() {
  const { usuario, rol } = useAuth();
  const { facultadActiva } = useFacultadActiva();
  const [ciclo, setCiclo] = useState(null);

  // Panel principal del super admin: no está dentro de ninguna facultad
  const enPanelPrincipal = rol === ROL.SUPER_ADMIN && !facultadActiva;

  useEffect(() => {
    if (enPanelPrincipal) return undefined;
    let vigente = true;
    catalogosService
      .obtenerCatalogos()
      .then((datos) => {
        if (vigente) setCiclo(datos?.ciclo_escolar ?? null);
      })
      .catch(() => {
        /* sin ciclo: la barra se ve igual, solo sin esa etiqueta */
      });
    return () => {
      vigente = false;
    };
  }, [enPanelPrincipal, facultadActiva?.id]);

  const facultad =
    rol === ROL.SUPER_ADMIN && facultadActiva ? facultadActiva : usuario?.facultad;
  const titulo = enPanelPrincipal ? 'Panel de Super Administración' : (facultad?.nombre ?? 'Asesorías');

  return (
    <div className="sticky top-0 z-10 hidden items-center gap-3 bg-[#D2B23D] shadow-xl px-6 py-2 lg:flex">
      <img src={LogoFic} alt="Logo de la facultad" className="h-10 w-auto object-contain" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#1B3A73]">
          {titulo}
        </p>
      </div>

      {!enPanelPrincipal && ciclo?.nombre && (
        <p className="whitespace-nowrap text-sm font-bold text-[#1B3A73]">
          Ciclo escolar {ciclo.nombre}
        </p>
      )}
    </div>
  );
}
