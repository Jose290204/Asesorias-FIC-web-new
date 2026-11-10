import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useEffect, useState } from 'react';

/**
 * Ventana para buscar y elegir un elemento de un catálogo (materias u horarios).
 *
 * Props:
 *  - open, onClose
 *  - titulo: texto del encabezado
 *  - elementos: lista del catálogo
 *  - renderTexto: función que devuelve el texto visible de cada elemento
 *  - onSelect: recibe el elemento elegido
 */
export default function ModalSeleccionCatalogo({ open, onClose, titulo, elementos = [], renderTexto, onSelect }) {
    // Celular: pantalla completa
    const esCelular = useMediaQuery('(max-width:599.95px)');
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        if (!open) setBusqueda('');
    }, [open]);

    const texto = busqueda.toLowerCase().trim();
    const elementosFiltrados = elementos.filter((item) => !texto || renderTexto(item).toLowerCase().includes(texto));

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullScreen={esCelular}
            maxWidth="xs"
            fullWidth
            disableRestoreFocus
            sx={{ '& .MuiPaper-root': esCelular ? { borderRadius: 0 } : { borderRadius: '12px' } }}
        >
            <DialogTitle
                sx={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                {titulo}
                <IconButton size="small" aria-label="close" onClick={onClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
                <TextField
                    size="small"
                    placeholder="Buscar..."
                    fullWidth
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <Box sx={{ maxHeight: esCelular ? 'none' : '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {elementosFiltrados.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                            No se encontraron resultados.
                        </Typography>
                    ) : (
                        elementosFiltrados.map((item, index) => (
                            <Box
                                key={item.id_materia || item.id_horario || index}
                                onClick={() => onSelect(item)}
                                sx={{
                                    p: 1.2,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: '#EAF0FB', color: '#08338F' },
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {renderTexto(item)}
                                </Typography>
                            </Box>
                        ))
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}