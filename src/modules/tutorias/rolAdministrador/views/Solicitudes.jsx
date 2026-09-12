import TablaSolicitudes from "../components/TablaSolicitudes";

const initialRows = [
    { id: 1, materia: "Taller integrador", estudiante: "Leslie Mayram Barrera Rodriguez", asesor: "Jenifer Guadalupe Tizoc Lopez", inicio: "25/08/2026", horario: "9:00 - 10:00 AM" },
    { id: 2, materia: "Matematicas discretas", estudiante: "Crisoforo Ahuelican", asesor: "Jose Angel Astorga Mejia", inicio: "25/08/2026", horario: "9:00 - 10:00 AM" },
    { id: 3, materia: "Lenguajes de programacion", estudiante: "Luis Fernando Velazquez", asesor: "Jenifer Guadalupe Tizoc Lopez", inicio: "25/08/2026", horario: "9:00 - 10:00 AM" },
    { id: 4, materia: "Sistemas distribuidos", estudiante: "Alexander Israel Barrera Herrera", asesor: "Jenifer Guadalupe Tizoc Lopez", inicio: "25/08/2026", horario: "9:00 - 10:00 AM" },
];

export default function Solicitudes() {
    return (

        <div className="mx-10 my-3 flex flex-col items-start justify-start gap-10">

            <div>
                <p className="text-2xl font-bold">Solicitudes</p>
            </div>

            <TablaSolicitudes></TablaSolicitudes>

        </div>

        
    )
}