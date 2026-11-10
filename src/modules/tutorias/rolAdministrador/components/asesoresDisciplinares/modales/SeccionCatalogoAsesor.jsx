import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, Typography } from '@mui/material';

/**
 * Bloque "título + botón Añadir + lista" que se usa para las materias y los horarios de un asesor.
 *
 * Props:
 *  - titulo: encabezado de la sección
 *  - items: lista de textos ya añadidos
 *  - textoVacio: mensaje cuando la lista está vacía
 *  - onAdd: abre la ventana de selección del catálogo
 *  - onRemove: recibe el índice del elemento quitado
 */
export default function SeccionCatalogoAsesor({ titulo, items = [], textoVacio, onAdd, onRemove }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {titulo}
                </Typography>

                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={onAdd}
                    sx={{
                        backgroundColor: '#244B91',
                        '&:hover': { backgroundColor: '#1B3A73' },
                        textTransform: 'none',
                        borderRadius: '20px',
                        px: 2
                    }}
                >
                    Añadir
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '120px', overflowY: 'auto', mt: 0.5 }}>
                {items.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', px: 1 }}>
                        {textoVacio}
                    </Typography>
                ) : (
                    items.map((item, index) => (
                        <Box
                            key={`${item}-${index}`}
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, py: 0.5, bgcolor: '#F4F7FC', borderRadius: '4px' }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                                {item}
                            </Typography>
                            <IconButton size="small" color="error" aria-label="Quitar" onClick={() => onRemove(index)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
}