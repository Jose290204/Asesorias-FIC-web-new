import { Box, Typography } from '@mui/material';

// Bloque de un modal de información: ícono en un cuadrito, etiqueta en gris y el contenido debajo.
// tono="alerta" lo pinta en rojo suave (para avisos, como las notas de rechazo).
export default function SeccionInfo({ icono, etiqueta, tono, children }) {
    const alerta = tono === 'alerta';

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                p: '14px 16px',
                borderRadius: '12px',
                backgroundColor: alerta ? '#FDF3F3' : '#F7F9FD',
                border: `1px solid ${alerta ? '#F3D6D6' : '#EEF1F7'}`
            }}
        >
            <Box
                sx={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: '10px',
                    backgroundColor: alerta ? '#F8DCDC' : '#E6ECF8',
                    color: alerta ? '#C62828' : '#08338F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {icono}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>{etiqueta}:</Typography>
                {children}
            </Box>
        </Box>
    );
}
