import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import { useEffect, useState } from "react";
import InputBuscar from "../../../../components/ui/InputBuscar";
import ToastNotification from "../../../../components/ui/ToastNotification";
import ModalCrearAsesorDisciplinar from "../components/asesoresDisciplinares/modales/ModalCrearAsesorDisciplinar";
import TablaAsesoresDisciplinares from "../components/asesoresDisciplinares/TablaAsesoresDisciplinares";
import ModalCargaExcel from "../components/ModalCargaExel";
import { getAsesoresDisciplinares } from "../services/asesoresDisciplinaresService";

// Color de los botones de crear (distinto al verde de la carga masiva)
const AZUL = "#244B91";
const AZUL_OSCURO = "#1B3A73";

export default function AsesoresDisciplinares() {
    const [asesores, setAsesores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [modalExcelOpen, setModalExcelOpen] = useState(false);
    const [modalCrearOpen, setModalCrearOpen] = useState(false);

    // Estado para el toast global de la vista
    const [toast, setToast] = useState({ open: false, message: "", type: "info" });

    const showToast = (message, type = "info") => {
        setToast({ open: true, message, type });
    };

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    useEffect(() => {
        getAsesoresDisciplinares()
            .then((data) => {
                setAsesores(data);
            })
            .catch((error) => {
                console.error("Error al obtener los asesores disciplinares:", error);
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

    const handleExcelData = (data) => {
        console.log("Asesores disciplinares cargados desde Excel:", data);
        // TODO: enviar el archivo al backend para registrar los asesores de forma masiva
    };

       // Agrega el asesor creado a la lista (el id real lo asignará el backend)
    const handleCrearAsesor = async (nuevoAsesor) => {
        // TODO: enviar nuevoAsesor al backend; la contraseña no se guarda en la lista
        const datosVisibles = { ...nuevoAsesor };
        delete datosVisibles.contrasena;

        setAsesores((prev) => {
            const nuevoId = prev.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
            return [{ ...datosVisibles, id: nuevoId }, ...prev];
        });
    };

    // Actualiza en la lista el asesor editado desde el modal de información
    const actualizarAsesor = (asesorActualizado) => {
        setAsesores((prev) =>
            prev.map((item) => (item.id === asesorActualizado.id ? { ...item, ...asesorActualizado } : item))
        );
    };

    // Quita de la lista al asesor eliminado
    const quitarAsesor = (id) => {
        setAsesores((prev) => prev.filter((item) => item.id !== id));
    };

    // Quita el foco del elemento activo antes de abrir un modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    const handleOpenModalExcel = (event) => {
        clearFocus(event);
        setModalExcelOpen(true);
    };

    const handleOpenModalCrear = (event) => {
        clearFocus(event);
        setModalCrearOpen(true);
    };

    // Filtro por búsqueda en tiempo real (nombre, correo o número de cuenta)
    const filasFiltradas = asesores.filter((row) => {
        const texto = busqueda.toLowerCase().trim();
        if (!texto) return true;

        const nombre = (row.nombre || "").toLowerCase();
        const correo = (row.correo || "").toLowerCase();
        const numCuenta = (row.numeroCuenta || "").toLowerCase();

        return (
            nombre.includes(texto) ||
            correo.includes(texto) ||
            numCuenta.includes(texto)
        );
    });

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-[#F4F7FC] px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <p className="text-2xl font-bold">Asesores Disciplinares</p>

            {/* Barra de herramientas: en celular el buscador va arriba y "Cargar Asesores" debajo (a la mitad del ancho) */}
            <div className="w-full flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="w-full min-w-0 sm:flex-1">
                    <InputBuscar
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre, correo o número de cuenta..."
                    />
                </div>

                <button
                    onClick={handleOpenModalExcel}
                    className="w-1/2 sm:w-auto shrink-0 justify-center bg-[#2e7d32] hover:bg-[#1b5e20] text-sm text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1.8 14.8l-1.4 1.4L12 15.8l-2.4 2.4-1.4-1.4 2.4-2.4-2.4-2.4 1.4-1.4 2.4 2.4 2.4-2.4 1.4 1.4-2.4 2.4 2.4 2.4zM13 9V3.5L18.5 9H13z"/>
                    </svg>
                    Cargar Asesores
                </button>

                {/* Botón normal: solo tablet y escritorio */}
                <Button
                    variant="contained"
                    size="medium"
                    startIcon={<AddOutlinedIcon />}
                    onClick={handleOpenModalCrear}
                    sx={{
                        borderRadius: "5px",
                        textTransform: "none",
                        backgroundColor: AZUL,
                        "&:hover": { backgroundColor: AZUL_OSCURO },
                        flexShrink: 0,
                        display: { xs: "none", sm: "inline-flex" }
                    }}
                >
                    Crear Asesor
                </Button>
            </div>

            {/* Botón flotante: solo celular */}
            <Fab
                variant="extended"
                aria-label="Crear asesor"
                onClick={handleOpenModalCrear}
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
                <AddOutlinedIcon sx={{ mr: 1 }} />
                Crear asesor
            </Fab>

            <ModalCargaExcel
                open={modalExcelOpen}
                onClose={() => setModalExcelOpen(false)}
                onDataLoaded={handleExcelData}
            />

            <ModalCrearAsesorDisciplinar
                open={modalCrearOpen}
                onClose={() => setModalCrearOpen(false)}
                onSave={handleCrearAsesor}
                showToast={showToast}
            />

            {/* Contenido: en celular se deja espacio abajo para que el botón flotante no tape la paginación */}
            <div className="w-full flex flex-1 flex-col pb-24 sm:pb-5">
                {cargando ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <CircularProgress sx={{ color: '#244B91' }} />
                        <p className="text-sm text-gray-600">Cargando asesores disciplinares...</p>
                    </div>
                ) : (
                    <TablaAsesoresDisciplinares
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