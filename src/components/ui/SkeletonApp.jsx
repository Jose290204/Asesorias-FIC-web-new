// src/components/ui/SkeletonApp.jsx
import { Box, Skeleton } from '@mui/material';

export default function SkeletonApp() {
    return (
        <Box className="flex min-h-screen bg-[#244B91] pr-2">
            {/* --- Silueta del Sidebar --- */}
            <Box
                sx={{
                    width: 280,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    pt: 5,
                    px: 3
                }}
            >
                {/* Logo circular */}
                <Skeleton
                    variant="circular"
                    width={110}
                    height={110}
                    sx={{ bgcolor: 'rgba(255,255,255,0.15)' }}
                />

                {/* Items del menú */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', mt: 2 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton
                            key={i}
                            variant="rounded"
                            width="100%"
                            height={48}
                            sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '8px' }}
                        />
                    ))}
                </Box>

                {/* Espaciador para empujar el perfil/logout hacia abajo */}
                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', mb: 3 }}>
                    <Skeleton
                        variant="rounded"
                        width="100%"
                        height={44}
                        sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '8px' }}
                    />
                    <Skeleton
                        variant="rounded"
                        width="100%"
                        height={44}
                        sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '8px' }}
                    />
                </Box>
            </Box>

            {/* --- Área de contenido vacía, solo con el fondo --- */}
            <Box
                sx={{
                    flex: 1,
                    bgcolor: '#f3f4f6',
                    borderRadius: '16px',
                    my: '8px'
                }}
            />
        </Box>
    );
}