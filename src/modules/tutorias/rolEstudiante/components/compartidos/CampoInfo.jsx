import { Box, Typography } from '@mui/material';

// Un dato de un modal de información: etiqueta arriba y valor abajo
export default function CampoInfo({ label, children }) {
    return (
        <Box>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>
                {label}
            </Typography>
            <Typography variant="body1" sx={{ color: '#333333', overflowWrap: 'anywhere', whiteSpace: 'pre-line' }}>
                {children || 'N/A'}
            </Typography>
        </Box>
    );
}
