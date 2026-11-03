// rolAdministrador/components/reportes/ModalDetalleAsesorias.jsx
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery } from '@mui/material';
import TablaReporte from './TablaReporte';

/**
 * Ventana con el detalle de las asesorías de una materia o de un grupo.
 * Props: open, onClose, titulo, subtitulo, columnas, rows
 */
export default function ModalDetalleAsesorias({ open, onClose, titulo, subtitulo, columnas = [], rows = [] }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullScreen={esCelular}
            disableRestoreFocus
            sx={{
                '& .MuiPaper-root': esCelular
                    ? { borderRadius: 0 }
                    : { width: '1100px', maxWidth: '95vw', maxHeight: '90dvh', borderRadius: '12px' }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, pr: 7, fontWeight: 'bold', fontSize: '1.2rem' }}>
                {titulo}
                {subtitulo && (
                    <Typography component="span" sx={{ display: 'block', fontSize: '0.85rem', fontWeight: 400, color: 'text.secondary' }}>
                        {subtitulo}
                    </Typography>
                )}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: '#F4F7FC' }}>
                <TablaReporte
                    columnas={columnas}
                    rows={rows}
                    ordenInicial={{ campo: 'fechaTexto', direccion: 'desc' }}
                    anchoMinimo={1000}
                    textoVacio="No hay asesorías"
                />
            </DialogContent>
        </Dialog>
    );
}