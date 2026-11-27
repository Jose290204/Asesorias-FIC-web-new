import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, Typography, useMediaQuery } from '@mui/material';

import EncabezadoModal from '../../../../rolAdministrador/components/compartidos/EncabezadoModal';
import { ESTILO_BOTON_CERRAR, ICONO, PAPER_MODAL_CELULAR, paperModal } from '../../../../rolAdministrador/components/compartidos/estilosAdmin';
import SeccionInfo from '../../../../rolEstudiante/components/compartidos/SeccionInfo';

/**
 * Detalle de una solicitud pendiente (solo lectura), con la nota que dejó el estudiante.
 * Props: open, onClose, solicitud (en el formato de la tarjeta: nombre_estudiante, materia, nota...)
 */
export default function ModalInfoSolicitudPendiente({ open, onClose, solicitud }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const texto = (valor) => (
        <Typography variant="body2" sx={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{valor}</Typography>
    );

    return (
        <Dialog open={Boolean(open)} onClose={onClose} fullScreen={esCelular} sx={esCelular ? PAPER_MODAL_CELULAR : paperModal(520)}>
            <EncabezadoModal
                icono={<InfoOutlinedIcon />}
                titulo="Información de la solicitud"
                subtitulo={solicitud?.materia}
                onClose={onClose}
            />

            <DialogContent dividers sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {solicitud?.nombre_estudiante && (
                        <SeccionInfo icono={<PersonOutlineOutlinedIcon sx={ICONO} />} etiqueta="Estudiante">
                            {texto(solicitud.nombre_estudiante)}
                        </SeccionInfo>
                    )}

                    {solicitud?.fecha_inicio_formateada && (
                        <SeccionInfo icono={<CalendarMonthOutlinedIcon sx={ICONO} />} etiqueta="Fecha de inicio">
                            {texto(solicitud.fecha_inicio_formateada)}
                        </SeccionInfo>
                    )}

                    {solicitud?.horario_con_dia && (
                        <SeccionInfo icono={<AccessTimeOutlinedIcon sx={ICONO} />} etiqueta="Horario">
                            {texto(solicitud.horario_con_dia)}
                        </SeccionInfo>
                    )}

                    {solicitud?.modalidad && (
                        <SeccionInfo icono={<LaptopOutlinedIcon sx={ICONO} />} etiqueta="Modalidad">
                            {texto(solicitud.modalidad)}
                        </SeccionInfo>
                    )}

                    {solicitud?.razon && (
                        <SeccionInfo icono={<HelpOutlineOutlinedIcon sx={ICONO} />} etiqueta="Razón de la asesoría">
                            {texto(solicitud.razon)}
                        </SeccionInfo>
                    )}

                    {/* La nota siempre se muestra, para que quede claro si el estudiante dejó algo o no */}
                    <SeccionInfo icono={<NotesOutlinedIcon sx={ICONO} />} etiqueta="Nota del estudiante">
                        {solicitud?.nota ? (
                            texto(solicitud.nota)
                        ) : (
                            <Typography variant="body2" sx={{ color: '#6A6A6A' }}>El estudiante no dejó ninguna nota.</Typography>
                        )}
                    </SeccionInfo>
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2,
                    pb: esCelular ? 'calc(16px + env(safe-area-inset-bottom))' : 2,
                    '& > button': { flex: esCelular ? 1 : 'none', minHeight: 40 }
                }}
            >
                <Button variant="contained" onClick={onClose} sx={ESTILO_BOTON_CERRAR}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
