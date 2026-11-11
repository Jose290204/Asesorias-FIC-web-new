import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

// Colores de la disponibilidad: verde cuando ya la armó y ámbar cuando falta
const COLOR_LISTA = '#1B5E20';
const COLOR_VACIA = '#8A5A00';

// Línea con ícono, etiqueta en negritas y valor (Correo:, Teléfono:, Número de cuenta:...). Si no hay valor, no se muestra.
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

// Versión móvil de una fila de la tabla de asesores (disciplinares y par).
// Mismo diseño que las demás tarjetas del admin: borde azul, datos con su etiqueta y un menú ⋮ con las acciones.
// Solo muestra; las acciones las maneja quien la usa (TablaAsesores).
// onEditar es opcional: los asesores par no se editan aquí (sus datos personales se editan en Estudiantes).
export default function TarjetaAsesor({ row, onInfo, onEditar, onBaja, textoBaja = 'Dar de baja', etiquetaId = 'Asesor' }) {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const cerrarMenu = () => setMenuAnchor(null);

    // Cierra el menú y ejecuta la acción que corresponda
    const handleAccion = (accion) => (event) => {
        cerrarMenu();
        accion(row, event);
    };

    const sinDisponibilidad = row.disponibilidad.vacia;
    const colorDisponibilidad = sinDisponibilidad ? COLOR_VACIA : COLOR_LISTA;

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
            <CardContent sx={{ padding: '24px 24px 20px' }}>
                <Box sx={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
                        <PersonOutlinedIcon sx={{ fontSize: 24, color: '#08338F', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', minWidth: 0 }}>
                            {row.nombre}
                        </Typography>
                    </Box>

                    {/* Un solo botón ⋮ con todas las acciones */}
                    <IconButton
                        aria-label="Más acciones"
                        aria-haspopup="true"
                        onClick={(e) => setMenuAnchor(e.currentTarget)}
                        sx={{ flexShrink: 0, mr: '-12px', mt: '-10px', color: '#555555' }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <LineaDato icono={<MailOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Correo">{row.correo}</LineaDato>
                    <LineaDato icono={<PhoneOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Teléfono">{row.telefono}</LineaDato>
                    <LineaDato icono={<BadgeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Cuenta">{row.numeroCuenta}</LineaDato>
                    <LineaDato
                        icono={<FiberManualRecordIcon sx={{ fontSize: 20, color: colorDisponibilidad }} />}
                        etiqueta="Disponibilidad"
                    >
                        <span className="font-semibold" style={{ color: colorDisponibilidad }}>
                            {sinDisponibilidad ? 'Sin disponibilidad' : 'Lista'}
                        </span>
                    </LineaDato>
                    <LineaDato icono={<TagOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta={etiquetaId}>{`#${row.id}`}</LineaDato>
                </Box>
            </CardContent>

            {/* Menú ⋮ de esta tarjeta */}
            <Menu
                disableScrollLock
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={cerrarMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleAccion(onInfo)} sx={{ minHeight: 44 }}>
                    <ListItemIcon><InfoOutlinedIcon fontSize="small" sx={{ color: '#08338F' }} /></ListItemIcon>
                    Información
                </MenuItem>
                {onEditar && (
                    <MenuItem onClick={handleAccion(onEditar)} sx={{ minHeight: 44 }}>
                        <ListItemIcon><EditOutlinedIcon fontSize="small" sx={{ color: '#08338F' }} /></ListItemIcon>
                        Editar
                    </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleAccion(onBaja)} sx={{ minHeight: 44, color: '#C42525' }}>
                    <ListItemIcon><DeleteOutlinedIcon fontSize="small" sx={{ color: '#C42525' }} /></ListItemIcon>
                    {textoBaja}
                </MenuItem>
            </Menu>
        </Card>
    );
}
