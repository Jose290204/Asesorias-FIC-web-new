import LogoUas from "../../assets/logo_uas.png";
import Menu from "./components/Menu";
import Container from "@mui/material/Container";

import NuestroEquipo from "./components/secciones/NuestroEquipo";
import NuestroProyecto from "./components/secciones/NuestroProyecto";
import QuienesSomos from "./components/secciones/QuienesSomos";
import ComoSurgio from "./components/secciones/ComoSurgio";
import Objetivo from "./components/secciones/Objetivos";
import Alcance from "./components/secciones/Alcance";
import MisionVision from "./components/secciones/MisionVision";
import Vinculacion from "./components/secciones/Vinculacion";


export default function Conocenos(){
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
            <NuestroEquipo/>

            {/* {seccion de Nuestro Proyecto} */}
            <NuestroProyecto/>

             {/* {seccion de Quienes Somos} */}
              <QuienesSomos/>
           
            {/* {seccion de Como SURGIO} */}
              <ComoSurgio/>

            {/* {seccion de Objetivo} */}
              <Objetivo/>

              {/* {seccion de Alcance} */}
              <Alcance/>

             {/* {seccion de Mision} */}
              <MisionVision/>

            {/* {seccion de vinculacion} */}
              <Vinculacion/>
        </main>

        {/* //FOOTER */}
          <footer id="contacto" className="bg-[#244B91] text-white">
            <div className="flex flex-col lg:flex-row justify-between gap-6 text-[11px] sm:text-[13px] text-center lg:text-left leading-tight">
    
    {/* ============================= PARTE IZQUIERDA ========================= */}
            <div className="text-justify">
              <h2 className="font-bold text-xl mb-1">Contacto</h2>
              <p>Facultad de Informática Culiacán</p>
              <p>C. Josefa Ortiz de Domínguez S/N, Cd Universitaria, CIUDAD UNIVERSITARIA, 80013 Culiacán</p>
              <p>sitema@correo.com</p>
            </div>

   {/* ============================= PARTE DERECHA ========================= */}
            <div className="w-full h-[250px] rounded-xl overflow-hidden">
              <iframe>
                
              </iframe>
            </div>


            </div>
          </footer>

      </div>
    );
}


