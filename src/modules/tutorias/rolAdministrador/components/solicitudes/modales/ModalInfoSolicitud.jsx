import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, Typography, useMediaQuery } from '@mui/material';

import { formatearFechaVisible } from '../../../../rolEstudiante/utils/fechaSolicitud';
import SeccionInfo from '../../../../rolEstudiante/components/compartidos/SeccionInfo';
import EncabezadoModal from '../../compartidos/EncabezadoModal';
import { ESTILO_BOTON_CERRAR, ESTILO_BOTON_VERDE, ICONO, PAPER_MODAL_CELULAR, paperModal } from '../../compartidos/estilosAdmin';
import { COLOR_ESTATUS, ETIQUETA_ESTATUS } from '../estatusSolicitud';

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

    const fecha = data?.fecha_inicio;
    const color = COLOR_ESTATUS[data?.estatus]?.texto ?? '#5F6368';
    const texto = (valor) => (
        <Typography variant="body2" sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{valor}</Typography>
    );

    const licenciaturaGrupo = [data?.licenciatura, data?.gradoGrupo].filter(Boolean).join(' · ');

    return (
        <Dialog open={Boolean(open)} onClose={onClose} fullScreen={esCelular} sx={esCelular ? PAPER_MODAL_CELULAR : paperModal(520)}>
            <EncabezadoModal
                icono={<InfoOutlinedIcon />}
                titulo="Información de la solicitud"
                subtitulo={data?.materia}
                onClose={onClose}
            />

            <DialogContent dividers sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <SeccionInfo icono={<FiberManualRecordIcon sx={{ ...ICONO, color }} />} etiqueta="Estatus">
                        <Typography variant="body2" sx={{ fontWeight: 600, color }}>
                            {ETIQUETA_ESTATUS[data?.estatus] ?? data?.estatus}
                        </Typography>
                    </SeccionInfo>

                    {data?.estudiante && (
                        <SeccionInfo icono={<PersonOutlineOutlinedIcon sx={ICONO} />} etiqueta="Estudiante">
                            {texto(data.estudiante)}
                        </SeccionInfo>
                    )}

                    {licenciaturaGrupo && (
                        <SeccionInfo icono={<SchoolOutlinedIcon sx={ICONO} />} etiqueta="Licenciatura y grupo">
                            {texto(licenciaturaGrupo)}
                        </SeccionInfo>
                    )}

                    {data?.asesor && (
                        <SeccionInfo icono={<BadgeOutlinedIcon sx={ICONO} />} etiqueta="Asesor solicitado">
                            {texto(data.asesor)}
                        </SeccionInfo>
                    )}

                    {fecha && (
                        <SeccionInfo icono={<CalendarMonthOutlinedIcon sx={ICONO} />} etiqueta="Fecha solicitada">
                            {texto(formatearFechaVisible(fecha))}
                        </SeccionInfo>
                    )}

                    {(data?.horario_con_dia ?? data?.horario) && (
                        <SeccionInfo icono={<AccessTimeOutlinedIcon sx={ICONO} />} etiqueta="Horario">
                            {texto(data.horario_con_dia ?? data.horario)}
                        </SeccionInfo>
                    )}

                    {data?.modalidad && (
                        <SeccionInfo icono={<LaptopOutlinedIcon sx={ICONO} />} etiqueta="Modalidad">
                            {texto(data.modalidad)}
                        </SeccionInfo>
                    )}

                    {data?.razonAsesoria && (
                        <SeccionInfo icono={<HelpOutlineOutlinedIcon sx={ICONO} />} etiqueta="Razón de la asesoría">
                            {texto(data.razonAsesoria)}
                        </SeccionInfo>
                    )}

                    {data?.motivo_rechazo && (
                        <SeccionInfo icono={<HelpOutlineOutlinedIcon sx={ICONO} />} etiqueta="Motivo del rechazo" tono="alerta">
                            {texto(data.motivo_rechazo)}
                        </SeccionInfo>
                    )}

                    {data?.observaciones && (
                        <SeccionInfo icono={<NotesOutlinedIcon sx={ICONO} />} etiqueta="Observaciones del estudiante">
                            {texto(data.observaciones)}
                        </SeccionInfo>
                    )}
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2,
                    gap: 1,
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    pb: esCelular ? 'calc(16px + env(safe-area-inset-bottom))' : 2,
                    '& > button': { flex: esCelular ? 1 : 'none', minHeight: 40 }
                }}
            >
                {/* En celular solo queda "Cerrar": aprobar o rechazar se hace desde la tarjeta */}
                {onRechazar && !esCelular && (
                    <Button variant="outlined" color="error" onClick={() => onRechazar(data)} sx={{ borderRadius: '8px', textTransform: 'none' }}>
                        Rechazar
                    </Button>
                )}

                {onAprobar && !esCelular && (
                    <Button variant="contained" onClick={() => onAprobar(data)} sx={ESTILO_BOTON_VERDE}>
                        Aprobar
                    </Button>
                )}

                <Button variant="contained" onClick={onClose} sx={ESTILO_BOTON_CERRAR}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
