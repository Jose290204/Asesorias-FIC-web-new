import { useState, useEffect } from "react";
import BotonFiltro from "../../../../components/ui/BotonFlitro";
import TablaAsesoresPar from "../components/TablaAsesoresPar";
import InputBuscar from "../../../../components/ui/InputBuscar";
import ModalFiltros from "../../../../components/ui/ModalFiltros";
import { ModalAgregarAsesorPar } from "../components/ModalesAsesorPar";
import ToastNotification from "../../../../components/ui/ToastNotification"; // Importación de la notificación Toast
import { getAsesoresPar } from "../services/asesoresParService";
import AddIcon from '@mui/icons-material/Add';

const initialFiltros = {
    licenciatura: "",
    grupo: "",
    modalidad: "",
    horario: "",
    razon: ""
};

export default function AsesoresPar() {
    const [asesores, setAsesores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [openModalFiltros, setOpenModalFiltros] = useState(false);
    const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [filtros, setFiltros] = useState(initialFiltros);

    // Estado para el Toast
    const [toast, setToast] = useState({
        open: false,
        message: "",
        type: "success"
    });

    useEffect(() => {
        getAsesoresPar()
            .then((data) => {
                setAsesores(data);
            })
            .catch((error) => {
                console.error("Error al obtener los asesores par:", error);
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

    const handleAsesorAgregado = (nuevoAsesor) => {
        console.log("Asesor agregado correctamente:", nuevoAsesor);

        // Mostrar Toast de éxito
        setToast({
            open: true,
            message: "Se agregó el usuario como Asesor Par correctamente.",
            type: "success"
        });

        // Opcional: Si deseas recargar la lista de asesores tras agregar uno nuevo:
        // getAsesoresPar().then((data) => setAsesores(data));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApply = () => {
        console.log("Filtros seleccionados:", filtros);
        setOpenModalFiltros(false);
    };

    const handleClear = () => {
        setFiltros(initialFiltros);
    };

    const filasFiltradas = asesores.filter((row) => {
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
        <div className="h-[calc(100vh-1rem)] w-full rounded-2xl pl-17 py-10 pr-17 flex flex-col items-start justify-start gap-11 bg-gray-100 overflow-hidden">
            <div>
                <p className="text-2xl font-bold">Asesores Par</p>
            </div>

            <div className="flex gap-8 items-center w-full">
                <InputBuscar
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button 
                    onClick={() => setModalAgregarOpen(true)}
                    className="bg-[#2e7d32] hover:bg-[#1b5e20] text-sm text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                    <AddIcon/>
                    Agregar Asesor
                </button>
            </div>

            {cargando ? (
                <p className="text-gray-500 font-medium">Cargando asesores par...</p>
            ) : (
                <TablaAsesoresPar rows={filasFiltradas} />
            )}

            {/* Modal de Filtros */}
            <ModalFiltros
                open={openModalFiltros}
                onClose={() => setOpenModalFiltros(false)}
                onApply={handleApply}
                onClear={handleClear}
            >
                <div className="flex flex-col gap-4">
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

            {/* Modal para Agregar Asesor Par */}
            <ModalAgregarAsesorPar
                open={modalAgregarOpen}
                onClose={() => setModalAgregarOpen(false)}
                onAsesorAgregado={handleAsesorAgregado}
            />

            {/* Notificación Toast */}
            <ToastNotification
                open={toast.open}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
            />
        </div>
    );
}