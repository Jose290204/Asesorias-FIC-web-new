import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

// 276969 -> "270.5 KB"
const formatearTamano = (bytes) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Evidencias de una sesión: nombre, tamaño y botón para descargar.
// evidencias: [{ id, nombre, tipo, tamano, fecha }]
// onDescargar(evidencia) siempre; onEliminar(evidencia) es opcional (sin él es solo lectura).
export default function ListaEvidencias({ evidencias = [], onDescargar, onEliminar }) {
    if (evidencias.length === 0) return null;

    return (
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#6A6A6A' }}>
                Evidencias ({evidencias.length})
            </Typography>

            {evidencias.map((evidencia) => (
                <Box
                    key={evidencia.id}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        pl: '8px',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E3E8F2'
                    }}
                >
                    <AttachFileIcon sx={{ fontSize: 16, color: '#08338F', flexShrink: 0 }} />

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography noWrap title={evidencia.nombre} sx={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                            {evidencia.nombre}
                        </Typography>
                        <Typography sx={{ fontSize: '11px', color: '#6B7280' }}>{formatearTamano(evidencia.tamano)}</Typography>
                    </Box>

                    <Tooltip title="Descargar">
                        <IconButton
                            size="small"
                            aria-label={`Descargar ${evidencia.nombre}`}
                            onClick={() => onDescargar?.(evidencia)}
                            sx={{ color: '#08338F' }}
                        >
                            <DownloadIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {onEliminar && (
                        <Tooltip title="Eliminar evidencia">
                            <IconButton
                                size="small"
                                aria-label={`Eliminar ${evidencia.nombre}`}
                                onClick={() => onEliminar(evidencia)}
                                sx={{ color: '#C62828' }}
                            >
                                <DeleteOutlineOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            ))}
        </Box>
    );
}
