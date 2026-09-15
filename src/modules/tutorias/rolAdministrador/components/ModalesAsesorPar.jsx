import { useState, useMemo, useEffect } from 'react';
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Componentes y Servicios propios
import InputBuscar from '../../../../components/ui/InputBuscar';
import { getEstudiantes } from '../services/estudianteService';
import { catalogoService } from '../services/catalogoService'; // Asegúrate de ajustar esta ruta si es necesario

// --- 1. MODAL INFORMACIÓN ASESOR PAR ---
export function ModalInfoAsesorPar({ open, onClose, data, onSave, showToast }) {
    const [formData, setFormData] = useState({
        nombre: '',
        matricula: '',
        contrasena: '',
        correo: '',
        telefono: '',
        licenciatura: '',
        grupo: '',
        promedio: '',
        materias: [],
        horarios: [],
        observaciones: ''
    });

    // Estado para guardar los datos originales con los que abrió el modal
    const [initialData, setInitialData] = useState(null);

    // Estados para controlar los sub-modales de selección
    const [openModalMateria, setOpenModalMateria] = useState(false);
    const [openModalHorario, setOpenModalHorario] = useState(false);

    // Listas de catálogos
    const [catalogoMaterias, setCatalogoMaterias] = useState([]);
    const [catalogoHorarios, setCatalogoHorarios] = useState([]);

    useEffect(() => {
        if (data && open) {
            const initialValues = {
                nombre: data.nombre || data.asesor || '',
                matricula: data.matricula || '',
                contrasena: data.contrasena || '••••••',
                correo: data.correo || '',
                telefono: data.telefono || '',
                licenciatura: data.licenciatura || '',
                grupo: data.grupo || '',
                promedio: data.promedio || '',
                materias: data.materias || ['Bases de Datos', 'Redes'],
                horarios: data.horarios || ['9:00 - 10:00 AM', '11:00 - 12:00 PM'],
                observaciones: data.raw?.observaciones || data.observaciones || ''
            };

            setFormData(initialValues);
            setInitialData(initialValues); // Guardamos la copia inicial

            // Cargar datos desde catalogoService
            try {
                const catalogos = catalogoService.getCatalogos();
                setCatalogoMaterias(catalogos.materias || []);
                setCatalogoHorarios(catalogos.horarios || []);
            } catch (error) {
                console.error('Error al cargar catálogos:', error);
            }
        }
    }, [data, open]);

    // Función para detectar si hubo cambios comparando con initialData
    const hasChanges = useMemo(() => {
        if (!initialData) return false;
        
        // Comparamos campos sencillos de texto/selects
        const basicFieldsChanged = Object.keys(formData).some((key) => {
            if (key === 'materias' || key === 'horarios') return false; // Se comparan aparte
            return formData[key] !== initialData[key];
        });

        if (basicFieldsChanged) return true;

        // Comparamos las materias (longitud o elementos diferentes)
        if (formData.materias.length !== initialData.materias.length) return true;
        const materiasChanged = formData.materias.some((m, i) => m !== initialData.materias[i]);
        if (materiasChanged) return true;

        // Comparamos los horarios (longitud o elementos diferentes)
        if (formData.horarios.length !== initialData.horarios.length) return true;
        const horariosChanged = formData.horarios.some((h, i) => h !== initialData.horarios[i]);
        if (horariosChanged) return true;

        return false;
    }, [formData, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectMateria = (materiaObj) => {
        const nombreMateria = materiaObj.materia;
        // Evitar duplicados
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
        // Evitar duplicados
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                    Información Asesor Par
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 3 }}>
                    {/* TODOS LOS CAMPOS EN UNA SOLA COLUMNA */}
                    <TextField
                        label="Nombre completo"
                        name="nombre"
                        size="small"
                        fullWidth
                        value={formData.nombre}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Número de Cuenta"
                        name="matricula"
                        size="small"
                        fullWidth
                        value={formData.matricula}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Contraseña"
                        name="contrasena"
                        type="password"
                        size="small"
                        fullWidth
                        value={formData.contrasena}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Correo institucional"
                        name="correo"
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
                        select
                        label="Licenciatura"
                        name="licenciatura"
                        size="small"
                        fullWidth
                        value={formData.licenciatura}
                        onChange={handleChange}
                    >
                        <MenuItem value="Licenciatura en informática">Licenciatura en informática</MenuItem>
                        <MenuItem value="Ingeniería en Software">Ingeniería en Software</MenuItem>
                    </TextField>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            select
                            label="Grupo"
                            name="grupo"
                            size="small"
                            sx={{ flex: 1 }}
                            value={formData.grupo}
                            onChange={handleChange}
                        >
                            <MenuItem value="2-1">2-1</MenuItem>
                            <MenuItem value="2-2">2-2</MenuItem>
                            <MenuItem value="4-1">4-1</MenuItem>
                        </TextField>

                        <TextField
                            label="Promedio"
                            name="promedio"
                            size="small"
                            sx={{ flex: 1 }}
                            value={formData.promedio}
                            onChange={handleChange}
                        />
                    </Box>

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

                <DialogActions sx={{ p: 2, pt: 1.5, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" color="inherit" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="contained" 
                        disabled={!hasChanges} // <-- Se desactiva si no hay cambios
                        sx={{ 
                            backgroundColor: '#2e7d32', 
                            '&:hover': { backgroundColor: '#1b5e20' },
                            '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' } // Estilo opcional cuando está deshabilitado
                        }} 
                        onClick={handleApply}
                    >
                        Aplicar Cambios
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- SUB-MODAL SELECCIONAR MATERIA DESDE CATÁLOGO --- */}
            <SubModalCatalogo
                open={openModalMateria}
                onClose={() => setOpenModalMateria(false)}
                titulo="Seleccionar Materia"
                elementos={catalogoMaterias}
                renderTexto={(item) => item.materia}
                onSelect={handleSelectMateria}
            />

            {/* --- SUB-MODAL SELECCIONAR HORARIO DESDE CATÁLOGO --- */}
            <SubModalCatalogo
                open={openModalHorario}
                onClose={() => setOpenModalHorario(false)}
                titulo="Seleccionar Horario"
                elementos={catalogoHorarios}
                renderTexto={(item) => item.horario}
                onSelect={handleSelectHorario}
            />
        </LocalizationProvider>
    );
}

// --- SUB-MODAL GENÉRICO PARA CATÁLOGOS ---
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

// --- 2. MODAL ELIMINAR ASESOR PAR ---
export function ModalEliminarAsesorPar({ open, onClose, onConfirm, showToast }) {
    const handleConfirm = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        if (onConfirm) onConfirm();
        if (showToast) showToast('Asesor Par eliminado correctamente', 'error');
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
                    ¿Estás seguro de que deseas eliminar este asesor par? Esta acción no se puede deshacer.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={handleCloseModal}>
                    Cancelar
                </Button>
                <Button variant="contained" color="error" onClick={handleConfirm}>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// --- 3. MODAL AGREGAR ASESOR PAR ---
export function ModalAgregarAsesorPar({ open, onClose, onAsesorAgregado }) {
    const [estudiantes, setEstudiantes] = useState([]);
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (open) {
            setCargando(true);
            getEstudiantes()
                .then((data) => {
                    setEstudiantes(data || []);
                })
                .catch((error) => {
                    console.error('Error al obtener estudiantes:', error);
                })
                .finally(() => {
                    setCargando(false);
                });
        } else {
            setBusqueda('');
            setEstudianteSeleccionado(null);
        }
    }, [open]);

    const estudiantesFiltrados = estudiantes.filter((est) => {
        const texto = busqueda.toLowerCase().trim();
        if (!texto) return true;

        return (
            (est.nombre || '').toLowerCase().includes(texto) ||
            (est.matricula || '').toLowerCase().includes(texto) ||
            (est.carrera || '').toLowerCase().includes(texto)
        );
    });

    const handleConfirmar = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        if (!estudianteSeleccionado) return;

        if (onAsesorAgregado) {
            onAsesorAgregado(estudianteSeleccionado);
        }

        onClose();
    };

    const handleCloseModal = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCloseModal} disableRestoreFocus maxWidth="sm" fullWidth>
            <DialogTitle className="font-bold text-xl">Agregar Asesor Par</DialogTitle>
            
            <DialogContent className="flex flex-col gap-4 py-4">
                <p className="text-sm text-gray-600">
                    Busca y selecciona un estudiante para asignarlo como Asesor Par:
                </p>

                <div className="w-full my-2">
                    <InputBuscar
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre, matrícula o carrera..."
                    />
                </div>

                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                    {cargando ? (
                        <p className="p-4 text-center text-sm text-gray-500">Cargando estudiantes...</p>
                    ) : estudiantesFiltrados.length === 0 ? (
                        <p className="p-4 text-center text-sm text-gray-500">No se encontraron estudiantes.</p>
                    ) : (
                        estudiantesFiltrados.map((est) => (
                            <div
                                key={est.id}
                                onClick={() => setEstudianteSeleccionado(est)}
                                className={`p-3 cursor-pointer transition-colors flex justify-between items-center ${
                                    estudianteSeleccionado?.id === est.id
                                        ? 'bg-green-50 border-l-4 border-[#2e7d32]'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">{est.nombre}</p>
                                    <p className="text-xs text-gray-500">{est.licenciatura} - {est.grupo}</p>
                                </div>
                                {estudianteSeleccionado?.id === est.id && (
                                    <span className="text-xs font-bold text-[#2e7d32]">Seleccionado</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>

            <DialogActions className="p-4 gap-2">
                <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleConfirmar}
                    disabled={!estudianteSeleccionado}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer ${
                        estudianteSeleccionado
                            ? 'bg-[#2e7d32] hover:bg-[#1b5e20]'
                            : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    Confirmar
                </button>
            </DialogActions>
        </Dialog>
    );
}