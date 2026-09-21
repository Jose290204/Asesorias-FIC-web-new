
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#EBDED0',
    ...theme.typography.body2,
    padding: theme.spacing(4,4),
    textAlign: 'center',
    color: '#000',
    borderRadius: '12px',
    height:'100%',
    display:'flex',
    flexDirection: 'column',
    justifyContent:'flex-start',
    boxShadow:'0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.12)',
    },
}));

export default function MisionVision() {
    return (
        <section id="misionVision" className="my-12 sm:my-16 px-4">

            <Box sx={{ flexGrow: 1, maxWidth:'900px', mx:'auto' }}>

                <Grid container spacing={4} justifyContent="center">

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Item elevation={0}>
                            <h2 className="font-extrabold text-2xl sm:text-2xl mb-6 text-gray-900 tracking-tight">Misión</h2>
                            <p className="text-black text-base sm:text-lg leading-relaxed text-justify font-normal">
                                Nuestra misión es proporcionar una plataforma digital que facilite la gestión de asesorías en la Facultad de Informática de Culiacán, promoviendo la interacción efectiva entre estudiantes y asesores y contribuyendo al desarrollo académico de los estudiantes mediante el acceso a recursos de asesoría de calidad.
                            </p>
                        </Item>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Item elevation={0}>
                            <h2 className="font-extrabold text-2xl sm:text-2xl mb-6 text-gray-900 tracking-tight">Visión</h2>

                           <p className="text-black text-base sm:text-lg leading-relaxed text-justify font-normal">
                                Nuestra visión es ser un referente en la implementación de soluciones tecnológicas en el ámbito académico, transformando la manera en que se gestionan las asesorías y mejorando la experiencia educativa de los estudiantes. Buscamos innovar continuamente para adaptarnos a las necesidades cambiantes de la comunidad universitaria.
                            </p>
                        </Item>
                    </Grid>

                </Grid>

            </Box>



        </section>
    )
}