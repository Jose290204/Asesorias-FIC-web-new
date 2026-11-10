

export default function TarjetaSeccion({ titulo, subtitulo, accion, children }) {
    return (
        <div className="w-full max-w-xl bg-white border border-gray-200 rounded-[10px] shadow-sm p-5 md:p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-base font-bold text-gray-900">{titulo}</p>
                    {subtitulo && <p className="mt-0.5 text-sm text-gray-600">{subtitulo}</p>}
                </div>
                {accion}
            </div>
            {children}
        </div>
    );
}
