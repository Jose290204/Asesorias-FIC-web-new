import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export default function TarjetaSolicitudesEnRevision() {

    //Datos de prueba - solo cambia estos segun tu tarjeta para pruebas
    const solicitudesEnRevision = [
        { id: 30, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial",  estado: "EN REVISION" },
        { id: 31, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial",  estado: "EN REVISION" },
        { id: 32, alumno: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial",  estado: "EN REVISION" },
        { id: 33, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial",  estado: "RECHAZADA" },
        { id: 34, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" ,  estado: "EN REVISION"},
        { id: 35, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" ,  estado: "EN REVISION"},
        { id: 36, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial",  estado: "RECHAZADA" },
        { id: 37, alumno: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial",  estado: "RECHAZADA" },
        { id: 38, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" ,  estado: "EN REVISION"},
        { id: 39, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" , estado: "RECHAZADA"}
    ];



    return (
        <Box className="flex flex-row flex-wrap gap-7 justify-center">
            {solicitudesEnRevision.map((solicitud) => ( //Este es apra que recorra el arreglo de datos y lso vaya imprimeindo


                <Card key={solicitud.id}
                    sx={{
                        //Si ocupas moverle a cualquier cosa de tamaño, margen color de la taerjeta es aqui
                        width: '400px',
                        background: '#FFFFFF',
                        borderLeft: '20px solid #08338F',

                        borderRadius: '5px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.20)',

                    }}
                >
                    <CardContent sx={{ padding: '24px 24px 10px 24px' }}> {/* La informacion de la tarjeta */}

                        {/* Contenedor principal de la img, nombre del alumno y email de alumno */}
                        

                           {/* ALUMNO */}
                        <Box
                            sx={{
                                display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            mb: '5px'
                            }}
                        >

                          {/*   <Avatar
                                sx={{
                                    backgroundColor: '#EBD9B4',
                                    color: '#8A6D2B',

                                    width: 63,
                                    height: 63,

                                    fontSize: '30px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {solicitud.alumno.charAt(0)}
                            </Avatar> */}


                            <Box>

                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        color: '#000000',
                                        lineHeight: 1.2
                                    }}
                                >
                                    {solicitud.alumno}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: '#333333',
                                        marginTop: '3px'
                                    }}
                                >
                                    {solicitud.email}
                                </Typography>

                            </Box>

                        </Box>


                        {/* DATOS */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    color: '#222222'
                                }}
                            >
                                <span className="font-bold">
                                    Materia:
                                </span>{' '}
                                {solicitud.materia}
                            </Typography>


                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    color: '#222222'
                                }}
                            >
                                <span className="font-bold">
                                    Fecha:
                                </span>{' '}
                                {solicitud.fecha}
                            </Typography>


                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    color: '#222222'
                                }}
                            >
                                <span className="font-bold">
                                    Modalidad:
                                </span>{' '}
                                {solicitud.modalidad}
                            </Typography>

                        </Box>

                    </CardContent>

                    {/* botones */}
                     <CardActions
                        sx={{
                            padding: '0px 30px 24px 30px',
                            justifyContent: 'flex-end',
                            gap: '18px'
                        }}
                    >

                        {/* ver informacion */}
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<InfoOutlinedIcon />}
                            sx={{
                                backgroundColor: '#E0B400',
                            color: '#FFFFFF',
                            borderRadius: '5px',
                            textTransform: 'none',
                            fontWeight: '600',

                                '&:hover': {
                                    backgroundColor: '#C9A000'
                                }
                            }}
                        >
                            Ver Info
                        </Button>


                        {/* editar */}
                        {solicitud.estado === "EN REVISION" && (

                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<EditOutlinedIcon />}
                                sx={{
                                    backgroundColor: '#43B45C',
                                    color: '#FFFFFF',

                                    borderRadius: '5px',
                                    textTransform: 'none',

                                    fontSize: '16px',
                                    padding: '7px 20px',

                                    '&:hover': {
                                        backgroundColor: '#369A4C'
                                    }
                                }}
                            >
                                Editar
                            </Button>

                        )}


                        {/* notas rechazadas */}
                        {solicitud.estado === "RECHAZADA" && (

                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<NotesOutlinedIcon />}
                                sx={{
                                    backgroundColor: '#F44336',
                                    color: '#FFFFFF',

                                     borderRadius: '5px',
                            textTransform: 'none',
                            fontWeight: '600',

                                    '&:hover': {
                                        backgroundColor: '#256628'
                                    }
                                }}
                            >
                                Notas del asesor
                            </Button>

                        )}

                    </CardActions>

                </Card>

            ))}

        </Box>
    );
}