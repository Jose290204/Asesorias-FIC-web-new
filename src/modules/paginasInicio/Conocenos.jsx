import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom';
import LogoUas from "../../assets/logo_uas.png";

import adiuas from '../../assets/dependencias/adiuas.png';
import biblioteca from '../../assets/dependencias/biblioteca.png';
import bienestar from '../../assets/dependencias/bienestar.png';
import ccu from '../../assets/dependencias/ccu.jpeg';
import ciencias from '../../assets/dependencias/ciencias.jpg';
import culturauaslogo from '../../assets/dependencias/culturauaslogo.png';
import dgep from '../../assets/dependencias/dgep.jpeg';
import dgvri from '../../assets/dependencias/dgvri.png';
import direccionartistica from '../../assets/dependencias/direccionartistica.png';
import EMPRENDEUAS from '../../assets/dependencias/EMPRENDEUAS.png';
import lidatfic from '../../assets/dependencias/lidatfic.png';
import logo_dges from '../../assets/dependencias/logo_dges.png';
import logo_dsgc from '../../assets/dependencias/logo_dsgc.png';
import logo_odontologia from '../../assets/dependencias/logo_odontologia.png';
import logo_prodep from '../../assets/dependencias/logo_prodep.jpeg';
import logofic from '../../assets/dependencias/logofic.png';
import medicina from '../../assets/dependencias/medicina.png';
import piefad from '../../assets/dependencias/piefad.png';
import psicologia from '../../assets/dependencias/psicologia.png';
import radio_uas from '../../assets/dependencias/radio_uas.png';
import sau from '../../assets/dependencias/sau.png';
import serviciosocial from '../../assets/dependencias/serviciosocial.png';


/* ======================= DATOS ======================= */

// Opciones del menú: texto visible e id de la sección a la que lleva
const MENU_OPCIONES = [
  { nombre: 'Nuestro equipo', id: 'equipo' },
  { nombre: 'Nuestro Proyecto', id: 'proyecto' },
  { nombre: '¿Quiénes somos?', id: 'quienes-somos' },
  { nombre: '¿Cómo surgió?', id: 'como-surgio' },
  { nombre: 'Objetivos', id: 'objetivos' },
  { nombre: 'Alcance', id: 'alcance' },
  { nombre: 'Misión y visión', id: 'mision-vision' },
  { nombre: 'Vinculación', id: 'vinculacion' },
  { nombre: 'Contacto', id: 'contacto' },
];

// Equipo: una entrada por persona con todos sus roles
const EQUIPO = [
  {
    nombre: "MC. Alejandro Yahir Sicairos Ochoa",
    roles: ["Gerente del proyecto", "Especialista SEO", "Analista de desarrollo y calidad"],
  },
  {
    nombre: "MGTI. Óscar Mejía Quintero",
    roles: ["Gerente del proyecto", "Analista de desarrollo y calidad"],
  },
  {
    nombre: "José Ángel Astorga Mejía",
    roles: ["Gerente del proyecto", "Gerente de desarrollo", "Analista de desarrollo y calidad"],
  },
  {
    nombre: "Leslie Mayram Barrera Rodríguez",
    roles: ["Gerente de desarrollo", "Diseñadora UI/UX"],
  },
  {
    nombre: "Jenifer Guadalupe Tizoc López",
    roles: ["Gerente de desarrollo"],
  },
];

// Pasos de la línea de tiempo de "¿Cómo surgió?"
const HISTORIA = [
  {
    titulo: "La necesidad",
    texto: "Se detectó la necesidad de mejorar la gestión de asesorías en la Facultad de Informática Culiacán.",
  },
  {
    titulo: "El problema",
    texto: "Muchos estudiantes tenían dificultades para acceder a las asesorías y los asesores no contaban con una herramienta eficiente para administrar horarios y solicitudes.",
  },
  {
    titulo: "La colaboración",
    texto: "Con el apoyo de Bienestar Universitario y el Laboratorio de Innovación se decidió desarrollar una plataforma que facilite esta interacción.",
  },
  {
    titulo: "Hoy",
    texto: "Un sistema web y móvil que optimiza los procesos y mejora la experiencia de estudiantes, asesores y administradores.",
  },
];

// Objetivos del sistema
const OBJETIVOS = [
  {
    titulo: "Automatizar el flujo",
    texto: "Automatizar la solicitud, aprobación y seguimiento de las asesorías.",
  },
  {
    titulo: "Consultar horarios",
    texto: "Dar a los estudiantes un espacio para consultar horarios disponibles y enviar solicitudes.",
  },
  {
    titulo: "Apoyar a los asesores",
    texto: "Facilitar la administración de horarios, asesorías, evidencias y reportes.",
  },
  {
    titulo: "Dejar evidencia",
    texto: "Generar historial y evidencia de cada asesoría para respaldos y evaluaciones.",
  },
];

// Elementos del alcance
const ALCANCE = [
  {
    Icono: EventAvailableOutlinedIcon,
    titulo: "Gestión de asesorías",
    texto: "Los estudiantes solicitan asesorías de forma sencilla y los asesores gestionan sus horarios y citas.",
  },
  {
    Icono: ForumOutlinedIcon,
    titulo: "Interacción eficiente",
    texto: "Comunicación entre estudiantes, asesores y administradores en una plataforma centralizada.",
  },
  {
    Icono: SettingsSuggestOutlinedIcon,
    titulo: "Automatización de procesos",
    texto: "Solicitud, aprobación y seguimiento automatizados para reducir tiempos de espera y mejorar la experiencia.",
  },
  {
    Icono: AutoGraphOutlinedIcon,
    titulo: "Historial y reportes",
    texto: "Historial de asesorías y reportes para que los administradores evalúen la efectividad del sistema y lo mejoren.",
  },
];

// Misión y visión
const MISION_VISION = [
  {
    Icono: FlagOutlinedIcon,
    titulo: "Misión",
    texto:
      "Proporcionar una plataforma digital que facilite la gestión de asesorías en la Facultad de Informática de Culiacán, promoviendo la interacción efectiva entre estudiantes y asesores y contribuyendo al desarrollo académico de los estudiantes mediante el acceso a recursos de asesoría de calidad.",
  },
  {
    Icono: VisibilityOutlinedIcon,
    titulo: "Visión",
    texto:
      "Ser un referente en la implementación de soluciones tecnológicas en el ámbito académico, transformando la manera en que se gestionan las asesorías y mejorando la experiencia educativa de los estudiantes. Buscamos innovar continuamente para adaptarnos a las necesidades cambiantes de la comunidad universitaria.",
  },
];

// Dependencias vinculadas: nombre (texto alternativo) y logo
const DEPENDENCIAS = [
  { nombre: "Facultad de Informática Culiacán", img: logofic },
  { nombre: "LIDATFIC", img: lidatfic },
  { nombre: "Bienestar Universitario", img: bienestar },
  { nombre: "Servicio Social", img: serviciosocial },
  { nombre: "ADIUAS", img: adiuas },
  { nombre: "SAU", img: sau },
  { nombre: "DGVRI", img: dgvri },
  { nombre: "PIEFAD", img: piefad },
  { nombre: "Biblioteca", img: biblioteca },
  { nombre: "Cultura UAS", img: culturauaslogo },
  { nombre: "Dirección de Actividades Artísticas", img: direccionartistica },
  { nombre: "Facultad de Psicología", img: psicologia },
  { nombre: "Facultad de Medicina", img: medicina },
  { nombre: "DGEP", img: dgep },
  { nombre: "Sistema de Gestión de la Calidad", img: logo_dsgc },
  { nombre: "PRODEP", img: logo_prodep },
  { nombre: "Radio UAS", img: radio_uas },
  { nombre: "Facultad de Ciencias", img: ciencias },
  { nombre: "Facultad de Odontología", img: logo_odontologia },
  { nombre: "CCU", img: ccu },
  { nombre: "Emprende UAS", img: EMPRENDEUAS },
  { nombre: "DGES", img: logo_dges },
];


/* ======================= AYUDANTES ======================= */

// Iniciales de una persona, ignorando títulos como "MC." o "MGTI."
function iniciales(nombre) {
  return nombre
    .split(" ")
    .filter((p) => !p.endsWith("."))
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

// Título de sección con la línea dorada debajo
function TituloSeccion({ children, centrado = true, claro = false }) {
  return (
    <div className={centrado ? "text-center" : ""}>
      <h2 className={`text-2xl sm:text-4xl font-bold ${claro ? "text-white" : "text-[#1B3A73]"}`}>
        {children}
      </h2>
      <div className={`mt-3 h-1 w-14 rounded-full bg-[#C49E0D] ${centrado ? "mx-auto" : ""}`} />
    </div>
  );
}

// Sección de texto con panel de ícono; alterna lado y fondo según las props
function SeccionTexto({ id, titulo, Icono, parrafos, invertida = false, fondo = "blanco" }) {
  const fondoClase = fondo === "blanco" ? "bg-white" : "bg-slate-100";

  return (
    <section id={id} className={`scroll-mt-24 py-14 sm:py-20 ${fondoClase}`}>
      <div
        className={`max-w-6xl mx-auto px-6 grid gap-10 md:grid-cols-5 items-center ${
          invertida ? "md:[&>div:first-child]:order-2" : ""
        }`}
      >
        {/* Columna de texto */}
        <div className="md:col-span-3">
          <TituloSeccion centrado={false}>{titulo}</TituloSeccion>
          <div className="mt-6 space-y-4 max-w-prose text-slate-600 leading-relaxed text-base sm:text-lg">
            {parrafos.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>

        {/* Panel decorativo con ícono */}
        <div className="md:col-span-2 grid place-items-center">
          <div className="grid h-48 w-48 sm:h-64 sm:w-64 place-items-center rounded-3xl bg-linear-to-br from-[#1B3A73] to-[#244B91] shadow-xl rotate-3">
            <Icono sx={{ fontSize: 96, color: "#EBD9B4" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// Barra de navegación por secciones, con scroll horizontal en pantallas pequeñas
function Menu() {
  return (
    <nav className="w-full bg-[#D49A17] shadow-lg border-b border-black/10">

      {/* Contenedor con scroll horizontal y sin barra visible */}
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* w-max + mx-auto: centrado si cabe, alineado al inicio si desborda */}
        <div className="flex w-max mx-auto items-center gap-1.5 sm:gap-2 py-2.5 px-3 sm:px-6">
          {MENU_OPCIONES.map((opcion) => (
            <button
              key={opcion.id}
              onClick={() => {
                document.getElementById(opcion.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="
                text-white
                font-medium
                text-sm sm:text-base
                px-3.5 py-1.5
                rounded-lg
                whitespace-nowrap
                tracking-wide
                shrink-0
                cursor-pointer
                transition-all duration-200 ease-in-out
                hover:bg-white/20
                hover:scale-105
                active:scale-95
              "
            >
              {opcion.nombre}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}


/* ======================= PÁGINA ======================= */

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

      {/* ============ CONTENIDO DE LA PAGINA ============ */}
      <main className="flex-1">

        {/* ---------- HERO ---------- */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-14 sm:py-20 text-center">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#C49E0D] mb-3">
              Acerca de nosotros
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#1B3A73] leading-tight">
              Sistema de tutorías FIC
            </h2>
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
              La Universidad Autónoma de Sinaloa, a través de Bienestar Universitario y la Facultad
              de Informática Culiacán, en colaboración con el Laboratorio de Innovación, Desarrollo
              Académico y Tecnológico, presenta el Sistema de tutorías FIC.
            </p>
          </div>
        </section>

        {/* ---------- NUESTRO EQUIPO ---------- */}
        <section id="equipo" className="scroll-mt-24 py-14 sm:py-20 bg-slate-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-10">
              <TituloSeccion>Nuestro equipo</TituloSeccion>
            </div>

            {/* Tarjetas centradas, todas del mismo ancho */}
            <ul className="flex flex-wrap justify-center gap-6">
              {EQUIPO.map((p) => (
                <li
                  key={p.nombre}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Avatar con iniciales */}
                  <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-linear-to-br from-[#1B3A73] to-[#244B91] text-2xl font-bold text-white ring-4 ring-[#EBD9B4]">
                    {iniciales(p.nombre)}
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 leading-snug">{p.nombre}</h3>

                  {/* Roles como chips */}
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {p.roles.map((r) => (
                      <span
                        key={r}
                        className="rounded-full bg-[#1B3A73]/10 px-3 py-1 text-xs font-medium text-[#1B3A73]"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- NUESTRO PROYECTO ---------- */}
        <SeccionTexto
          id="proyecto"
          titulo="Nuestro proyecto"
          Icono={RocketLaunchOutlinedIcon}
          fondo="blanco"
          parrafos={[
            "El Sistema de tutorías FIC es una plataforma móvil y web desarrollada para permitir la gestión de asesorías en la Facultad de Informática de Culiacán, facilitando la interacción entre estudiantes, asesores y administradores mediante una plataforma moderna, eficiente y centralizada.",
            "Sus objetivos principales son automatizar la solicitud, aprobación y seguimiento de asesorías y proveer a los estudiantes un espacio para consultar horarios disponibles y enviar solicitudes para asesorías.",
            "El sistema facilita a los asesores la administración de sus horarios, asesorías, evidencias y reportes, además de la generación de historial y evidencia de cada asesoría para respaldos y evaluaciones.",
          ]}
        />

        {/* ---------- QUIÉNES SOMOS ---------- */}
        <SeccionTexto
          id="quienes-somos"
          titulo="¿Quiénes somos?"
          Icono={GroupsOutlinedIcon}
          fondo="gris"
          invertida
          parrafos={[
            "Somos el Laboratorio de Innovación, Desarrollo Académico y Tecnológico de la Facultad de Informática Culiacán, un espacio dedicado a la creación de soluciones tecnológicas que impacten positivamente los procesos académicos y administrativos dentro de la universidad.",
            "Nuestro laboratorio está conformado por estudiantes y docentes comprometidos con la mejora continua, la transformación digital y la implementación de herramientas tecnológicas reales que resuelvan problemáticas institucionales. Trabajamos en proyectos de software, automatización de procesos, desarrollo web, sistemas de gestión y propuestas innovadoras orientadas a la eficiencia operativa.",
            "Más que un espacio de desarrollo, somos un equipo que busca aplicar el conocimiento adquirido en el aula para generar soluciones funcionales que beneficien directamente a la comunidad universitaria.",
          ]}
        />

        {/* ---------- ¿CÓMO SURGIÓ? (línea de tiempo) ---------- */}
        <section id="como-surgio" className="scroll-mt-24 py-14 sm:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <div className="mb-12">
              <TituloSeccion>¿Cómo surgió?</TituloSeccion>
            </div>

            {/* Línea vertical con un punto por paso */}
            <ol className="relative border-l-2 border-[#C49E0D]/60 ml-3 space-y-10">
              {HISTORIA.map((paso, i) => (
                <li key={paso.titulo} className="pl-8 relative">
                  <span className="absolute -left-[17px] top-0 grid h-8 w-8 place-items-center rounded-full bg-[#1B3A73] text-sm font-bold text-white ring-4 ring-white">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-bold text-[#1B3A73]">{paso.titulo}</h3>
                  <p className="mt-1 text-slate-600 leading-relaxed">{paso.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- OBJETIVOS ---------- */}
        <section id="objetivos" className="scroll-mt-24 py-14 sm:py-20 bg-slate-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-10">
              <TituloSeccion>Objetivos</TituloSeccion>
            </div>

            {/* Cuatro tarjetas numeradas */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {OBJETIVOS.map((o, i) => (
                <article
                  key={o.titulo}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="text-4xl font-black text-[#C49E0D]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-bold text-slate-800">{o.titulo}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{o.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- ALCANCE ---------- */}
        <section id="alcance" className="scroll-mt-24 py-14 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-10">
              <TituloSeccion>Alcance</TituloSeccion>
            </div>

            {/* Cuadrícula de 1 columna en móvil y 2 desde sm */}
            <div className="grid gap-6 sm:grid-cols-2">
              {ALCANCE.map(({ Icono, titulo, texto }) => (
                <article
                  key={titulo}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-[#C49E0D] hover:shadow-md"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#1B3A73] text-[#EBD9B4]">
                    <Icono />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{titulo}</h3>
                    <p className="mt-1 text-sm sm:text-base text-slate-600 leading-relaxed">{texto}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- MISIÓN Y VISIÓN ---------- */}
        <section
          id="mision-vision"
          className="scroll-mt-24 py-14 sm:py-20 bg-linear-to-br from-[#1B3A73] to-[#244B91] text-white"
        >
          <div className="max-w-6xl mx-auto px-6">
            {/* items-stretch y h-full igualan la altura de ambas tarjetas */}
            <div className="grid gap-6 md:grid-cols-2 items-stretch">
              {MISION_VISION.map(({ Icono, titulo, texto }) => (
                <article
                  key={titulo}
                  className="h-full rounded-2xl bg-white/10 p-8 ring-1 ring-white/20"
                >
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[#C49E0D] text-white">
                    <Icono />
                  </div>
                  <h2 className="text-2xl font-bold">{titulo}</h2>
                  <p className="mt-3 text-blue-50 leading-relaxed">{texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- VINCULACIÓN ---------- */}
        <section id="vinculacion" className="scroll-mt-24 py-14 sm:py-20 bg-slate-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-10">
              <TituloSeccion>Dependencias vinculadas</TituloSeccion>
            </div>

            {/* Logos centrados; la última fila queda centrada aunque no esté completa */}
            <ul className="flex flex-wrap justify-center gap-4 sm:gap-5">
              {DEPENDENCIAS.map((d) => (
                <li
                  key={d.nombre}
                  title={d.nombre}
                  className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg hover:ring-[#C49E0D]"
                >
                  {/* Escala de grises solo en pantallas con mouse (md en adelante) */}
                  <img
                    src={d.img}
                    alt={d.nombre}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition md:grayscale md:opacity-80 md:hover:grayscale-0 md:hover:opacity-100"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
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