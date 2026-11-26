import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

import { ESTILO_BOTON_AZUL, ICONO } from '../compartidos/estilosAdmin';
import TarjetaAdmin from '../compartidos/TarjetaAdmin';

// Estatus de la disponibilidad: verde cuando ya la armó y ámbar cuando falta
const LISTA = { label: 'Disponibilidad lista', color: '#2E7D32', fondo: '#E8F5E9' };
const PENDIENTE = { label: 'Sin disponibilidad', color: '#B26A00', fondo: '#FFF4D6' };

// Versión móvil de una fila de la tabla de asesores (disciplinares y par): solo lo esencial.
// "Disponibilidad" queda a la vista; Información, Editar y Dar de baja van en el menú ⋮ de arriba.
// El teléfono y el resto de los datos están en el modal de información.
// Solo muestra; las acciones las maneja quien la usa (TablaAsesores).
// onEditar es opcional: los asesores par no se editan aquí (sus datos personales se editan en Estudiantes).
// onDisponibilidad es opcional: si no se pasa, no se muestra el botón.
export default function TarjetaAsesor({ row, onInfo, onEditar, onBaja, onDisponibilidad, textoBaja = 'Dar de baja' }) {
    const estatus = row.disponibilidad.vacia ? PENDIENTE : LISTA;

    const [menuAnchor, setMenuAnchor] = useState(null);
    const cerrarMenu = () => setMenuAnchor(null);
    const elegir = (accion) => (e) => {
        cerrarMenu();
        accion(row, e);
    };

    const menu = (
        <>
            <IconButton
                size="small"
                aria-label="Más acciones"
                aria-haspopup="true"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{ flexShrink: 0, mr: '-8px', mt: '-4px', color: '#08338F' }}
            >
                <MoreVertIcon />
            </IconButton>

            <Menu
                disableScrollLock
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={cerrarMenu}
                slotProps={{ paper: { sx: { borderRadius: '12px', boxShadow: '0px 8px 24px rgba(8, 51, 143, 0.18)' } } }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={elegir(onInfo)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><InfoOutlinedIcon fontSize="small" sx={{ color: '#08338F' }} /></ListItemIcon>
                    Información
                </MenuItem>
                {onEditar && (
                    <MenuItem onClick={elegir(onEditar)} sx={{ minHeight: 44 }}>
                        <ListItemIcon><EditOutlinedIcon fontSize="small" sx={{ color: '#8A6D2B' }} /></ListItemIcon>
                        Editar
                    </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={elegir(onBaja)} sx={{ minHeight: 44, color: '#C62828' }}>
                    <ListItemIcon><DeleteOutlineOutlinedIcon fontSize="small" sx={{ color: '#C62828' }} /></ListItemIcon>
                    {textoBaja}
                </MenuItem>
            </Menu>
        </>
    );

    return (
        <TarjetaAdmin
            franja={estatus.color}
            titulo={row.nombre}
            pastilla={estatus}
            encabezadoDerecha={menu}
            lineas={[
                { icono: <MailOutlinedIcon sx={ICONO} />, etiqueta: 'Correo', valor: row.correo },
                { icono: <BadgeOutlinedIcon sx={ICONO} />, etiqueta: 'Cuenta', valor: row.numeroCuenta }
            ]}
            acciones={
                onDisponibilidad && (
                    <Button
                        variant="contained"
                        sx={{ ...ESTILO_BOTON_AZUL, minHeight: 40, gridColumn: '1 / -1' }}
                        startIcon={<EventAvailableOutlinedIcon />}
                        onClick={(e) => onDisponibilidad(row, e)}
                    >
                        Disponibilidad
                    </Button>
                )
            }
        />
    );
}
