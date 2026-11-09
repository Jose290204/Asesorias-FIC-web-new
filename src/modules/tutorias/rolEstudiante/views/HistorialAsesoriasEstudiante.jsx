import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import { useCallback, useEffect, useState } from "react";
import ToastNotification from "../../../../components/ui/ToastNotification";
import { traerAsesorias } from "../../../../Services/asesoriasEstudianteService";
import { mensajesDeError } from "../../../../Services/errores";
import ListaHistorialEstudiante from "../components/historial/ListaHistorialEstudiante";

export default function HistorialAsesoriasEstudiante() {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // La API pagina de 10 en 10: "meta" trae la última página y el total
    const [pagina, setPagina] = useState(1);
    const [meta, setMeta] = useState(null);

    // Toast para errores de carga
    const [toast, setToast] = useState({ open: false, message: "", type: "info" });

    // El historial son las asesorías ya cerradas: completadas y canceladas
    const cargarHistorial = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const { asesorias, meta: metaNueva } = await traerAsesorias({ estatus: "historial", page: pagina });
            setHistorial(asesorias);
            setMeta(metaNueva);
        } catch (err) {
            console.error("Error al cargar el historial", err);
            setError(true);
            setToast({ open: true, message: mensajesDeError(err)[0], type: "error" });
        } finally {
            setLoading(false);
        }
    }, [pagina]);

    useEffect(() => {
        cargarHistorial();
    }, [cargarHistorial]);

    const total = meta?.total ?? historial.length;

    return (
        <div className="min-h-[calc(100dvh-4.5rem)] w-full px-4 py-6 md:px-17 md:py-10 flex flex-col items-start justify-start gap-6 md:gap-11 bg-transparent">
            <div>
                <p className="text-2xl font-bold">Historial de asesorias</p>
                {!loading && !error && (
                    <p className="mt-1 text-sm text-gray-600">
                        <span className="font-bold">{total}</span>{" "}
                        {total === 1 ? "resultado" : "resultados"}
                    </p>
                )}
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
                        <ListaHistorialEstudiante historial={historial} />

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
