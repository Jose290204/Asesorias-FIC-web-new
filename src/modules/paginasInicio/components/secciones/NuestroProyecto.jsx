
import Container from "@mui/material/Container";

export default function NuestroProyecto() {
    return (
        <section  id="nuestroProyecto" className="bg-slate-100 py-12 sm:py-16 lg:py-20">

            <Container maxWidth="md" className="text-center">
                <div className="p-6 sm:p-10 lg:p-12 " style={{ backgroundColor: "#244B91" }}>
                    <h2 className="font-bold sm:text-3xl lg:text-4xl leading-relaxed text-white mb-6">Nuestro Proyecto</h2>
                    <p className="text-white text-base sm:text-lg leading-relaxed text-justify">
                        El Sistema de tutorías FIC es una plataforma móvil y web desarrollada para permitir la gestión de asesorías en la facultad de informática de culiacan, facilitando la interacción entre estudiantes, asesores y administradores mediante una plataforma moderna, eficiente y centralizada.
                        Sus objetivos principales son automatizar la solicitud, aprobación y seguimiento de asesorías y proveer a los estudiantes un espacio para consultar horarios disponibles y enviar solicitudes para asesorías.
                        En el sistema se facilita a los asesores la administración de sus horarios, asesorías, evidencias y reportes, además de la generación de historial y evidencia de cada asesoría para respaldos y evaluaciones.
                        El desarrollo de este sistema busca digitalizar y automatizar el flujo completo de asesorías, tanto para estudiantes, asesores disciplinares y pares, como para administradores, mejorando la comunicación, la organización y la eficiencia operativa.
                    </p>
                </div>
            </Container>
        </section>
    )
}