
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function TarjetaSolicitarAsesoria({ asesor }) {
    return (
        <Box className="flex flex-row flex-wrap gap-7 justify-center">
        <Card
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
            <CardContent
                sx={{
                    padding: '24px 24px 10px 24px',
                }}
            >
                {/* Nombre asesor */}
                <Typography
                    sx={{
                         display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            mb: '5px'
                    }}
                >
                    {asesor.nombre}
                </Typography>

                {/* Materias */}
                <Typography
                    sx={{
                        fontSize: '15px',
                                color: '#333333'
                    }}
                >
                    <span className="font-bold">
                        Materias:
                    </span>{" "}
                    {asesor.materias.join(", ")}
                </Typography>

                {/* Modalidad */}
                <Typography
                    sx={{
                         fontSize: '15px',
                                color: '#333333'
                    }}
                >
                    <span className="font-bold">
                        Modalidad:
                    </span>{" "}
                    {asesor.modalidad}
                </Typography>
            </CardContent>

{/* ================== BOTONES ====================== */}
            {/* ver Info */}
            <CardActions
                sx={{
                      padding: '0px 24px 20px 24px',
                        justifyContent: 'flex-end',
                        gap: '10px'
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.5fr',
                        gap: '10px',
                        width: '100%',
                    }}
                >
                    {/* VER INFORMACIÓN */}
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
                                backgroundColor: '#C49E0D'
                            }
                        }}
                    >
                        Ver Info
                    </Button>

                    {/* SOLICITAR ASESORÍA */}
                    <Button
                         variant="contained"
                        size="small"
                        startIcon={<SendOutlinedIcon />}
                        sx={{
                            backgroundColor: '#2E7D32',
                            color: '#FFFFFF',
                            borderRadius: '5px',
                            textTransform: 'none',
                            fontWeight: '600',

                            '&:hover': {
                                backgroundColor: '#256628'
                            }
                        }}
                    >
                        Solicitar Asesoría
                    </Button>
                </Box>
            </CardActions>
        </Card>
        </Box>
    );
}