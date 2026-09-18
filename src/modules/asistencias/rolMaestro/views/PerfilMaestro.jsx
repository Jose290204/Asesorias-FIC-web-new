export default function PerfilMaestro() {
    return (
        <div className="mx-10 my-3 flex flex-col items-start justify-start gap-10">
            <div>
                <p className="text-2xl font-bold">Perfil</p>
            </div>

            
            <div className="w-full flex flex-col items-center gap-8">
                
                <div className="w-28 h-28 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-400 shadow-sm overflow-hidden">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>

                
                <div className="w-full max-w-xl bg-white border border-gray-200 rounded-[10px] shadow-sm p-8 flex flex-col gap-6">
                    {/* Campo Nombre Completo */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Nombre Completo
                        </label>
                        <input 
                            type="text" 
                            value="Leslie Mayram Barrera Rodriguez"
                            readOnly
                            className="w-full bg-gray-100 border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                        />
                    </div>

                    {/* Campo Número de Cuenta */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Número de Cuenta
                        </label>
                        <input 
                            type="text" 
                            value="19519958"
                            readOnly
                            className="w-full bg-gray-100 border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}