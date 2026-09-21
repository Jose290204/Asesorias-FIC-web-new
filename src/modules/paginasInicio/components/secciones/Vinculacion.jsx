
import { Paper } from "@mui/material";
import Container from "@mui/material/Container";
import adiuas from '../../../../assets/dependencias/adiuas.png';
import biblioteca from '../../../../assets/dependencias/biblioteca.png';
import bienestar from '../../../../assets/dependencias/bienestar.png';
import ccu from '../../../../assets/dependencias/ccu.jpeg';
import ciencias from '../../../../assets/dependencias/ciencias.jpg';
import culturauaslogo from '../../../../assets/dependencias/culturauaslogo.png';
import dgep from '../../../../assets/dependencias/dgep.jpeg';
import dgvri from '../../../../assets/dependencias/dgvri.png';
import direccionartistica from '../../../../assets/dependencias/direccionartistica.png';
import EMPRENDEUAS from '../../../../assets/dependencias/EMPRENDEUAS.png';
import lidatfic from '../../../../assets/dependencias/lidatfic.png';
import logo_dges from '../../../../assets/dependencias/logo_dges.png';
import logo_dsgc from '../../../../assets/dependencias/logo_dsgc.png';
import logo_odontologia from '../../../../assets/dependencias/logo_odontologia.png';
import logo_prodep from '../../../../assets/dependencias/logo_prodep.jpeg';
import logofic from '../../../../assets/dependencias/logofic.png';
import medicina from '../../../../assets/dependencias/medicina.png';
import piefad from '../../../../assets/dependencias/piefad.png';
import psicologia from '../../../../assets/dependencias/psicologia.png';
import radio_uas from '../../../../assets/dependencias/radio_uas.png';
import sau from '../../../../assets/dependencias/sau.png';
import serviciosocial from '../../../../assets/dependencias/serviciosocial.png';


const dependencias = [
    {
        nombre: "FIC",
        img: logofic
    },
    {
        nombre: "LIDATFIC",
        img: lidatfic,
    },
    {
        nombre: "Bienestar Universitario",
        img: bienestar,
    },
    {
        nombre: "Servicio Social",
        img: serviciosocial,
    },
    {
        nombre: "ADUAS",
        img: adiuas,
    },
    {
        nombre: "SAU",
        img: sau,
    },
    {
        nombre: "DGVRI",
        img: dgvri,
    },
    {
        nombre: "PIEFAD",
        img: piefad,
    },
    {
        nombre: "Biblioteca",
        img: biblioteca,
    },
    {
        nombre: "Cultura UAS",
        img: culturauaslogo,
    },
    {
        nombre: "Artistica",
        img: direccionartistica,
    },

    {
        nombre: "psicologia",
        img: psicologia,
    },
    {
        nombre: "Facultad de Medicina",
        img: medicina,
    },
    {
        nombre: "DGEP",
        img: dgep,
    },

    {
        nombre: "SGC",
        img: logo_dsgc,
    },

    {
        nombre: "prodep",
        img: logo_prodep,
    },

    {
        nombre: "RADIO UAS",
        img: radio_uas,
    },

    {
        nombre: "Ciencias",
        img: ciencias,
    },

    {
        nombre: "odontologia",
        img: logo_odontologia
    },

    {
        nombre: "CCU",
        img: ccu,
    },

    {
        nombre: "emprendedores",
        img: EMPRENDEUAS,
    },

    {
        nombre: "DGES",
        img: logo_dges,
    },
]

export default function Vinculacion() {
    return (
        <section id="vinculacion" className="my-12 sm:my-16">

            <Container className="text-center">
               <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl leading-relaxed text-black mb-10">Dependencias Vinculadas</h2>

                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-11 gap-5">

                    {dependencias.map((dependencia) => (
                        <Paper key={dependencia.nombre}
                            elevation={3}
                            className="w-[80px] h-[80px] flex items-center justify-center p-2"
                        >
                            <img src={dependencia.img}
                                alt={dependencia.nombre}
                                className="max-h-full max-w-full object-contain" />
                        </Paper>
                    ))}
                </div>
            </Container>
        </section >
    )
}