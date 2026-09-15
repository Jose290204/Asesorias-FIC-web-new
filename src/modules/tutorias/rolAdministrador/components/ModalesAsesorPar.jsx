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
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Componentes y Servicios propios
import InputBuscar from '../../../../components/ui/InputBuscar';
import { getEstudiantes } from '../services/estudianteService';

// --- 1. MODAL INFORMACIÓN ASESOR PAR ---
export function ModalInfoAsesorPar({ open, onClose, data, onSave, showToast }) {
    const [formData, setFormData] = useState({
        materia: '',
        estudiante: '',
        asesor: '',
        inicio: '',
        horario: '',
        observaciones: ''
    });

    useEffect(() => {
        if (data && open) {
            const rawFecha = data.raw?.fecha_inicio || data.inicio;
            
            const fechaValida = rawFecha && dayjs(rawFecha).isValid()
                ? dayjs(rawFecha).format('YYYY-MM-DD')
                : '';

            setFormData({
                materia: data.materia || '',
                estudiante: data.estudiante || '',
                asesor: data.asesor || '',
                inicio: fechaValida,
                horario: data.horario || '',
                observaciones: data.raw?.observaciones || ''
            });
        }
    }, [data, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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

    const parsedDate = formData.inicio && dayjs(formData.inicio).isValid()
        ? dayjs(formData.inicio)
        : null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog
                open={open}
                onClose={handleCloseModal}
                disableRestoreFocus
                sx={{
                    '& .MuiPaper-root': {
                        width: '600px',
                        maxWidth: '600px',
                        height: '600px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
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

                <DialogContent dividers>
                    <Box>
                        <TextField
                            label="Materia"
                            name="materia"
                            size="small"
                            fullWidth
                            value={formData.materia}
                            onChange={handleChange}
                            sx={{ marginBottom: 2.5 }}
                        />
                        <TextField
                            label="Estudiante"
                            name="estudiante"
                            size="small"
                            fullWidth
                            value={formData.estudiante}
                            onChange={handleChange}
                            sx={{ marginBottom: 2.5 }}
                        />
                        <TextField
                            label="Asesor"
                            name="asesor"
                            size="small"
                            fullWidth
                            value={formData.asesor}
                            onChange={handleChange}
                            sx={{ marginBottom: 2.5 }}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 2,
                                marginBottom: 2.5
                            }}
                        >
                            <TextField
                                label="Horario"
                                name="horario"
                                size="small"
                                value={formData.horario}
                                onChange={handleChange}
                                sx={{ width: '49%' }}
                            />

                            <DatePicker
                                label="Fecha Inicio"
                                value={parsedDate}
                                onChange={(newValue) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        inicio: newValue && newValue.isValid() ? newValue.format('YYYY-MM-DD') : ''
                                    }));
                                }}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        sx: { width: '49%' }
                                    }
                                }}
                            />
                        </Box>

                        <TextField
                            label="Observaciones"
                            name="observaciones"
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.observaciones}
                            onChange={handleChange}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5 }}>
                    <Button variant="contained" color="primary" onClick={handleApply}>
                        Aplicar Cambios
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
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