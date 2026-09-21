import Container from "@mui/material/Container";
import Paper from '@mui/material/Paper';

const tarjetas = [
    {
        titulo: "GERENTES DEL PROYECTO",
        personas: ["MC. Alejandro Yahir Sicairos Ochoa",
            "MGTI. Oscar Mejía Quintero",
            "Jose Angel Astorga Mejia"],

    },
    {
        titulo: "GERENTES DE DESARROLLO",
        personas: ["Jose Angel Astorga Mejia",
            "Leslie Mayram Barrera Rodriguez",
            "Raquel del Pilar Ibarra Meza",
            "Bhrandon Nedel Medina Hernandez",
            "Erick Fernando Sanchez Barraza",
            "Jenifer Guadalupe Tizoc Lopez",],
    },
    {
        titulo: "ESPECIALISTAS SEO",
        personas: ["MC. Alejandro Yahir Sicairos Ochoa"],
    },
    {
        titulo: "ANALISTAS DE DESARROLLO Y CALIDAD",
        personas: ["MC. Alejandro Yahir Sicairos Ochoa",
            "MGTI. Oscar Mejía Quintero",
            "Jose Angel Astorga Mejia"],
    },
    {
        titulo: "DISEÑADOR UI/UX",
        personas: ["Leslie Mayram Barrera Rodriguez"]
    }
]


export default function NuestroEquipo() {
    return (
        <section id="nuestroEquipo" className="py-12 sm:py-16 scroll-mt-24">
            <Container>
                <div className="text-center mb-8">
                    <h1 className="font-bold text-black text-2xl sm:text-3xl lg:text-2xl">Acerca de Nosotros</h1>
                    <p className="text-gray-800 font-semibold text-lg sm:text-xl mt-2">Sistemas de tutorias FIC</p>
                </div>

                <div className="max-w-4xl mx-auto mb-12">
                    <p className="text-center text-black text-base sm:text-lg leading-relaxed font-medium">
                        La Universidad Autónoma de Sinaloa a través de Bienestar Universitario y la Facultad de Informática Culiacán en colaboración con el Laboratorio de Innovación,
                        Desarrollo Académico y Tecnológico de la Facultad de Informática Culiacán, presenta el Sistema de tutorias FIC.</p>
                </div>

                {/* Grid Tarjetas */}
                <div className="flex flex-wrap justify-center gap-6 mt-8">
                    {tarjetas.map((tarjeta) => (
                        <Paper key={tarjeta.titulo}
                            elevation={0}
                            className="p-4 rounded-2xl flex flex-col justify-start transition-all duration-300 hover:-translate-y-1"
                            style={{
                                backgroundColor: "#EBDED0",
                                border: "1px solid rgba(0, 0, 0, 0.08)",
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)"

                            }}
                        >

                            <h2 className="font-bold text-black text-base sm:text-lg mb-3 text-center tracking-tight border-b border-black/10 pb-2">
                                {tarjeta.titulo}</h2>

                            <div className="space-y-1.5 text-center">
                                {tarjeta.personas.map((persona) => (
                                    <p
                                        key={persona}
                                        className="text-black 
                      font-medium 
                      text-base 
                      sm:text-lg 
                      leading-relaxed 
                      break-words"
                                    >
                                        {persona}
                                    </p>
                                ))}

                            </div>

                        </Paper>


                    ))}
                </div>
            </Container>

        </section>
    )
}
