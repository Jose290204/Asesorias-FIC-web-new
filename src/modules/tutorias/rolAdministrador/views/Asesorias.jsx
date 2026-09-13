import { useState, useEffect } from "react";
import BotonFiltro from "../../../../components/ui/BotonFlitro";
import TablaAsesorias from "../components/TablaAsesorias";
import InputBuscar from "../../../../components/ui/InputBuscar";
import BotonCarga from "../components/BotonAccion";
import ModalFiltros from "../../../../components/ui/ModalFiltros";
import ModalCargaExcel from "../components/ModalCargaExel";
import { getAsesorias } from "../services/asesoriasService";

const initialFiltros = {
    licenciatura: "",
    grupo: "",
    modalidad: "",
    horario: "",
    razon: ""
};

export default function Asesorias() {
    const [asesorias, setAsesorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [openModalFiltros, setopenModalFiltros] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [filtros, setFiltros] = useState(initialFiltros);

    const [modalExcelOpen, setModalExcelOpen] = useState(false);
    const handleExcelData = (data) => {
        console.log("Asesorías recibidas del Excel:", data);
        // Aquí puedes realizar la llamada a tu API/Servicio para enviar las asesorías cargadas
    };
    // Cargar los datos desde el servicio\
    useEffect(() => {
        getAsesorias()
            .then((data) => {
                setAsesorias(data);
            })
            .catch((error) => {
                console.error("Error al obtener las asesorías:", error);
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

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

    // Filtrado en tiempo rreal
    const filasFiltradas = asesorias.filter((row) => {
        const texto = busqueda.toLowerCase().trim();
        if (!texto) return true;

        const materia = (row.materia || "").toLowerCase();
        const estudiante = (row.estudiante || "").toLowerCase();
        const asesor = (row.asesor || "").toLowerCase();

        return (
            materia.includes(texto) ||
            estudiante.includes(texto) ||
            asesor.includes(texto)
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
                <button 
                    onClick={() => setModalExcelOpen(true)}
                    className="bg-[#2e7d32] hover:bg-[#1b5e20] text-sm text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1.8 14.8l-1.4 1.4L12 15.8l-2.4 2.4-1.4-1.4 2.4-2.4-2.4-2.4 1.4-1.4 2.4 2.4 2.4-2.4 1.4 1.4-2.4 2.4 2.4 2.4zM13 9V3.5L18.5 9H13z" />
                    </svg>
                    Cargar Asesorias
                </button>
            </div>

            <ModalCargaExcel
                open={modalExcelOpen}
                onClose={() => setModalExcelOpen(false)}
                onDataLoaded={handleExcelData}
            />

            {cargando ? (
                <p className="text-gray-500 font-medium">Cargando asesorías...</p>
            ) : (
                <TablaAsesorias rows={filasFiltradas} />
            )}

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