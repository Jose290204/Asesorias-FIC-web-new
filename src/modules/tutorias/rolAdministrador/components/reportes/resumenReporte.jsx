

// Color de la franja lateral de las tarjetas (dorado, como el de los logotipos)
const COLOR_ACENTO = '#C49E0D';

// Tarjetas con los totales del reporte. items: [{ titulo, valor, detalle?, color? }]
export default function ResumenReporte({ items = [] }) {
    return (
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {items.map((item) => (
                <div
                    key={item.titulo}
                    className="bg-white rounded-xl border border-gray-200 border-l-4 shadow-sm px-4 py-3 min-w-0 flex flex-col gap-0.5"
                    style={{ borderLeftColor: item.color || COLOR_ACENTO }}
                >
                    <p className="text-[11px] font-semibold tracking-wide uppercase text-gray-500 truncate">{item.titulo}</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 leading-tight break-words">{item.valor}</p>
                    {item.detalle && <p className="text-xs text-gray-500 break-words">{item.detalle}</p>}
                </div>
            ))}
        </div>
    );
}