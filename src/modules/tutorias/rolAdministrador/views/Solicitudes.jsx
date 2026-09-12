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
        <div className="mx-10 my-3 flex flex-col items-start justify-start gap-10">
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