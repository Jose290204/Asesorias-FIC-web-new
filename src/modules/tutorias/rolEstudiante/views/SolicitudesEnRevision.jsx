import { useState } from "react";
import TarjetaSolicitudesEnRevision from "../components/TarjetaSolicitudesEnRevision";
import ToastNotification from "../../../../components/ui/ToastNotification"; // Asegúrate de ajustar la ruta de importación si es necesario

export default function SolicitudesEnRevision() {
    const [filtroEstado, setFiltroEstado] = useState("TODO");
    
    // Estados para el Toast Global
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("info");

    const triggerToast = (message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setToastOpen(true);
    };

    return (
        <div className="h-[calc(100vh-1rem)] w-full rounded-2xl pl-17 py-10 pr-17 flex flex-col items-start justify-start gap-8 bg-gray-100 overflow-hidden relative">
            <div>
                <p className="text-2xl font-bold">Solicitudes en revisión</p>
            </div>

            {/* SECCIÓN DE FILTRO */}
            <div className="w-full max-w-xs flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Filtro por estados</label>
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none bg-white cursor-pointer text-sm shadow-sm font-medium text-gray-800"
                >
                    <option value="TODO">TODO</option>
                    <option value="EN REVISION">EN REVISION</option>
                    <option value="RECHAZADA">RECHAZADA</option>
                </select>
            </div>

            {/* CONTENEDOR DE TARJETAS */}
            <div className="w-full overflow-y-auto max-h-[calc(100vh-260px)] pb-5">
                <TarjetaSolicitudesEnRevision 
                    filtroEstado={filtroEstado} 
                    showToast={triggerToast} 
                />
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