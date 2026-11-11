import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { estaEnLinea, textoHace } from './tiempo';

// Línea con ícono, etiqueta en negritas y valor (Correo:, Rol:, Dispositivo:...). Si no hay valor, no se muestra.
function LineaDato({ icono, etiqueta, children }) {
    if (!children) return null;

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Box sx={{ display: 'flex', color: '#08338F', mt: '1px', flexShrink: 0 }}>{icono}</Box>
            <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere', minWidth: 0 }}>
                <span className="font-bold">{etiqueta}: </span>
                {children}
            </Typography>
        </Box>
    );
}

// Versión móvil de una fila de la tabla de usuarios en línea.
// Mismo diseño que las demás tarjetas del admin: datos con su etiqueta y el botón de cerrar sesión abajo.
// Solo muestra; la acción de cerrar sesión la maneja quien la usa (TablaUsuariosEnLinea).
export default function TarjetaUsuarioEnLinea({ row, onCerrarSesion }) {
    const enLinea = estaEnLinea(row.ultimaActividad);
    const IconoDispositivo = row.tipo === 'web' ? ComputerOutlinedIcon : PhoneIphoneOutlinedIcon;
    const colorEstado = enLinea ? '#1B5E20' : '#8A5A00';

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
                <Box sx={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <PersonOutlinedIcon sx={{ fontSize: 24, color: '#08338F', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0 }}>
                        {row.nombre}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <LineaDato icono={<MailOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Correo">{row.correo}</LineaDato>
                    <LineaDato icono={<ShieldOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Rol">{row.rol}</LineaDato>
                    <LineaDato icono={<IconoDispositivo sx={{ fontSize: 20 }} />} etiqueta="Dispositivo">{row.dispositivo}</LineaDato>
                    <LineaDato icono={<AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Última actividad">
                        {textoHace(row.ultimaActividad)}
                    </LineaDato>
                    <LineaDato
                        icono={<FiberManualRecordIcon sx={{ fontSize: 20, color: colorEstado }} />}
                        etiqueta="Estado"
                    >
                        <span className="font-semibold" style={{ color: colorEstado }}>
                            {enLinea ? 'En línea' : 'Ausente'}
                        </span>
                    </LineaDato>
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