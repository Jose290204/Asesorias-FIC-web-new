import { ExternalLink, Menu } from 'lucide-react';
// import { useState } from 'react';
import LogoBienestar from '../../../assets/dependencias/bienestar.png';
import LidatFic from '../../../assets/dependencias/lidatfic.png';
import LogoFicFooter from '../../../assets/dependencias/logofic.png';
import fondoInicio from '../../../assets/fondo_inicio.jpeg';
import LogoUas from '../../../assets/logo_uas.png';
import FormularioLogin from '../../../components/auth/formularioLogin';

export default function Login() {

  

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Barra de navegación superior (AppBar) */}
      <header className="sticky top-0 z-50 bg-[#244B91] text-white h-[70px] pr-[35px] sm:pr-[90px] flex items-center justify-between shadow-md relative">
        
        {/* Lado Izquierdo: Menú + Logo UAS */}
        <div className="flex items-center">
          
          {/* menu boton*/}
          <button 
            className="absolute left-2 sm:left-4 p-1.5 hover:bg-white/10 rounded-lg transition"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          {/* logo uas */}
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

        {/* Lado Derecho: Título y Subtítulo de la Facultad */}
        <div className="flex flex-col items-center">
          <h1 className="text-[17px] sm:text-[18px] font-bold text-white">
            Tutorias FIC
          </h1>
          <p className="text-[14px] sm:text-[15px] text-white">
            Facultad de Informática Culiacán
          </p>
        </div>
      </header>

      {/* formulario */}
      <main 
        className="flex-1 flex justify-center items-center py-10 pb-[150px] pt-[150px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${fondoInicio})` }}
      >
        <FormularioLogin/>
      </main>

     <footer className="bg-[#244B91] text-white rounded-t-[30px] px-6 sm:px-16 py-8 w-full mt-auto">
  <div className="max-w-[1200px] mx-auto">
    
    {/* Contenedor de Logos */}
    <div className="flex justify-center items-center gap-6 sm:gap-12 mb-8">
      {/* Logo 1 */}
      <img 
        src={LogoFicFooter}
        alt="Logo FIC" 
        className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] object-contain"
      />
      {/* Logo 2 */}
      <img 
        src={LidatFic}
        alt="Logo LIDAT FIC" 
        className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] object-contain"
      />
      {/* Logo 3 */}
      <img 
        src={LogoBienestar}
        alt="Logo Bienestar" 
        className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] object-contain"
      />
    </div>

    {/* Contenedor de Textos */}
    <div className="flex flex-col lg:flex-row justify-between gap-6 text-[11px] sm:text-[13px] text-center lg:text-left leading-tight">
      
      {/* Desarrollado por */}
      <div className="flex flex-col items-center lg:items-start space-y-0.5">
        <h3 className="font-bold mb-1.5 text-[12px] sm:text-[14px]">Desarrollado por:</h3>
        <p>Astorga Mejia Jose Angel</p>
        <p>Barrera Rodriguez Leslie Mayram</p>
        <p>Ibarra Meza Raquel del Pilar</p>
        <p>Medina Hernandez Bhrandon Nedel</p>
        <p>Sanchez Barraza Erick Fernando</p>
        <p>Tizoc Lopez Jenifer Guadalupe</p>
      </div>

      {/* Colaboradores */}
      <div className="flex flex-col items-center lg:items-start space-y-0.5">
        <h3 className="font-bold mb-1.5 text-[12px] sm:text-[14px]">Colaboradores:</h3>
        <p>MC. Alejandro Yahir Sicairos Ochoa</p>
        <p>MGTI. Oscar Mejia Quintero</p>
        <p>MC. Evelia Inzunza García</p>
        <p>Dr. Zeus del Valle Castillo Nájera</p>
        <p>Dr. Jose de Jesús Uriarte Adrian</p>
      </div>

      {/* Contacto */}
      <div className="flex flex-col items-center lg:items-start space-y-1">
        <h3 className="font-bold mb-0.5 text-[12px] sm:text-[14px]">Contacto:</h3>
        <a href="mailto:contacto@correo.mx" className="hover:underline">
          contacto@correo.mx
        </a>
        <button className="flex items-center justify-center lg:justify-start gap-1 hover:underline">
          <ExternalLink className="w-3 h-3" />
          Conocenos
        </button>
        <button className="flex items-center justify-center lg:justify-start gap-1 hover:underline">
          <ExternalLink className="w-3 h-3" />
          Politicas de privacidad
        </button>
      </div>

      {/* Copyright */}
      <div className="flex justify-center lg:justify-start items-center pt-2 lg:pt-0">
        <a href="https://fic.uas.edu.mx/" target="_blank" rel="noreferrer" className="hover:underline text-[10px] sm:text-[12px]">
          © Facultad de Informática Culiacán - 2026
        </a>
      </div>

    </div>
  </div>
</footer>

    </div>
  );
}

// COMPONENTE DEL FORMULARIO CENTRAL
