import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

export default function TarjetaHistorialEstudiante() {

    //Datos de prueba - solo cambia estos segun tu tarjeta para pruebas
    const historialEstudiante = [
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
  ];





    return (
        <Box className="flex flex-row flex-wrap gap-7 justify-center">
            {historialEstudiante.map((solicitud) => ( //Este es apra que recorra el arreglo de datos y lso vaya imprimeindo


                <Card key={solicitud.id}
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

                        {/* Información de la asesoría */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px'
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
                                {solicitud.asesor}
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
                                {solicitud.materia}
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
                                {solicitud.modalidad}
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
                                {solicitud.horario}
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
                                {solicitud.fecha}
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
                                backgroundColor: '#2E7D32',
                                color: '#fff',
                                borderRadius: '5px',
                                textTransform: 'none'
                            }}
                            size="small"
                            startIcon={<InfoOutlinedIcon />}
                        >
                            Ver Informacion
                        </Button>

                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#2E7D32',
                                color: '#fff',
                                borderRadius: '5px',
                                textTransform: 'none'
                            }}
                            size="small"
                            startIcon={<ChatOutlinedIcon />}
                        >
                            Material
                        </Button>

                    </CardActions>

                </Card>

            ))}

        </Box>
    );
}