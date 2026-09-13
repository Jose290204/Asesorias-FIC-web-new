import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBuscar from '../../../../components/ui/InputBuscar';
import ModalCargaExcel from '../components/ModalCargaExel'; // Ajustar ruta si es necesario
import TablaEstudiantes from '../components/TablaEstudiantes';
import { getEstudiantes, updateEstudiante, deleteEstudiante, uploadEstudiantes } from '../services/estudianteService';
import ToastNotification from '../../../../components/ui/ToastNotification';

export default function Estudiantes() {
    const [searchTerm, setSearchTerm] = useState('');
    const [estudiantes, setEstudiantes] = useState([]);
    const [modalExcelOpen, setModalExcelOpen] = useState(false);

    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => setToast({ open: true, message, type });

    useEffect(() => {
        fetchEstudiantes();
    }, []);

    const fetchEstudiantes = async () => {
        try {
            const data = await getEstudiantes();
            setEstudiantes(data);
        } catch (error) {
            showToast('Error al obtener la lista de estudiantes', 'error');
        }
    };

    const handleUpdateEstudiante = async (updatedData) => {
        try {
            await updateEstudiante(updatedData.id, updatedData);
            setEstudiantes((prev) =>
                prev.map((item) => (item.id === updatedData.id ? updatedData : item))
            );
        } catch (error) {
            showToast('Error al actualizar el estudiante', 'error');
        }
    };

    const handleDeleteEstudiante = async (dataToDelete) => {
        try {
            await deleteEstudiante(dataToDelete.id);
            setEstudiantes((prev) => prev.filter((item) => item.id !== dataToDelete.id));
        } catch (error) {
            showToast('Error al eliminar el estudiante', 'error');
        }
    };

    const handleExcelData = async (data) => {
        try {
            await uploadEstudiantes(data);
            showToast('Estudiantes cargados exitosamente', 'success');
            fetchEstudiantes(); // Recargar datos de la tabla
        } catch (error) {
            showToast('Error al procesar el archivo de estudiantes', 'error');
        }
    };

    // Helper para desenfocar elementos activos antes de abrir el modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    const handleOpenModalExcel = (event) => {
        clearFocus(event);
        setModalExcelOpen(true);
    };

    const filteredEstudiantes = estudiantes.filter((item) => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return true;

        const nombre = (item.nombre || '').toLowerCase();
        const correo = (item.correo || '').toLowerCase();
        const numCuenta = (item.numeroCuenta || '').toLowerCase();
        const grupo = (item.grupo || '').toLowerCase();

        return (
            nombre.includes(term) ||
            correo.includes(term) ||
            numCuenta.includes(term) ||
            grupo.includes(term)
        );
    });

    return (
        <div className="mx-10 my-3 flex flex-col items-start justify-start gap-10">
            <div>
                <p className="text-2xl font-bold">Estudiantes</p>
            </div>

            {/* Barra superior con buscador y botón para abrir el modal estilo Asesores */}
            <div className="flex gap-4 items-center w-full">
                <InputBuscar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button
                    onClick={handleOpenModalExcel}
                    className="bg-[#2e7d32] hover:bg-[#1b5e20] text-sm text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1.8 14.8l-1.4 1.4L12 15.8l-2.4 2.4-1.4-1.4 2.4-2.4-2.4-2.4 1.4-1.4 2.4 2.4 2.4-2.4 1.4 1.4-2.4 2.4 2.4 2.4zM13 9V3.5L18.5 9H13z" />
                    </svg>
                    Cargar Estudiantes
                </button>
            </div>

            {/* Modal Reutilizable de Carga Masiva desde Excel */}
            <ModalCargaExcel
                open={modalExcelOpen}
                onClose={() => setModalExcelOpen(false)}
                onDataLoaded={handleExcelData}
            />

            {/* Tabla Principal */}
            <TablaEstudiantes
                rows={filteredEstudiantes}
                onUpdate={handleUpdateEstudiante}
                onDelete={handleDeleteEstudiante}
            />

            {/* Notificaciones */}
            <ToastNotification
                open={toast.open}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}