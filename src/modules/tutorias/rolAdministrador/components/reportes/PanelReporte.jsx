

// Recuadro blanco con título (y subtítulo opcional) para agrupar una sección del reporte
export default function PanelReporte({ titulo, subtitulo, children }) {
    return (
        <section className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 flex flex-col gap-3 min-w-0">
            <div>
                <h2 className="text-base font-bold text-gray-900">{titulo}</h2>
                {subtitulo && <p className="text-xs text-gray-500">{subtitulo}</p>}
            </div>
            {children}
        </section>
    );
}