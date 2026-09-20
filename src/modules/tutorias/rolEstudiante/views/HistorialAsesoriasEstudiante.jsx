import TarjetaHistorialAsesorias from "../components/TarjetaHistorialEstudiante";


export default function HistorialAsesoriasEstudiante() {
    return (
            <div className="h-[calc(100vh-1rem)] w-full rounded-2xl pl-17 py-10 pr-4 flex flex-col items-start justify-start gap-11 bg-gray-100 overflow-hidden">
                <div>
                    <p className="text-2xl font-bold">Historial de asesorias</p>
                </div>
    
                {/* Contenedor para las tarjetas o contenido de la pagina */}
                <div className="w-full overflow-y-auto pr-4 max-h-[calc(100vh-180px)]">
                    <TarjetaHistorialAsesorias/>
                </div>
            </div>
        );
}