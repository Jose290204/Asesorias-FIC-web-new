import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

export default function TarjetaHistorialAsesorias() {

    //Datos de prueba - solo cambia estos segun tu tarjeta para pruebas
    const solicitudesPendientes = [
        { id: 12, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
        { id: 13, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
        { id: 14, alumno: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
        { id: 15, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
        { id: 16, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
        { id: 17, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
        { id: 18, alumno: "Alexander Israel Barrera Rodrigez", email: "ai.barrera@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
        { id: 19, alumno: "Luis Fernando Vlelazquez Araujo", email: "lf.velazquez@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
        { id: 20, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" },
        { id: 21, alumno: "Jenifer Guadalupe Tizoc Lopez", email: "jg.tizoc@info.uas.edu.mx", materia: "Introducción a la programación", fecha: "05/03/2004", modalidad: "Presencial" }
    ];



    return (
        <Box className="flex flex-row flex-wrap gap-7 justify-center">
            {solicitudesPendientes.map((solicitud) => ( //Este es apra que recorra el arreglo de datos y lso vaya imprimeindo


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
                    <CardContent sx={{ padding: '24px 24px 15px 24px' }}> {/* La informacion de la tarjeta */}

                        {/* Contenedor principal de la img, nombre del alumno y email de alumno */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', mb: 3 }}>

                            <Avatar
                                sx={{
                                    //Estilos de la foto de usuario
                                    backgroundColor: '#EBD9B4',
                                    color: '#8A6D2B',
                                    width: 50,
                                    height: 50,
                                    fontSize: '24px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {solicitud.alumno.charAt(0)}
                            </Avatar>

                            {/* contenedor para separar nombre y email */}
                            <Box>

                                <Typography sx={{ fontSize: '16px', fontWeight: "700", color: '#000000', lineHeight: 1.2 }}>
                                    {solicitud.alumno}
                                </Typography>
                                <Typography sx={{ fontSize: '13px', color: '6A6A6A' }}>
                                    {solicitud.email}
                                </Typography>

                            </Box>


                        </Box>


                        {/* Contenedor principal de los datos */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

                            <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                <span className="font-bold">Materia: </span> {solicitud.materia}
                            </Typography>
                            <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                <span className="font-bold">Fecha: </span> {solicitud.fecha}
                            </Typography>

                        </Box>

                    </CardContent>

                    {/* Donde se ponen los botones que se ocupen, se pueden quitar o agregar mas */}
                    <CardActions
                        sx={{
                            //Para poner los botones a un lado
                            padding: '0px 24px 20px 24px',
                            justifyContent: 'flex-end',
                            gap: '10px'
                        }}
                    >
                        <Button variant="contained" sx={{ color: '#ffffff', borderRadius: '5px', textTransform: 'none' }} size="small" startIcon={<InfoOutlinedIcon />}>
                            Informacion
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: '#C49E0D', color: '#ffffff', borderRadius: '5px', textTransform: 'none' }} size="small" startIcon={<ChatOutlinedIcon />}>
                            Chat
                        </Button>
                    </CardActions>
                </Card>
            )

            )}
        </Box>
    );
}