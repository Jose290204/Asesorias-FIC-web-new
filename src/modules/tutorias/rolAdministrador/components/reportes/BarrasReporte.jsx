

// Relleno de las barras: degradado dorado
const RELLENO_BARRA = 'linear-gradient(90deg, #E0BD4B, #C49E0D)';

/**
 * Lista de barras horizontales: cada renglón muestra el nombre, la cantidad y una barra
 * proporcional al valor más alto.
 *
 * Props:
 *  - items: [{ clave, etiqueta, valor }] (ya ordenados)
 *  - onItemClick: si se manda, cada renglón es un botón que recibe el item
 *  - textoVacio: mensaje cuando no hay datos
 */
export default function BarrasReporte({ items = [], onItemClick, textoVacio = 'Sin datos' }) {
    const maximo = items.reduce((max, item) => Math.max(max, item.valor), 0) || 1;

    if (items.length === 0) {
        return <p className="text-sm text-gray-500">{textoVacio}</p>;
    }

    return (
        <ul className="flex flex-col">
            {items.map((item) => {
                const contenido = (
                    <>
                        <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-gray-800 truncate">{item.etiqueta}</span>
                            <span className="font-semibold text-gray-900 shrink-0">{item.valor}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{ width: `${(item.valor / maximo) * 100}%`, background: RELLENO_BARRA }}
                            />
                        </div>
                    </>
                );

                return (
                    <li key={item.clave}>
                        {onItemClick ? (
                            <button
                                type="button"
                                title="Ver detalle"
                                onClick={() => onItemClick(item)}
                                className="w-full text-left flex flex-col gap-1.5 rounded-lg px-2 py-2.5 hover:bg-[#FBF5E1] transition-colors cursor-pointer"
                            >
                                {contenido}
                            </button>
                        ) : (
                            <div className="flex flex-col gap-1.5 px-2 py-2.5">{contenido}</div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}