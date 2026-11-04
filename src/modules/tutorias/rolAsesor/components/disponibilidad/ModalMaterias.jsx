import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';


export default function ModalMaterias({ open, onClose, catalogo, seleccionadas, onConfirm }) {
    const [busqueda, setBusqueda] = useState('');
    const [ids, setIds] = useState([]);

    // Al abrir, parte de lo que ya estaba seleccionado
    useEffect(() => {
        if (open) {
            setIds(seleccionadas.map((m) => m.id));
            setBusqueda('');
        }
    }, [open, seleccionadas]);

    const toggle = (id) =>
        setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const filtradas = catalogo.filter((m) =>
        String(m.nombre).toLowerCase().includes(busqueda.toLowerCase().trim())
    );

    const handleConfirm = () => {
        onConfirm(catalogo.filter((m) => ids.includes(m.id)).map((m) => ({ id: m.id, nombre: m.nombre })));
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableRestoreFocus>
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                Materias que asesoras
            </DialogTitle>
            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, py: 2 }}>
                <TextField
                    size="small"
                    placeholder="Buscar materia..."
                    fullWidth
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <Box sx={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {filtradas.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                            No se encontraron resultados.
                        </Typography>
                    ) : (
                        filtradas.map((m) => (
                            <ListItemButton
                                key={m.id}
                                dense
                                onClick={() => toggle(m.id)}
                                sx={{ borderRadius: '6px' }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Checkbox
                                        edge="start"
                                        size="small"
                                        checked={ids.includes(m.id)}
                                        tabIndex={-1}
                                        disableRipple
                                        sx={{ color: '#9e9e9e', '&.Mui-checked': { color: '#2e7d32' } }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={m.nombre} slotProps={{ primary: { sx: { fontSize: '14px' } } }} />
                            </ListItemButton>
                        ))
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 1.5 }}>
                <Button onClick={onClose} sx={{ textTransform: 'none', color: '#555' }}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    sx={{ textTransform: 'none', backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
                >
                    Listo ({ids.length})
                </Button>
            </DialogActions>
        </Dialog>
    );
}
