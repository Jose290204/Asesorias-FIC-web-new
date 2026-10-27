import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import { useEffect, useState } from 'react';
import InputBuscar from '../../../../components/ui/InputBuscar';
import ToastNotification from '../../../../components/ui/ToastNotification';
import ModalCrearEstudiante from '../components/estudiantes/modales/ModalCrearEstudiante';
import TablaEstudiantes from '../components/estudiantes/TablaEstudiantes';
import ModalCargaExcel from '../components/ModalCargaExel';
import { deleteEstudiante, getEstudiantes, updateEstudiante, uploadEstudiantes } from '../services/estudianteService';

// Color de los botones de crear (distinto al verde de la carga masiva)
const AZUL = '#244B91';
const AZUL_OSCURO = '#1B3A73';

export default function Estudiantes() {
    const [searchTerm, setSearchTerm] = useState('');
    const [estudiantes, setEstudiantes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modalExcelOpen, setModalExcelOpen] = useState(false);
    const [modalCrearOpen, setModalCrearOpen] = useState(false);

    // Estado para el toast global de la vista
    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => setToast({ open: true, message, type });

    const fetchEstudiantes = async () => {
        try {
            const data = await getEstudiantes();
            setEstudiantes(data);
        } catch (error) {
            console.error('Error al obtener los estudiantes:', error);
            showToast('Error al obtener la lista de estudiantes', 'error');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchEstudiantes();
    }, []);

    // Agrega el estudiante creado a la lista (el id real lo asignará el backend)
    const handleCrearEstudiante = async (nuevoEstudiante) => {
        // TODO: llamar al servicio de alta de estudiantes cuando exista el endpoint
        setEstudiantes((prev) => {
            const nuevoId = prev.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
            return [{ ...nuevoEstudiante, id: nuevoId }, ...prev];
        });
    };

    // Guarda los cambios de un estudiante. Si falla, el error llega a quien lo llamó (el modal), que avisa con su toast.
    const handleUpdateEstudiante = async (updatedData) => {
        await updateEstudiante(updatedData.id, updatedData);
        setEstudiantes((prev) =>
            prev.map((item) => (item.id === updatedData.id ? { ...item, ...updatedData } : item))
        );
    };

    // Elimina un estudiante. Si falla, el error llega a quien lo llamó (la tabla), que avisa con su toast.
    const handleDeleteEstudiante = async (dataToDelete) => {
        await deleteEstudiante(dataToDelete.id);
        setEstudiantes((prev) => prev.filter((item) => item.id !== dataToDelete.id));
    };

    const handleExcelData = async (data) => {
        try {
            await uploadEstudiantes(data);
            showToast('Estudiantes cargados exitosamente', 'success');
            fetchEstudiantes(); // Recarga los datos de la tabla
        } catch (error) {
            console.error('Error al procesar el archivo de estudiantes:', error);
            showToast('Error al procesar el archivo de estudiantes', 'error');
        }
    };

    // Quita el foco del elemento activo antes de abrir un modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    const handleOpenModalExcel = (event) => {
        clearFocus(event);
        setModalExcelOpen(true);
    };

    const handleOpenModalCrear = (event) => {
        clearFocus(event);
        setModalCrearOpen(true);
    };

    // Filtro por búsqueda en tiempo real (nombre, correo, número de cuenta o grupo)
    const filteredEstudiantes = estudiantes.filter((item) => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return true;

        return (
            (item.nombre || '').toLowerCase().includes(term) ||
            (item.correo || '').toLowerCase().includes(term) ||
            (item.numeroCuenta || '').toLowerCase().includes(term) ||
            (item.grupo || '').toLowerCase().includes(term)
        );
    });

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-[#F4F7FC] px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <p className="text-2xl font-bold">Estudiantes</p>

            {/* Barra de herramientas: en celular el buscador va arriba y "Cargar Estudiantes" debajo (a la mitad del ancho) */}
            <div className="w-full flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="w-full min-w-0 sm:flex-1">
                    <InputBuscar
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre, correo, cuenta o grupo..."
                    />
                </div>

                <button
                    onClick={handleOpenModalExcel}
                    className="w-1/2 sm:w-auto shrink-0 justify-center bg-[#2e7d32] hover:bg-[#1b5e20] text-sm text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1.8 14.8l-1.4 1.4L12 15.8l-2.4 2.4-1.4-1.4 2.4-2.4-2.4-2.4 1.4-1.4 2.4 2.4 2.4-2.4 1.4 1.4-2.4 2.4 2.4 2.4zM13 9V3.5L18.5 9H13z" />
                    </svg>
                    Cargar Estudiantes
                </button>

                {/* Botón normal: solo tablet y escritorio */}
                <Button
                    variant="contained"
                    size="medium"
                    startIcon={<PersonAddAlt1OutlinedIcon />}
                    onClick={handleOpenModalCrear}
                    sx={{
                        borderRadius: '5px',
                        textTransform: 'none',
                        backgroundColor: AZUL,
                        '&:hover': { backgroundColor: AZUL_OSCURO },
                        flexShrink: 0,
                        display: { xs: 'none', sm: 'inline-flex' }
                    }}
                >
                    Crear Estudiante
                </Button>
            </div>

            {/* Botón flotante: solo celular */}
            <Fab
                variant="extended"
                aria-label="Crear estudiante"
                onClick={handleOpenModalCrear}
                sx={{
                    position: 'fixed',
                    right: 16,
                    bottom: 16,
                    zIndex: 10,
                    textTransform: 'none',
                    color: '#ffffff',
                    backgroundColor: AZUL,
                    '&:hover': { backgroundColor: AZUL_OSCURO },
                    display: { xs: 'inline-flex', sm: 'none' }
                }}
            >
                <PersonAddAlt1OutlinedIcon sx={{ mr: 1 }} />
                Crear estudiante
            </Fab>

            <ModalCrearEstudiante
                open={modalCrearOpen}
                onClose={() => setModalCrearOpen(false)}
                onSave={handleCrearEstudiante}
                showToast={showToast}
            />

            {/* Modal reutilizable de carga masiva desde Excel */}
            <ModalCargaExcel
                open={modalExcelOpen}
                onClose={() => setModalExcelOpen(false)}
                onDataLoaded={handleExcelData}
            />

            {/* Contenido: en celular se deja espacio abajo para que el botón flotante no tape la paginación */}
            <div className="w-full flex flex-1 flex-col pb-24 sm:pb-5">
                {cargando ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <CircularProgress sx={{ color: '#244B91' }} />
                        <p className="text-sm text-gray-600">Cargando estudiantes...</p>
                    </div>
                ) : (
                    <TablaEstudiantes
                        rows={filteredEstudiantes}
                        onUpdate={handleUpdateEstudiante}
                        onDelete={handleDeleteEstudiante}
                    />
                )}
            </div>

            <ToastNotification
                open={toast.open}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}