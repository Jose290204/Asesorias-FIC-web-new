import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, Typography, useMediaQuery } from '@mui/material';
import { useState } from 'react';

import SeccionInfo from '../../../../rolEstudiante/components/compartidos/SeccionInfo';
import ModalDisponibilidadAsesor from '../../asesores/ModalDisponibilidadAsesor';
import ResumenDisponibilidad from '../../asesores/ResumenDisponibilidad';
import EncabezadoModal from '../../compartidos/EncabezadoModal';
import {
    ESTILO_BOTON_CERRAR,
    ESTILO_BOTON_SECUNDARIO,
    ICONO,
    PAPER_MODAL_CELULAR,
    paperModal
} from '../../compartidos/estilosAdmin';

/**
 * Información de un asesor par. Un asesor par es un estudiante con rol de asesor, así que sus datos personales
 * son de solo lectura (se editan en Estudiantes). Lo que sí se puede cambiar aquí es su disponibilidad.
 *
 * Props:
 *  - open, onClose
 *  - data: asesor seleccionado (formato de asesoresAdminService)
 *  - onGuardarDisponibilidad: onGuardarDisponibilidad(asesor, cuerpo) -> promesa con true/false
 */
export default function ModalInfoAsesorPar({ open, onClose, data, onGuardarDisponibilidad }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');
    const [modalDisponibilidadOpen, setModalDisponibilidadOpen] = useState(false);

    const handleCloseModal = () => {
        document.activeElement?.blur();
        onClose();
    };

    const abrirDisponibilidad = (e) => {
        e.currentTarget.blur();
        setModalDisponibilidadOpen(true);
    };

    const texto = (valor) => (
        <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{valor}</Typography>
    );

    return (
        <Dialog
            open={Boolean(open)}
            onClose={handleCloseModal}
            fullScreen={esCelular}
            disableRestoreFocus
            sx={esCelular ? PAPER_MODAL_CELULAR : paperModal(550)}
        >
            <EncabezadoModal
                icono={<InfoOutlinedIcon />}
                titulo="Información del asesor par"
                subtitulo={data?.nombre}
                onClose={handleCloseModal}
            />

            <DialogContent dividers sx={{ py: 2 }}>
                {data && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <SeccionInfo icono={<PersonOutlineOutlinedIcon sx={ICONO} />} etiqueta="Nombre">
                            {texto(data.nombre)}
                        </SeccionInfo>
                        {data.correo && (
                            <SeccionInfo icono={<MailOutlinedIcon sx={ICONO} />} etiqueta="Correo institucional">
                                {texto(data.correo)}
                            </SeccionInfo>
                        )}
                        {data.numeroCuenta && (
                            <SeccionInfo icono={<BadgeOutlinedIcon sx={ICONO} />} etiqueta="Número de cuenta">
                                {texto(data.numeroCuenta)}
                            </SeccionInfo>
                        )}
                        {data.telefono && (
                            <SeccionInfo icono={<PhoneOutlinedIcon sx={ICONO} />} etiqueta="Teléfono">
                                {texto(data.telefono)}
                            </SeccionInfo>
                        )}

                        <Typography variant="body2" sx={{ color: '#6B7280', px: 0.5 }}>
                            Sus datos personales se editan desde Estudiantes, porque es un estudiante con rol de asesor.
                        </Typography>

                        <SeccionInfo icono={<EventAvailableOutlinedIcon sx={ICONO} />} etiqueta="Disponibilidad">
                            <Box sx={{ mt: 0.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <ResumenDisponibilidad disponibilidad={data.disponibilidad} />
                                <Button
                                    variant="outlined"
                                    startIcon={<EditCalendarOutlinedIcon />}
                                    onClick={abrirDisponibilidad}
                                    sx={{ ...ESTILO_BOTON_SECUNDARIO, alignSelf: 'flex-start', color: '#08338F', borderColor: '#08338F' }}
                                >
                                    {data.disponibilidad.vacia ? 'Armar disponibilidad' : 'Editar disponibilidad'}
                                </Button>
                            </Box>
                        </SeccionInfo>
                    </Box>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2,
                    pt: 1.5,
                    justifyContent: 'flex-end',
                    pb: esCelular ? 'calc(16px + env(safe-area-inset-bottom))' : 2,
                    '& > button': { flex: esCelular ? 1 : 'none', minHeight: 40 }
                }}
            >
                <Button variant="contained" onClick={handleCloseModal} sx={ESTILO_BOTON_CERRAR}>
                    Cerrar
                </Button>
            </DialogActions>

            <ModalDisponibilidadAsesor
                open={modalDisponibilidadOpen}
                onClose={() => setModalDisponibilidadOpen(false)}
                asesor={data}
                onGuardar={(cuerpo) => onGuardarDisponibilidad?.(data, cuerpo)}
            />
        </Dialog>
    );
}
