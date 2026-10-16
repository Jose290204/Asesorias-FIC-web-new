import CircularProgress from "@mui/material/CircularProgress";
import { useCallback, useEffect, useState } from "react";
import ToastNotification from "../../../../components/ui/ToastNotification";
import TarjetaAsesoriasEstudiantes from "../components/TarjetaAsesoriasEstudiantes";

// Datos de prueba
const ASESORIAS_PRUEBA = [
    { id: 12, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Base de Datos", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM", material_adicional: [{ id_material: 1, nombre_archivo: "Guia_Base_de_Datos.pdf", mime_type: "application/pdf", url_archivo: "#" }, { id_material: 2, nombre_archivo: "Ejercicios.docx", mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", url_archivo: "#" }] },
    { id: 13, asesor: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 14, asesor: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 15, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 16, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 17, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 18, asesor: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 19, asesor: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 20, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 21, asesor: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" }
];

export default function AsesoriasEstudiante() {
    const [asesorias, setAsesorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Toast para errores de carga
    const [toast, setToast] = useState({ open: false, message: "", type: "info" });

    // Carga las asesorías en curso del estudiante
    const cargarAsesorias = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            // TODO: reemplazar por la llamada real al servicio (ej. asesoriasService.obtenerAsesoriasEstudiante())
            await new Promise((resolve) => setTimeout(resolve, 300));
            setAsesorias(ASESORIAS_PRUEBA);
        } catch (err) {
            console.error("Error al cargar asesorías", err);
            setError(true);
            setToast({ open: true, message: "No se pudieron cargar las asesorías", type: "error" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarAsesorias();
    }, [cargarAsesorias]);

    return (
        <div className="min-h-[calc(100dvh-4.5rem)] w-full px-4 py-6 md:px-17 md:py-10 flex flex-col items-start justify-start gap-6 md:gap-11 bg-gray-100">
            <p className="text-2xl font-bold">Asesorias En Curso</p>

            <div className="w-full pb-5">
                {loading ? (
                    <div className="w-full min-h-[40vh] flex flex-col items-center justify-center gap-3">
                        <CircularProgress />
                        <p className="text-gray-500 font-semibold">Cargando asesorías...</p>
                    </div>
                ) : error ? (
                    <div className="w-full py-10 text-center">
                        <p className="text-gray-500 mb-1">No se pudieron cargar las asesorías.</p>
                        <button onClick={cargarAsesorias} className="text-blue-700 font-semibold underline cursor-pointer">
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <TarjetaAsesoriasEstudiantes asesorias={asesorias} />
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