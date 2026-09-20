import { useEffect, useState } from "react";

import TarjetaAsesor from "../components/TarjetaSolicitarAsesoria";
import { getAsesores } from "../services/estudianteService";

export default function SolicitarAsesoria() {

     const [asesores, setAsesores] = useState([]);
        const [loading, setLoading] = useState(true);
        const[query, setQuery] = useState("");

       useEffect(() => {
        const fetchAsesores = async () => {
            try {
                const data = await getAsesores();
                setAsesores(data);
            } catch (error) {
                console.error("Error al cargar las solicitudes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAsesores();
    }, []);


// Filtrar asesores
    const asesoresFiltrados = asesores.filter((asesor) => {

        const texto = `
            ${asesor.nombre}
            ${asesor.materias.join(" ")}
            ${asesor.modalidad}
        `.toLowerCase();

        return texto.includes(query.toLowerCase());

    });

    if (loading) {

        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-gray-500">
                    Cargando asesores...
                </p>
            </div>
        );

    }


   /*  //filtrar solicitudes por busqueda
    const asesoresFiltradas = asesores.filter((asesor) =>
        Object.values(solicitud).some((valor) =>
            String(valor)
    .toLowerCase()
    .includes(query.toLocaleLowerCase())
        )
    ); */

    return (

       

        <div className="mx-10 my-3 flex flex-col items-start justify-start gap-10">
            <div>
                <p className="text-2xl font-bold">Solicitar Asesoria</p>
            </div>

            <p className="text-gray-500">Sin reportes</p>

{/* {======================================00000} */}

       <div className="mt-7 flex items-center gap-5">

                    {/* FILTRO */}
                    <button 
                    onClick={""}
                        type="button"
                        className="flex items-center gap-2 font-semibold text-gray-900"
                    >
                        <span>
                            Filtro
                        </span>

                        <span className="text-xl">
                            
                        </span>
                    </button>


                    {/* BUSCADOR */}
                    <div className="relative w-[265px]">

                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            
                        </span>

                        <input
                            type="text"
                            value={query}
                            onChange={(e) =>
                                setQuery(e.target.value)
                            }
                            placeholder="Buscar Asesoría"
                            className="w-full rounded-xl bg-[#F2F3F5] py-4 pl-11 pr-4 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#2B5599]"
                        />

                    </div>


                    {/* CREAR SOLICITUD */}
                    <button
                        type="button"
                        className="bg-[#2e7d32] hover:bg-[#1b5e20] text-sm text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                        Crear Solicitud
                    </button>

                </div>


                {/* TARJETAS */}
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                    {asesoresFiltrados.length === 0 ? (

                        <p className="col-span-full py-10 text-center text-gray-500">
                            No se encontraron asesores.
                        </p>

                    ) : (

                        asesoresFiltrados.map((asesor) => (

                            <TarjetaAsesor
                                key={asesor.id}
                                asesor={asesor}
                            />

                        ))

                    )}

                </div>

            </div>

        

    );
}