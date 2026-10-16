import { CircularProgress, MenuItem, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ToastNotification from "../../../../components/ui/ToastNotification"; // Asegúrate de ajustar la ruta de importación si es necesario
import TarjetaSolicitudesEnRevision from "../components/TarjetaSolicitudesEnRevision";

// Datos de prueba. Cuando haya backend, esto viene del servicio.
// - fecha: formato YYYY-MM-DD
// - horariosAsesor: horarios que ese asesor tiene disponibles (se usan en "Modificar Solicitud")
// - notaEstudiante: nota que dejó el estudiante al solicitar (opcional)
// - nota: nota del asesor al rechazar
const SOLICITUDES_PRUEBA = [
    { id: 30, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Programacion", fecha: "2026-10-27", horario: "18:00 - 19:00", modalidad: "Presencial", estado: "EN REVISION", asesor: "Josue Manuel Medina Lopez", horariosAsesor: ["17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00"], notaEstudiante: "Necesito repasar arreglos y ciclos." },
    { id: 31, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Programacion", fecha: "2026-10-28", horario: "18:00 - 19:00", modalidad: "Presencial", estado: "EN REVISION", asesor: "Josue Manuel Medina Lopez", horariosAsesor: ["17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00"] },
    { id: 32, alumno: "Luis Fernando Velazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Programacion", fecha: "2026-10-29", horario: "18:00 - 19:00", modalidad: "Presencial", estado: "EN REVISION", asesor: "Josue Manuel Medina Lopez", horariosAsesor: ["17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00"] },
    { id: 33, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Programacion", fecha: "2026-10-20", horario: "18:00 - 19:00", modalidad: "Presencial", estado: "RECHAZADA", asesor: "Josue Manuel Medina Lopez", nota: "Esa fecha ya no esta disponible" },
    { id: 34, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Programacion", fecha: "2026-10-21", horario: "18:00 - 19:00", modalidad: "Presencial", estado: "RECHAZADA", asesor: "Josue Manuel Medina Lopez", nota: "Esa fecha ya no esta disponible" }
];

export default function SolicitudesEnRevision() {
    const [filtroEstado, setFiltroEstado] = useState("TODO");
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Estados para el Toast Global
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("info");

    const triggerToast = useCallback((message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setToastOpen(true);
    }, []);

    // Carga las solicitudes del estudiante
    const cargarSolicitudes = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            // TODO: reemplazar por la llamada real al servicio (ej. solicitudesService.obtenerMisSolicitudes())
            await new Promise((resolve) => setTimeout(resolve, 300));
            setSolicitudes(SOLICITUDES_PRUEBA);
        } catch (err) {
            console.error('Error al cargar solicitudes', err);
            setError(true);
            triggerToast('No se pudieron cargar las solicitudes', 'error');
        } finally {
            setLoading(false);
        }
    }, [triggerToast]);

    useEffect(() => {
        cargarSolicitudes();
    }, [cargarSolicitudes]);

    // Editar: la tarjeta avisa y aquí se actualiza la lista (aquí también va la llamada a la API)
    const handleActualizar = (solicitudActualizada) => {
        setSolicitudes((prev) =>
            prev.map((item) => (item.id === solicitudActualizada.id ? { ...item, ...solicitudActualizada } : item))
        );
    };

    // Eliminar (aquí también va la llamada a la API)
    const handleEliminar = (solicitud) => {
        setSolicitudes((prev) => prev.filter((item) => item.id !== solicitud?.id));
    };

    const solicitudesFiltradas = solicitudes.filter(
        (solicitud) => filtroEstado === "TODO" || solicitud.estado === filtroEstado
    );

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full px-4 md:px-17 py-6 md:py-10 flex flex-col items-start justify-start gap-6 md:gap-8 bg-gray-100">
            <p className="text-xl md:text-2xl font-bold">Solicitudes en revisión</p>

            {/* SECCIÓN DE FILTRO */}
            <TextField
                select
                label="Filtro por estados"
                size="small"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                sx={{ width: '100%', maxWidth: { sm: 320 }, backgroundColor: '#FFFFFF' }}
            >
                <MenuItem value="TODO">TODO</MenuItem>
                <MenuItem value="EN REVISION">EN REVISION</MenuItem>
                <MenuItem value="RECHAZADA">RECHAZADA</MenuItem>
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
                        <button onClick={cargarSolicitudes} className="text-blue-700 font-semibold underline cursor-pointer">
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <TarjetaSolicitudesEnRevision
                        solicitudes={solicitudesFiltradas}
                        onActualizar={handleActualizar}
                        onEliminar={handleEliminar}
                        showToast={triggerToast}
                    />
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