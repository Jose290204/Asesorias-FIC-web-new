import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useNavigate } from 'react-router-dom';
import LogoUas from "../../assets/logo_uas.png";
import Menu from "./components/Menu";


import Alcance from "./components/secciones/Alcance";
import ComoSurgio from "./components/secciones/ComoSurgio";
import MisionVision from "./components/secciones/MisionVision";
import NuestroEquipo from "./components/secciones/NuestroEquipo";
import NuestroProyecto from "./components/secciones/NuestroProyecto";
import Objetivo from "./components/secciones/Objetivos";
import QuienesSomos from "./components/secciones/QuienesSomos";
import Vinculacion from "./components/secciones/Vinculacion";



export default function Conocenos() {

  // Funcion para navegar entre pantallas
  const navigate = useNavigate();

  function irInicioPage() {
    navigate('/');
  }

  return (
    <div className="min-h-dvh bg-slate-100 flex flex-col scroll-smooth">

      {/* ============ ENCABEZADO ============ */}
      <header className="bg-linear-to-r from-[#1B3A73] to-[#244B91] text-white px-4 sm:px-8 lg:px-12 py-3 sm:py-4 shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo + título */}
          <button
            onClick={irInicioPage}
            className="flex items-center gap-3 sm:gap-4 min-w-0 cursor-pointer text-left"
            aria-label="Ir al inicio"
          >
            <img
              src={LogoUas}
              alt="Logo Institucional"
              className="h-11 sm:h-14 w-auto object-contain shrink-0"
            />

            {/* Separador entre el logo y el texto */}
            <span className="hidden sm:block h-10 w-px bg-white/30" />

            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold leading-tight truncate">
                Tutorías FIC
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 leading-tight truncate">
                Facultad de Informática Culiacán
              </p>
            </div>
          </button>

          {/* Botón para volver al inicio */}
          <button
            onClick={irInicioPage}
            className="shrink-0 inline-flex items-center gap-2 rounded-[5px] border border-white/40 px-3 sm:px-4 py-2 text-sm font-medium hover:bg-white hover:text-[#244B91] transition-colors cursor-pointer"
          >
            <HomeOutlinedIcon fontSize="small" />
            <span className="hidden sm:inline">Inicio</span>
          </button>

        </div>
      </header>

      {/*=============== MENU ==================*/}
      <div className="sticky top-0 z-50">
        <Menu />
      </div>

      {/* { ============ CONTENIDO DE LA PAGINA}=============== */}

      <main className="flex-1">

        {/* {seccion de Nuestro Equipo} */}
        <NuestroEquipo />

        {/* {seccion de Nuestro Proyecto} */}
        <NuestroProyecto />

        {/* {seccion de Quienes Somos} */}
        <QuienesSomos />

        {/* {seccion de Como SURGIO} */}
        <ComoSurgio />

        {/* {seccion de Objetivo} */}
        <Objetivo />

        {/* {seccion de Alcance} */}
        <Alcance />

        {/* {seccion de Mision} */}
        <MisionVision />

        {/* {seccion de vinculacion} */}
        <Vinculacion />
      </main>

      {/* ===============   FOOTER    ==========================*/}
      <footer id="contacto" className="w-full bg-linear-to-r from-[#1B3A73] to-[#244B91] text-white shadow-inner border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* ============================= PARTE IZQUIERDA ========================= */}
          <div className="text-center md:text-left">

            <h2 className="font-bold text-2xl sm:text-3xl mb-1">Contacto</h2>
            <div className="mx-auto md:mx-0 mb-6 h-1 w-14 rounded-full bg-[#C49E0D]" />

            <p className="text-base sm:text-lg font-semibold mb-5">Facultad de Informática Culiacán</p>

            <ul className="flex flex-col gap-4 text-sm sm:text-base text-blue-50">
              <li className="flex items-start justify-center md:justify-start gap-3">
                <LocationOnOutlinedIcon className="mt-0.5 shrink-0 text-[#EBD9B4]" />
                <span className="max-w-sm leading-relaxed text-left">
                  C. Josefa Ortiz de Domínguez S/N, Cd Universitaria, CIUDAD UNIVERSITARIA, 80013 Culiacán
                </span>
              </li>

              <li className="flex items-center justify-center md:justify-start gap-3">
                <EmailOutlinedIcon className="shrink-0 text-[#EBD9B4]" />
                <a href="mailto:sitema@correo.com" className="hover:underline">sitema@correo.com</a>
              </li>
            </ul>
          </div>

          {/* ============================= PARTE DERECHA ========================= */}
          <div className="w-full h-[240px] sm:h-[300px] lg:h-[320px] rounded-[10px] overflow-hidden shadow-2xl border border-white/20">
            <iframe
              className="w-full h-full border-0"
              title="Facultad de informatica UAS"
              src="https://www.openstreetmap.org/export/embed?bbox=-107.38368362188342%2C24.821274192730453%2C-107.38023430109025%2C24.82302940506748&amp;layer=mapnik&amp;marker=24.822151802007767%2C-107.38195896148682"
              loading="lazy"
            />
          </div>

        </div>

        {/* Derechos */}
        <div className="border-t border-white/10 px-6 py-4 text-center text-xs sm:text-sm text-blue-100">
          © {new Date().getFullYear()} Tutorías FIC · Facultad de Informática Culiacán · UAS
        </div>

      </footer>

    </div>
  );
}