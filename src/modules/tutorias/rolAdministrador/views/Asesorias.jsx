import BotonFiltro from "../../../../components/ui/BotonFlitro"
import TablaAsesorias from "../components/TablaAsesorias"
import InputBuscar from "../../../../components/ui/InputBuscar"
import BotonAccion from "../../../../components/ui/BotonAccion"


export default function Asesorias() {
    return (

        <div className="mx-10 my-3 flex flex-col items-start justify-start gap-10">
            <div>
                <p className="text-2xl font-bold">Asesorias</p>
            </div>
            <div className="flex gap-8">
                <BotonFiltro></BotonFiltro>
                <InputBuscar></InputBuscar>
                <BotonAccion label="Cargar Asesoria"></BotonAccion>
            </div>
            <TablaAsesorias/>
        </div>

        
    )
}