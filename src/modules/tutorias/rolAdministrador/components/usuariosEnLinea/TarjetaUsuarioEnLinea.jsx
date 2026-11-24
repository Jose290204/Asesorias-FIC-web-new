import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import Button from '@mui/material/Button';

import { ESTILO_BOTON_SECUNDARIO, ICONO } from '../compartidos/estilosAdmin';
import TarjetaAdmin from '../compartidos/TarjetaAdmin';
import { estaEnLinea, textoHace } from './tiempo';

const EN_LINEA = { label: 'En línea', color: '#2E7D32', fondo: '#E8F5E9' };
const AUSENTE = { label: 'Ausente', color: '#B26A00', fondo: '#FFF4D6' };

// Versión móvil de una fila de la tabla de usuarios en línea: lo esencial y el botón de cerrar sesión.
// Solo muestra; la acción de cerrar sesión la maneja quien la usa (TablaUsuariosEnLinea).
export default function TarjetaUsuarioEnLinea({ row, onCerrarSesion }) {
    const estatus = estaEnLinea(row.ultimaActividad) ? EN_LINEA : AUSENTE;
    const IconoDispositivo = row.tipo === 'web' ? ComputerOutlinedIcon : PhoneIphoneOutlinedIcon;

    return (
        <TarjetaAdmin
            franja={estatus.color}
            titulo={row.nombre}
            pastilla={estatus}
            lineas={[
                { icono: <MailOutlinedIcon sx={ICONO} />, etiqueta: 'Correo', valor: row.correo },
                { icono: <ShieldOutlinedIcon sx={ICONO} />, etiqueta: 'Rol', valor: row.rol },
                { icono: <IconoDispositivo sx={ICONO} />, etiqueta: 'Dispositivo', valor: row.dispositivo },
                { icono: <AccessTimeOutlinedIcon sx={ICONO} />, etiqueta: 'Última actividad', valor: textoHace(row.ultimaActividad) }
            ]}
            acciones={
                <Button
                    variant="outlined"
                    color="error"
                    disabled={row.esActual}
                    sx={{ ...ESTILO_BOTON_SECUNDARIO, minHeight: 40, gridColumn: '1 / -1' }}
                    startIcon={<LogoutOutlinedIcon />}
                    onClick={(e) => onCerrarSesion(row, e)}
                >
                    {row.esActual ? 'Tu sesión actual' : 'Cerrar sesión'}
                </Button>
            }
        />
    );
}
