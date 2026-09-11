import BotonFiltro from "../../../../components/ui/BotonFlitro";
import TablaAsesorias from "../components/TablaAsesorias";
import InputBuscar from "../../../../components/ui/InputBuscar";
import BotonAccion from "../../../../components/ui/BotonAccion";
import { useState } from "react";
import ModalFiltros from "../../../../components/ui/ModalFiltros";

const initialRows = [
    { id: 1, materia: "Taller integrador", estudiante: "Leslie Mayram Barrera Rodriguez", asesor: "Jenifer Guadalupe Tizoc Lopez", inicio: "25/08/2026", horario: "9:00 - 10:00 AM" },
    { id: 2, materia: "Matematicas discretas", estudiante: "Crisoforo Ahuelican", asesor: "Jose Angel Astorga Mejia", inicio: "25/08/2026", horario: "9:00 - 10:00 AM" },
    { id: 3, materia: "Lenguajes de programacion", estudiante: "Luis Fernando Velazquez", asesor: "Jenifer Guadalupe Tizoc Lopez", inicio: "25/08/2026", horario: "9:00 - 10:00 AM" },
    { id: 4, materia: "Sistemas distribuidos", estudiante: "Alexander Israel Barrera Herrera", asesor: "Jenifer Guadalupe Tizoc Lopez", inicio: "25/08/2026", horario: "9:00 - 10:00 AM" },
];

const initialFiltros = {
    licenciatura: "",
    grupo: "",
    modalidad: "",
    horario: "",
    razon: ""
};

export default function Asesorias() {
    const [openModalFiltros, setopenModalFiltros] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [filtros, setFiltros] = useState(initialFiltros);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApply = () => {
        console.log("Filtros seleccionados:", filtros);
        setopenModalFiltros(false);
    };

    const handleClear = () => {
        setFiltros(initialFiltros);
    };

    // Filtrado reactivo en tiempo real por búsqueda simple
    const filasFiltradas = initialRows.filter((row) => {
        const texto = busqueda.toLowerCase();
        return (
            row.materia.toLowerCase().includes(texto) ||
            row.estudiante.toLowerCase().includes(texto) ||
            row.asesor.toLowerCase().includes(texto)
        );
    });

    return (
        <div className="mx-10 my-3 flex flex-col items-start justify-start gap-10">
            <div>
                <p className="text-2xl font-bold">Asesorias</p>
            </div>

            <div className="flex gap-8 items-center w-full">
                <BotonFiltro onClick={() => setopenModalFiltros(true)} />
                <InputBuscar
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <BotonAccion label="Cargar Asesoria" />
            </div>

            <TablaAsesorias rows={filasFiltradas} />

            <ModalFiltros
                open={openModalFiltros}
                onClose={() => setopenModalFiltros(false)}
                onApply={handleApply}
                onClear={handleClear}
            >
                <div className="flex flex-col gap-4">
                    {/* Licenciatura */}
                    <div>
                        <label className="font-bold text-sm block mb-1">Licenciatura</label>
                        <select
                            name="licenciatura"
                            value={filtros.licenciatura}
                            onChange={handleChange}
                            className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer"
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="Ingeniería Informática">Ingeniería Informática</option>
                            <option value="Ingeniería en Sistemas">Ingeniería en Sistemas</option>
                            <option value="Licenciatura en Software">Licenciatura en Software</option>
                        </select>
                    </div>

                    {/* Grupo */}
                    <div>
                        <label className="font-bold text-sm block mb-1">Grupo</label>
                        <select
                            name="grupo"
                            value={filtros.grupo}
                            onChange={handleChange}
                            className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer"
                        >
                            <option value="">Selecciona un grupo</option>
                            <option value="1-1">1-1</option>
                            <option value="2-1">2-1</option>
                            <option value="3-1">3-1</option>
                            <option value="4-1">4-1</option>
                        </select>
                    </div>

                    {/* Modalidad */}
                    <div>
                        <label className="font-bold text-sm block mb-1">Modalidad</label>
                        <select
                            name="modalidad"
                            value={filtros.modalidad}
                            onChange={handleChange}
                            className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer"
                        >
                            <option value="">Selecciona modalidad</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Virtual">Virtual</option>
                            <option value="Híbrida">Híbrida</option>
                        </select>
                    </div>

                    {/* Horario */}
                    <div>
                        <label className="font-bold text-sm block mb-1">Horario</label>
                        <select
                            name="horario"
                            value={filtros.horario}
                            onChange={handleChange}
                            className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer"
                        >
                            <option value="">Selecciona un horario</option>
                            <option value="8:00 - 9:00 AM">8:00 - 9:00 AM</option>
                            <option value="9:00 - 10:00 AM">9:00 - 10:00 AM</option>
                            <option value="10:00 - 11:00 AM">10:00 - 11:00 AM</option>
                            <option value="11:00 - 12:00 PM">11:00 - 12:00 PM</option>
                        </select>
                    </div>

                    {/* Razón */}
                    <div>
                        <label className="font-bold text-sm block mb-1">Razón</label>
                        <select
                            name="razon"
                            value={filtros.razon}
                            onChange={handleChange}
                            className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer"
                        >
                            <option value="">Selecciona una razón</option>
                            <option value="Reforzamiento de temas">Reforzamiento de temas</option>
                            <option value="Regularización">Regularización</option>
                            <option value="Preparación de examen">Preparación de examen</option>
                            <option value="Dudas en proyecto">Dudas en proyecto</option>
                        </select>
                    </div>
                </div>
            </ModalFiltros>
        </div>
    );
}