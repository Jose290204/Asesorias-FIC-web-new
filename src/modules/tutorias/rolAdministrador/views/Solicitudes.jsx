import { useEffect, useState } from "react";
import TablaSolicitudes from "../components/TablaSolicitudes";
import { getSolicitudes } from "../services/solicitudesService"; // Ajusta la ruta a tu servicio

export default function Solicitudes() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const data = await getSolicitudes();
                setRows(data);
            } catch (error) {
                console.error("Error al cargar las solicitudes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitudes();
    }, []);

    return (
        <div className="h-[calc(100vh-1rem)] w-full rounded-2xl pl-17 py-10 pr-17 flex flex-col items-start justify-start gap-11 bg-gray-100 overflow-hidden">
            <div>
                <p className="text-2xl font-bold">Solicitudes</p>
            </div>

            {loading ? (
                <p className="text-gray-500">Cargando solicitudes...</p>
            ) : (
                <TablaSolicitudes rows={rows} />
            )}
        </div>
    );
}