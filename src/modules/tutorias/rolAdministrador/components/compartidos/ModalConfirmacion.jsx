import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';

import { PAPER_CONFIRMACION } from '../../../rolAsesor/components/compartidos/estilosModales';
import EncabezadoModal from './EncabezadoModal';
import { ESTILO_BOTON_AZUL, ESTILO_BOTON_SECUNDARIO, ESTILO_BOTON_VERDE } from './estilosAdmin';

// Modal de confirmación con el diseño nuevo (Aprobar, Eliminar, Quitar, Cerrar sesión...).
// tono: 'rojo' (acción que no se deshace), 'verde' (aprobar) o 'azul'. children = el texto de la pregunta.
export default function ModalConfirmacion({
    open,
    onClose,
    onConfirm,
    icono,
    titulo,
    subtitulo = 'Confirmación',
    tono = 'azul',
    textoConfirmar = 'Aceptar',
    textoCancelar = 'Cancelar',
    deshabilitado = false,
    children
}) {
    const botonConfirmar =
        tono === 'rojo'
            ? { color: 'error', sx: { borderRadius: '8px', textTransform: 'none', fontWeight: 700 } }
            : { sx: tono === 'verde' ? ESTILO_BOTON_VERDE : ESTILO_BOTON_AZUL };

    return (
        <Dialog open={Boolean(open)} onClose={onClose} disableAutoFocus disableEnforceFocus sx={PAPER_CONFIRMACION}>
            <EncabezadoModal icono={icono} titulo={titulo} subtitulo={subtitulo} tono={tono} />

            <DialogContent dividers sx={{ py: 3, overflowWrap: 'anywhere' }}>
                {children}
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose} sx={ESTILO_BOTON_SECUNDARIO}>
                    {textoCancelar}
                </Button>
                <Button variant="contained" onClick={onConfirm} disabled={deshabilitado} {...botonConfirmar}>
                    {textoConfirmar}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
