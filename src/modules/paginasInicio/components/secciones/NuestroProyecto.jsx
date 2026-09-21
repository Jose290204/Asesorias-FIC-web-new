
import Container from "@mui/material/Container";

export default function NuestroProyecto() {
    return (
        <section  id="nuestroProyecto" className="scroll-auto">

            <Container  maxWidth="lg" className="text-center">

                <div className="bg-[#244B91] text-white rounded-2xl px-6 py-10 sm:px-10 sm:py-12 lg:px-16 transition-all duration-300"
                    style={{
                        boxShadow: "0 15px 35px -5px rgba(36, 75, 145, 0.35), 0 8px 15px -6px rgba(0, 0, 0, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.1)"
                    }}>
                    <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl leading-relaxed text-white mb-3">Nuestro Proyecto</h2>
                    <div className="space-y-2 text-left sm:text-justify text-sm">

                       <p className="text-white text-base sm:text-lg leading-relaxed p-2">El Sistema de tutorías FIC es una plataforma móvil y web desarrollada para permitir la gestión de asesorías en la facultad de informática de culiacan, facilitando la interacción entre estudiantes, asesores y administradores mediante una plataforma moderna, eficiente y centralizada.
                        </p> 

                        <p className="text-white text-base sm:text-lg leading-relaxed p-2">
                            Sus objetivos principales son automatizar la solicitud, aprobación y seguimiento de asesorías y proveer a los estudiantes un espacio para consultar horarios disponibles y enviar solicitudes para asesorías.</p>

                        <p className="text-white text-base sm:text-lg leading-relaxed p-2">
                            En el sistema se facilita a los asesores la administración de sus horarios, asesorías, evidencias y reportes, además de la generación de historial y evidencia de cada asesoría para respaldos y evaluaciones.</p> 

                        <p className="text-white text-base sm:text-lg leading-relaxed p-2">
                            El desarrollo de este sistema busca digitalizar y automatizar el flujo completo de asesorías, tanto para estudiantes, asesores disciplinares y pares, como para administradores, mejorando la comunicación, la organización y la eficiencia operativa.</p> 
                    </div>
                </div>
            </Container>
        </section>
    )
}