import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';



export default function TarjetaAsesoriasEnCurso( { asesorias = [] } ) {

    //mensaje si no aprecen busquedas
    if (asesorias.length === 0) {
        return (
            <Box className="w-full text-center py-10">
                <Typography sx={{ fontSize: '16px', color: '#666666' }}>
                    No se encontraron asesorías que coincidan con la búsqueda.
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="flex flex-row flex-wrap gap-7 justify-center">
            {asesorias.map((asesoria) => ( 
                <Card key={asesoria.id}
                    sx={{
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
                    <CardContent sx={{ padding: '24px 24px 15px' }}>
                        <Box sx={{ marginBottom: '20px' }}>
                            <Typography sx={{ fontSize: '18px', fontWeight: "700", color: '#000000', lineHeight: 1.2 }}>
                                {asesoria.materia}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                <span className="font-bold">Alumno: </span> {asesoria.alumno}
                            </Typography>
                            <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                <span className="font-bold">Inicio: </span> {asesoria.fecha}
                            </Typography>
                            <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                <span className="font-bold">Horario: </span> {asesoria.horario}
                            </Typography>
                            <Typography sx={{ fontSize: '15px', color: '#333333' }}>
                                <span className="font-bold">Modalidad: </span> {asesoria.modalidad}
                            </Typography>
                        </Box>
                    </CardContent>

                    <CardActions
                        sx={{
                            padding: '0px 24px 20px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '10px',
                                width: '100%'
                            }}
                        >
                            <Button variant="contained" sx={{ borderRadius: '5px', textTransform: 'none' }} size="small" startIcon={<InfoOutlinedIcon />}>
                                Informacion
                            </Button>
                            <Button variant="contained" sx={{ backgroundColor: '#2E7D32', color: '#ffffff', borderRadius: '5px', textTransform: 'none' }} size="small" startIcon={<CheckOutlinedIcon />}>
                                Completar
                            </Button>
                            <Button variant="contained" sx={{ borderRadius: '5px', textTransform: 'none', background:'#C49E0D' }} size="small" startIcon={<FileDownloadOutlinedIcon />}>
                                Material
                            </Button>
                            <Button variant="contained" sx={{ backgroundColor: '#C42525', color: '#ffffff', borderRadius: '5px', textTransform: 'none' }} size="small" startIcon={<DeleteOutlineOutlinedIcon />}>
                                Eliminar
                            </Button>
                        </Box>
                    </CardActions>
                </Card>
            ))}
        </Box>
    );
}
