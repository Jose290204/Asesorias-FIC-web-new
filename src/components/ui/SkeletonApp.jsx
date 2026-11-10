// src/components/ui/SkeletonApp.jsx
import { Box, Skeleton } from '@mui/material';

// Esqueleto que se ve mientras se recupera la sesión. Copia la estructura actual de los layouts:
//  - Escritorio (lg en adelante): menú azul a la izquierda (288 px) + franja amarilla con la facultad y el ciclo
//    + contenido con título, barra de herramientas y una tabla.
//  - Celular y tablet: cabecera azul (menú, logo y usuario) + contenido con tarjetas en lugar de tabla.
// Mantén aquí las mismas medidas y clases de los layouts (w-72, px-4 md:px-17, py-8 md:py-10) para que
// al terminar de cargar no haya saltos. Todavía no se sabe el rol, por eso es una estructura general.
const SOBRE_AZUL = 'rgba(255,255,255,0.15)';
const SOBRE_AMARILLO = 'rgba(27,58,115,0.18)';

// Menú lateral (solo escritorio)
function MenuLateralSkeleton() {
    return (
        <aside className="hidden w-72 shrink-0 flex-col lg:flex">
            {/* Logo */}
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4.5, pb: 4 }}>
                <Skeleton variant="circular" width={136} height={136} sx={{ bgcolor: SOBRE_AZUL }} />
            </Box>

            {/* Opciones del menú */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, px: 1.75 }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, height: 36 }}>
                        <Skeleton variant="rounded" width={22} height={22} sx={{ bgcolor: SOBRE_AZUL }} />
                        <Skeleton variant="rounded" height={16} sx={{ bgcolor: SOBRE_AZUL, width: `${[48, 40, 38, 62, 48, 52][i - 1]}%` }} />
                    </Box>
                ))}
            </Box>

            {/* Usuario y cerrar sesión, al fondo */}
            <Box sx={{ mt: 'auto', borderTop: `1px solid ${SOBRE_AZUL}`, display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Skeleton variant="circular" width={36} height={36} sx={{ bgcolor: SOBRE_AZUL }} />
                    <Skeleton variant="rounded" width={64} height={16} sx={{ bgcolor: SOBRE_AZUL }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Skeleton variant="rounded" width={22} height={22} sx={{ bgcolor: SOBRE_AZUL }} />
                    <Skeleton variant="rounded" width={96} height={16} sx={{ bgcolor: SOBRE_AZUL }} />
                </Box>
            </Box>
        </aside>
    );
}

// Franja amarilla con logo de la facultad, su nombre y el ciclo (solo escritorio)
function BarraContextoSkeleton() {
    return (
        <div className="hidden items-center gap-3 bg-[#D2B23D] px-6 py-2 shadow-xl lg:flex">
            <Skeleton variant="rounded" width={40} height={40} sx={{ bgcolor: SOBRE_AMARILLO }} />
            <Skeleton variant="rounded" width={230} height={18} sx={{ bgcolor: SOBRE_AMARILLO }} />
            <div className="flex-1" />
            <Skeleton variant="rounded" width={170} height={18} sx={{ bgcolor: SOBRE_AMARILLO }} />
        </div>
    );
}

// Cabecera azul con menú, logo y usuario (celular y tablet)
function CabeceraMovilSkeleton() {
    return (
        <header className="flex items-center gap-2 bg-[#244B91] px-3 py-2 lg:hidden">
            <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: SOBRE_AZUL }} />
            <Skeleton variant="rounded" width={32} height={32} sx={{ bgcolor: SOBRE_AZUL }} />
            <Skeleton variant="rounded" width={110} height={18} sx={{ bgcolor: SOBRE_AZUL }} />
            <div className="flex-1" />
            <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: SOBRE_AZUL }} />
        </header>
    );
}

// Tarjeta de una fila (solo celular, donde la tabla se ve como tarjetas)
function TarjetaSkeleton() {
    return (
        <Box
            sx={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                borderLeft: '8px solid rgba(8,51,143,0.25)',
                borderRadius: '5px',
                boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.12)',
                p: 2
            }}
        >
            <Skeleton variant="text" width="75%" height={24} />
            <Skeleton variant="text" width="55%" height={18} />
            <Skeleton variant="text" width="45%" height={18} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25, mt: 1.5 }}>
                <Skeleton variant="circular" width={26} height={26} />
                <Skeleton variant="circular" width={26} height={26} />
                <Skeleton variant="circular" width={26} height={26} />
            </Box>
        </Box>
    );
}

// Tabla (tablet y escritorio): encabezado azul y filas
function TablaSkeleton() {
    const columnas = ['6%', '28%', '20%', '18%', '10%', '12%'];

    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'block' },
                width: '100%',
                overflow: 'hidden',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.08)'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 58, px: 4, bgcolor: '#244B91' }}>
                {columnas.map((ancho, i) => (
                    <Skeleton key={i} variant="rounded" height={14} sx={{ bgcolor: SOBRE_AZUL, width: ancho }} />
                ))}
            </Box>

            {[1, 2, 3, 4, 5].map((fila) => (
                <Box
                    key={fila}
                    sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 79, px: 4, borderTop: '1px solid #EEF1F6' }}
                >
                    {columnas.map((ancho, i) => (
                        <Box key={i} sx={{ width: ancho }}>
                            <Skeleton variant="text" width="85%" height={20} />
                            {i === 1 && <Skeleton variant="text" width="55%" height={20} />}
                        </Box>
                    ))}
                </Box>
            ))}
        </Box>
    );
}

export default function SkeletonApp() {
    return (
        <div className="flex min-h-dvh bg-[#244B91]">
            <MenuLateralSkeleton />

            {/* Columna derecha: cabecera + contenido */}
            <div className="flex min-w-0 flex-1 flex-col">
                <BarraContextoSkeleton />
                <CabeceraMovilSkeleton />

                <main className="min-w-0 flex-1 bg-[#F4F7FC]">
                    <div className="flex min-h-full w-full flex-col items-start gap-6 px-4 py-8 md:gap-8 md:px-17 md:py-10">
                        {/* Título */}
                        <Skeleton variant="text" width={180} height={38} />

                        {/* Barra de herramientas: filtros + buscador + botón de crear */}
                        <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
                            <Skeleton variant="rounded" width={110} height={40} />
                            <Skeleton variant="rounded" height={46} sx={{ width: { xs: '100%', sm: 'auto' }, flex: { sm: 1 }, maxWidth: { sm: 500 } }} />
                            <div className="hidden flex-1 sm:block" />
                            <Skeleton variant="rounded" width={150} height={40} sx={{ display: { xs: 'none', sm: 'block' } }} />
                        </div>

                        {/* Leyenda de resultados */}
                        <Skeleton variant="text" width={140} height={20} sx={{ mt: { xs: -1.5, md: -2 } }} />

                        {/* Tabla (md en adelante) o tarjetas (celular) */}
                        <TablaSkeleton />
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, width: '100%' }}>
                            {[1, 2, 3, 4].map((i) => (
                                <TarjetaSkeleton key={i} />
                            ))}
                        </Box>
                    </div>
                </main>
            </div>
        </div>
    );
}
