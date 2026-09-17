import Container from "@mui/material/Container";
import Paper from '@mui/material/Paper';

const tarjetas = [
    {titulo: "G ERENTES DEL PROYECTO",
        personas: [ "MC. Alejandro Yahir Sicairos Ochoa",
            "C. Axel Manuel Aguilar Perez",
            "MGTI. Oscar Mejía Quintero",
            "Jose Angel Astorga Mejia"],
        
    },
    {
        titulo:"GERENTES DE DESARROLLO",
        personas: ["Jose Angel Astorga Mejia",
            "Leslie Mayram Barrera Rodriguez",
            "Raquel del Pilar Ibarra Meza",
            "Bhrandon Nedel Medina Hernandez",
            "Erick Fernando Sanchez Barraza",
            "Jenifer Guadalupe Tizoc Lopez",],
    },
    {titulo: "ESPECIALISTAS SEO",
        personas: ["MC. Alejandro Yahir Sicairos Ochoa",
            "C. Axel Manuel Aguilar Perez"],
    },
    {
        titulo: "ANALISTAS DE DESARROLLO Y CALIDAD",
        personas: ["MC. Alejandro Yahir Sicairos Ochoa",
            "C. Axel Manuel Aguilar Perez",
            "MGTI. Oscar Mejía Quintero",
            "Jose Angel Astorga Mejia"],
    },
    {
        titulo: "DISEÑADOR UI/UX",
        personas: ["Leslie Mayram Barrera Rodriguez"]
    }
]


export default function NuestroEquipo(){
    return(
        <section id="nuestroEquipo" className="bg-white py-16 sm:py-16 lg:py-15">
            <Container>
            <div className="text-center mb-8">
                <h1 className="font-bold text-black text-2xl sm:text-3xl lg:text-2xl">Acerca de Nosotros</h1>
                <p className="text-black text-lg sm:text-1xl mt-1">Sistemas de titorias FIC</p>
            </div>
            <div className="max-w-4xl mx-auto mb-10">
                <p className="text-center text-lg sm:text-xl leading-relaxed">La Universidad Autónoma de Sinaloa a través de Bienestar Universitario y la Facultad de Informática Culiacán en colaboración con el Laboratorio de Innovación, Desarrollo Académico y Tecnológico de la Facultad de Informática Culiacán, presenta el Sistema de tutorias FIC.</p>
            </div>

            <div className="text-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mt-8">
                {tarjetas.map((tarjeta) => (
                    <Paper key={tarjeta.titulo}
                    elevation={2}
                    className=" p-5 sm:p-6 rounded-xl"
                    >

                        <h2 className="font-bold text-lg sm:text-xl mb-3">
                            {tarjeta.titulo}</h2>
                            <div className="space-y-1">
                                 {tarjeta.personas.map((persona) => (
                    <p
                        key={persona}
                        className="
                            text-sm
                            sm:text-base
                            leading-relaxed
                            break-words
                        "
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
