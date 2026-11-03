// rolAdministrador/views/Reportes.jsx
// Una sola vista para todos los reportes: el parámetro `tipo` viene de la ruta (ver App.jsx).

const REPORTES = {
    materia: { titulo: 'Reporte por materia', descripcion: 'Asesorías y solicitudes agrupadas por materia.' },
    asesor: { titulo: 'Reporte por asesor', descripcion: 'Asesorías atendidas por cada asesor.' },
    estudiante: { titulo: 'Reporte por estudiante', descripcion: 'Asesorías recibidas por cada estudiante.' },
    grupo: { titulo: 'Reporte por grupo', descripcion: 'Asesorías solicitadas por grupo.' },
    licenciatura: { titulo: 'Reporte por licenciatura', descripcion: 'Asesorías agrupadas por licenciatura.' }
};

export default function Reportes({ tipo }) {
    const reporte = REPORTES[tipo] || { titulo: 'Reportes', descripcion: '' };

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-[#F4F7FC] px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold">{reporte.titulo}</p>
                {reporte.descripcion && <p className="text-sm text-gray-600">{reporte.descripcion}</p>}
            </div>

            {/* TODO: filtros (periodo, licenciatura), tabla del reporte y exportación cuando existan los endpoints */}
            <p className="text-gray-500">Sin datos todavía</p>
        </div>
    );
}