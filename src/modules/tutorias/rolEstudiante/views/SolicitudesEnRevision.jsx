import { CircularProgress, MenuItem, Pagination, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ToastNotification from "../../../../components/ui/ToastNotification";
import { mensajesDeError } from "../../../../Services/errores";
import { cancelarSolicitud, editarSolicitud, traerSolicitudes } from "../../../../Services/solicitudesEstudianteService";
import ListaSolicitudesEnRevision from "../components/solicitudes/ListaSolicitudesEnRevision";

// Opciones del filtro: el valor es el estatus que entiende la API ("" = todas)
const FILTROS = [
    { valor: "", etiqueta: "Todas" },
    { valor: "pendiente", etiqueta: "En revisión" },
    { valor: "aceptada", etiqueta: "Aceptadas" },
    { valor: "rechazada", etiqueta: "Rechazadas" },
    { valor: "cancelada", etiqueta: "Canceladas" },
];

export default function SolicitudesEnRevision() {
    // Al entrar se muestran solo las solicitudes en revisión (pendientes)
    const [filtroEstatus, setFiltroEstatus] = useState("pendiente");
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // La API pagina de 10 en 10: "meta" trae la última página y el total
    const [pagina, setPagina] = useState(1);
    const [meta, setMeta] = useState(null);

    // Estados para el Toast Global
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("info");

    const triggerToast = useCallback((message, type = "info") => {
        setToastMessage(message);
        setToastType(type);
        setToastOpen(true);
    }, []);

    // Carga las solicitudes del estudiante
    // silencioso = recarga sin quitar la lista (se usa después de editar o cancelar)
    const cargarSolicitudes = useCallback(async ({ silencioso = false } = {}) => {
        try {
            if (!silencioso) setLoading(true);
            setError(false);

            const { solicitudes: lista, meta: metaNueva } = await traerSolicitudes({ estatus: filtroEstatus, page: pagina });

            // Si cambió la lista y esta página quedó vacía, se regresa a la anterior
            // (el efecto de abajo vuelve a cargar solo)
            if (lista.length === 0 && pagina > 1) {
                setPagina(pagina - 1);
                return;
            }

            setSolicitudes(lista);
            setMeta(metaNueva);
        } catch (err) {
            console.error("Error al cargar solicitudes", err);
            if (!silencioso) setError(true);
            triggerToast(mensajesDeError(err)[0], "error");
        } finally {
            setLoading(false);
        }
    }, [filtroEstatus, pagina, triggerToast]);

    useEffect(() => {
        cargarSolicitudes();
    }, [cargarSolicitudes]);

    // Al cambiar de filtro se vuelve a la primera página
    const handleCambiarFiltro = (e) => {
        setFiltroEstatus(e.target.value);
        setPagina(1);
    };

    // Regresan true si salió bien (el modal se cierra) y false si falló (el modal sigue abierto).
    // Aquí caen, por ejemplo, 409 solicitud_no_pendiente, 422 fuera_de_ciclo y 409 solicitud_duplicada.
    const handleEditar = async (id, cambios) => {
        try {
            await editarSolicitud(id, cambios);
            triggerToast("Solicitud actualizada correctamente", "success");
            cargarSolicitudes({ silencioso: true });
            return true;
        } catch (err) {
            triggerToast(mensajesDeError(err)[0], "error");
            return false;
        }
    };

    // Cancelar reemplaza al antiguo "eliminar": la solicitud no se borra, queda como "cancelada"
    const handleCancelar = async (solicitud) => {
        try {
            await cancelarSolicitud(solicitud.id);
            triggerToast("Solicitud cancelada correctamente", "success");
            cargarSolicitudes({ silencioso: true });
            return true;
        } catch (err) {
            triggerToast(mensajesDeError(err)[0], "error");
            return false;
        }
    };

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full px-4 md:px-17 py-6 md:py-10 flex flex-col items-start justify-start gap-6 md:gap-8 bg-gray-100">
            <p className="text-xl md:text-2xl font-bold">Solicitudes en revisión</p>

            {/* SECCIÓN DE FILTRO */}
            <TextField
                select
                label="Filtro por estados"
                size="small"
                value={filtroEstatus}
                onChange={handleCambiarFiltro}
                sx={{ width: '100%', maxWidth: { sm: 320 }, backgroundColor: '#FFFFFF' }}
            >
                {FILTROS.map((f) => (
                    <MenuItem key={f.valor} value={f.valor}>{f.etiqueta}</MenuItem>
                ))}
            </TextField>

            {/* TARJETAS (el scroll lo hace la página, no este contenedor) */}
            <div className="w-full pb-6">
                {loading ? (
                    <div className="w-full min-h-[40vh] flex flex-col items-center justify-center gap-3">
                        <CircularProgress />
                        <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Cargando solicitudes...
                        </Typography>
                    </div>
                ) : error ? (
                    <div className="w-full text-center py-10">
                        <Typography sx={{ color: 'text.secondary', mb: 1 }}>
                            No se pudieron cargar las solicitudes.
                        </Typography>
                        <button onClick={() => cargarSolicitudes()} className="text-blue-700 font-semibold underline cursor-pointer">
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <>
                        <ListaSolicitudesEnRevision
                            solicitudes={solicitudes}
                            onEditar={handleEditar}
                            onCancelar={handleCancelar}
                            showToast={triggerToast}
                        />

                        {/* Paginación: solo aparece si hay más de una página */}
                        {meta && meta.last_page > 1 && (
                            <div className="mt-6 flex w-full justify-center">
                                <Pagination count={meta.last_page} page={pagina} onChange={(_, nueva) => setPagina(nueva)} />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* TOAST NOTIFICATION GLOBAL */}
            <ToastNotification
                open={toastOpen}
                onClose={() => setToastOpen(false)}
                message={toastMessage}
                type={toastType}
            />
        </div>
    );
}
