import CircularProgress from "@mui/material/CircularProgress";
import { useCallback, useEffect, useState } from "react";
import ToastNotification from "../../../../components/ui/ToastNotification";
import TarjetaHistorialAsesorias from "../components/TarjetaHistorialEstudiante";

// Datos de prueba. Cuando haya backend, esto viene del servicio.
const HISTORIAL_PRUEBA = [
    {
        id: 1,
        asesor: "Juan Pérez",
        materia: "Programación",
        modalidad: "Presencial",
        fecha: "15/09/2026",
        fechaInicio: "15/09/2026",
        fechaFin: "19/09/2026",
        horario: "10:00 AM - 11:00 AM",
        estado: "Finalizada",
        descripcion:
            "Asesoría sobre estructuras de datos y algoritmos.",
        material_adicional: [
            { id_material: 1, nombre_archivo: "Material de estructuras de datos", mime_type: "application/pdf", url_archivo: "#" },
        ],
    },
    {
        id: 2,
        asesor: "María López",
        materia: "Bases de Datos",
        modalidad: "Virtual",
        fecha: "12/09/2026",
        fechaInicio: "12/09/2026",
        fechaFin: "16/09/2026",
        horario: "12:00 PM - 1:00 PM",
        estado: "Finalizada",
        descripcion:
            "Repaso de consultas SQL y relaciones entre tablas.",
        material_adicional: [
            { id_material: 1, nombre_archivo: "Ejercicios SQL", mime_type: "application/pdf", url_archivo: "#" },
        ],
    },
    {
        id: 3,
        asesor: "Carlos Ramírez",
        materia: "Matemáticas",
        modalidad: "Presencial",
        fecha: "10/09/2026",
        fechaInicio: "10/09/2026",
        fechaFin: "14/09/2026",
        horario: "09:00 AM - 10:00 AM",
        estado: "Finalizada",
        descripcion:
            "Asesoría de álgebra y resolución de ejercicios.",
        material_adicional: [],
    },
    {
        id: 4,
        asesor: "Leslie Mayram",
        materia: "Programacion Avanzada",
        modalidad: "Presencial",
        fecha: "10/09/2026",
        fechaInicio: "10/09/2026",
        fechaFin: "14/09/2026",
        horario: "10:00 AM - 1:00 PM",
        estado: "Finalizada",
        descripcion:
            "Asesoría de Programacion y resolución de ejercicios.",
        material_adicional: [],
    },
    {
        id: 5,
        asesor: "Juan Pérez",
        materia: "Programación",
        modalidad: "Presencial",
        fecha: "15/09/2026",
        fechaInicio: "15/09/2026",
        fechaFin: "19/09/2026",
        horario: "10:00 AM - 11:00 AM",
        estado: "Finalizada",
        descripcion:
            "Asesoría sobre estructuras de datos y algoritmos.",
        material_adicional: [
            { id_material: 1, nombre_archivo: "Material de estructuras de datos", mime_type: "application/pdf", url_archivo: "#" },
        ],
    },
    {
        id: 6,
        asesor: "María López",
        materia: "Bases de Datos",
        modalidad: "Virtual",
        fecha: "12/09/2026",
        fechaInicio: "12/09/2026",
        fechaFin: "16/09/2026",
        horario: "12:00 PM - 1:00 PM",
        estado: "Finalizada",
        descripcion:
            "Repaso de consultas SQL y relaciones entre tablas.",
        material_adicional: [
            { id_material: 1, nombre_archivo: "Ejercicios SQL", mime_type: "application/pdf", url_archivo: "#" },
        ],
    },
];

export default function HistorialAsesoriasEstudiante() {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Toast para errores de carga
    const [toast, setToast] = useState({ open: false, message: "", type: "info" });

    // Carga el historial de asesorías del estudiante
    const cargarHistorial = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            // TODO: reemplazar por la llamada real al servicio (ej. asesoriasService.obtenerHistorialEstudiante())
            await new Promise((resolve) => setTimeout(resolve, 300));
            setHistorial(HISTORIAL_PRUEBA);
        } catch (err) {
            console.error("Error al cargar el historial", err);
            setError(true);
            setToast({ open: true, message: "No se pudo cargar el historial", type: "error" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarHistorial();
    }, [cargarHistorial]);

    return (
        <div className="min-h-[calc(100dvh-4.5rem)] w-full px-4 py-6 md:px-17 md:py-10 flex flex-col items-start justify-start gap-6 md:gap-11 bg-gray-100">
            <div>
                <p className="text-2xl font-bold">Historial de asesorias</p>
                {!loading && !error && (
                    <p className="mt-1 text-sm text-gray-600">
                        <span className="font-bold">{historial.length}</span>{" "}
                        {historial.length === 1 ? "resultado" : "resultados"}
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
                        <button onClick={cargarHistorial} className="text-blue-700 font-semibold underline cursor-pointer">
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <TarjetaHistorialAsesorias historial={historial} />
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