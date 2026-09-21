
import Container from "@mui/material/Container";

export default function Alcance() {
    return (
        <section id="alcance" className="my-12 sm:my-16">
     <Container maxWidth="lg" className="text-center">
        <div className="bg-[#244B91] text-white rounded-2xl px-6 py-10 sm:px-10 sm:py-12 lg:px-16 transition-all duration-300"
                    style={{
                        boxShadow: "0 15px 35px -5px rgba(36, 75, 145, 0.35), 0 8px 15px -6px rgba(0, 0, 0, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.1)"
                    }}>
            <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl leading-relaxed text-white mb-3">Alcance</h2>
            
            
            <div className="space-y-4 text-left sm:text-justify">

                <p className="text-white text-base sm:text-lg leading-relaxed p-1">• Gestión de asesorías: Permitir a los estudiantes solicitar asesorías de manera sencilla y a los asesores gestionar sus horarios y citas.</p>
                <p className="text-white text-base sm:text-lg leading-relaxed p-1">• Interacción eficiente: Facilitar la comunicación entre estudiantes, asesores y administradores a través de una plataforma centralizada.</p>
                <p className="text-white text-base sm:text-lg leading-relaxed p-1">• Automatización de procesos: Automatizar la solicitud, aprobación y seguimiento de asesorías para reducir tiempos de espera y mejorar la experiencia del usuario.</p>
                <p className="text-white text-base sm:text-lg leading-relaxed p-1">• Historial y reportes: Generar un historial de asesorías y reportes que permitan a los administradores evaluar la efectividad del sistema y realizar mejoras continuas.</p>
            </div>
        </div>
    </Container>

</section>
)}
    