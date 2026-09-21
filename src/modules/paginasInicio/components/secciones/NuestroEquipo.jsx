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
                <div className="text-center mb-18">
                    <h1 className="font-black text-slate-900 text-2xl sm:text-4xl lg:text-5xl tracking-tight drop-shadow-sm">Acerca de Nosotros</h1>
                    <p className="text-slate-800 font-semibold text-base sm:text-xl lg:text-2xl mt-3 tracking-wide">Sistemas de tutorias FIC</p>
                </div>

                <div className="max-w-5xl mx-auto mb-22 px-2">
                    <p className="font-extrabold text-center text-base sm:text-lg leading-relaxed">
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

                            <h2 className="font-extrabold text-sm sm:text-base font-bold text-gray-900 tracking-wider text-center uppercase pb-3 border-b border-gray-200 w-full">
                                {tarjeta.titulo}</h2>

                            <div className="space-y-1.5 text-center w-full">
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
