
import Container from "@mui/material/Container";

export default function QuienesSomos() {
    return (
        <section id="quienesSomos" className="my-12 sm:my-16">

             <Container  maxWidth="lg" className="text-center">
                
                <div className="bg-[#244B91] text-white rounded-2xl px-6 py-10 sm:px-10 sm:py-12 lg:px-16 transition-all duration-300"
                    style={{
                        boxShadow: "0 15px 35px -5px rgba(36, 75, 145, 0.35), 0 8px 15px -6px rgba(0, 0, 0, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.1)"
                    }}>
                   
                    <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl leading-relaxed text-white mb-3">Quienes Somos</h2>
                   <div className="space-y-2 text-left sm:text-justify text-sm">
                   
                     <p className="text-white text-base sm:text-lg leading-relaxed p-2">Somos el Laboratorio de Innovación, Desarrollo Académico y Tecnológico de la Facultad de Informática Culiacán, un espacio dedicado a la creación de soluciones tecnológicas que impacten positivamente los procesos académicos y administrativos dentro de la universidad.</p>

                     <p className="text-white text-base sm:text-lg leading-relaxed p-2">Nuestro laboratorio está conformado por estudiantes y docentes comprometidos con la mejora continua, la transformación digital y la implementación de herramientas tecnológicas reales que resuelvan problemáticas institucionales. Trabajamos en proyectos de software, automatización de procesos, desarrollo web, sistemas de gestión y propuestas innovadoras orientadas a la eficiencia operativa.</p>

                     <p className="text-white text-base sm:text-lg leading-relaxed p-2">Más que un espacio de desarrollo, somos un equipo que busca aplicar el conocimiento adquirido en el aula para generar soluciones funcionales que beneficien directamente a la comunidad universitaria.</p>
                   
                    </div>
                </div>
            </Container>
        </section>
    )
}