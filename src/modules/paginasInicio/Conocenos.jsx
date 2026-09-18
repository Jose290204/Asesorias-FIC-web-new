import LogoUas from "../../assets/logo_uas.png";
import Menu from "./components/Menu";


import NuestroEquipo from "./components/secciones/NuestroEquipo";
import NuestroProyecto from "./components/secciones/NuestroProyecto";
import QuienesSomos from "./components/secciones/QuienesSomos";
import ComoSurgio from "./components/secciones/ComoSurgio";
import Objetivo from "./components/secciones/Objetivos";
import Alcance from "./components/secciones/Alcance";
import MisionVision from "./components/secciones/MisionVision";
import Vinculacion from "./components/secciones/Vinculacion";


export default function Conocenos() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* Barra de navegación superior (AppBar) */}
      <header className="bg-[#244B91] text-white min-h-[80px]  sm:min-h-[90px] px-4 sm:px-8 lg:px-12 flex items-center justify-between shadow-md relative">

        {/* Logo UAS */}
        <div className="flex items-center">

          <img
            src={LogoUas}
            alt="Logo Institucional"
            className="h-12 sm:h-[55px] ml-[60px] sm:ml-[90px] w-auto object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/48x48/2b3a55/FFFFFF?text=UAS';
            }}
          />
        </div>

        {/* Título y Subtítulo de la Facultad */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
            Tutorias FIC
          </h1>
          <p className="text-[14px] sm:text-[15px] text-white">
            Facultad de Informática Culiacán
          </p>
        </div>

      </header>

      {/*=============== MENU ==================*/}
      <div className="sticky top-0 z-50">
        <Menu />
      </div>

      {/* { ============ CONTENIDO DE LA PAGINA}=============== */}

      <main>

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
      <footer id="contacto" className="w-full border-t border-blue-gray-50 px-4 py-8 sm:px-8 lg:px-12  bg-[#244B91] text-white">

        <div className="max-w-7x1 mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-6">

          {/* ============================= PARTE IZQUIERDA ========================= */}
          <div className="w-full md:w-[45%] text-center md:text-left">

            <h2 className="font-bold text-2xl mb-1">Contacto</h2>
            <p className="text-base sm:text-lg mb-1">Facultad de Informática Culiacán</p>

            <p className="text-sm sm:text-base leading-relaxed mb-1">C. Josefa Ortiz de Domínguez S/N, Cd Universitaria, CIUDAD UNIVERSITARIA, 80013 Culiacán</p>

            <p className="text-sm sm:text-base leading-relaxed mb-1">sitema@correo.com</p>
          </div>

          {/* ============================= PARTE DERECHA ========================= */}
          <div className="w-full h-full md:w-[50%] h-[250%] sm:h-[300px] lg:h-[350px]  rounded-xl overflow-hidden">

            <iframe className="w-full h-full"
              title="Facultad de informatica UAS"
              width="425" height="350" src="https://www.openstreetmap.org/export/embed?bbox=-107.38368362188342%2C24.821274192730453%2C-107.38023430109025%2C24.82302940506748&amp;layer=mapnik&amp;marker=24.822151802007767%2C-107.38195896148682"   style={{ border: "1px solid black" }}> 
              
                </iframe>



          </div>

        </div>


      </footer>

    </div>
  );
}


