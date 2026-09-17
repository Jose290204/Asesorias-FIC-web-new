
import Container from "@mui/material/Container";

export default function ComoSurgio() {
    return (
        <section id="comoSurgio" className="bg-slate-100 py-12 sm:py-16 lg:py-20">

            <Container maxWidth="md" className="text-center">
                <div className="p-6 sm:p-10 lg:p-12" style={{ backgroundColor: "#244B91" }}>

                    <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl leading-relaxed text-white mb-6">Como Surgio</h2>
                    <p className="text-white text-base sm:text-lg leading-relaxed text-justify">
                        El Sistema de Tutorías FIC surgió como respuesta a la necesidad de mejorar la gestión de asesorías en la Facultad de Informática Culiacán. Observamos que muchos estudiantes enfrentaban dificultades para acceder a las asesorías y que los asesores necesitaban una herramienta eficiente para administrar sus horarios y solicitudes. Con el apoyo de Bienestar Universitario y el Laboratorio de Innovación, decidimos desarrollar una plataforma que facilite esta interacción, optimizando los procesos y promoviendo un ambiente académico más colaborativo y accesible.
                        </p>
                </div>
            </Container>
        </section >
    )
}