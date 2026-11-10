// Un número con su etiqueta, para la fila de estadísticas
export default function Estadistica({ valor, etiqueta }) {
    return (
        <div className="flex flex-col items-center justify-center gap-0.5 px-2 py-4">
            <span className="text-2xl font-bold text-[#244B91]">{valor ?? 0}</span>
            <span className="text-center text-xs font-medium text-gray-600">{etiqueta}</span>
        </div>
    );
}
