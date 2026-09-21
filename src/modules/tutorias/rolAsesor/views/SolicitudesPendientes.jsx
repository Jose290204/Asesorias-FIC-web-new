import TarjetaSolicitudesPendientes from "../components/TarjetaSolicitudesPendientes";

export default function SolicitudesPendientes() {
    return (
        <div className="h-[calc(100vh-1rem)] w-full rounded-2xl pl-17 py-10 pr-17 flex flex-col items-start justify-start gap-11 bg-gray-100 overflow-hidden">
            <div>
                <p className="text-2xl font-bold">Solicitudes Pendientes</p>
            </div>

            {/* Contenedor para las tarjetas o contenido de la pagina */}
            <div className="w-full overflow-y-auto max-h-[calc(100vh-180px)] pb-5">
                <TarjetaSolicitudesPendientes />
            </div>
        </div>
    );
}