import { Box, Typography } from '@mui/material';

// Bloque de un formulario: cuadrito con ícono + título y los campos debajo (en una sola columna).
// Los campos quedan con fondo blanco dentro del bloque.
export default function BloqueFormulario({ icono, titulo, children }) {
    return (
        <Box
            sx={{
                p: '14px 16px',
                borderRadius: '12px',
                backgroundColor: '#F7F9FD',
                border: '1px solid #EEF1F7',
                '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF' }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: 2 }}>
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        borderRadius: '10px',
                        backgroundColor: '#E6ECF8',
                        color: '#08338F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {icono}
                </Box>
                <Typography sx={{ fontWeight: 'bold', color: '#6A6A6A', fontSize: '0.8125rem' }}>{titulo}</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 2 }}>{children}</Box>
        </Box>
    );
}
