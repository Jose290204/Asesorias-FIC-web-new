
import Container from "@mui/material/Container";

export default function QuienesSomos() {
    return (
        <section id="quienesSomos" className="py-10 sm:py-16 lg:py-10">

            <Container maxWidth="md" className="text-center">
                  <div className="text-white bg-[#244B91] text-white rounded-xl p-6 sm:p-10">
                    <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl leading-relaxed text-white mb-6">Quienes Somos</h2>
                    <p className="text-white text-base sm:text-lg leading-relaxed text-justify">
                    Somos el Laboratorio de Innovación, Desarrollo Académico y Tecnológico de la Facultad de Informática Culiacán, un espacio dedicado a la creación de soluciones tecnológicas que impacten positivamente los procesos académicos y administrativos dentro de la universidad.
                    Nuestro laboratorio está conformado por estudiantes y docentes comprometidos con la mejora continua, la transformación digital y la implementación de herramientas tecnológicas reales que resuelvan problemáticas institucionales. Trabajamos en proyectos de software, automatización de procesos, desarrollo web, sistemas de gestión y propuestas innovadoras orientadas a la eficiencia operativa.
                    Más que un espacio de desarrollo, somos un equipo que busca aplicar el conocimiento adquirido en el aula para generar soluciones funcionales que beneficien directamente a la comunidad universitaria.
                    </p>
                    </div>
            </Container>
        </section>
    )
}