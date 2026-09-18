import { useNavigate } from 'react-router-dom';

export default function SeleccionModulo({ userRole }) {
    const navigate = useNavigate();
    
    // El permiso es verdadero solo si el rol es exactamente 'asesor'
    const permisoModuloAsistencia = userRole === 'asesor';

    // Manejador para el Módulo de Tutorías
    const handleTutoriasClick = () => {
        if (userRole === 'admin') {
            navigate('/tutorias/admin');
        } else if (userRole === 'asesor') {
            navigate('/tutorias/asesor');
        } else if (userRole === 'estudiante') {
            navigate('/tutorias/estudiante');
        } else {
            alert('Rol no reconocido para el módulo de tutorías');
        }
    };

    // Manejador para el Módulo de Asistencias
    const handleAsistenciasClick = () => {
        if (!permisoModuloAsistencia) return;

        if (userRole === 'asesor') {
            navigate('/asistencias/maestro'); 
        } else {
            alert('Acceso restringido solo para asesores');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-[15px] shadow-[0_0_10px_rgba(0,0,0,0.1)] p-8 max-w-md w-full text-center">
                
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Selección de Módulo</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Bienvenido. Rol actual: <span className="font-semibold text-[#D4A017] uppercase">{userRole}</span>
                </p>

                <div className="flex flex-col gap-4">
                    {/* Botón Módulo de Tutorías */}
                    <button
                        onClick={handleTutoriasClick}
                        className="w-full h-12.5 bg-[#244B91] hover:bg-[#1d3d77] text-white font-bold rounded-lg transition-colors shadow-md"
                    >
                        Módulo de Tutorías
                    </button>

                    {/* Botón Módulo de Asistencias (Solo activo para 'asesor') */}
                    <button
                        onClick={handleAsistenciasClick}
                        disabled={!permisoModuloAsistencia}
                        className={`w-full h-12.5 text-white font-bold rounded-lg shadow-md transition-all ${
                            permisoModuloAsistencia 
                                ? 'bg-[#D4A017] hover:bg-[#c29115] cursor-pointer' 
                                : 'bg-gray-300 cursor-not-allowed opacity-60'
                        }`}
                    >
                        Módulo de Asistencias {!permisoModuloAsistencia && '(Solo Asesores)'}
                    </button>
                </div>

            </div>
        </div>
    );
}