// rolAdministrador/components/reportes/ModalDetalleAsesorias.jsx
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import { Button, Dialog, DialogActions, DialogContent, useMediaQuery } from '@mui/material';

import EncabezadoModal from '../compartidos/EncabezadoModal';
import { ESTILO_BOTON_CERRAR, PAPER_MODAL_CELULAR } from '../compartidos/estilosAdmin';
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
            sx={
                esCelular
                    ? PAPER_MODAL_CELULAR
                    : { '& .MuiPaper-root': { width: '1100px', maxWidth: '95vw', maxHeight: '90dvh', borderRadius: '16px' } }
            }
        >
            <EncabezadoModal icono={<EventNoteOutlinedIcon />} titulo={titulo} subtitulo={subtitulo} onClose={onClose} />

            <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2 }, backgroundColor: '#F4F7FC' }}>
                <TablaReporte
                    columnas={columnas}
                    rows={rows}
                    ordenInicial={{ campo: 'fechaTexto', direccion: 'desc' }}
                    anchoMinimo={1000}
                    textoVacio="No hay asesorías"
                />
            </DialogContent>

            <DialogActions sx={{ p: 2, pb: esCelular ? 'calc(16px + env(safe-area-inset-bottom))' : 2 }}>
                <Button variant="contained" onClick={onClose} sx={{ ...ESTILO_BOTON_CERRAR, textTransform: 'none', borderRadius: '8px', minHeight: 40 }}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
