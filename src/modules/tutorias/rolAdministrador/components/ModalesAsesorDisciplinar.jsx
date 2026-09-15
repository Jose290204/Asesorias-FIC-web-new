import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    Typography,
    TextField,
    Box,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Servicio de catálogos
import { catalogoService } from '../services/catalogoService';

// --- 1. MODAL INFORMACIÓN ASESOR ---
export function ModalInfoAsesor({ open, onClose, data, onSave, showToast }) {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        numeroCuenta: '',
        estado: 'ACTIVO',
        materias: [],
        horarios: []
    });

    // Estado para guardar la copia inicial y comparar cambios
    const [initialData, setInitialData] = useState(null);

    const [openModalMateria, setOpenModalMateria] = useState(false);
    const [openModalHorario, setOpenModalHorario] = useState(false);

    const [catalogoMaterias, setCatalogoMaterias] = useState([]);
    const [catalogoHorarios, setCatalogoHorarios] = useState([]);

    useEffect(() => {
        if (data && open) {
            const initialValues = {
                nombre: data.nombre || '',
                correo: data.correo || '',
                telefono: data.telefono || '',
                numeroCuenta: data.numeroCuenta || '',
                estado: data.estado || 'ACTIVO',
                materias: data.materias ? [...data.materias] : [],
                horarios: data.horarios ? [...data.horarios] : []
            };

            setFormData(initialValues);
            setInitialData(initialValues); // Guardamos la foto inicial

            try {
                const catalogos = catalogoService.getCatalogos();
                setCatalogoMaterias(catalogos.materias || []);
                setCatalogoHorarios(catalogos.horarios || []);
            } catch (error) {
                console.error('Error al cargar catálogos:', error);
            }
        }
    }, [data, open]);

    // Función auxiliar para comparar si hay cambios reales
    const hasChanges = () => {
        if (!initialData) return false;
        
        return (
            formData.nombre !== initialData.nombre ||
            formData.correo !== initialData.correo ||
            formData.telefono !== initialData.telefono ||
            formData.numeroCuenta !== initialData.numeroCuenta ||
            formData.estado !== initialData.estado ||
            JSON.stringify(formData.materias) !== JSON.stringify(initialData.materias) ||
            JSON.stringify(formData.horarios) !== JSON.stringify(initialData.horarios)
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectMateria = (materiaObj) => {
        const nombreMateria = materiaObj.materia;
        if (!formData.materias.includes(nombreMateria)) {
            setFormData((prev) => ({
                ...prev,
                materias: [...prev.materias, nombreMateria]
            }));
        }
        setOpenModalMateria(false);
    };

    const handleRemoveMateria = (index) => {
        setFormData((prev) => ({
            ...prev,
            materias: prev.materias.filter((_, i) => i !== index)
        }));
    };

    const handleSelectHorario = (horarioObj) => {
        const nombreHorario = horarioObj.horario;
        if (!formData.horarios.includes(nombreHorario)) {
            setFormData((prev) => ({
                ...prev,
                horarios: [...prev.horarios, nombreHorario]
            }));
        }
        setOpenModalHorario(false);
    };

    const handleRemoveHorario = (index) => {
        setFormData((prev) => ({
            ...prev,
            horarios: prev.horarios.filter((_, i) => i !== index)
        }));
    };

    const handleApply = () => {
        if (!hasChanges()) return; // Evitar ejecución si no hay cambios

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        if (onSave) onSave({ ...data, ...formData });
        if (showToast) showToast('Cambios aplicados correctamente', 'info');
        onClose();
    };

    const handleCloseModal = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCloseModal}
            disableRestoreFocus
            sx={{
                '& .MuiPaper-root': {
                    width: '500px',
                    maxWidth: '500px',
                    maxHeight: '90vh',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1.5
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>
                Información del Asesor Disciplinar
                <IconButton
                    aria-label="close"
                    onClick={handleCloseModal}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 3 }}>
                <TextField
                    label="Nombre Completo"
                    name="nombre"
                    size="small"
                    fullWidth
                    value={formData.nombre}
                    onChange={handleChange}
                />
                
                <TextField
                    label="Correo Electrónico"
                    name="correo"
                    type="email"
                    size="small"
                    fullWidth
                    value={formData.correo}
                    onChange={handleChange}
                />

                <TextField
                    label="Teléfono"
                    name="telefono"
                    size="small"
                    fullWidth
                    value={formData.telefono}
                    onChange={handleChange}
                />

                <TextField
                    label="Número de Cuenta"
                    name="numeroCuenta"
                    size="small"
                    fullWidth
                    value={formData.numeroCuenta}
                    onChange={handleChange}
                />

                <TextField
                    select
                    label="Estado"
                    name="estado"
                    size="small"
                    fullWidth
                    value={formData.estado}
                    onChange={handleChange}
                >
                    <MenuItem value="ACTIVO">ACTIVO</MenuItem>
                    <MenuItem value="INACTIVO">INACTIVO</MenuItem>
                </TextField>

                {/* SECCIÓN MATERIAS QUE ASESORA */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Materias que asesora
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenModalMateria(true)}
                            sx={{
                                backgroundColor: '#3b945e',
                                '&:hover': { backgroundColor: '#2e7d32' },
                                textTransform: 'none',
                                borderRadius: '20px',
                                px: 2
                            }}
                        >
                            Añadir
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '120px', overflowY: 'auto', mt: 0.5 }}>
                        {formData.materias.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', px: 1 }}>
                                No hay materias añadidas.
                            </Typography>
                        ) : (
                            formData.materias.map((materia, index) => (
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, py: 0.5, bgcolor: '#f9f9f9', borderRadius: '4px' }}>
                                    <Typography variant="body2" color="text.secondary">{materia}</Typography>
                                    <IconButton size="small" color="error" onClick={() => handleRemoveMateria(index)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))
                        )}
                    </Box>
                </Box>

                {/* SECCIÓN HORARIOS DE ASESORÍA */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Horarios de asesoría
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenModalHorario(true)}
                            sx={{
                                backgroundColor: '#3b945e',
                                '&:hover': { backgroundColor: '#2e7d32' },
                                textTransform: 'none',
                                borderRadius: '20px',
                                px: 2
                            }}
                        >
                            Añadir
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '120px', overflowY: 'auto', mt: 0.5 }}>
                        {formData.horarios.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', px: 1 }}>
                                No hay horarios añadidos.
                            </Typography>
                        ) : (
                            formData.horarios.map((horario, index) => (
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, py: 0.5, bgcolor: '#f9f9f9', borderRadius: '4px' }}>
                                    <Typography variant="body2" color="text.secondary">{horario}</Typography>
                                    <IconButton size="small" color="error" onClick={() => handleRemoveHorario(index)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))
                        )}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1.5, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={handleCloseModal}>
                    Cancelar
                </Button>
                {/* Botón con la propiedad disabled dependiendo de la función hasChanges() */}
                <Button 
                    variant="contained" 
                    disabled={!hasChanges()} 
                    sx={{ 
                        backgroundColor: '#2e7d32', 
                        '&:hover': { backgroundColor: '#1b5e20' },
                        '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' } 
                    }} 
                    onClick={handleApply}
                >
                    Aplicar Cambios
                </Button>
            </DialogActions>

            {/* Sub-modales para selección desde catálogo */}
            <SubModalCatalogo
                open={openModalMateria}
                onClose={() => setOpenModalMateria(false)}
                titulo="Seleccionar Materia"
                elementos={catalogoMaterias}
                renderTexto={(item) => item.materia}
                onSelect={handleSelectMateria}
            />

            <SubModalCatalogo
                open={openModalHorario}
                onClose={() => setOpenModalHorario(false)}
                titulo="Seleccionar Horario"
                elementos={catalogoHorarios}
                renderTexto={(item) => item.horario}
                onSelect={handleSelectHorario}
            />
        </Dialog>
    );
}

// Subcomponente genérico de catálogo para búsqueda y selección
function SubModalCatalogo({ open, onClose, titulo, elementos, renderTexto, onSelect }) {
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        if (!open) setBusqueda('');
    }, [open]);

    const elementosFiltrados = elementos.filter((item) => {
        const texto = busqueda.toLowerCase().trim();
        if (!texto) return true;
        return renderTexto(item).toLowerCase().includes(texto);
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableRestoreFocus>
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {titulo}
                <IconButton size="small" onClick={onClose}>
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
                <Box sx={{ maxH: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                                    '&:hover': { bgcolor: '#f1f8e9', color: '#2e7d32' },
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

// --- 2. MODAL ELIMINAR ASESOR ---
export function ModalEliminarAsesor({ open, onClose, onConfirm, data, showToast }) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm(data);
        if (showToast) showToast('Asesor disciplinar eliminado correctamente', 'error');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '450px',
                    maxWidth: '450px',
                    height: '250px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminación</DialogTitle>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" align="center">
                    ¿Estás seguro de que deseas eliminar a {data?.nombre ? <strong>{data.nombre}</strong> : 'este asesor'}? Esta acción no se puede deshacer.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="error" onClick={handleConfirm}>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}