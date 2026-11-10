import LogoAsesorias from '../../assets/logo_asesorias.png';
import TextoFicAsesorias from '../../assets/texto_fic_asesorias.png';

// Logo de las pantallas de acceso (login y recuperar contraseña): el escudo de Asesorías
// y, al lado, el texto "FIC Asesorías".
export default function LogoFicAsesorias() {
  return (
    <div role="img" aria-label="Logo Asesorías FIC" className="flex items-center gap-[10px] sm:gap-[14px]">
      <img src={LogoAsesorias} alt="" className="w-[100px] sm:w-[115px] object-contain" />
      <img src={TextoFicAsesorias} alt="" className="w-[78px] sm:w-[90px] object-contain" />
    </div>
  );
}
