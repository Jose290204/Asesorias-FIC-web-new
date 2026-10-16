// TODO: reemplazar por los datos reales (AuthContext / API)
const PERFIL_PRUEBA = {
    nombre: 'Jose Angel Astorga Mejia',
    numeroCuenta: '19519958',
    correo: 'ja.astorga22@info.uas.edu.mx',
    carrera: 'Licenciatura en Informática',
    grupo: '5-1',
    estadisticas: {
        completadas: 8,
        enCurso: 2,
        enRevision: 1,
    },
};

function CampoPerfil({ label, value }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <input
                type="text"
                value={value ?? ''}
                readOnly
                tabIndex={-1}
                className="w-full bg-gray-100 border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
            />
        </div>
    );
}

function TarjetaEstadistica({ valor, etiqueta }) {
    return (
        <div className="flex flex-col items-center justify-center gap-1 rounded-[10px] border border-gray-200 bg-white px-3 py-4 shadow-sm">
            <span className="text-2xl font-bold text-[#244B91]">{valor}</span>
            <span className="text-center text-xs font-medium text-gray-600">{etiqueta}</span>
        </div>
    );
}

export default function PerfilEstudiante() {
    const perfil = PERFIL_PRUEBA;

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-gray-100 px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-8 md:gap-11">
            <p className="text-2xl font-bold">Perfil</p>

            <div className="w-full flex flex-col items-center gap-8">
                {/* Foto de perfil (icono predefinido) */}
                <div className="w-28 h-28 shrink-0 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-400 shadow-sm overflow-hidden">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>

                {/* Resumen de actividad */}
                <div className="w-full max-w-xl grid grid-cols-3 gap-3 md:gap-4">
                    <TarjetaEstadistica valor={perfil.estadisticas.completadas} etiqueta="Asesorías completadas" />
                    <TarjetaEstadistica valor={perfil.estadisticas.enCurso} etiqueta="En curso" />
                    <TarjetaEstadistica valor={perfil.estadisticas.enRevision} etiqueta="Solicitudes en revisión" />
                </div>

                {/* Datos del estudiante */}
                <div className="w-full max-w-xl bg-white border border-gray-200 rounded-[10px] shadow-sm p-5 md:p-8 flex flex-col gap-6">
                    <CampoPerfil label="Nombre Completo" value={perfil.nombre} />
                    <CampoPerfil label="Número de Cuenta" value={perfil.numeroCuenta} />
                    <CampoPerfil label="Correo Institucional" value={perfil.correo} />
                    <CampoPerfil label="Carrera" value={perfil.carrera} />
                    <CampoPerfil label="Grupo" value={perfil.grupo} />
                </div>
            </div>
        </div>
    );
}