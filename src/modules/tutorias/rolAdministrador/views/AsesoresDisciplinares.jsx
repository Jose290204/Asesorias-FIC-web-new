import { useState, useEffect } from "react";
import InputBuscar from "../../../../components/ui/InputBuscar";
import ModalCargaExcel from "../components/ModalCargaExel";
import TablaAsesoresDisciplinares from "../components/TablaAsesoresDisciplinares";
import { getAsesoresDisciplinares } from "../services/asesoresDisciplinaresService";

export default function AsesoresDisciplinares() {
    const [asesores, setAsesores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [modalExcelOpen, setModalExcelOpen] = useState(false);

    useEffect(() => {
        getAsesoresDisciplinares()
            .then((data) => {
                setAsesores(data);
            })
            .catch((error) => {
                console.error("Error al obtener los asesores disciplinares:", error);
            })
            .finally(() => {
                setCargando(false);
            });
    }, []);

    const handleExcelData = (data) => {
        console.log("Asesores disciplinares cargados desde Excel:", data);
        // Aquí puedes realizar la llamada al backend para registrar masivamente los asesores
    };

    const handleInfo = (row) => {
        console.log("Ver detalle del asesor:", row);
    };

    const handleEliminar = (row) => {
        console.log("Eliminar asesor:", row);
    };

    // Helper para desenfocar elementos activos antes de abrir el modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    const handleOpenModalExcel = (event) => {
        clearFocus(event);
        setModalExcelOpen(true);
    };

    // Filtro por búsqueda en tiempo real (Nombre, Correo o Número de Cuenta)
    const filasFiltradas = asesores.filter((row) => {
        const texto = busqueda.toLowerCase().trim();
        if (!texto) return true;

        const nombre = (row.nombre || "").toLowerCase();
        const correo = (row.correo || "").toLowerCase();
        const numCuenta = (row.numeroCuenta || "").toLowerCase();

        return (
            nombre.includes(texto) ||
            correo.includes(texto) ||
            numCuenta.includes(texto)
        );
    });

    return (
        <div className="mx-10 my-3 flex flex-col items-start justify-start gap-10">
            <div>
                <p className="text-2xl font-bold">Asesores Disciplinares</p>
            </div>

            <div className="flex gap-4 items-center w-full">
                <InputBuscar
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                
                <button 
                    onClick={handleOpenModalExcel}
                    className="bg-[#2e7d32] hover:bg-[#1b5e20] text-sm text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1.8 14.8l-1.4 1.4L12 15.8l-2.4 2.4-1.4-1.4 2.4-2.4-2.4-2.4 1.4-1.4 2.4 2.4 2.4-2.4 1.4 1.4-2.4 2.4 2.4 2.4zM13 9V3.5L18.5 9H13z"/>
                    </svg>
                    Cargar Asesores
                </button>
            </div>

            <ModalCargaExcel
                open={modalExcelOpen}
                onClose={() => setModalExcelOpen(false)}
                onDataLoaded={handleExcelData}
            />

            {cargando ? (
                <p className="text-gray-500 font-medium">Cargando asesores disciplinares...</p>
            ) : (
                <TablaAsesoresDisciplinares 
                    rows={filasFiltradas} 
                    onInfo={handleInfo}
                    onEliminar={handleEliminar}
                />
            )}
        </div>
    );
}