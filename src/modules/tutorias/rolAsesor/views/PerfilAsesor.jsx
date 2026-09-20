import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Button,
    Typography,
    TextField,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Ajusta estas rutas según dónde esté este archivo en tu proyecto
import { catalogoService } from '../../rolAdministrador/services/catalogoService';
import ToastNotification from '../../../../components/ui/ToastNotification';

// Datos de prueba - reemplázalos con los datos reales del asesor
const MATERIAS_INICIALES = ['Programación Estructurada', 'Fundamentos de Bases de Datos'];
const HORARIOS_INICIALES = ['10:00-11:00 AM', '4:00-5:00 PM'];

// --- SUBCOMPONENTE: SELECTOR DE CATÁLOGO (búsqueda y selección) ---
function SubModalCatalogo({ open, onClose, titulo, elementos, campoTexto, onSelect }) {
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        if (!open) setBusqueda('');
    }, [open]);

    const elementosFiltrados = elementos.filter((item) => {
        const texto = busqueda.toLowerCase().trim();
        if (!texto) return true;
        return String(item[campoTexto]).toLowerCase().includes(texto);
    });

    return (
        <Dialog  open={open} onClose={onClose} maxWidth="xs" fullWidth disableRestoreFocus>
            <DialogTitle sx={{  fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <Box sx={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                                    {item[campoTexto]}
                                </Typography>
                            </Box>
                        ))
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}

// --- SUBCOMPONENTE: SECCIÓN CON LISTA + BOTÓN AÑADIR (se usa para materias y para horarios) ---
function SeccionCatalogoEditable({ titulo, tituloSelector, textoVacio, items, catalogo, campoTexto, onAdd, onRemove }) {
    const [openSelector, setOpenSelector] = useState(false);

    const handleSelect = (elemento) => {
        const nombre = elemento[campoTexto];
        if (!items.includes(nombre)) onAdd(nombre);
        setOpenSelector(false);
    };

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
                    onClick={() => setOpenSelector(true)}
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
                {items.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', px: 1 }}>
                        {textoVacio}
                    </Typography>
                ) : (
                    items.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, py: 0.5, bgcolor: '#f9f9f9', borderRadius: '4px' }}>
                            <Typography variant="body2" color="text.secondary">{item}</Typography>
                            <IconButton size="small" color="error" onClick={() => onRemove(index)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))
                )}
            </Box>

            <SubModalCatalogo
                open={openSelector}
                onClose={() => setOpenSelector(false)}
                titulo={tituloSelector}
                elementos={catalogo}
                campoTexto={campoTexto}
                onSelect={handleSelect}
            />
        </Box>
    );
}

// --- PÁGINA ---
export default function PerfilAsesor() {
    const [materias, setMaterias] = useState(MATERIAS_INICIALES);
    const [horarios, setHorarios] = useState(HORARIOS_INICIALES);

    // Última versión guardada, para saber si hay cambios
    const [guardado, setGuardado] = useState({
        materias: MATERIAS_INICIALES,
        horarios: HORARIOS_INICIALES
    });

    // Estado para el Toast Global
    const [toast, setToast] = useState({
        open: false,
        message: '',
        type: 'info'
    });

    const showToast = (message, type = 'info') => {
        setToast({ open: true, message, type });
    };

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    // Catálogos desde catalogoService
    const catalogoMaterias = catalogoService.getMaterias();
    const catalogoHorarios = catalogoService.getHorarios();

    const hasChanges =
        JSON.stringify(materias) !== JSON.stringify(guardado.materias) ||
        JSON.stringify(horarios) !== JSON.stringify(guardado.horarios);

    // Handlers de materias
    const handleAgregarMateria = (nombre) => setMaterias((prev) => [...prev, nombre]);
    const handleQuitarMateria = (index) => setMaterias((prev) => prev.filter((_, i) => i !== index));

    // Handlers de horarios
    const handleAgregarHorario = (nombre) => setHorarios((prev) => [...prev, nombre]);
    const handleQuitarHorario = (index) => setHorarios((prev) => prev.filter((_, i) => i !== index));

    const handleApply = () => {
        if (!hasChanges) return; // Evitar ejecución si no hay cambios

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        // Aquí va tu llamada a la API
        console.log('Perfil actualizado:', { materias, horarios });

        setGuardado({ materias, horarios });
        showToast('Cambios aplicados correctamente', 'info');
    };

    return (
        <div className="h-[calc(100vh-1rem)] w-full rounded-2xl pl-17 py-10 pr-4 flex flex-col items-start justify-start gap-5 bg-gray-100">
            <div>
                <p className="text-2xl font-bold">Perfil</p>
            </div>


            <div className="w-full flex flex-col items-center gap-8">

                {/* <div className="w-28 h-28 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-400 shadow-sm overflow-hidden">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div> */}


                <div className="w-full max-w-xl bg-white border border-gray-200 rounded-[10px] shadow-sm p-8 flex flex-col gap-6">
                    {/* Campo Nombre Completo */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            value="Leslie Mayram Barrera Rodriguez"
                            readOnly
                            className="w-full bg-gray-100 border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                        />
                    </div>

                    {/* Campo Número de Cuenta */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Número de Cuenta
                        </label>
                        <input
                            type="text"
                            value="19519958"
                            readOnly
                            className="w-full bg-gray-100 border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                        />
                    </div>

                    {/* SECCIÓN MATERIAS QUE ASESORA */}
                    <SeccionCatalogoEditable
                        titulo="Materias que asesora"
                        tituloSelector="Seleccionar Materia"
                        textoVacio="No hay materias añadidas."
                        items={materias}
                        catalogo={catalogoMaterias}
                        campoTexto="materia"
                        onAdd={handleAgregarMateria}
                        onRemove={handleQuitarMateria}
                    />

                    {/* SECCIÓN HORARIOS DE ASESORÍA */}
                    <SeccionCatalogoEditable
                        titulo="Horarios de asesoría"
                        tituloSelector="Seleccionar Horario"
                        textoVacio="No hay horarios añadidos."
                        items={horarios}
                        catalogo={catalogoHorarios}
                        campoTexto="horario"
                        onAdd={handleAgregarHorario}
                        onRemove={handleQuitarHorario}
                    />

                    {/* Botón deshabilitado mientras no haya cambios */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            disabled={!hasChanges}
                            onClick={handleApply}
                            sx={{
                                backgroundColor: '#2e7d32',
                                '&:hover': { backgroundColor: '#1b5e20' },
                                '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' }
                            }}
                        >
                            Aplicar Cambios
                        </Button>
                    </Box>
                </div>
            </div>

            {/* Toast Global */}
            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}
