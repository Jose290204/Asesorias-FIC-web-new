import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import { useEffect, useState } from "react";
import InputBuscar from "../../../../components/ui/InputBuscar";
import ToastNotification from "../../../../components/ui/ToastNotification";
import ModalAsignarAsesorPar from "../components/asesoresPar/modales/ModalAsignarAsesorPar";
import TablaAsesoresPar from "../components/asesoresPar/TablaAsesoresPar";
import { getAsesoresPar } from "../services/asesoresParService";

// Color de los botones de asignar
const AZUL = "#2e7d32";
const AZUL_OSCURO = "#1b5e20";

// Unifica la forma de cada asesor sin importar si viene del mock o del backend.
// Un asesor par es un estudiante con rol de asesor: sus datos personales son los del estudiante.
// TODO: quitar esta adaptación cuando el servicio entregue directamente estos campos
const normalizarAsesorPar = (item) => ({
    ...item,
    nombre: item.nombre ?? item.estudiante ?? "",
    correo: item.correo ?? "",
    telefono: item.telefono ?? "",
    numeroCuenta: item.numeroCuenta ?? "",
    licenciatura: item.licenciatura ?? "",
    grupo: item.grupo ?? "",
    promedio: item.promedio ?? "",
    estado: item.estado ?? "ACTIVO",
    materias: item.materias ?? (item.materia ? [item.materia] : []),
    horarios: item.horarios ?? (item.horario ? [item.horario] : [])
});

export default function AsesoresPar() {
    const [asesores, setAsesores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [modalAsignarOpen, setModalAsignarOpen] = useState(false);

    // Estado para el toast global de la vista
    const [toast, setToast] = useState({ open: false, message: "", type: "info" });

    const showToast = (message, type = "info") => {
        setToast({ open: true, message, type });
    };

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    useEffect(() => {
        getAsesoresPar()
            .then((data) => {
                setAsesores(data.map(normalizarAsesorPar));
            })
            .catch((error) => {
                console.error("Error al obtener los asesores par:", error);
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

    // Cambia el rol del estudiante elegido a Asesor Par y lo agrega a la lista
    const handleAsignarAsesor = async (estudiante) => {
        // TODO: llamar al backend para cambiar el rol del estudiante a Asesor Par (id_rol 5)
        setAsesores((prev) => {
            const nuevoId = prev.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
            return [
                {
                    ...normalizarAsesorPar({}),
                    id: nuevoId,
                    idEstudiante: estudiante.id,
                    nombre: estudiante.nombre,
                    correo: estudiante.correo,
                    numeroCuenta: estudiante.numeroCuenta,
                    licenciatura: estudiante.licenciatura,
                    grupo: estudiante.grupo,
                    estado: "ACTIVO"
                },
                ...prev
            ];
        });
    };

    // Actualiza en la lista el asesor editado desde el modal de información
    const actualizarAsesor = (asesorActualizado) => {
        setAsesores((prev) =>
            prev.map((item) => (item.id === asesorActualizado.id ? { ...item, ...asesorActualizado } : item))
        );
    };

    // Quita el rol de asesor par: el estudiante sigue existiendo, solo sale de esta lista
    const quitarAsesor = (id) => {
        setAsesores((prev) => prev.filter((item) => item.id !== id));
    };

    // Quita el foco del elemento activo antes de abrir un modal
    const handleOpenModalAsignar = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
        setModalAsignarOpen(true);
    };

    // Filtro por búsqueda en tiempo real (nombre, correo o número de cuenta)
    const filasFiltradas = asesores.filter((row) => {
        const texto = busqueda.toLowerCase().trim();
        if (!texto) return true;

        return (
            (row.nombre || "").toLowerCase().includes(texto) ||
            (row.correo || "").toLowerCase().includes(texto) ||
            (row.numeroCuenta || "").toLowerCase().includes(texto)
        );
    });

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-[#F4F7FC] px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <p className="text-2xl font-bold">Asesores Par</p>

            {/* Barra de herramientas: buscador y botón de asignar (en celular el botón pasa a ser flotante) */}
            <div className="w-full flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="w-full min-w-0 sm:flex-1">
                    <InputBuscar
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre, correo o número de cuenta..."
                    />
                </div>

                {/* Botón normal: solo tablet y escritorio */}
                <Button
                    variant="contained"
                    size="medium"
                    startIcon={<PersonAddAlt1OutlinedIcon />}
                    onClick={handleOpenModalAsignar}
                    sx={{
                        borderRadius: "5px",
                        textTransform: "none",
                        backgroundColor: AZUL,
                        "&:hover": { backgroundColor: AZUL_OSCURO },
                        flexShrink: 0,
                        display: { xs: "none", sm: "inline-flex" }
                    }}
                >
                    Asignar Asesor Par
                </Button>
            </div>

            {/* Botón flotante: solo celular */}
            <Fab
                variant="extended"
                aria-label="Asignar asesor par"
                onClick={handleOpenModalAsignar}
                sx={{
                    position: "fixed",
                    right: 16,
                    bottom: 16,
                    zIndex: 10,
                    textTransform: "none",
                    color: "#ffffff",
                    backgroundColor: AZUL,
                    "&:hover": { backgroundColor: AZUL_OSCURO },
                    display: { xs: "inline-flex", sm: "none" }
                }}
            >
                <PersonAddAlt1OutlinedIcon sx={{ mr: 1 }} />
                Asignar asesor
            </Fab>

            <ModalAsignarAsesorPar
                open={modalAsignarOpen}
                onClose={() => setModalAsignarOpen(false)}
                asesoresActuales={asesores}
                onAsignar={handleAsignarAsesor}
                showToast={showToast}
            />

            {/* Contenido: en celular se deja espacio abajo para que el botón flotante no tape la paginación */}
            <div className="w-full flex flex-1 flex-col pb-24 sm:pb-5">
                {cargando ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <CircularProgress sx={{ color: '#244B91' }} />
                        <p className="text-sm text-gray-600">Cargando asesores par...</p>
                    </div>
                ) : (
                    <TablaAsesoresPar
                        rows={filasFiltradas}
                        onUpdate={actualizarAsesor}
                        onRemove={quitarAsesor}
                    />
                )}
            </div>

            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}