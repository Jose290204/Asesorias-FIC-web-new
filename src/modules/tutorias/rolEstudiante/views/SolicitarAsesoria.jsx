import { useState, useEffect } from "react";
import TarjetaSolicitarAsesorias from "../components/TarjetaSolicitarAsesorias";
import Button from '@mui/material/Button';
import InputBuscar from "../../../../components/ui/InputBuscar";
import BotonFiltro from "../../../../components/ui/BotonFlitro";
import ModalFiltros from "../../../../components/ui/ModalFiltros";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { ModalCrearSolicitud } from "../components/ModalesSolicitarAsesorias";
import ToastNotification from "../../../../components/ui/ToastNotification";
import { catalogoService } from "../../rolAdministrador/services/catalogoService"; // Asegúrate de que la ruta sea correcta

const initialFiltros = {
    licenciatura: "",
    grupo: "",
    modalidad: "",
    horario: "",
    razon: ""
};

export default function SolicitarAsesoria() {

    // Arreglo de datos estático
    const asesores = [
        { id: 30, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materias: ["Introducción a la programación, Base de datos, Redes"], modalidad: "Presencial / Virtual", horarios: ['9:00 - 10:00 AM, 11:00 - 12:00 PM'], licenciatura: 'Licenciatura en informatica', grupo: "2-1" },
        { id: 31, asesor: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materias: ["Introducción a la programación, Base de datos, Redes"], modalidad: "Presencial / Virtual", horarios: ['9:00 - 10:00 AM, 11:00 - 12:00 PM'], licenciatura: 'Licenciatura en informatica', grupo: "2-1" },
        { id: 32, asesor: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materias: ["Introducción a la programación, Base de datos, Redes"], modalidad: "Presencial / Virtual", horarios: ['9:00 - 10:00 AM, 11:00 - 12:00 PM'], licenciatura: 'Licenciatura en informatica', grupo: "2-1" },
        { id: 33, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materias: ["Introducción a la programación, Base de datos, Redes"], modalidad: "Presencial / Virtual", horarios: ['9:00 - 10:00 AM, 11:00 - 12:00 PM'], licenciatura: 'Licenciatura en informatica', grupo: "2-1" },
        { id: 34, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materias: ["Introducción a la programación, Base de datos, Redes"], modalidad: "Presencial / Virtual", horarios: ['9:00 - 10:00 AM, 11:00 - 12:00 PM'], licenciatura: 'Licenciatura en informatica', grupo: "2-1" },
        { id: 35, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materias: ["Introducción a la programación, Base de datos, Redes"], modalidad: "Presencial / Virtual", horarios: ['9:00 - 10:00 AM, 11:00 - 12:00 PM'], licenciatura: 'Licenciatura en informatica', grupo: "2-1" },
        { id: 36, asesor: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materias: ["Introducción a la programación, Base de datos, Redes"], modalidad: "Presencial / Virtual", horarios: ['9:00 - 10:00 AM, 11:00 - 12:00 PM'], licenciatura: 'Licenciatura en informatica', grupo: "2-1" },
        { id: 37, asesor: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materias: ["Introducción a la programación, Base de datos, Redes"], modalidad: "Presencial / Virtual", horarios: ['9:00 - 10:00 AM, 11:00 - 12:00 PM'], licenciatura: 'Licenciatura en informatica', grupo: "2-1" },
        { id: 38, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materias: ["Introducción a la programación, Base de datos, Redes"], modalidad: "Presencial / Virtual", horarios: ['9:00 - 10:00 AM, 11:00 - 12:00 PM'], licenciatura: 'Licenciatura en informatica', grupo: "2-1" },
        { id: 39, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materias: ["Introducción a la programación, Base de datos, Redes"], modalidad: "Presencial / Virtual", estado: "RECHAZADA", licenciatura: 'Licenciatura en informatica', grupo: "2-1" }
    ];

    const [query, setQuery] = useState("");
    const [openModalFiltros, setOpenModalFiltros] = useState(false);
    const [filtros, setFiltros] = useState(initialFiltros);

    // Estados para almacenar los datos de los catálogos
    const [licenciaturas, setLicenciaturas] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [gruposFiltrados, setGruposFiltrados] = useState([]);
    const [modalidades, setModalidades] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [razones, setRazones] = useState([]);

    // Estado del modal crear
    const [modalCrearOpen, setModalCrearOpen] = useState(false);

    // Estado para el Toast Global
    const [toast, setToast] = useState({
        open: false,
        message: "",
        type: "info"
    });

    // Cargar catálogos al montar el componente
    useEffect(() => {
        const licData = catalogoService.getLicenciaturas();
        const grpData = catalogoService.getGrupos();
        const modData = catalogoService.getModalidades();
        const horData = catalogoService.getHorarios();
        const razData = catalogoService.getRazonesAsesoria();

        setLicenciaturas(licData);
        setGrupos(grpData);
        setGruposFiltrados(grpData);
        setModalidades(modData);
        setHorarios(horData);
        setRazones(razData);
    }, []);

    const showToast = (message, type = "info") => {
        setToast({ open: true, message, type });
    };

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    // Helper para desenfocar elementos activos antes de abrir el modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    const handleOpenModalFiltros = (event) => {
        clearFocus(event);
        setOpenModalFiltros(true);
    };

    const handleOpenCrear = (event) => {
        clearFocus(event);
        setModalCrearOpen(true);
    };

    const handleCrearSolicitud = async (nuevaSolicitud) => {
        console.log("Solicitud creada:", nuevaSolicitud);
    };

    // Manejo de cambios en los inputs del filtro dinámico
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "licenciatura") {
            const idLic = Number(value);
            if (idLic) {
                const filtrados = grupos.filter((g) => g.id_licenciatura === idLic);
                setGruposFiltrados(filtrados.length > 0 ? filtrados : grupos);
            } else {
                setGruposFiltrados(grupos);
            }
            setFiltros((prev) => ({
                ...prev,
                licenciatura: value,
                grupo: ""
            }));
        } else {
            setFiltros((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFocus = (e) => {
        e.target.size = 5;
    };

    const handleBlur = (e) => {
        e.target.size = 1;
    };

    const handleSelectOption = (e) => {
        handleChange(e);
        e.target.size = 1;
        e.target.blur();
    };

    const handleApply = () => {
        console.log("Filtros aplicados:", filtros);
        setOpenModalFiltros(false);
    };

    const handleClear = () => {
        setFiltros(initialFiltros);
        setGruposFiltrados(grupos);
    };

    // Filtrar los datos combinando búsqueda por texto y opciones del modal
    const asesoresFiltrados = asesores.filter((item) => {
        // 1. Filtrado por texto (Buscador)
        const nombreAsesor = item.asesor || "";
        const materiasTexto = Array.isArray(item.materias) ? item.materias.join(" ") : String(item.materias || "");
        const modalidadTexto = item.modalidad || "";

        const textoCompleto = `${nombreAsesor} ${materiasTexto} ${modalidadTexto}`.toLowerCase();
        const texto = query.toLowerCase().trim();
        const coincideTexto = !texto || textoCompleto.includes(texto);

        // 2. Filtrado por opciones del modal de filtros
        // Nota: Asegúrate de adaptar las comparaciones si tus IDs de filtros coinciden con nombres o números en los objetos
        const coincideLicenciatura = !filtros.licenciatura || 
            String(item.id_licenciatura || item.licenciatura).toLowerCase().includes(String(filtros.licenciatura).toLowerCase());
        
        const coincideGrupo = !filtros.grupo || 
            String(item.id_grupo || item.grupo).toLowerCase().includes(String(filtros.grupo).toLowerCase());
        
        const coincideModalidad = !filtros.modalidad || 
            String(item.id_modalidad || item.modalidad).toLowerCase().includes(String(filtros.modalidad).toLowerCase());
        
        const coincideHorario = !filtros.horario || 
            (Array.isArray(item.horarios) ? item.horarios.join(" ") : String(item.horarios || "")).toLowerCase().includes(String(filtros.horario).toLowerCase());
        
        const coincideRazon = !filtros.razon || 
            String(item.id_razon || item.razon).toLowerCase().includes(String(filtros.razon).toLowerCase());

        return (
            coincideTexto &&
            coincideLicenciatura &&
            coincideGrupo &&
            coincideModalidad &&
            coincideHorario &&
            coincideRazon
        );
    });

    return (
        <div className="h-[calc(100vh-1rem)] w-full rounded-2xl pl-17 py-10 pr-17 flex flex-col items-start justify-start gap-11 bg-gray-100 overflow-hidden">
            <div>
                <p className="text-2xl font-bold">Solicitar Asesoria</p>
            </div>

            <div className="w-full flex justify-between items-center">
                {/* FILTRO BOTÓN */}
                <BotonFiltro onClick={handleOpenModalFiltros} />

                <InputBuscar
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar Asesoría"
                />
            </div>

            {/* LISTADO DE TARJETAS */}
            <div className="w-full overflow-y-auto max-h-[calc(100vh-180px)] pb-5 flex flex-row flex-wrap gap-7 justify-center">
                {asesoresFiltrados.length === 0 ? (
                    <p className="col-span-full py-10 text-center text-gray-500">
                        No se encontraron asesores.
                    </p>
                ) : (
                    asesoresFiltrados.map((item) => (
                        <TarjetaSolicitarAsesorias key={item.id} asesor={item} />
                    ))
                )}
            </div>

            {/* Boton */}
            <div className="w-full flex justify-end">
                <Button
                    variant="contained"
                    sx={{ borderRadius: '5px', textTransform: 'none', backgroundColor: '#2E7D32' }}
                    size="medium"
                    startIcon={<AddOutlinedIcon />}
                    onClick={handleOpenCrear}
                >
                    Crear Solicitud
                </Button>
            </div>

            {/* Modal de Filtros Dinámicos */}
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
                            onChange={handleSelectOption}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer text-sm"
                        >
                            <option value="">Selecciona una licenciatura</option>
                            {licenciaturas.map((item) => (
                                <option key={item.id_licenciatura} value={item.id_licenciatura}>
                                    {item.licenciatura}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="font-bold text-sm block mb-1">Grupo</label>
                        <select
                            name="grupo"
                            value={filtros.grupo}
                            onChange={handleSelectOption}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer text-sm"
                        >
                            <option value="">Selecciona un grupo</option>
                            {gruposFiltrados.map((item) => (
                                <option key={item.id_grupo} value={item.id_grupo}>
                                    {item.grupo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="font-bold text-sm block mb-1">Modalidad</label>
                        <select
                            name="modalidad"
                            value={filtros.modalidad}
                            onChange={handleSelectOption}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer text-sm"
                        >
                            <option value="">Selecciona modalidad</option>
                            {modalidades.map((item) => (
                                <option key={item.id_modalidad} value={item.id_modalidad}>
                                    {item.modalidad}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="font-bold text-sm block mb-1">Horario</label>
                        <select
                            name="horario"
                            value={filtros.horario}
                            onChange={handleSelectOption}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer text-sm"
                        >
                            <option value="">Selecciona un horario</option>
                            {horarios.map((item) => (
                                <option key={item.id_horario} value={item.id_horario}>
                                    {item.horario}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="font-bold text-sm block mb-1">Razón</label>
                        <select
                            name="razon"
                            value={filtros.razon}
                            onChange={handleSelectOption}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer text-sm"
                        >
                            <option value="">Selecciona una razón</option>
                            {razones.map((item) => (
                                <option key={item.id_razon} value={item.id_razon}>
                                    {item.razon}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </ModalFiltros>

            {/* Modal Crear Solicitud */}
            <ModalCrearSolicitud
                open={modalCrearOpen}
                onClose={() => setModalCrearOpen(false)}
                onSave={handleCrearSolicitud}
                showToast={showToast}
                asesores={asesores}
            />

            {/* Toast Global */}
            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />

        </div>
    );
}