import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Button from '@mui/material/Button';
import { useState } from "react";
import InputBuscar from "../../../../components/ui/InputBuscar";
import TarjetaAsesoriasEnCurso from "../components/TajetaAsesoriasEnCurso";

// Ajusta esta ruta si tu archivo de modales está en otra carpeta
import ToastNotification from "../../../../components/ui/ToastNotification";
import { ModalCrearAsesoria } from "../components/ModalesAsesoriasEnCurso";

// Datos de prueba
const ASESORIAS_PRUEBA = [
    { id: 12, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Base de Datos", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 13, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 14, alumno: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 15, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 16, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 17, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 18, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 19, alumno: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 20, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" },
    { id: 21, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial", horario: "10:00 - 11:00 AM" }
];

export default function AsesoriasEnCurso() {

    const [busqueda, setBusqueda] = useState("");

    // La lista es un estado para que las asesorías creadas aparezcan en las tarjetas
    const [asesoriasEnCurso, setAsesoriasEnCurso] = useState(ASESORIAS_PRUEBA);

    // Estado del modal
    const [modalCrearOpen, setModalCrearOpen] = useState(false);

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

    // Helper para desenfocar elementos activos antes de abrir el modal
    const clearFocus = (event) => {
        if (event?.currentTarget) event.currentTarget.blur();
        document.activeElement?.blur();
    };

    const handleOpenCrear = (event) => {
        clearFocus(event);
        setModalCrearOpen(true);
    };

    // Aquí va tu llamada a la API para crear la asesoría (y de ahí tomar el id real)
    // El modal ya se encarga de mostrar el toast y de cerrarse.
    const handleCrearAsesoria = async (nuevaAsesoria) => {
        console.log('Asesoría creada:', nuevaAsesoria);

        setAsesoriasEnCurso((prev) => {
            const nuevoId = prev.reduce((max, item) => Math.max(max, item.id), 0) + 1;
            return [{ ...nuevaAsesoria, id: nuevoId }, ...prev];
        });
    };

    const asesoriasFiltradas = asesoriasEnCurso.filter((asesoria) => {
        const textoBusqueda = busqueda.toLowerCase();
        return (
            asesoria.materia.toLowerCase().includes(textoBusqueda) ||
            asesoria.alumno.toLowerCase().includes(textoBusqueda)
        );
    });

    return (
    <div className="h-[calc(100vh-1rem)] w-full rounded-2xl pl-17 py-10 pr-17 flex flex-col items-start justify-start gap-10 bg-gray-100 overflow-hidden">
        <p className="text-2xl font-bold">Asesorias en curso</p>

        <div className="w-full flex items-center gap-6">
            <InputBuscar
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por materia o alumno..."
            />

            <Button
                variant="contained"
                sx={{ borderRadius: '5px', textTransform: 'none', backgroundColor: '#2E7D32' }}
                size="medium"
                startIcon={<AddOutlinedIcon />}
                onClick={handleOpenCrear}
            >
                Crear Asesoria
            </Button>
        </div>

        <div className="w-full overflow-y-auto max-h-[calc(100vh-180px)] pb-5">
            <TarjetaAsesoriasEnCurso asesorias={asesoriasFiltradas} />
        </div>

        {/* Modal */}
        <ModalCrearAsesoria
            open={modalCrearOpen}
            onClose={() => setModalCrearOpen(false)}
            onSave={handleCrearAsesoria}
            showToast={showToast}
        />

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
