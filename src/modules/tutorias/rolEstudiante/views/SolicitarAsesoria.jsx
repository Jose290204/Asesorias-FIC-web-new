import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import Pagination from '@mui/material/Pagination';
import { useCallback, useEffect, useRef, useState } from "react";
import BotonFiltro from "../../../../components/ui/BotonFlitro";
import InputBuscar from "../../../../components/ui/InputBuscar";
import ToastNotification from "../../../../components/ui/ToastNotification";
import { traerAsesores } from "../../../../Services/asesoresEstudianteService";
import { traerOpcionesFiltros } from "../../../../Services/opcionesFiltrosService";
import { crearSolicitud } from "../../../../Services/solicitudesEstudianteService";
import { ModalCrearSolicitud } from "../components/ModalesSolicitarAsesorias";
import ModalFiltrosEstudiante from "../components/ModalFiltrosEstudiante";
import TarjetaSolicitarAsesorias from "../components/TarjetaSolicitarAsesorias";

// Cada filtro guarda el VALOR que se manda al backend (id o texto del enum), "" = sin filtrar
const initialFiltros = {
    materia: "",
    horario: "",
    modalidad: ""
};

export default function SolicitarAsesoria() {

    const [asesores, setAsesores] = useState([]);
    const [meta, setMeta] = useState(null);      // datos de paginación que manda el backend
    const [pagina, setPagina] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // query: lo que se escribe en el buscador. buscar: ese texto ya "asentado" (400 ms sin teclear)
    const [query, setQuery] = useState("");
    const [buscar, setBuscar] = useState("");
    const [openModalFiltros, setOpenModalFiltros] = useState(false);
    // filtros: los ya aplicados a la lista. borrador: lo que se está eligiendo en el modal.
    const [filtros, setFiltros] = useState(initialFiltros);
    const [borrador, setBorrador] = useState(initialFiltros);
    // Opciones de los selects del modal: { materias, horarios, modalidades } de { valor, etiqueta }
    const [opciones, setOpciones] = useState({ materias: [], horarios: [], modalidades: [], razones: [] });

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

    // Número de la última petición enviada: si llega una respuesta vieja después de una nueva, se descarta
    const ultimaPeticion = useRef(0);

    // Carga la lista de asesores aplicando búsqueda, filtros y página
    const cargarAsesores = useCallback(async () => {
        const numero = ++ultimaPeticion.current;
        try {
            setLoading(true);
            setError(false);
            const resultado = await traerAsesores({
                buscar,
                materiaId: filtros.materia,
                horarioId: filtros.horario,
                modalidad: filtros.modalidad,
                page: pagina
            });
            if (numero !== ultimaPeticion.current) return; // ya salió una petición más nueva
            setAsesores(resultado.asesores);
            setMeta(resultado.meta);
        } catch (err) {
            if (numero !== ultimaPeticion.current) return;
            console.error("Error al cargar asesores", err);
            setError(true);
            showToast("No se pudieron cargar los asesores", "error");
        } finally {
            if (numero === ultimaPeticion.current) setLoading(false);
        }
    }, [buscar, filtros, pagina, showToast]);

    // Se vuelve a cargar cada vez que cambia la búsqueda, un filtro o la página
    useEffect(() => {
        cargarAsesores();
    }, [cargarAsesores]);

    // Opciones de los selects del modal: se piden una sola vez al entrar
    useEffect(() => {
        traerOpcionesFiltros()
            .then(setOpciones)
            .catch((err) => {
                console.error("Error al cargar las opciones de filtros", err);
                showToast("No se pudieron cargar las opciones de filtros", "error");
            });
    }, [showToast]);

    // Debounce: espera 400 ms sin teclear antes de buscar, y regresa a la página 1
    useEffect(() => {
        const espera = setTimeout(() => {
            setBuscar(query.trim());
            setPagina(1);
        }, 400);
        return () => clearTimeout(espera);
    }, [query]);

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

    const MENSAJES_ERROR = {
        sin_ciclo: 'No hay un ciclo escolar vigente ahora mismo.',
        fuera_de_ciclo: 'Esa fecha queda fuera del ciclo escolar vigente.',
        dia_no_disponible: 'Ese día no se ofrecen asesorías.',
        materia_no_ofrecida: 'El asesor ya no imparte esa materia.',
        modalidad_no_ofrecida: 'El asesor ya no ofrece esa modalidad.',
        horario_no_disponible: 'El asesor ya no tiene ese horario disponible.',
        solicitud_duplicada: 'Ya tienes una solicitud pendiente para ese mismo horario.',
    };

   const handleCrearSolicitud = async (nuevaSolicitud) => {
        try {
            await crearSolicitud(nuevaSolicitud);
            cargarAsesores(); // refresca la lista por si el asesor se quedó sin cupo
        } catch (error) {
             const codigo = error.response?.data?.codigo;
            const mensaje = MENSAJES_ERROR[codigo] || error.response?.data?.message || 'No se pudo crear la solicitud';
            throw new Error(mensaje);
        }
    };

    // Manejo de cambios en los inputs del filtro
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBorrador((prev) => ({ ...prev, [name]: value }));
    };

    // Aplicar: los cambios del modal pasan a la lista (desde la página 1) y se cierra
    const handleApply = () => {
        setFiltros(borrador);
        setPagina(1);
        setOpenModalFiltros(false);
    };

    // Limpiar: borra todos los filtros (aplicados y del modal) y se cierra
    const handleClear = () => {
        setBorrador(initialFiltros);
        setFiltros(initialFiltros);
        setPagina(1);
        setOpenModalFiltros(false);
    };

    const handleCambiarPagina = (_evento, nuevaPagina) => {
        setPagina(nuevaPagina);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Cuántos se muestran en esta página (meta.from y meta.to son null cuando no hay resultados)
    const mostrando = meta?.total > 0 ? meta.to - meta.from + 1 : 0;

   return (
    <div className="w-full px-4 py-6 md:px-17 md:py-10 flex flex-col items-start justify-start gap-6 md:gap-11">
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
        {!loading && !error && meta && (
            <p className="-mt-3 md:-mt-6 text-sm text-gray-600">
                Mostrando <span className="font-bold">{mostrando}</span> de{" "}
                <span className="font-bold">{meta.total}</span> asesores
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
        <div className="w-full pb-5 grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
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
            ) : asesores.length === 0 ? (
                <p className="col-span-full py-10 text-center text-gray-500">
                    No se encontraron asesores.
                </p>
            ) : (
                asesores.map((item) => (
                    <TarjetaSolicitarAsesorias
                        key={item.id}
                        asesor={item}
                        onSaveSolicitud={handleCrearSolicitud}
                        showToast={showToast}
                        razones={opciones.razones}
                    />
                ))
            )}
        </div>

        {/* Paginación: solo si hay más de una página */}
        {!loading && !error && meta?.last_page > 1 && (
            <div className="w-full flex justify-center pb-24 sm:pb-5">
                <Pagination
                    count={meta.last_page}
                    page={pagina}
                    onChange={handleCambiarPagina}
                    color="primary"
                />
            </div>
        )}

        {/* Modal de Filtros del estudiante */}
        <ModalFiltrosEstudiante
            open={openModalFiltros}
            onClose={() => setOpenModalFiltros(false)}
            opciones={opciones}
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
            razones={opciones.razones}
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