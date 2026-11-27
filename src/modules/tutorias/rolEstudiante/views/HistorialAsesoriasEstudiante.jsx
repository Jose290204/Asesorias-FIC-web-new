import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import { useCallback, useEffect, useState } from "react";
import useRefrescoPorAvisos from "../../../../hooks/useRefrescoPorAvisos";
import ToastNotification from "../../../../components/ui/ToastNotification";
import { traerAsesorias } from "../../../../Services/asesoriasEstudianteService";
import { mensajesDeError } from "../../../../Services/errores";
import { conTiempoMinimo } from '../../../../utils/tiempoMinimo';
import TituloVista from "../../../../components/ui/TituloVista";
import ListaHistorialEstudiante from "../components/historial/ListaHistorialEstudiante";

// Filtro por estatus del historial. "valor" es lo que entiende la API (estatus) y "color" el de la tarjeta
const FILTROS = [
    { valor: "historial", label: "Todas", color: "#244B91" },
    { valor: "completada", label: "Completadas", color: "#2E7D32" },
    { valor: "cancelada", label: "Canceladas", color: "#C62828" },
];

export default function HistorialAsesoriasEstudiante() {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // La API pagina de 10 en 10: "meta" trae la última página y el total
    const [pagina, setPagina] = useState(1);
    const [meta, setMeta] = useState(null);

    // Estatus elegido: "historial" = completadas y canceladas juntas
    const [filtro, setFiltro] = useState("historial");

    // Toast para errores de carga
    const [toast, setToast] = useState({ open: false, message: "", type: "info" });

    // El historial son las asesorías ya cerradas: completadas y canceladas
    const cargarHistorial = useCallback(async ({ silencioso = false } = {}) => {
        try {
            if (!silencioso) setLoading(true);
            setError(false);
            const { asesorias, meta: metaNueva } = await conTiempoMinimo(traerAsesorias({ estatus: filtro, page: pagina }));
            setHistorial(asesorias);
            setMeta(metaNueva);
        } catch (err) {
            console.error("Error al cargar el historial", err);
            if (!silencioso) setError(true);
            setToast({ open: true, message: mensajesDeError(err)[0], type: "error" });
        } finally {
            setLoading(false);
        }
    }, [pagina, filtro]);

    useEffect(() => {
        cargarHistorial();
    }, [cargarHistorial]);

    useRefrescoPorAvisos(() => cargarHistorial({ silencioso: true }));

    const total = meta?.total ?? historial.length;

    // Al cambiar de filtro se vuelve a la primera página
    const cambiarFiltro = (valor) => {
        if (valor === filtro) return;
        setFiltro(valor);
        setPagina(1);
    };

    const textoVacio = filtro === "completada"
        ? "No tienes asesorías completadas."
        : filtro === "cancelada"
            ? "No tienes asesorías canceladas."
            : "No tienes asesorías en tu historial.";

    return (
        <div className="min-h-[calc(100dvh-4.5rem)] w-full px-4 py-6 md:px-17 md:py-10 flex flex-col items-start justify-start gap-6 md:gap-11 bg-transparent">
            <TituloVista
                titulo="Historial de asesorías"
                subtitulo={!loading && !error ? `${total} ${total === 1 ? "resultado" : "resultados"}` : null}
            />

            {/* Filtro por estatus */}
            <div className="flex w-full flex-wrap gap-2" role="group" aria-label="Filtrar por estatus">
                {FILTROS.map((f) => {
                    const activo = filtro === f.valor;
                    return (
                        <Chip
                            key={f.valor}
                            label={f.label}
                            onClick={() => cambiarFiltro(f.valor)}
                            aria-pressed={activo}
                            variant={activo ? "filled" : "outlined"}
                            sx={{
                                fontWeight: 600,
                                borderColor: f.color,
                                color: activo ? "#fff" : f.color,
                                backgroundColor: activo ? f.color : "transparent",
                                "&:hover": { backgroundColor: activo ? f.color : `${f.color}1A` },
                                "&:focus": { backgroundColor: activo ? f.color : "transparent" },
                            }}
                        />
                    );
                })}
            </div>

            {/* Contenedor de las tarjetas (el scroll lo hace la página, no este contenedor) */}
            <div className="w-full pb-5">
                {loading ? (
                    <div className="w-full min-h-[40vh] flex flex-col items-center justify-center gap-3">
                        <CircularProgress />
                        <p className="text-gray-500 font-semibold">Cargando historial...</p>
                    </div>
                ) : error ? (
                    <div className="w-full py-10 text-center">
                        <p className="text-gray-500 mb-1">No se pudo cargar el historial.</p>
                        <Button onClick={cargarHistorial} sx={{ textTransform: "none", fontWeight: 600 }}>
                            Reintentar
                        </Button>
                    </div>
                ) : (
                    <>
                        <ListaHistorialEstudiante historial={historial} textoVacio={textoVacio} />

                        {/* Paginación: solo aparece si hay más de una página */}
                        {meta && meta.last_page > 1 && (
                            <div className="mt-6 flex w-full justify-center">
                                <Pagination count={meta.last_page} page={pagina} onChange={(_, nueva) => setPagina(nueva)} />
                            </div>
                        )}
                    </>
                )}
            </div>

            <ToastNotification
                open={toast.open}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}
