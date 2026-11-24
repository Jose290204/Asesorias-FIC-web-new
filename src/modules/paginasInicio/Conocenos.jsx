import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoFic from "../../assets/fic_logo.png";
import LogoUas from "../../assets/logo_uas.png";

import bienestar from '../../assets/dependencias/bienestar.png';


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
    nombre: "José Ángel Astorga Mejía",
    roles: ["Gerente del proyecto", "Gerente de desarrollo", "Analista de desarrollo y calidad"],
  },
  {
    nombre: "MC. Alejandro Yahir Sicairos Ochoa",
    roles: ["Gerente del proyecto", "Especialista SEO", "Analista de desarrollo y calidad"],
  },
  {
    nombre: "MGTI. Óscar Mejía Quintero",
    roles: ["Analista de desarrollo y calidad"],
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

// Roles del equipo en el orden en que se muestran: [como está en EQUIPO, título en plural]
const ROLES_EQUIPO = [
  ["Gerente del proyecto", "Gerentes del proyecto"],
  ["Gerente de desarrollo", "Gerentes de desarrollo"],
  ["Especialista SEO", "Especialistas SEO"],
  ["Analista de desarrollo y calidad", "Analistas de desarrollo y calidad"],
  ["Diseñadora UI/UX", "Diseñadora UI/UX"],
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

// Redes sociales de la facultad que aparecen en Contacto
const REDES = [
  { nombre: "Facebook", usuario: "Facultad de Informática Culiacán", url: "https://www.facebook.com/FICuliacan/", Icono: FacebookIcon },
  { nombre: "Instagram", usuario: "@facultadinformaticaculiacan", url: "https://www.instagram.com/facultadinformaticaculiacan/", Icono: InstagramIcon },
];

// Dependencias vinculadas: nombre (texto alternativo) y logo
const DEPENDENCIAS = [
  { nombre: "Bienestar Universitario", img: bienestar },
  { nombre: "Facultad de Informática Culiacán", img: LogoFic },
];


/* ======================= AYUDANTES ======================= */

// Lleva suavemente a una sección de la página
function irASeccion(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// Título de sección: etiqueta pequeña dorada, título y la línea dorada debajo
function TituloSeccion({ children, etiqueta, centrado = true, claro = false }) {
  return (
    <div className={centrado ? "text-center" : ""}>
      {etiqueta && (
        <p className="mb-2 font-titulos text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#C49E0D]">
          {etiqueta}
        </p>
      )}
      <h2 className={`text-2xl sm:text-4xl font-extrabold leading-tight ${claro ? "text-white" : "text-[#1B3A73]"}`}>
        {children}
      </h2>
      <div className={`mt-4 h-1 w-14 rounded-full bg-[#C49E0D] ${centrado ? "mx-auto" : ""}`} />
    </div>
  );
}

// Sección de texto con panel de ícono; alterna lado y fondo según las props
function SeccionTexto({ id, etiqueta, titulo, Icono, parrafos, invertida = false, fondo = "medio" }) {
  const fondoClase = fondo === "medio" ? "bg-[#E3EBF8]" : "bg-[#EEF3FB]";

  return (
    <section id={id} className={`scroll-mt-24 py-16 sm:py-24 ${fondoClase}`}>
      <div
        className={`max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-5 items-center ${
          invertida ? "md:[&>div:first-child]:order-2" : ""
        }`}
      >
        {/* Columna de texto */}
        <div className="md:col-span-3">
          <TituloSeccion etiqueta={etiqueta} centrado={false}>{titulo}</TituloSeccion>
          <div className="mt-7 space-y-4 max-w-prose text-slate-600 leading-relaxed text-base sm:text-lg">
            {parrafos.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>

        {/* Panel con ícono: anillos decorativos y un recuadro azul con borde dorado */}
        <div className="md:col-span-2 grid place-items-center">
          <div className="relative grid h-56 w-56 sm:h-72 sm:w-72 place-items-center">
            <span className="absolute inset-0 rounded-full border-2 border-dashed border-[#C49E0D]/50" />
            <span className="absolute inset-6 rounded-full bg-white/70" />
            <div className="relative grid h-32 w-32 sm:h-40 sm:w-40 place-items-center rounded-3xl bg-linear-to-br from-[#1E4DB7] via-[#08338F] to-[#052466] shadow-[0_16px_36px_rgba(8,51,143,0.35)] ring-4 ring-[#EBD9B4]">
              <Icono sx={{ fontSize: 72, color: "#EBD9B4" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Barra de navegación por secciones: resalta la sección que se está viendo
// y hace scroll horizontal en pantallas pequeñas
function Menu({ activa }) {
  return (
    <nav className="w-full bg-linear-to-r from-[#DDB02B] via-[#D49A17] to-[#C98F13] shadow-[0_4px_16px_rgba(0,0,0,0.2)] border-b border-black/10">

      {/* Contenedor con scroll horizontal y sin barra visible */}
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* w-max + mx-auto: centrado si cabe, alineado al inicio si desborda */}
        <div className="flex w-max mx-auto items-center gap-1.5 sm:gap-2 py-2.5 px-3 sm:px-6">
          {MENU_OPCIONES.map((opcion) => {
            const esActiva = activa === opcion.id;

            return (
              <button
                key={opcion.id}
                onClick={() => irASeccion(opcion.id)}
                className={`
                  font-titulos font-semibold
                  text-[13px] sm:text-sm
                  px-4 py-1.5
                  rounded-full
                  whitespace-nowrap
                  shrink-0
                  cursor-pointer
                  transition-all duration-200 ease-in-out
                  active:scale-95
                  ${esActiva
                    ? "bg-[#1B3A73] text-white shadow-md"
                    : "text-white hover:bg-white/20"}
                `}
              >
                {opcion.nombre}
              </button>
            );
          })}
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

  // Sección que se está viendo (para resaltarla en el menú)
  const [seccionActiva, setSeccionActiva] = useState('');

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setSeccionActiva(e.target.id);
        });
      },
      // Cuenta como "activa" la sección que cruza la parte alta de la pantalla
      { rootMargin: '-30% 0px -60% 0px' }
    );

    MENU_OPCIONES.forEach((o) => {
      const el = document.getElementById(o.id);
      if (el) observador.observe(el);
    });

    return () => observador.disconnect();
  }, []);

  return (
    <div className="min-h-dvh bg-[#EEF3FB] flex flex-col scroll-smooth font-texto [&_h1]:font-titulos [&_h2]:font-titulos [&_h3]:font-titulos">

      {/* ============ ENCABEZADO ============ */}
      <header className="bg-linear-to-r from-[#0B2A66] via-[#1B3A73] to-[#244B91] text-white px-4 sm:px-8 lg:px-12 py-3 sm:py-4 border-b-[3px] border-[#D4A017]">
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
                Asesorías FIC
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 leading-tight truncate">
                Facultad de Informática Culiacán
              </p>
            </div>
          </button>

          {/* Botón para volver al inicio */}
          <button
            onClick={irInicioPage}
            className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-medium hover:bg-white hover:text-[#244B91] transition-colors cursor-pointer"
          >
            <HomeOutlinedIcon fontSize="small" />
            <span className="hidden sm:inline">Inicio</span>
          </button>

        </div>
      </header>

      {/*=============== MENU ==================*/}
      <div className="sticky top-0 z-50">
        <Menu activa={seccionActiva} />
      </div>

      {/* ============ CONTENIDO DE LA PAGINA ============ */}
      <main className="flex-1">

        {/* ---------- HERO ---------- */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#0B2A66] via-[#1B3A73] to-[#244B91] text-white">
          {/* Círculos decorativos */}
          <span className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border-[40px] border-white/5" />
          <span className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#C49E0D]/10" />

          <div className="relative max-w-6xl mx-auto px-6 py-14 sm:py-20 grid gap-10 lg:grid-cols-5 items-center">

            {/* Texto */}
            <div className="lg:col-span-3 text-center lg:text-left">
              <p className="mb-3 font-titulos text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#E6C65A]">
                Acerca de nosotros
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight">
                Asesorías FIC
              </h2>
              <div className="mx-auto lg:mx-0 mt-5 h-1 w-16 rounded-full bg-[#C49E0D]" />
              <p className="mt-6 text-base sm:text-lg text-blue-50 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                La Universidad Autónoma de Sinaloa, a través de Bienestar Universitario y la Facultad
                de Informática Culiacán, en colaboración con el Laboratorio de Innovación, Desarrollo
                Académico y Tecnológico, presenta el Sistema de Asesorías FIC.
              </p>

              {/* Botones */}
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                <button
                  onClick={() => irASeccion('equipo')}
                  className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-titulos font-bold text-white cursor-pointer bg-linear-to-r from-[#E0B32A] to-[#C49E0D] shadow-[0_6px_16px_rgba(196,158,13,0.4)] transition hover:brightness-110 active:scale-95"
                >
                  Conoce al equipo
                  <KeyboardArrowDownOutlinedIcon fontSize="small" />
                </button>
                <button
                  onClick={() => irASeccion('contacto')}
                  className="rounded-lg border border-white/40 px-5 py-2.5 font-titulos font-semibold cursor-pointer transition hover:bg-white hover:text-[#1B3A73] active:scale-95"
                >
                  Contacto
                </button>
              </div>
            </div>

            {/* Logo de la facultad sobre una tarjeta blanca */}
            <div className="lg:col-span-2 grid place-items-center">
              <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-4 ring-[#EBD9B4]/60">
                <img
                  src={LogoFic}
                  alt="Facultad de Informática Culiacán, 34 aniversario"
                  className="h-52 sm:h-72 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- NUESTRO EQUIPO ---------- */}
        <section id="equipo" className="relative overflow-hidden scroll-mt-24 py-16 sm:py-24 bg-linear-to-b from-[#244B91] to-[#1B3A73] text-white">
          <span className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full border-[32px] border-white/5" />

          <div className="relative max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <TituloSeccion etiqueta="Quiénes lo hacen posible" claro>Nuestro equipo</TituloSeccion>
            </div>

            {/* Todo en línea: cada rol es un título y debajo los nombres, uno por renglón */}
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-9 text-center">
              {ROLES_EQUIPO.map(([rol, rolPlural]) => {
                const personas = EQUIPO.filter((p) => p.roles.includes(rol));
                if (personas.length === 0) return null;

                return (
                  <div key={rol} className="w-full">
                    <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-[#EBD9B4]">
                      {personas.length > 1 ? rolPlural : rol}
                    </h3>
                    <div className="mx-auto mt-2 mb-3 h-0.5 w-10 rounded-full bg-[#C49E0D]" />
                    <ul className="flex flex-col gap-1.5">
                      {personas.map((p) => (
                        <li key={p.nombre} className="text-base sm:text-xl text-white">
                          {p.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- NUESTRO PROYECTO ---------- */}
        <SeccionTexto
          id="proyecto"
          etiqueta="Qué hacemos"
          titulo="Nuestro proyecto"
          Icono={RocketLaunchOutlinedIcon}
          fondo="medio"
          parrafos={[
            "El Sistema de Asesorías FIC es una plataforma móvil y web desarrollada para permitir la gestión de asesorías en la Facultad de Informática de Culiacán, facilitando la interacción entre estudiantes, asesores y administradores mediante una plataforma moderna, eficiente y centralizada.",
            "Sus objetivos principales son automatizar la solicitud, aprobación y seguimiento de asesorías y proveer a los estudiantes un espacio para consultar horarios disponibles y enviar solicitudes para asesorías.",
            "El sistema facilita a los asesores la administración de sus horarios, asesorías, evidencias y reportes, además de la generación de historial y evidencia de cada asesoría para respaldos y evaluaciones.",
          ]}
        />

        {/* ---------- QUIÉNES SOMOS ---------- */}
        <SeccionTexto
          id="quienes-somos"
          etiqueta="Nuestra identidad"
          titulo="¿Quiénes somos?"
          Icono={GroupsOutlinedIcon}
          fondo="claro"
          invertida
          parrafos={[
            "Somos el Laboratorio de Innovación, Desarrollo Académico y Tecnológico de la Facultad de Informática Culiacán, un espacio dedicado a la creación de soluciones tecnológicas que impacten positivamente los procesos académicos y administrativos dentro de la universidad.",
            "Nuestro laboratorio está conformado por estudiantes y docentes comprometidos con la mejora continua, la transformación digital y la implementación de herramientas tecnológicas reales que resuelvan problemáticas institucionales. Trabajamos en proyectos de software, automatización de procesos, desarrollo web, sistemas de gestión y propuestas innovadoras orientadas a la eficiencia operativa.",
            "Más que un espacio de desarrollo, somos un equipo que busca aplicar el conocimiento adquirido en el aula para generar soluciones funcionales que beneficien directamente a la comunidad universitaria.",
          ]}
        />

        {/* ---------- ¿CÓMO SURGIÓ? (línea de tiempo) ---------- */}
        <section id="como-surgio" className="scroll-mt-24 py-16 sm:py-24 bg-[#E3EBF8]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-14">
              <TituloSeccion etiqueta="Nuestra historia">¿Cómo surgió?</TituloSeccion>
            </div>

            {/* Cuatro pasos en fila (en celular, uno debajo de otro) unidos por una línea dorada */}
            <ol className="relative grid gap-10 md:grid-cols-4">
              <span className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-[#C49E0D]/50" />

              {HISTORIA.map((paso, i) => (
                <li key={paso.titulo} className="relative text-center">
                  <span className="relative mx-auto grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-[#1E4DB7] to-[#08338F] text-base font-bold text-white ring-4 ring-[#E3EBF8] shadow-md">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-[#1B3A73]">{paso.titulo}</h3>
                  <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">{paso.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- OBJETIVOS ---------- */}
        <section id="objetivos" className="scroll-mt-24 py-16 sm:py-24 bg-[#EEF3FB]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <TituloSeccion etiqueta="Lo que buscamos">Objetivos</TituloSeccion>
            </div>

            {/* Cuatro tarjetas numeradas */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {OBJETIVOS.map((o, i) => (
                <article
                  key={o.titulo}
                  className="overflow-hidden rounded-2xl border border-[#E3E8F2] bg-white shadow-[0_2px_10px_rgba(8,51,143,0.08)] transition hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(8,51,143,0.16)]"
                >
                  <div className="h-1.5 bg-linear-to-r from-[#1E4DB7] to-[#08338F]" />
                  <div className="p-6">
                    <span className="text-4xl font-black text-[#C49E0D]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-bold text-[#1B3A73]">{o.titulo}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{o.texto}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- ALCANCE ---------- */}
        <section id="alcance" className="scroll-mt-24 py-16 sm:py-24 bg-[#E3EBF8]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <TituloSeccion etiqueta="Hasta dónde llega">Alcance</TituloSeccion>
            </div>

            {/* Cuadrícula de 1 columna en móvil y 2 desde sm */}
            <div className="grid gap-6 sm:grid-cols-2">
              {ALCANCE.map(({ Icono, titulo, texto }) => (
                <article
                  key={titulo}
                  className="flex gap-5 rounded-2xl border border-[#E3E8F2] bg-white p-6 shadow-[0_2px_10px_rgba(8,51,143,0.06)] transition hover:border-[#C49E0D] hover:shadow-[0_10px_24px_rgba(8,51,143,0.12)]"
                >
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#E6ECF8] text-[#08338F]">
                    <Icono />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B3A73] text-lg">{titulo}</h3>
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
          className="relative overflow-hidden scroll-mt-24 py-16 sm:py-24 bg-linear-to-br from-[#0B2A66] via-[#1B3A73] to-[#244B91] text-white"
        >
          <span className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full border-[36px] border-white/5" />

          <div className="relative max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <TituloSeccion etiqueta="Hacia dónde vamos" claro>Misión y visión</TituloSeccion>
            </div>

            {/* items-stretch y h-full igualan la altura de ambas tarjetas */}
            <div className="grid gap-6 md:grid-cols-2 items-stretch">
              {MISION_VISION.map(({ Icono, titulo, texto }) => (
                <article
                  key={titulo}
                  className="h-full rounded-2xl bg-white/10 p-8 ring-1 ring-white/20 backdrop-blur-sm"
                >
                  <div className="mb-5 grid h-14 w-14 place-items-center rounded-xl bg-linear-to-br from-[#E0B32A] to-[#C49E0D] text-white shadow-lg">
                    <Icono />
                  </div>
                  <h3 className="text-2xl font-bold">{titulo}</h3>
                  <div className="mt-2 mb-4 h-0.5 w-10 rounded-full bg-[#C49E0D]" />
                  <p className="text-blue-50 leading-relaxed">{texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- VINCULACIÓN ---------- */}
        <section id="vinculacion" className="scroll-mt-24 py-16 sm:py-24 bg-[#EEF3FB]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <TituloSeccion etiqueta="Trabajamos con">Dependencias vinculadas</TituloSeccion>
            </div>

            {/* Logos centrados; la última fila queda centrada aunque no esté completa */}
            <ul className="flex flex-wrap justify-center gap-4 sm:gap-5">
              {DEPENDENCIAS.map((d) => (
                <li
                  key={d.nombre}
                  title={d.nombre}
                  className="grid h-32 w-32 sm:h-40 sm:w-40 place-items-center rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(8,51,143,0.08)] ring-1 ring-[#E3E8F2] transition hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(8,51,143,0.16)] hover:ring-[#C49E0D]"
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
      <footer id="contacto" className="w-full bg-linear-to-r from-[#0B2A66] via-[#1B3A73] to-[#244B91] text-white border-t-[3px] border-[#D4A017]">

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* ============================= PARTE IZQUIERDA ========================= */}
          <div className="text-center md:text-left">

            <h2 className="font-extrabold text-2xl sm:text-3xl mb-1">Contacto</h2>
            <div className="mx-auto md:mx-0 mb-6 h-1 w-14 rounded-full bg-[#C49E0D]" />

            <p className="text-base sm:text-lg font-semibold mb-5">Facultad de Informática Culiacán</p>

            <ul className="flex flex-col gap-4 text-sm sm:text-base text-blue-50">
              <li className="flex items-start justify-center md:justify-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
                  <LocationOnOutlinedIcon className="text-[#EBD9B4]" />
                </span>
                <span className="max-w-sm leading-relaxed text-left self-center">
                  C. Josefa Ortiz de Domínguez S/N, Cd Universitaria, CIUDAD UNIVERSITARIA, 80013 Culiacán
                </span>
              </li>

              <li className="flex items-center justify-center md:justify-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
                  <EmailOutlinedIcon className="text-[#EBD9B4]" />
                </span>
                <a href="mailto:info@info.uas.edu.mx" className="hover:underline">info@info.uas.edu.mx</a>
              </li>

              {REDES.map(({ nombre, usuario, url, Icono }) => (
                <li key={nombre} className="flex items-center justify-center md:justify-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
                    <Icono className="text-[#EBD9B4]" />
                  </span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${nombre} de la Facultad de Informática Culiacán`}
                    className="hover:underline text-left"
                  >
                    {usuario}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ============================= PARTE DERECHA ========================= */}
          <div className="w-full h-[240px] sm:h-[300px] lg:h-[320px] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20">
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
          © {new Date().getFullYear()} Asesorías FIC · Facultad de Informática Culiacán · UAS
        </div>

      </footer>

    </div>
  );
}
