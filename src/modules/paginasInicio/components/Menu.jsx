import { NavLink } from 'react-router-dom';

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
        <nav className='w-full bg-[#D49A17] shadow-md'>
            <div className='flex justify-center items-center lg:justify-center gap-10 sm:gap-10 py-3 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide'>
                {Menuopciones.map((nombre) => (
                    <button key={nombre.id} 
                    onClick={() => {
                        document.getElementById(nombre.id)?.scrollIntoView({
                            behavior: "smooth",
                        })
                    }}
                        className="text-white hover:bg-[#B9820F]
              rounded-md
              transition
              shrink-0"
                    >
                    {nombre.nombre}
                    </button>
                ))}
            </div>
        </nav>
    )
} 