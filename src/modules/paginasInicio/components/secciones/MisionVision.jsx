
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: 'center',
    color: '#000',
}));

export default function MisionVision() {
    return (
        <section id="misionVision" className="py-15 px-15">

            <Box sx={{ flexGrow: 1 }}>

                <Grid container spacing={4} className="rounded-xl">

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Item elevation={3} sx={{backgroundColor:"E8D6A8", minHeight:"250px "}}>
                        <h2 className="font-bold text-xl mb-6">Misión</h2>
                        <p className="text-black sm:text-lg leading-relaxed text-justify">
                           Nuestra misión es proporcionar una plataforma digital que facilite la gestión de asesorías en la Facultad de Informática de Culiacán, promoviendo la interacción efectiva entre estudiantes y asesores y contribuyendo al desarrollo académico de los estudiantes mediante el acceso a recursos de asesoría de calidad.
                        </p>
                        </Item>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Item elevation={3} sx={{backgroundColor:"E8D6A8", minHeight:"250px"}}>
                        <h2 className="font-bold text-xl mb-6">Visión</h2>

                        <p className="text-black sm:text-lg leading-relaxed text-justify">
                            Nuestra visión es ser un referente en la implementación de soluciones tecnológicas en el ámbito académico, transformando la manera en que se gestionan las asesorías y mejorando la experiencia educativa de los estudiantes. Buscamos innovar continuamente para adaptarnos a las necesidades cambiantes de la comunidad universitaria.
                        </p>
                        </Item>
                    </Grid>

                </Grid>

            </Box>



        </section>
    )
}