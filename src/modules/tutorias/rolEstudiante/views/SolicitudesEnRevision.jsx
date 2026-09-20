
import TarjetaSolicitudesEnRevision from "../components/TarjetaSolicitudesEnRevision";

export default function SolicitudesEnRevision() {
    return (

        <div className="mx-10 my-3 flex flex-col items-start justify-start gap-10">
            <div>
                <p className="text-2xl font-bold">Solicitudes en revisión</p>
            </div>

            <p className="text-gray-500">Sin reportes</p>

            {/* Solicitudes en revision */}
             <TarjetaSolicitudesEnRevision />
        </div>

        
    )
}