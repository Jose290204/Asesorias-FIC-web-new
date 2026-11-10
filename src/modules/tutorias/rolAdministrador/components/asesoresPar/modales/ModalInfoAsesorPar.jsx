import CloseIcon from '@mui/icons-material/Close';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography, useMediaQuery } from '@mui/material';

import { useState } from 'react';

import ModalDisponibilidadAsesor from '../../asesores/ModalDisponibilidadAsesor';
import ResumenDisponibilidad from '../../asesores/ResumenDisponibilidad';

// Campo de solo lectura con el estilo de los demás modales
function Dato({ label, valor }) {
    return (
        <TextField
            label={label}
            value={valor || ''}
            placeholder="—"
            disabled
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
        />
    );
}

/**
 * Información de un asesor par. Un asesor par es un estudiante con rol de asesor, así que sus datos personales
 * se muestran bloqueados (se editan en Estudiantes). Lo que sí se puede cambiar aquí es su disponibilidad.
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

    return (
        <Dialog
            open={Boolean(open)}
            onClose={handleCloseModal}
            fullScreen={esCelular}
            disableRestoreFocus
            sx={{
                '& .MuiPaper-root': esCelular
                    ? { borderRadius: 0 }
                    : { width: '550px', maxWidth: '90vw', maxHeight: '90dvh', borderRadius: '12px', p: 1.5 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, pr: 7, fontWeight: 'bold', fontSize: '1.2rem' }}>
                Información del Asesor Par
                <IconButton
                    aria-label="close"
                    onClick={handleCloseModal}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                    py: 3,
                    '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#1F2937' },
                    '& .MuiInputLabel-root.Mui-disabled': { color: 'text.secondary' },
                    '& .MuiOutlinedInput-root.Mui-disabled': { backgroundColor: '#F3F5F9' },
                    '& .Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: '#E1E5EC' }
                }}
            >
                {data && (
                    <>
                        <Dato label="Nombre" valor={data.nombre} />
                        <Dato label="Correo institucional" valor={data.correo} />
                        <Dato label="Número de cuenta" valor={data.numeroCuenta} />
                        <Dato label="Teléfono" valor={data.telefono} />

                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            Sus datos personales se editan desde Estudiantes, porque es un estudiante con rol de asesor.
                        </Typography>

                        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between gap-3">
                                <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#1F2937' }}>
                                    Disponibilidad
                                </Typography>

                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditCalendarOutlinedIcon />}
                                    onClick={abrirDisponibilidad}
                                    sx={{ flexShrink: 0, textTransform: 'none', borderRadius: '5px', color: '#244B91', borderColor: '#244B91' }}
                                >
                                    {data.disponibilidad.vacia ? 'Armar' : 'Editar'}
                                </Button>
                            </div>

                            <ResumenDisponibilidad disponibilidad={data.disponibilidad} />
                        </div>
                    </>
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
                <Button variant="outlined" color="inherit" onClick={handleCloseModal}>
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
