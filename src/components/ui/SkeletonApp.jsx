// src/components/ui/SkeletonApp.jsx
import { Box, Skeleton } from '@mui/material';

// Mismo esqueleto que el layout actual: header azul arriba + contenido de la página.
// Mantén aquí las mismas clases del layout (min-h-dvh, px-4 md:px-17, grid de tarjetas)
// para que al terminar de cargar no haya saltos.
const COLOR_HEADER = 'rgba(255,255,255,0.15)';

function TarjetaSkeleton() {
    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: '#FFFFFF',
                borderLeft: '20px solid rgba(8,51,143,0.25)',
                borderRadius: '5px',
                boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.12)',
                p: 3
            }}
        >
            {/* Avatar + nombre */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Skeleton variant="circular" width={50} height={50} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="35%" height={14} />
                    <Skeleton variant="text" width="80%" height={22} />
                    <Skeleton variant="text" width="60%" height={16} />
                </Box>
            </Box>

            {/* Datos */}
            <Skeleton variant="text" width="90%" height={22} />
            <Skeleton variant="text" width="70%" height={22} />
            <Skeleton variant="text" width="50%" height={22} />

            {/* Botones */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25, mt: 3 }}>
                <Skeleton variant="rounded" width={110} height={30} />
                <Skeleton variant="rounded" width={80} height={30} />
            </Box>
        </Box>
    );
}

export default function SkeletonApp() {
    return (
        <Box className="flex min-h-dvh flex-col bg-[#244B91]">
            {/* --- Silueta del header --- */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 1
                }}
            >
                {/* Botón de menú (hamburguesa) */}
                <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: COLOR_HEADER }} />
                {/* Título de la app */}
                <Skeleton variant="rounded" width={120} height={20} sx={{ bgcolor: COLOR_HEADER, borderRadius: '6px' }} />
            </Box>

            {/* --- Silueta del contenido de la página --- */}
            <Box component="main" className="min-w-0 flex-1">
                <div className="min-h-[calc(100dvh-4.5rem)] w-full px-4 md:px-17 py-6 md:py-10 flex flex-col items-start gap-6 md:gap-11 bg-gray-100">
                    {/* Título */}
                    <Skeleton variant="text" width={220} height={40} />

                    {/* Barra de filtros / buscador */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, sm: 3 } }}>
                        <Skeleton variant="rounded" width={110} height={40} />
                        <Skeleton variant="rounded" height={40} sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }} />
                    </Box>

                    {/* Tarjetas */}
                    <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4 md:gap-5">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <TarjetaSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </Box>
        </Box>
    );
}