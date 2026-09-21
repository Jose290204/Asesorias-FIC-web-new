
import Container from "@mui/material/Container";

export default function ComoSurgio() {
    return (
        <section id="comoSurgio" className="my-12 sm:my-16">

            <Container  maxWidth="lg" className="text-center">
                <div className="bg-gradient-to-r from-[#3267c4] to-[#244B91] text-white rounded-2xl px-6 py-10 sm:px-10 sm:py-12 lg:px-16 transition-all duration-300"
                    style={{
                        boxShadow: "0 15px 35px -5px rgba(36, 75, 145, 0.35), 0 8px 15px -6px rgba(0, 0, 0, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.1)"
                    }}>

                   <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl leading-relaxed text-white mb-3">Como Surgio</h2>
                    <p className="text-white text-base sm:text-lg leading-relaxed text-justify">
                        El Sistema de Tutorías FIC surgió como respuesta a la necesidad de mejorar la gestión de asesorías en la Facultad de Informática Culiacán. Observamos que muchos estudiantes enfrentaban dificultades para acceder a las asesorías y que los asesores necesitaban una herramienta eficiente para administrar sus horarios y solicitudes. Con el apoyo de Bienestar Universitario y el Laboratorio de Innovación, decidimos desarrollar una plataforma que facilite esta interacción, optimizando los procesos y promoviendo un ambiente académico más colaborativo y accesible.
                        </p>
                </div>
            </Container>
        </section >
    )
}