import CloseIcon from '@mui/icons-material/Close';
import { Box, DialogTitle, IconButton, Typography } from '@mui/material';

const FONDO = {
    azul: 'linear-gradient(135deg, #1E4DB7 0%, #08338F 100%)',
    verde: 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)',
    rojo: 'linear-gradient(135deg, #E04848 0%, #C42525 100%)'
};

// Encabezado de los modales: cuadrito con ícono, título en negritas, subtítulo gris y botón de cerrar (si hay onClose)
export default function EncabezadoModal({ icono, titulo, subtitulo, tono = 'azul', onClose }) {
    return (
        <DialogTitle sx={{ m: 0, p: 2, pr: onClose ? 7 : 2, display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Box
                sx={{
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    borderRadius: '12px',
                    background: FONDO[tono] ?? FONDO.azul,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {icono}
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1.2 }}>{titulo}</Typography>
                {subtitulo && (
                    <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px', overflowWrap: 'anywhere' }}>
                        {subtitulo}
                    </Typography>
                )}
            </Box>
            {onClose && (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            )}
        </DialogTitle>
    );
}
