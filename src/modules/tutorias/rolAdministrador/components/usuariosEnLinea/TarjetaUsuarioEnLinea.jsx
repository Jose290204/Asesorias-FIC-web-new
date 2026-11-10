import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { estaEnLinea, textoHace } from './tiempo';

// Línea con ícono y texto
function LineaDato({ icono, texto }) {
    if (!texto) return null;

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Box sx={{ display: 'flex', color: '#08338F', mt: '1px', flexShrink: 0 }}>{icono}</Box>
            <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere', minWidth: 0 }}>
                {texto}
            </Typography>
        </Box>
    );
}

// Versión móvil de una fila de la tabla de usuarios en línea.
// Solo muestra; la acción de cerrar sesión la maneja quien la usa (TablaUsuariosEnLinea).
export default function TarjetaUsuarioEnLinea({ row, onCerrarSesion }) {
    const enLinea = estaEnLinea(row.ultimaActividad);
    const IconoDispositivo = row.dispositivo === 'Web' ? ComputerOutlinedIcon : PhoneIphoneOutlinedIcon;

    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: '400px',
                background: '#FFFFFF',
                borderLeft: '20px solid #08338F',
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.20)'
            }}
        >
            <CardContent sx={{ padding: '24px 24px 15px' }}>
                <Typography sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', marginBottom: '16px' }}>
                    {row.nombre}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <LineaDato icono={<MailOutlinedIcon sx={{ fontSize: 20 }} />} texto={row.correo} />
                    <LineaDato icono={<IconoDispositivo sx={{ fontSize: 20 }} />} texto={row.dispositivo} />
                    <LineaDato icono={<AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />} texto={`Última actividad: ${textoHace(row.ultimaActividad)}`} />

                    {/* Chips: estado de conexión y rol */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mt: '4px' }}>
                        <Chip
                            size="small"
                            label={enLinea ? 'EN LÍNEA' : 'AUSENTE'}
                            sx={{
                                fontWeight: 600,
                                ...(enLinea
                                    ? { backgroundColor: '#E6F4EA', color: '#1B5E20' }
                                    : { backgroundColor: '#FFF4E5', color: '#8A5A00' })
                            }}
                        />
                        <Chip
                            size="small"
                            variant="outlined"
                            label={row.rol}
                            sx={{ borderColor: '#BDBDBD', color: '#555555', fontWeight: 600 }}
                        />
                    </Box>
                </Box>
            </CardContent>

            <CardActions sx={{ padding: '0px 24px 20px 24px' }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    disabled={row.esActual}
                    sx={{ minHeight: 40, color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                    startIcon={<LogoutOutlinedIcon />}
                    onClick={(e) => onCerrarSesion(row, e)}
                >
                    {row.esActual ? 'Tu sesión actual' : 'Cerrar sesión'}
                </Button>
            </CardActions>
        </Card>
    );
}