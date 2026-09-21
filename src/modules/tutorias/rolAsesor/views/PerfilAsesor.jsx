import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import Loading from '../../../../components/ui/Loading';


import { asesoresService } from '../../../../Services/asesoresService';
import ToastNotification from '../../../../components/ui/ToastNotification';
import { catalogoService } from '../../rolAdministrador/services/catalogoService';

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
function SeccionCatalogoEditable({ titulo, tituloSelector, textoVacio, items, catalogo, campoTexto, campoId, onAdd, onRemove }) {
    const [openSelector, setOpenSelector] = useState(false);

    const handleSelect = (elemento) => {
       const yaExiste = items.some((item) => item[campoId] === elemento[campoId])
       if(!yaExiste) {
        onAdd(elemento)
        setOpenSelector(false);
       }
       
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
                            <Typography variant="body2" color="text.secondary">{item[campoTexto]}</Typography>
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
    //estado para el perfil completo
    const [perfil, setPerfil] = useState(null);

    //estado de carga, mientras llega la respuesta del back
    const [loading, setLoading] = useState(true);

    //arreglos para llenar materias y horarios
    const [materias, setMaterias] = useState([]);
    const [horarios, setHorarios] = useState([])

    //materias y horarios seleccionados
    const [guardado, setGuardado] = useState({ materias: [], horarios: [] });

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

      const cargarPerfil = useCallback(async () => {
        try {
            setLoading(true); // mostramos la pantalla de carga
            const respuesta = await asesoresService.obtenerPerfilAsesor(); // corremos la api
            const datos = respuesta.data;

            // recibimos los datos y actualizamos las listas
            setPerfil(datos.datosAsesor);
            setMaterias(datos.materiasAsesor);
            setHorarios(datos.horariosAsesor);
            setGuardado({ materias: datos.materias, horarios: datos.horarios });
        } catch (error) {
            console.error('Error al cargar el perfil', error);
            showToast('No se pudo cargar el perfil', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    //cargamos el perfil
    useEffect(() => {
        cargarPerfil();
    }, [cargarPerfil]);

    // Catálogos desde catalogoService
    const catalogoMaterias = catalogoService.getMaterias();
    const catalogoHorarios = catalogoService.getHorarios();

    const hasChanges =
        JSON.stringify(materias) !== JSON.stringify(guardado.materias) ||
        JSON.stringify(horarios) !== JSON.stringify(guardado.horarios);

    // Handlers de materias
    const handleAgregarMateria = (materia) => setMaterias((prev) => [...prev, materia]);
    const handleQuitarMateria = (index) => setMaterias((prev) => prev.filter((_, i) => i !== index));

    // Handlers de horarios
    const handleAgregarHorario = (horario) => setHorarios((prev) => [...prev, horario]);
    const handleQuitarHorario = (index) => setHorarios((prev) => prev.filter((_, i) => i !== index));

    const handleApply = async () => {
        if (!hasChanges) return;


        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        
        try {

            await asesoresService.actualizarMateriasYHorarios(materias, horarios);

            setGuardado({ materias, horarios });
            showToast('Cambios aplicados correctamente', 'success');
            cargarPerfil()
        } catch (error) {
            const mensaje = error.response?.data?.message || 'Error al guardar los cambios';
            showToast(mensaje, 'error');
        }
    };
    
    if (loading) {
        return <Loading mensaje='cargando perfil...'/>;
    }

   return (
    <div className="h-[calc(100vh-1rem)] w-full rounded-2xl pl-17 py-10 pr-4 flex flex-col items-start justify-start gap-5 bg-gray-100 overflow-hidden">
        <p className="text-2xl font-bold">Perfil</p>

        <div className="w-full overflow-y-auto max-h-[calc(100vh-180px)] pb-5">
            <div className="w-full flex flex-col items-center gap-8">

                <div className="w-full max-w-xl bg-white border border-gray-200 rounded-[10px] shadow-sm p-8 flex flex-col gap-6">
                    {/* Campo Nombre Completo */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            value={perfil.nombre_completo}
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
                            value={perfil.numero_cuenta}
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
                        campoId="id_materia"
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
                        campoId="id_horario"
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
