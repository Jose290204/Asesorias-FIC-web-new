import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    useMediaQuery
} from '@mui/material';

import { formatearFechaVisible } from '../../../../rolEstudiante/utils/fechaSolicitud';

/**
 * Detalle de una solicitud (solo lectura).
 *
 * Props:
 *  - open, onClose
 *  - data: fila de la solicitud
 *  - onAprobar, onRechazar: (opcionales) si se pasan, el pie muestra esos botones solo en tablet y escritorio;
 *    en celular se ocultan para evitar toques accidentales (se decide desde la tarjeta)
 */
export default function ModalInfoSolicitud({ open, onClose, data, onAprobar, onRechazar }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    // La fecha puede venir en "fecha_inicio" (datos de prueba) o dentro de "raw" (servicio)
    const fecha = data?.fecha_inicio ?? data?.raw?.fecha ?? data?.fecha;

    // Cada campo: [etiqueta, valor]. Los que no tienen valor no se muestran.
    const campos = [
        ['Estudiante', data?.estudiante],
        ['Licenciatura', data?.licenciatura],
        ['Grado y grupo', data?.gradoGrupo],
        ['Asesor solicitado', data?.asesor],
        ['Materia', data?.materia],
        ['Fecha solicitada', fecha ? formatearFechaVisible(fecha) : ''],
        ['Horario', data?.horario],
        ['Modalidad', data?.modalidad],
        ['Razón de asesoría', data?.razonAsesoria]
    ].filter(([, valor]) => Boolean(valor));

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullScreen={esCelular}
            sx={{
                '& .MuiPaper-root': esCelular
                    ? { borderRadius: 0 }
                    : {
                        width: '550px',
                        maxWidth: '90vw',
                        maxHeight: '90dvh',
                        borderRadius: '12px',
                        p: 1.5
                    }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, pr: 7, fontWeight: 'bold', fontSize: '1.2rem' }}>
                Información de la solicitud
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
                    {campos.map(([etiqueta, valor]) => (
                        <TextField
                            key={etiqueta}
                            label={etiqueta}
                            size="small"
                            fullWidth
                            value={valor}
                            slotProps={{ input: { readOnly: true }, inputLabel: { shrink: true } }}
                        />
                    ))}

                    {data?.observaciones && (
                        <TextField
                            label="Observaciones del estudiante"
                            size="small"
                            fullWidth
                            multiline
                            minRows={2}
                            value={data.observaciones}
                            slotProps={{ input: { readOnly: true }, inputLabel: { shrink: true } }}
                        />
                    )}
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2,
                    pt: 1.5,
                    gap: 1,
                    flexWrap: 'wrap',
                    pb: esCelular ? 'calc(16px + env(safe-area-inset-bottom))' : 2,
                    '& > button': { flex: esCelular ? 1 : 'none', minHeight: 40 }
                }}
            >
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cerrar
                </Button>

                {/* En celular solo queda "Cerrar": aprobar o rechazar se hace desde la tarjeta */}
                {onRechazar && !esCelular && (
                    <Button variant="outlined" color="error" onClick={() => onRechazar(data)}>
                        Rechazar
                    </Button>
                )}

                {onAprobar && !esCelular && (
                    <Button variant="contained" color="success" onClick={() => onAprobar(data)}>
                        Aprobar
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}