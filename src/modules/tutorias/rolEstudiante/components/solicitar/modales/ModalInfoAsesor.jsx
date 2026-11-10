import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import LaptopMacOutlinedIcon from '@mui/icons-material/LaptopMacOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { accionesModal, botonCerrarEncabezado, botonSecundario, contenidoModal, encabezadoModal, paperModal } from '../../../../../../components/ui/estilosModal';

// Convierte ["A, B", "C"] o "A / B" en ["A", "B", "C"]
const aLista = (valor) =>
    (Array.isArray(valor) ? valor : [valor])
        .flatMap((v) => String(v ?? '').split(/[,/]/))
        .map((v) => v.trim())
        .filter(Boolean);

// Sección con ícono, título y las etiquetas (chips) de su lista. Sin datos muestra "N/A"
function Seccion({ icono, titulo, items, estiloChip }) {
    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1, color: '#244B91' }}>
                {icono}
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {titulo}
                </Typography>
            </Box>
            {items.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#6A6A6A' }}>N/A</Typography>
            ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {items.map((item) => (
                        <Chip key={item} label={item} size="small" sx={{ fontWeight: 600, ...estiloChip }} />
                    ))}
                </Box>
            )}
        </Box>
    );
}

// ==========================================
// MODAL INFORMACIÓN DEL ASESOR
// ==========================================
export default function ModalInfoAsesor({ open, onClose, asesor }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    if (!asesor) return null;

    const nombre = asesor.asesor || asesor.nombre || '';
    const materias = aLista(asesor.materias);
    const horarios = aLista(asesor.horarios ?? asesor.horario);
    const modalidades = aLista(asesor.modalidad ?? asesor.modalidades);

    return (
        <Dialog open={Boolean(open)} onClose={onClose} fullScreen={esCelular} sx={paperModal(esCelular, '480px')}>
            <DialogTitle component="div" sx={{ ...encabezadoModal, display: 'flex', alignItems: 'center', gap: 1.75 }}>
                <Avatar sx={{ width: 44, height: 44, bgcolor: '#EBD9B4', color: '#8A6D2B', fontWeight: 'bold', boxShadow: '0 0 0 2px #D4A017' }}>
                    {nombre ? nombre.charAt(0).toUpperCase() : ''}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.25 }}>{nombre}</Typography>
                    <Typography variant="body2" sx={{ color: '#dbe7ff', overflowWrap: 'anywhere' }}>
                        {asesor.email || asesor.correo || 'N/A'}
                    </Typography>
                </Box>
                <IconButton aria-label="close" onClick={onClose} sx={botonCerrarEncabezado}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={contenidoModal}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Seccion
                        icono={<MenuBookOutlinedIcon fontSize="small" />}
                        titulo="Materias"
                        items={materias}
                        estiloChip={{ backgroundColor: '#eef2fb', color: '#244B91' }}
                    />
                    <Seccion
                        icono={<AccessTimeOutlinedIcon fontSize="small" />}
                        titulo="Horarios"
                        items={horarios}
                        estiloChip={{ backgroundColor: '#fbf4dc', color: '#7a5d0f', border: '1px solid #e6cf85' }}
                    />
                    <Seccion
                        icono={<LaptopMacOutlinedIcon fontSize="small" />}
                        titulo="Modalidad"
                        items={modalidades}
                        estiloChip={{ backgroundColor: '#e8f5ec', color: '#1b6b3a' }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={accionesModal}>
                <Button variant="outlined" onClick={onClose} sx={botonSecundario}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
