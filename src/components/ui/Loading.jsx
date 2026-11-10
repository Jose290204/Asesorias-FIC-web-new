import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading({ mensaje = 'Cargando...', pantallaCompleta = false }) {
    return (
        <Box
            className={`w-full rounded-2xl bg-gray-100 ${pantallaCompleta ? 'h-screen' : 'h-full'}`}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3
            }}
        >
            <CircularProgress sx={{ color: '#2E7D32' }} size={80} thickness={4} />
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                {mensaje}
            </Typography>
        </Box>
    );
}