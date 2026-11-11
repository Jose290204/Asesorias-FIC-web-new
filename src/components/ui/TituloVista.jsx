// Título de una vista: acento dorado a la izquierda, título en azul y, debajo, un subtítulo opcional
// (por ejemplo, cuántos registros hay). Es el mismo encabezado en todas las vistas del admin.
export default function TituloVista({ titulo, subtitulo }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
                <span className="h-7 w-1.5 shrink-0 rounded-full bg-[#d4b03c]" aria-hidden="true" />
                <h1 className="text-2xl font-bold text-[#08338F]">{titulo}</h1>
            </div>
            {subtitulo && <p className="pl-[18px] text-sm text-gray-600">{subtitulo}</p>}
        </div>
    );
}
