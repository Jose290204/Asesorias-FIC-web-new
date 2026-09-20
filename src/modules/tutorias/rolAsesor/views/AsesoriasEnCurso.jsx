import InputBuscar from "../../../../components/ui/InputBuscar";
import TarjetaAsesoriasEnCurso from "../components/TajetaAsesoriasEnCurso";
import { useState } from "react";
import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';


export default function AsesoriasEnCurso() {

    const [busqueda, setBusqueda] = useState("");

    const asesoriasEnCurso = [
        { id: 12, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Base de Datos", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
        { id: 13, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
        { id: 14, alumno: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
        { id: 15, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
        { id: 16, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
        { id: 17, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
        { id: 18, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
        { id: 19, alumno: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
        { id: 20, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
        { id: 21, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" }
    ];

    const asesoriasFiltradas = asesoriasEnCurso.filter((asesoria) => {
        const textoBusqueda = busqueda.toLowerCase();
        return (
            asesoria.materia.toLowerCase().includes(textoBusqueda) ||
            asesoria.alumno.toLowerCase().includes(textoBusqueda)
        );
    });

    return (
        <div className="h-[calc(100vh-1rem)] w-full rounded-2xl pl-17 py-10 pr-17 flex flex-col items-start justify-start gap-10 bg-gray-100 overflow-hidden">
            <div className="w-full flex justify-between">
                <p className="text-2xl font-bold">Asesorias en curso</p>

                <InputBuscar
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por materia o alumno..."
                />




            </div>

            <div className="w-full overflow-y-auto max-h-[calc(100vh-180px)] pb-5">
                <TarjetaAsesoriasEnCurso asesorias={asesoriasFiltradas} />
            </div>

            <div className="w-full flex justify-end">
                <Button variant="contained" sx={{ borderRadius: '5px', textTransform: 'none', backgroundColor: '#2E7D32' }} size="medium" startIcon={<AddOutlinedIcon />}>
                    Crear Asesoria
                </Button>
            </div>


        </div>
    );
}