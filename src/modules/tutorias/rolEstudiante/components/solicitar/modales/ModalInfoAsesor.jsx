import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Seccion from '../../compartidos/SeccionInfo';

// Convierte ["A, B", "C"] o "A / B" en ["A", "B", "C"]
const aLista = (valor) =>
    (Array.isArray(valor) ? valor : [valor])
        .flatMap((v) => String(v ?? '').split(/[,/]/))
        .map((v) => v.trim())
        .filter(Boolean);

// Lista de etiquetas (horarios, modalidades)
function Etiquetas({ items }) {
    if (items.length === 0) return <Typography variant="body2">N/A</Typography>;

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', mt: '4px' }}>
            {items.map((item) => (
                <Chip
                    key={item}
                    label={item}
                    size="small"
                    sx={{ backgroundColor: '#FFFFFF', border: '1px solid #D5DDEE', color: '#333333', fontSize: '0.8125rem' }}
                />
            ))}
        </Box>
    );
}

// ==========================================
// 2. MODAL INFORMACIÓN
// ==========================================
export default function ModalInfoAsesor({ open, onClose, asesor }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    if (!asesor) return null;

    // Lo que trae el objeto del asesor (una línea por materia / horario)
    const materiasAsesor = aLista(asesor.materias);
    const horariosAsesor = aLista(asesor.horarios ?? asesor.horario);
    const modalidadesAsesor = aLista(asesor.modalidad ?? asesor.modalidades);
    const nombre = asesor.asesor || asesor.nombre || '';

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullScreen={esCelular}
            sx={{
                '& .MuiPaper-root': esCelular ? { borderRadius: 0 } : {
                    width: '450px',
                    maxWidth: '90vw',
                    borderRadius: '16px',
                    p: 1.5
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, pr: 7, display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Avatar
                    sx={{
                        backgroundColor: '#EBD9B4',
                        color: '#8A6D2B',
                        width: 52,
                        height: 52,
                        fontSize: '24px',
                        fontWeight: 'bold',
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 0 0 2px #D9C48F',
                        flexShrink: 0
                    }}
                >
                    {nombre ? nombre.charAt(0) : 'A'}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', lineHeight: 1.2, overflowWrap: 'anywhere' }}>
                        {nombre}
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px' }}>Asesor disciplinar</Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Seccion icono={<EmailOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Correo">
                        <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{asesor.email || asesor.correo || 'N/A'}</Typography>
                    </Seccion>

                    <Seccion icono={<MenuBookOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Materias">
                        {materiasAsesor.length === 0 ? (
                            <Typography variant="body2">N/A</Typography>
                        ) : (
                            materiasAsesor.map((materia) => (
                                <Typography key={materia} variant="body2">{materia}</Typography>
                            ))
                        )}
                    </Seccion>

                    <Seccion icono={<AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Horarios disponibles">
                        <Etiquetas items={horariosAsesor} />
                    </Seccion>

                    <Seccion icono={<LaptopOutlinedIcon sx={{ fontSize: 20 }} />} etiqueta="Modalidad">
                        <Etiquetas items={modalidadesAsesor} />
                    </Seccion>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={onClose} sx={{ backgroundColor: '#08338F', '&:hover': { backgroundColor: '#062568' } }}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
