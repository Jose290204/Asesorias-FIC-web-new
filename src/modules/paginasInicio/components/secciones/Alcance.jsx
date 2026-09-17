
import Container from "@mui/material/Container";

export default function Alcance() {
    return (
        <section id="alcance">

            <Container maxWidth="md" className="text-center">
                <div className="p-6 sm:p-10 lg:p-12" style={{ backgroundColor: "#244B91" }}>
                    <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl leading-relaxed text-white mb-6">Alcance</h2>
                    <p className="text-white text-base sm:text-lg leading-relaxed text-justify">• Gestión de asesorías: Permitir a los estudiantes solicitar asesorías de manera sencilla y a los asesores gestionar sus horarios y citas.</p>

                    <p className="text-white text-base sm:text-lg leading-relaxed text-justify">• Interacción eficiente: Facilitar la comunicación entre estudiantes, asesores y administradores a través de una plataforma centralizada.</p>

                    <p className="text-white text-base sm:text-lg leading-relaxed text-justify">• Automatización de procesos: Automatizar la solicitud, aprobación y seguimiento de asesorías para reducir tiempos de espera y mejorar la experiencia del usuario.</p>

                    <p className="text-white text-base sm:text-lg leading-relaxed text-justify">• Historial y reportes: Generar un historial de asesorías y reportes que permitan a los administradores evaluar la efectividad del sistema y realizar mejoras continuas.
                    </p>
                </div>
            </Container>
        </section >
    )
}