// Una fila de datos: ícono, etiqueta chica y valor
export default function FilaDato({ icono, label, value }) {
    return (
        <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8EEF9] text-[#244B91]">
                {icono}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className="break-words text-sm font-semibold text-gray-900">{value || '—'}</p>
            </div>
        </div>
    );
}
