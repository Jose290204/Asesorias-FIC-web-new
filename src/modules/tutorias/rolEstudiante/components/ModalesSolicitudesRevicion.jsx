import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton, TextField, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PersonIcon from '@mui/icons-material/Person';

// ==========================================
// 1. MODAL INFORMACIÓN
// ==========================================
export function ModalInformacion({ open, onClose, solicitud }) {
    if (!solicitud) return null;

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '480px',
                    maxWidth: '90vw',
                    borderRadius: '10px',
                    p: 2,
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 8px 24px rgba(0,0,0,0.15)'
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '12px 16px 8px 16px' }}>
                <Box sx={{ width: 40 }} />
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                    Información de la Solicitud
                </Typography>
                <IconButton onClick={onClose} sx={{ color: '#888888' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <hr style={{ border: '0', borderTop: '1px solid #EAEAEA', margin: '0 16px 16px 16px' }} />

            <DialogContent sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Materia:</Typography>
                        <Typography variant="body1" sx={{ color: '#333333' }}>{solicitud.materia || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Asesor</Typography>
                        <Typography variant="body1" sx={{ color: '#333333' }}>{solicitud.asesor || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Fecha</Typography>
                        <Typography variant="body1" sx={{ color: '#333333' }}>{solicitud.fecha || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Horario</Typography>
                        <Typography variant="body1" sx={{ color: '#333333' }}>{solicitud.horario || 'N/A'}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>Estado</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333333' }}>{solicitud.estado || 'N/A'}</Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'end', borderTop: '1px solid #E0E0E0' }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ==========================================
// 2. MODAL EDITAR SOLICITUD
// ==========================================
export function EditarSolicitud({ open, onClose, solicitud, showToast }) {
    const [formData, setFormData] = useState({
        materia: '',
        asesor: '',
        fecha: '',
        horario: '',
        modalidad: ''
    });

    const [hasChanged, setHasChanged] = useState(false);
    const [confirmarCancelarOpen, setConfirmarCancelarOpen] = useState(false);

    useEffect(() => {
        if (solicitud) {
            setFormData({
                materia: solicitud.materia || '',
                asesor: solicitud.asesor || '',
                fecha: solicitud.fecha || '',
                horario: solicitud.horario || '18:00 - 19:00',
                modalidad: solicitud.modalidad || 'Presencial'
            });
            setHasChanged(false);
        }
    }, [solicitud, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setHasChanged(true);
    };

    const handleGuardar = () => {
        console.log("Se guardaron los cambios de la solicitud:", formData);
        if (showToast) showToast('Se guardó el cambio correctamente', 'info');
        if (onClose) onClose();
    };

    const confirmarEliminacion = () => {
        setConfirmarCancelarOpen(false);
        if (showToast) showToast('Se eliminó la solicitud', 'error');
        if (onClose) onClose();
    };

    if (!solicitud) return null;

    return (
        <>
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
                sx={{
                    '& .MuiPaper-root': {
                        width: '500px',
                        maxWidth: '95vw',
                        borderRadius: '10px',
                        p: 1,
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0px 10px 30px rgba(0,0,0,0.15)'
                    }
                }}
            >
                {/* Cabecera */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '16px 20px 8px 20px' }}>
                    <Box sx={{ width: 30 }} />
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', }}>
                        Modificar Solicitud
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: '#888888', '&:hover': { backgroundColor: 'transparent' } }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <hr style={{ border: '0', borderTop: '1px solid #EAEAEA', margin: '0 16px 16px 16px' }} />

                <DialogContent sx={{ py: 1, px: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                        {/* Campo Asesor */}
                        <Box sx={{ border: '1px solid #C4C4C4', borderRadius: '8px', p: '10px 14px', backgroundColor: '#FAFAFA', position: 'relative', mt: 1 }}>
                            <Typography component="span" sx={{ fontSize: '12px', color: '#777777', position: 'absolute', top: '-10px', left: '12px', backgroundColor: '#FAFAFA', px: '4px' }}>
                                Asesor
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon sx={{ color: '#888888', fontSize: '20px' }} />
                                <Typography sx={{ fontSize: '15px', color: '#555555', fontWeight: 500 }}>
                                    {formData.asesor}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Materia (No editable con diseño de etiqueta flotante) */}
                        <Box sx={{ border: '1px solid #C4C4C4', borderRadius: '8px', p: '10px 14px', backgroundColor: '#FAFAFA', position: 'relative' }}>
                            <Typography component="span" sx={{ fontSize: '12px', color: '#777777', position: 'absolute', top: '-10px', left: '12px', backgroundColor: '#FAFAFA', px: '4px' }}>
                                Materia
                            </Typography>
                            <Typography sx={{ fontSize: '15px', color: '#555555', fontWeight: 500 }}>
                                {formData.materia}
                            </Typography>
                        </Box>

                        {/* Fecha tipo calendario con diseño de etiqueta flotante */}
                        <Box sx={{ border: '1px solid #C4C4C4', borderRadius: '8px', p: '6px 14px', backgroundColor: '#FFFFFF', position: 'relative' }}>
                            <Typography component="span" sx={{ fontSize: '12px', color: '#777777', position: 'absolute', top: '-10px', left: '12px', backgroundColor: '#FFFFFF', px: '4px' }}>
                                Fecha
                            </Typography>
                            <TextField
                                fullWidth
                                variant="standard"
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                InputProps={{
                                    disableUnderline: true,
                                    endAdornment: <CalendarTodayOutlinedIcon sx={{ color: '#6A6A6A', fontSize: '20px', mr: 1, pointerEvents: 'none' }} />
                                }}
                                sx={{
                                    mt: 0.5,
                                    '& input': { fontSize: '15px', color: '#333' },
                                    '& .MuiInput-root:before, & .MuiInput-root:after': { borderBottom: 'none !important' }
                                }}
                            />
                        </Box>

                        {/* Horario (Select sin líneas internas) */}
                        <Box sx={{ border: '1px solid #C4C4C4', borderRadius: '8px', p: '6px 14px', backgroundColor: '#FFFFFF', position: 'relative' }}>
                            <Typography component="span" sx={{ fontSize: '12px', color: '#777777', position: 'absolute', top: '-10px', left: '12px', backgroundColor: '#FFFFFF', px: '4px' }}>
                                Horario
                            </Typography>
                            <TextField
                                fullWidth
                                select
                                variant="standard"
                                name="horario"
                                value={formData.horario}
                                onChange={handleChange}
                                InputProps={{ disableUnderline: true }}
                                sx={{
                                    mt: 0.5,
                                    '& .MuiSelect-select': { fontSize: '15px', color: '#333', py: 0.5, backgroundColor: 'transparent' },
                                    '& .MuiInput-root:before, & .MuiInput-root:after': { borderBottom: 'none !important' }
                                }}
                            >
                                <MenuItem value="18:00 - 19:00">18:00 - 19:00</MenuItem>
                                <MenuItem value="19:00 - 20:00">19:00 - 20:00</MenuItem>
                            </TextField>
                        </Box>

                        {/* Modalidad (Select sin líneas internas) */}
                        <Box sx={{ border: '1px solid #C4C4C4', borderRadius: '8px', p: '6px 14px', backgroundColor: '#FFFFFF', position: 'relative' }}>
                            <Typography component="span" sx={{ fontSize: '12px', color: '#777777', position: 'absolute', top: '-10px', left: '12px', backgroundColor: '#FFFFFF', px: '4px' }}>
                                Modalidad
                            </Typography>
                            <TextField
                                fullWidth
                                select
                                variant="standard"
                                name="modalidad"
                                value={formData.modalidad}
                                onChange={handleChange}
                                InputProps={{ disableUnderline: true }}
                                sx={{
                                    mt: 0.5,
                                    '& .MuiSelect-select': { fontSize: '15px', color: '#333', py: 0.5, backgroundColor: 'transparent' },
                                    '& .MuiInput-root:before, & .MuiInput-root:after': { borderBottom: 'none !important' }
                                }}
                            >
                                <MenuItem value="Presencial">Presencial</MenuItem>
                                <MenuItem value="En línea">En línea</MenuItem>
                            </TextField>
                        </Box>

                        {/* Botón cancelar solicitud */}
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setConfirmarCancelarOpen(true)}
                            sx={{
                                color: '#F44336',
                                borderColor: '#F44336',
                                borderRadius: '5px',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                py: 1,
                                mt: 1,
                                '&:hover': { backgroundColor: '#FEEPEE', borderColor: '#F44336' }
                            }}
                        >
                            CANCELAR SOLICITUD
                        </Button>
                    </Box>
                </DialogContent>

                <hr style={{ border: '0', borderTop: '1px solid #EAEAEA', margin: '16px 16px 0 16px' }} />

                {/* Botones inferiores */}
                <DialogActions sx={{ p: '16px 24px', justifyContent: 'space-between' }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            color: '#333333',
                            borderColor: '#CCCCCC',
                            textTransform: 'none',
                            borderRadius: '5px',
                            px: 3,
                            fontWeight: 'bold',
                            '&:hover': { backgroundColor: '#F5F5F5', borderColor: '#BBBBBB' }
                        }}
                    >
                        CANCELAR
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!hasChanged}
                        onClick={handleGuardar}
                        sx={{
                            backgroundColor: '#43B45C',
                            '&:hover': { backgroundColor: '#132863' },
                            textTransform: 'none',
                            borderRadius: '5px',
                            px: 3,
                            fontWeight: 'bold',
                            '&.Mui-disabled': { backgroundColor: '#E0E0E0', color: '#9E9E9E' }
                        }}
                    >
                        CONFIRMAR
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Submodal de advertencia para cancelar solicitud */}
            <Dialog
                open={confirmarCancelarOpen}
                onClose={() => setConfirmarCancelarOpen(false)}
                sx={{
                    '& .MuiPaper-root': {
                        width: '380px',
                        borderRadius: '16px',
                        p: 2,
                        textAlign: 'center'
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1C398B' }}>
                    ¿Estás seguro de cancelar esta solicitud?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Esta acción eliminará la solicitud de manera definitiva.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setConfirmarCancelarOpen(false)}
                        sx={{ textTransform: 'none', borderRadius: '8px', color: '#333', borderColor: '#CCC' }}
                    >
                        No, volver
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={confirmarEliminacion}
                        sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                        Sí, eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

// ==========================================
// 3. MODAL NOTA ASESOR
// ==========================================
export function ModalNotaAsesor({ open, onClose, nota }) {
    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '420px',
                    maxWidth: '90vw',
                    borderRadius: '20px',
                    p: 2,
                    backgroundColor: '#FFFFFF',
                    textAlign: 'center',
                    boxShadow: '0px 8px 24px rgba(0,0,0,0.15)'
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#1C398B' }}>
                Notas del asesor
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
                <Typography variant="body1" sx={{ color: '#333333' }}>
                    {nota || 'Esa fecha ya no esta disponible'}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        backgroundColor: '#1C398B',
                        '&:hover': { backgroundColor: '#132863' },
                        textTransform: 'none',
                        borderRadius: '8px',
                        px: 4
                    }}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}