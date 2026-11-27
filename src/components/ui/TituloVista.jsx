import { useState } from 'react';

// Título de una vista: acento dorado a la izquierda, título en azul y, debajo, un subtítulo
// (por ejemplo, cuántos registros hay). Es el mismo encabezado en todas las vistas.
//
// El renglón del subtítulo SIEMPRE ocupa su lugar, haya o no texto, para que el contenido de abajo
// no se mueva al buscar, filtrar o cargar.
//
// Convención de los contadores de las listas: "{N} {sustantivo} {estado}", por ejemplo
// "4 asesores encontrados", "3 asesorías en curso", "2 solicitudes pendientes".
//
// Mientras la vista carga manda subtitulo={null}: aquí se sigue mostrando el último texto que hubo,
// así el contador no parpadea ni desaparece. Con undefined o '' el renglón se vacía.
export default function TituloVista({ titulo, subtitulo }) {
    const [recordado, setRecordado] = useState(subtitulo || null);

    // Ajuste de estado durante el render (patrón de React): guarda el último subtítulo con texto
    if (subtitulo && subtitulo !== recordado) setRecordado(subtitulo);
    if (!subtitulo && subtitulo !== null && recordado !== null) setRecordado(null);

    const visible = subtitulo || (subtitulo === null ? recordado : null);

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
                <span className="h-7 w-1.5 shrink-0 rounded-full bg-[#d4b03c]" aria-hidden="true" />
                <h1 className="text-2xl font-bold text-[#08338F]">{titulo}</h1>
            </div>
            <p className="min-h-5 pl-[18px] text-sm text-gray-600">{visible || ' '}</p>
        </div>
    );
}
