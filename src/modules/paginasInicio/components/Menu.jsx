

const Menuopciones = [
    {nombre:'Nuestro equipo',
        id: "nuestroEquipo",
    },
    {nombre:'Nuestro Proyecto',
        id: 'nuestroProyecto',
    },
    {nombre:'¿Quienes somos?',
        id: 'quienesSomos',
    },
    {nombre:'¿Como Surgio?',
        id: 'comoSurgio',
    },
    {nombre:'Objetivos',
        id: 'objetivos'
    },
    {nombre:'Alcance',
        id:'alcance',
    },
    {nombre:'Misión y visión',
        id: 'misionVision',
    },
    {nombre:'Vinculación',
        id:'vinculacion',
    },
    {nombre:"Contacto",
        id: "contacto",
    }];

export default function Menu() {
    return (
        <nav className="w-full bg-gradient-to-r from-[#c49e0d] to-[#c4a30dea] shadow-lg sticky top-0 z-50 border-b border-black/10 backdrop-blur-md">
            <div className='flex justify-center items-center lg:justify-center gap-1.5 sm:gap-5 sm:gap-2 py-1.5 py-3 px-3 overflow-x-auto whitespace-nowrap scrollbar-hide'>
                {Menuopciones.map((nombre) => (
                    <button key={nombre.id} 
                    onClick={() => {
                        document.getElementById(nombre.id)?.scrollIntoView({
                            behavior: "smooth",
                        })
                    }}
                        className="
                            text-white 
                            font-medium 
                            text-sm sm:text-base 
                            px-3.5 py-1.5 
                            rounded-lg 
                            transition-all duration-200 ease-in-out
                            hover:bg-white/20 
                            hover:scale-105 
                            active:scale-95 
                            shrink-0 
                            tracking-wide
                        "
                    >
                    {nombre.nombre}
                    </button>
                ))}
            </div>
        </nav>
    )
}