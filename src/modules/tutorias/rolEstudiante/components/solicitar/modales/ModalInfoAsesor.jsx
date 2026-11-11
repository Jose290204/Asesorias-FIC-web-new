import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

// Convierte ["A, B", "C"] o "A / B" en ["A", "B", "C"]
const aLista = (valor) =>
    (Array.isArray(valor) ? valor : [valor])
        .flatMap((v) => String(v ?? '').split(/[,/]/))
        .map((v) => v.trim())
        .filter(Boolean);

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
    const materias = materiasAsesor.join('\n') || 'N/A';
    const horarios = horariosAsesor.join('\n') || 'N/A';
    const modalidades = modalidadesAsesor.join('\n') || 'N/A';

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullScreen={esCelular}
            sx={{
                '& .MuiPaper-root': esCelular ? { borderRadius: 0 } : {
                    width: '450px',
                    maxWidth: '90vw',
                    borderRadius: '12px',
                    p: 1.5
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.25rem', textAlign: 'center', }}>
                {asesor.asesor || asesor.nombre}
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
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Correo:</Typography>
                        <Typography variant="body2">{asesor.email || asesor.correo || 'N/A'}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Materias:</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{materias}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Horarios:</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{horarios}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Modalidad:</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{modalidades}</Typography>
                    </Box>
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
