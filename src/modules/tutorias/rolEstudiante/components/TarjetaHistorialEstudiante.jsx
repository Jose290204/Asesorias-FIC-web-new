import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

// Ajusta estas rutas según dónde estén los archivos en tu proyecto
import ToastNotification from '../../../../components/ui/ToastNotification';
import {
    ModalInfoHistorialEstudiante,
    ModalMaterialHistorialEstudiante
} from '../components/ModalesHistorialAsesoriasEstudiantes';

//Datos de prueba - solo cambia estos segun tu tarjeta para pruebas
const HISTORIAL_PRUEBA = [
    {
        id: 1,
        asesor: "Juan Pérez",
        materia: "Programación",
        modalidad: "Presencial",
        fecha: "15/09/2026",
        horario: "10:00 AM - 11:00 AM",
        estado: "Finalizada",
        descripcion:
            "Asesoría sobre estructuras de datos y algoritmos.",
        material: [
            {
                id: 1,
                nombre: "Material de estructuras de datos",
                url: "#",
            },
        ],
    },
    {
        id: 2,
        asesor: "María López",
        materia: "Bases de Datos",
        modalidad: "Virtual",
        fecha: "12/09/2026",
        horario: "12:00 PM - 1:00 PM",
        estado: "Finalizada",
        descripcion:
            "Repaso de consultas SQL y relaciones entre tablas.",
        material: [
            {
                id: 1,
                nombre: "Ejercicios SQL",
                url: "#",
            },
        ],
    },
    {
        id: 3,
        asesor: "Carlos Ramírez",
        materia: "Matemáticas",
        modalidad: "Presencial",
        fecha: "10/09/2026",
        horario: "09:00 AM - 10:00 AM",
        estado: "Finalizada",
        descripcion:
            "Asesoría de álgebra y resolución de ejercicios.",
        material: [],
    },
    {
        id: 4,
        asesor: "Leslie Mayram",
        materia: "Programacion Avanzada",
        modalidad: "Presencial",
        fecha: "10/09/2026",
        horario: "10:00 AM - 1:00 PM",
        estado: "Finalizada",
        descripcion:
            "Asesoría de Programacion y resolución de ejercicios.",
        material: [],
    },
    {
        id: 5,
        asesor: "Juan Pérez",
        materia: "Programación",
        modalidad: "Presencial",
        fecha: "15/09/2026",
        horario: "10:00 AM - 11:00 AM",
        estado: "Finalizada",
        descripcion:
            "Asesoría sobre estructuras de datos y algoritmos.",
        material: [
            {
                id: 1,
                nombre: "Material de estructuras de datos",
                url: "#",
            },
        ],
    },
    {
        id: 6,
        asesor: "María López",
        materia: "Bases de Datos",
        modalidad: "Virtual",
        fecha: "12/09/2026",
        horario: "12:00 PM - 1:00 PM",
        estado: "Finalizada",
        descripcion:
            "Repaso de consultas SQL y relaciones entre tablas.",
        material: [
            {
                id: 1,
                nombre: "Ejercicios SQL",
                url: "#",
            },
        ],
    },
];

export default function TarjetaHistorialEstudiante() {

    // La lista es un estado para que los cambios de los modales se vean en la tarjeta
    const [historialEstudiante, setHistorialEstudiante] = useState(HISTORIAL_PRUEBA);

    // Estados para Modales
    const [selectedAsesoria, setSelectedAsesoria] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalMaterialOpen, setModalMaterialOpen] = useState(false);

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

    // Handlers para Abrir Modales
    const handleOpenInfo = (asesoria, event) => {
        clearFocus(event);
        setSelectedAsesoria(asesoria);
        setModalInfoOpen(true);
    };

    const handleOpenMaterial = (asesoria, event) => {
        clearFocus(event);
        setSelectedAsesoria(asesoria);
        setModalMaterialOpen(true);
    };

    // Guardar cambios del modal de información (aquí va tu llamada a la API)
    // El modal ya se encarga de mostrar el toast y de cerrarse.
    const handleGuardarInfo = (asesoriaActualizada) => {
        console.log('Información actualizada:', asesoriaActualizada);
        setHistorialEstudiante((prev) =>
            prev.map((item) =>
                item.id === asesoriaActualizada.id ? { ...item, ...asesoriaActualizada } : item
            )
        );
    };

    // Guardar el material (aquí va tu llamada a la API)
    // El modal ya se encarga de mostrar el toast y de cerrarse.
    // La lista queda en material_adicional y el modal la lee primero al volver a abrirse.
    const handleGuardarMaterial = (listaMateriales) => {
        console.log('Material guardado para la asesoría', selectedAsesoria?.id, listaMateriales);
        setHistorialEstudiante((prev) =>
            prev.map((item) =>
                item.id === selectedAsesoria?.id ? { ...item, material_adicional: listaMateriales } : item
            )
        );
    };

    return (
        <>
            <Box className="flex flex-row flex-wrap gap-7 justify-center">
                {historialEstudiante.map((asesoria) => ( //Este es apra que recorra el arreglo de datos y lso vaya imprimeindo


                    <Card key={asesoria.id}
                        sx={{
                            //Si ocupas moverle a cualquier cosa de tamaño, margen color de la taerjeta es aqui
                            width: '410px',
                            background: '#FFFFFF',
                            borderLeft: '20px solid #08338F',

                            borderRadius: '5px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.20)',

                        }}
                    >
                        <CardContent
                            sx={{
                                padding: '24px 24px 15px 24px'
                            }}
                        >

                            <Box sx={{ marginBottom: '20px' }}>
                                <Typography sx={{ fontSize: '18px', fontWeight: "700", color: '#000000', lineHeight: 1.2 }}>
                                    {asesoria.materia}
                                </Typography>
                            </Box>

                            {/* Información de la asesoría */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',

                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: '#333333'
                                    }}
                                >
                                    <span className="font-bold">
                                        Asesor:
                                    </span>{' '}
                                    {asesoria.asesor}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: '#333333'
                                    }}
                                >
                                    <span className="font-bold">
                                        Materia:
                                    </span>{' '}
                                    {asesoria.materia}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: '#333333'
                                    }}
                                >
                                    <span className="font-bold">
                                        Modalidad:
                                    </span>{' '}
                                    {asesoria.modalidad}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: '#333333'
                                    }}
                                >
                                    <span className="font-bold">
                                        Horario:
                                    </span>{' '}
                                    {asesoria.horario}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: '#333333'
                                    }}
                                >
                                    <span className="font-bold">
                                        Fecha:
                                    </span>{' '}
                                    {asesoria.fecha}
                                </Typography>

                            </Box>

                        </CardContent>

                        {/* Botones */}
                        <CardActions
                            sx={{
                                padding: '0px 24px 20px 24px',
                                justifyContent: 'flex-end',
                                gap: '10px'
                            }}
                        >

                            <Button
                                variant="contained"
                                sx={{
                                    color: '#fff',
                                    borderRadius: '5px',
                                    textTransform: 'none'
                                }}
                                size="small"
                                startIcon={<InfoOutlinedIcon />}
                                onClick={(e) => handleOpenInfo(asesoria, e)}
                            >
                                Informacion
                            </Button>

                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#C49E0D',
                                    color: '#fff',
                                    borderRadius: '5px',
                                    textTransform: 'none'
                                }}
                                size="small"
                                startIcon={<FileDownloadOutlinedIcon />}
                                onClick={(e) => handleOpenMaterial(asesoria, e)}
                            >
                                Material
                            </Button>

                        </CardActions>

                    </Card>

                ))}

            </Box>

            {/* Modales */}
            <ModalInfoHistorialEstudiante
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={selectedAsesoria}
                onSave={handleGuardarInfo}
                showToast={showToast}
            />

            <ModalMaterialHistorialEstudiante
                open={modalMaterialOpen}
                onClose={() => setModalMaterialOpen(false)}
                data={selectedAsesoria}
                onSave={handleGuardarMaterial}
                showToast={showToast}
            />

            {/* Toast Global */}
            <ToastNotification
                open={toast.open}
                onClose={handleCloseToast}
                message={toast.message}
                type={toast.type}
            />
        </>
    );
}
