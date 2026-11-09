import { useEffect, useState } from 'react';
import LogoFic from '../../../assets/fic_logo.png';
import LogoUas from '../../../assets/logo_uas.png';
import { ROL } from '../../../constants/roles';
import { useAuth } from '../../../context/AuthContext';
import { useFacultadActiva } from '../../../context/FacultadActivaContext';
import { catalogosService } from '../../../Services/catalogosService';

// Franja superior del contenido (solo escritorio): logo de la facultad, su nombre y el ciclo escolar vigente.
// - La facultad sale de la sesión (usuario.facultad); si el super admin está dentro del panel
//   de una facultad, se muestra esa.
// - El ciclo sale de GET /catalogos (campo ciclo_escolar). Si el backend aún no lo manda, no se muestra.
// - En el panel principal del super admin (fuera de toda facultad) va el logo de la UAS y no hay ciclo:
//   el ciclo escolar es de cada facultad, así que mostrar uno ahí sería engañoso.
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
  const titulo = enPanelPrincipal ? 'Panel de Administración' : (facultad?.nombre ?? 'Asesorías');

  return (
    <div className="sticky top-0 z-10 hidden items-center gap-3 bg-[linear-gradient(90deg,#dcc152_0%,#D2B23D_50%,#c4a22f_100%)] shadow-[0_4px_18px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.35)] border-b border-[#a98a1f]/40 px-6 py-2 lg:flex">
      <img
        src={enPanelPrincipal ? LogoUas : LogoFic}
        alt={enPanelPrincipal ? 'Logo de la UAS' : 'Logo de la facultad'}
        className="h-10 w-auto object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#1B3A73]">
          {titulo}
        </p>
      </div>

      {!enPanelPrincipal && ciclo?.nombre && (
        <p className="whitespace-nowrap rounded-full bg-[#1B3A73]/10 px-3 py-1 text-sm font-bold text-[#1B3A73] ring-1 ring-[#1B3A73]/20">
          Ciclo escolar {ciclo.nombre}
        </p>
      )}
    </div>
  );
}
