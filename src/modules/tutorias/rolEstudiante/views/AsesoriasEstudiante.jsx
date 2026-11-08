import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import { useCallback, useEffect, useState } from "react";
import ToastNotification from "../../../../components/ui/ToastNotification";
import { traerAsesorias } from "../../../../Services/asesoriasEstudianteService";
import { mensajesDeError } from "../../../../Services/errores";
import ListaAsesoriasEstudiante from "../components/asesorias/ListaAsesoriasEstudiante";

export default function AsesoriasEstudiante() {
    const [asesorias, setAsesorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // La API pagina de 10 en 10: "meta" trae la última página y el total
    const [pagina, setPagina] = useState(1);
    const [meta, setMeta] = useState(null);

    // Toast para errores de carga
    const [toast, setToast] = useState({ open: false, message: "", type: "info" });

    // Carga las asesorías en curso del estudiante
    // silencioso = recarga sin quitar la lista (refresco automático)
    const cargarAsesorias = useCallback(async ({ silencioso = false } = {}) => {
        try {
            if (!silencioso) setLoading(true);
            setError(false);
            const { asesorias: lista, meta: metaNueva } = await traerAsesorias({ estatus: "en_curso", page: pagina });
            setAsesorias(lista);
            setMeta(metaNueva);
        } catch (err) {
            console.error("Error al cargar asesorías", err);
            // Un refresco automático que falla no molesta: se intenta de nuevo en el siguiente
            if (!silencioso) {
                setError(true);
                setToast({ open: true, message: mensajesDeError(err)[0], type: "error" });
            }
        } finally {
            setLoading(false);
        }
    }, [pagina]);

    useEffect(() => {
        cargarAsesorias();
    }, [cargarAsesorias]);

    // Cada 20 s se refresca la lista sin quitarla (solo con la pestaña a la vista):
    // así el globito de mensajes sin leer se actualiza solo
    useEffect(() => {
        const intervalo = setInterval(() => {
            if (!document.hidden) cargarAsesorias({ silencioso: true });
        }, 20000);
        return () => clearInterval(intervalo);
    }, [cargarAsesorias]);

    // Al abrir o cerrar el chat, esa asesoría ya no tiene mensajes sin leer
    const handleChatLeido = (asesoriaId) =>
        setAsesorias((prev) => prev.map((a) => (a.id === asesoriaId ? { ...a, mensajes_sin_leer: 0 } : a)));

    const total = meta?.total ?? asesorias.length;

    return (
        <div className="min-h-[calc(100dvh-4.5rem)] w-full px-4 py-6 md:px-17 md:py-10 flex flex-col items-start justify-start gap-6 md:gap-11 bg-gray-100">
            <div>
                <p className="text-2xl font-bold">Asesorias En Curso</p>
                {!loading && !error && (
                    <p className="mt-1 text-sm text-gray-600">
                        <span className="font-bold">{total}</span>{" "}
                        {total === 1 ? "asesoría en curso" : "asesorías en curso"}
                    </p>
                )}
            </div>

            <div className="w-full pb-5">
                {loading ? (
                    <div className="w-full min-h-[40vh] flex flex-col items-center justify-center gap-3">
                        <CircularProgress />
                        <p className="text-gray-500 font-semibold">Cargando asesorías...</p>
                    </div>
                ) : error ? (
                    <div className="w-full py-10 text-center">
                        <p className="text-gray-500 mb-1">No se pudieron cargar las asesorías.</p>
                        <Button onClick={() => cargarAsesorias()} sx={{ textTransform: "none", fontWeight: 600 }}>
                            Reintentar
                        </Button>
                    </div>
                ) : (
                    <>
                        <ListaAsesoriasEstudiante asesorias={asesorias} onChatLeido={handleChatLeido} />

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
