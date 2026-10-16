import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import { useCallback, useEffect, useState } from "react";
import BotonFiltro from "../../../../components/ui/BotonFlitro";
import InputBuscar from "../../../../components/ui/InputBuscar";
import ToastNotification from "../../../../components/ui/ToastNotification";
import ModalFiltrosEstudiante from "../components/ModalFiltrosEstudiante";
import { ModalCrearSolicitud } from "../components/ModalesSolicitarAsesorias";
import TarjetaSolicitarAsesorias from "../components/TarjetaSolicitarAsesorias";

const initialFiltros = {
    materia: "",
    horario: "",
    modalidad: ""
};

// Info del estudiante (la que llega al iniciar sesión).
// TODO: reemplazar por el usuario real, p. ej. const { user } = useAuth();
// y pasar user.materias / user.horarios / user.modalidades.
const estudiante = {
    materias: ["Programación Web", "Bases de Datos", "Estructura de Datos", "Redes de Computadoras"],
    horarios: ["9:00 - 10:00 AM", "11:00 - 12:00 PM", "4:00 - 5:00 PM"],
    modalidades: ["Presencial", "Virtual"]
};

// Datos de prueba. Cuando haya backend, esto viene del servicio.
const ASESORES_PRUEBA = [
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

export default function SolicitarAsesoria() {

    const [asesores, setAsesores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [query, setQuery] = useState("");
    const [openModalFiltros, setOpenModalFiltros] = useState(false);
    // filtros: los ya aplicados a la lista. borrador: lo que se está eligiendo en el modal.
    const [filtros, setFiltros] = useState(initialFiltros);
    const [borrador, setBorrador] = useState(initialFiltros);

    // Estado del modal crear
    const [modalCrearOpen, setModalCrearOpen] = useState(false);

    // Estado para el Toast Global
    const [toast, setToast] = useState({
        open: false,
        message: "",
        type: "info"
    });

    const showToast = useCallback((message, type = "info") => {
        setToast({ open: true, message, type });
    }, []);

    // Carga la lista de asesores
    const cargarAsesores = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            // TODO: reemplazar por la llamada real al servicio (ej. asesoresService.obtenerAsesores())
            await new Promise((resolve) => setTimeout(resolve, 300));
            setAsesores(ASESORES_PRUEBA);
        } catch (err) {
            console.error("Error al cargar asesores", err);
            setError(true);
            showToast("No se pudieron cargar los asesores", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        cargarAsesores();
    }, [cargarAsesores]);

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
        setBorrador(filtros); // el modal siempre abre con los filtros ya aplicados
        setOpenModalFiltros(true);
    };

    const handleOpenCrear = (event) => {
        clearFocus(event);
        setModalCrearOpen(true);
    };

    const handleCrearSolicitud = async (nuevaSolicitud) => {
        console.log("Solicitud creada:", nuevaSolicitud);
    };

    // Manejo de cambios en los inputs del filtro
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBorrador((prev) => ({ ...prev, [name]: value }));
    };

    // Aplicar: los cambios del modal pasan a la lista y se cierra
    const handleApply = () => {
        setFiltros(borrador);
        setOpenModalFiltros(false);
    };

    // Limpiar: borra todos los filtros (aplicados y del modal) y se cierra
    const handleClear = () => {
        setBorrador(initialFiltros);
        setFiltros(initialFiltros);
        setOpenModalFiltros(false);
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
        const contiene = (valorItem, filtro) =>
            !filtro || String(valorItem ?? "").toLowerCase().includes(String(filtro).toLowerCase());

        const coincideMateria = contiene(materiasTexto, filtros.materia);
        const coincideModalidad = contiene(modalidadTexto, filtros.modalidad);
        const coincideHorario = contiene(
            Array.isArray(item.horarios) ? item.horarios.join(" ") : item.horarios,
            filtros.horario
        );

        return coincideTexto && coincideMateria && coincideModalidad && coincideHorario;
    });

   return (
    <div className="min-h-[calc(100dvh-4.5rem)] w-full px-4 py-6 md:px-17 md:py-10 flex flex-col items-start justify-start gap-6 md:gap-11 bg-gray-100">
        <p className="text-2xl font-bold">Solicitar Asesoria</p>

        <div className="w-full flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
            {/* FILTRO BOTÓN */}
            <BotonFiltro onClick={handleOpenModalFiltros} />

            <div className="w-full min-w-0 sm:flex-1">
                <InputBuscar
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar Asesor"
                />
            </div>

            {/* Botón normal: solo tablet y escritorio */}
            <Button
                variant="contained"
                sx={{ borderRadius: '5px', textTransform: 'none', backgroundColor: '#2E7D32', display: { xs: 'none', sm: 'inline-flex' } }}
                size="medium"
                startIcon={<AddOutlinedIcon />}
                onClick={handleOpenCrear}
            >
                Crear Solicitud
            </Button>
        </div>

        {/* Contador de resultados */}
        {!loading && !error && (
            <p className="-mt-3 md:-mt-6 text-sm text-gray-600">
                Mostrando <span className="font-bold">{asesoresFiltrados.length}</span> de{" "}
                <span className="font-bold">{asesores.length}</span> asesores
            </p>
        )}

        {/* Botón flotante: solo celular */}
        <Fab
            variant="extended"
            color="success"
            aria-label="Crear solicitud"
            onClick={handleOpenCrear}
            sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 10, textTransform: 'none', display: { xs: 'inline-flex', sm: 'none' } }}
        >
            <AddOutlinedIcon sx={{ mr: 1 }} />
            Crear solicitud
        </Fab>

        {/* LISTADO DE TARJETAS */}
        <div className="w-full pb-24 sm:pb-5 grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
            {loading ? (
                <div className="col-span-full min-h-[40vh] flex flex-col items-center justify-center gap-3">
                    <CircularProgress />
                    <p className="text-gray-500 font-semibold">Cargando asesores...</p>
                </div>
            ) : error ? (
                <div className="col-span-full py-10 text-center">
                    <p className="text-gray-500 mb-1">No se pudieron cargar los asesores.</p>
                    <button onClick={cargarAsesores} className="text-blue-700 font-semibold underline cursor-pointer">
                        Reintentar
                    </button>
                </div>
            ) : asesoresFiltrados.length === 0 ? (
                <p className="col-span-full py-10 text-center text-gray-500">
                    No se encontraron asesores.
                </p>
            ) : (
                asesoresFiltrados.map((item) => (
                    <TarjetaSolicitarAsesorias
                        key={item.id}
                        asesor={item}
                        onSaveSolicitud={handleCrearSolicitud}
                        showToast={showToast}
                    />
                ))
            )}
        </div>

        {/* Modal de Filtros del estudiante */}
        <ModalFiltrosEstudiante
            open={openModalFiltros}
            onClose={() => setOpenModalFiltros(false)}
            estudiante={estudiante}
            filtros={borrador}
            onChange={handleChange}
            onApply={handleApply}
            onClear={handleClear}
        />

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