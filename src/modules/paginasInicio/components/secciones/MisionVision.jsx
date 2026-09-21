
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';



const Item = ({ children }) => {
  return (
    <div className="h-full flex  flex-col justify-start p-8 text-center  
     rounded-2xl  bg-[#244391] text-sm font-normal leading-relaxed 
    shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.04)]
      transition-all duration-300 ease-out
        cursor-pointer
      hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(36,67,145,0.5)]
    ">
      {children}
    </div>
  );
};

export default function MisionVision() {
    return (
        <section id="misionVision" className="my-12 sm:my-16 px-4">

            <Box sx={{ flexGrow: 1, maxWidth:'1000px', mx:'auto' }}>

                <Grid container spacing={ 6} justifyContent="center">

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Item elevation={0}>
                            <h2 className="font-extrabold text-2xl sm:text-2xl mb-6 text-white">Misión</h2>
                            <p className="text-white text-base sm:text-lg leading-relaxed text-justify font-normal">
                                Nuestra misión es proporcionar una plataforma digital que facilite la gestión de asesorías en la Facultad de Informática de Culiacán, promoviendo la interacción efectiva entre estudiantes y asesores y contribuyendo al desarrollo académico de los estudiantes mediante el acceso a recursos de asesoría de calidad.
                            </p>
                        </Item>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Item elevation={0}>
                            <h2 className="font-extrabold text-2xl sm:text-2xl mb-6 text-white">Visión</h2>

                           <p className="text-white text-base sm:text-lg leading-relaxed text-justify font-normal">
                                Nuestra visión es ser un referente en la implementación de soluciones tecnológicas en el ámbito académico, transformando la manera en que se gestionan las asesorías y mejorando la experiencia educativa de los estudiantes. Buscamos innovar continuamente para adaptarnos a las necesidades cambiantes de la comunidad universitaria.
                            </p>
                        </Item>
                    </Grid>

                </Grid>

            </Box>



        </section>
    )
}