import CircularProgress from "@mui/material/CircularProgress";
import { useCallback, useEffect, useState } from "react";
import BotonFiltro from "../../../../components/ui/BotonFlitro";
import InputBuscar from "../../../../components/ui/InputBuscar";
import ModalFiltrosAdmin from "../components/asesorias/modales/ModalFiltrosAdmin";
import TablaSolicitudes from "../components/solicitudes/TablaSolicitudes";
import { SOLICITUDES_ADMIN_PRUEBA, USAR_DATOS_PRUEBA_ADMIN } from "../datosPrueba";
import { catalogoService } from "../services/catalogoService";
import { getSolicitudes } from "../services/solicitudesService";

const initialFiltros = {
    licenciatura: "",
    grupo: "",
    modalidad: "",
    horario: "",
    razon: ""
};

// Compara textos sin acentos, espacios ni mayúsculas ("Informática" == "INFORMATICA", "9:00 - 10:00 AM" == "9:00-10:00 AM")
const normalizar = (texto) =>
    String(texto ?? "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, "")
        .toLowerCase();

// Nombre que corresponde a un id dentro de un catálogo
const nombreDe = (lista, campoId, campoNombre, id) =>
    lista.find((item) => String(item[campoId]) === String(id))?.[campoNombre];

// Sin filtro activo (nombre vacío) todo coincide; con filtro, el valor de la fila debe ser el mismo
const coincide = (valorFila, nombreFiltro) => !nombreFiltro || normalizar(valorFila) === normalizar(nombreFiltro);

export default function Solicitudes() {
    const [rows, setRows] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [openModalFiltros, setOpenModalFiltros] = useState(false);

    // "filtros" es lo que se está eligiendo en el modal; "filtrosAplicados" es lo que se usa en la lista
    const [filtros, setFiltros] = useState(initialFiltros);
    const [filtrosAplicados, setFiltrosAplicados] = useState(initialFiltros);

    // Catálogos para el modal de filtros
    const [licenciaturas, setLicenciaturas] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [gruposFiltrados, setGruposFiltrados] = useState([]);
    const [modalidades, setModalidades] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [razones, setRazones] = useState([]);

    // Carga las solicitudes: con datos de prueba si el interruptor está activo
    const cargarSolicitudes = useCallback(async () => {
        if (USAR_DATOS_PRUEBA_ADMIN) {
            setRows(SOLICITUDES_ADMIN_PRUEBA);
            setCargando(false);
            return;
        }

        try {
            const data = await getSolicitudes();
            setRows(data || []);
        } catch (error) {
            console.error("Error al cargar las solicitudes:", error);
        } finally {
            setCargando(false);
        }
    }, []);

    // Quita una solicitud de la lista (se usa al aprobar o rechazar con datos de prueba)
    const quitarSolicitud = (id) => {
        setRows((prev) => prev.filter((row) => row.id !== id));
    };

    useEffect(() => {
        const grpData = catalogoService.getGrupos();

        setLicenciaturas(catalogoService.getLicenciaturas());
        setGrupos(grpData);
        setGruposFiltrados(grpData);
        setModalidades(catalogoService.getModalidades());
        setHorarios(catalogoService.getHorarios());
        setRazones(catalogoService.getRazonesAsesoria());

        cargarSolicitudes();
    }, [cargarSolicitudes]);

    const handleOpenModalFiltros = (e) => {
        if (e?.currentTarget) e.currentTarget.blur();
        document.activeElement?.blur();
        setOpenModalFiltros(true);
    };

    // Al cambiar la licenciatura, los grupos se limitan a los de esa licenciatura
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
            setFiltros((prev) => ({ ...prev, licenciatura: value, grupo: "" }));
        } else {
            setFiltros((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleApply = () => {
        setFiltrosAplicados(filtros);
        setOpenModalFiltros(false);
    };

    const handleClear = () => {
        setFiltros(initialFiltros);
        setFiltrosAplicados(initialFiltros);
        setGruposFiltrados(grupos);
    };

    // Opciones del modal: cada una es { valor, etiqueta }
    const opcionesFiltros = {
        licenciaturas: licenciaturas.map((i) => ({ valor: i.id_licenciatura, etiqueta: i.licenciatura })),
        grupos: gruposFiltrados.map((i) => ({ valor: i.id_grupo, etiqueta: i.grupo })),
        modalidades: modalidades.map((i) => ({ valor: i.id_modalidad, etiqueta: i.modalidad })),
        horarios: horarios.map((i) => ({ valor: i.id_horario, etiqueta: i.horario })),
        razones: razones.map((i) => ({ valor: i.id_razon, etiqueta: i.razon }))
    };

    // Los filtros guardan ids; las filas traen textos, así que se comparan por nombre
    const nombresFiltro = {
        licenciatura: nombreDe(licenciaturas, "id_licenciatura", "licenciatura", filtrosAplicados.licenciatura),
        grupo: nombreDe(grupos, "id_grupo", "grupo", filtrosAplicados.grupo),
        modalidad: nombreDe(modalidades, "id_modalidad", "modalidad", filtrosAplicados.modalidad),
        horario: nombreDe(horarios, "id_horario", "horario", filtrosAplicados.horario),
        razon: nombreDe(razones, "id_razon", "razon", filtrosAplicados.razon)
    };

    const filasFiltradas = rows.filter((row) => {
        const texto = busqueda.toLowerCase().trim();
        const coincideBusqueda =
            !texto ||
            (row.materia || "").toLowerCase().includes(texto) ||
            (row.estudiante || "").toLowerCase().includes(texto) ||
            (row.asesor || "").toLowerCase().includes(texto);

        return (
            coincideBusqueda &&
            coincide(row.licenciatura, nombresFiltro.licenciatura) &&
            coincide(row.gradoGrupo, nombresFiltro.grupo) &&
            coincide(row.modalidad, nombresFiltro.modalidad) &&
            coincide(row.horario, nombresFiltro.horario) &&
            coincide(row.razonAsesoria, nombresFiltro.razon)
        );
    });

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-[#F4F7FC] px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <p className="text-2xl font-bold">Solicitudes</p>

            {/* Barra de herramientas: en celular el filtro va arriba y el buscador abajo */}
            <div className="w-full flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
                <BotonFiltro onClick={handleOpenModalFiltros} />

                <div className="w-full min-w-0 sm:flex-1">
                    <InputBuscar
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por materia, estudiante o asesor..."
                    />
                </div>
            </div>

            <div className="w-full flex flex-1 flex-col pb-5">
                {cargando ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <CircularProgress sx={{ color: '#244B91' }} />
                        <p className="text-sm text-gray-600">Cargando solicitudes...</p>
                    </div>
                ) : (
                    <TablaSolicitudes rows={filasFiltradas} onRemove={quitarSolicitud} onRefresh={cargarSolicitudes} />
                )}
            </div>

            <ModalFiltrosAdmin
                open={openModalFiltros}
                onClose={() => setOpenModalFiltros(false)}
                opciones={opcionesFiltros}
                filtros={filtros}
                onChange={handleChange}
                onApply={handleApply}
                onClear={handleClear}
            />
        </div>
    );
}