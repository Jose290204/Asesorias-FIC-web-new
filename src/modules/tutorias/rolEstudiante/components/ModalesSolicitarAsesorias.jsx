import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    TextField,
    Box,
    MenuItem,
    Autocomplete,
    InputAdornment,
    Typography,
    createFilterOptions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/es';

import { catalogoService } from '../../rolAdministrador/services/catalogoService';

// --- HELPERS ---
const IDS_MATERIAS_DEMO = [94, 95, 96];

const claveNombre = (texto) => String(texto ?? '').trim().toLowerCase();

const sinDuplicados = (lista, obtenerClave) => {
    const vistos = new Set();
    return lista.filter((item) => {
        const clave = obtenerClave(item);
        if (!clave || vistos.has(clave)) return false;
        vistos.add(clave);
        return true;
    });
};

const buscarNombreEnLista = (lista, campoId, campoNombre, id) => {
    const encontrado = lista.find((item) => String(item[campoId]) === String(id));
    return encontrado ? encontrado[campoNombre] : undefined;
};

const filtrarAsesores = createFilterOptions({
    stringify: (asesor) => `${asesor.asesor || asesor.nombre || ''} ${asesor.email ?? ''}`
});

const FORMULARIO_CREAR_INICIAL = {
    asesor: null,
    materiaId: '',
    inicio: null,
    horarioId: '',
    modalidadId: '',
    nota: ''
};

// ==========================================
// 1. MODAL CREAR SOLICITUD (Buscador global)
// ==========================================
export function ModalCrearSolicitud({ open, onClose, onSave, showToast, asesores = [], materiasAsesor }) {
    const [formData, setFormData] = useState(FORMULARIO_CREAR_INICIAL);
    const [calendarioOpen, setCalendarioOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (!open) return;
        setFormData(FORMULARIO_CREAR_INICIAL);
        setCalendarioOpen(false);
    }, [open]);

    const asesoresList = sinDuplicados(asesores, (item) => item.email || claveNombre(item.asesor));

    const materiasList =
        materiasAsesor ??
        (catalogoService?.getMaterias ? catalogoService.getMaterias().filter((item) => IDS_MATERIAS_DEMO.includes(item.id_materia)) : []);
    const horariosList = catalogoService?.getHorarios ? catalogoService.getHorarios() : [];
    const modalidadesList = catalogoService?.getModalidades ? catalogoService.getModalidades() : [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const abrirCalendario = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setCalendarioOpen(true);
    };

    const formularioCompleto =
        Boolean(formData.asesor) &&
        Boolean(formData.materiaId) &&
        Boolean(formData.inicio?.isValid()) &&
        Boolean(formData.horarioId) &&
        Boolean(formData.modalidadId);

    const handleCrear = async () => {
        if (!formularioCompleto || guardando) return;

        setGuardando(true);
        try {
            const { asesor } = formData;

            const nuevaSolicitud = {
                asesorId: asesor.id,
                asesor: asesor.asesor || asesor.nombre,
                asesorEmail: asesor.email,
                materiaId: formData.materiaId,
                materia: buscarNombreEnLista(materiasList, 'id_materia', 'materia', formData.materiaId),
                inicio: formData.inicio.format('YYYY-MM-DD'),
                fecha: formData.inicio.format('DD/MM/YYYY'),
                horarioId: formData.horarioId,
                horario: buscarNombreEnLista(horariosList, 'id_horario', 'horario', formData.horarioId),
                modalidadId: formData.modalidadId,
                modalidad: buscarNombreEnLista(modalidadesList, 'id_modalidad', 'modalidad', formData.modalidadId),
                nota: formData.nota.trim()
            };

            if (onSave) await onSave(nuevaSolicitud);
            if (showToast) showToast('Solicitud creada correctamente', 'success');
            if (onClose) onClose();
        } catch (error) {
            if (showToast) showToast('Ocurrió un error al crear la solicitud', 'error');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
                sx={{
                    '& .MuiPaper-root': {
                        width: '550px',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1.5
                    }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Solicitar Asesoría
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
                        <Autocomplete
                            fullWidth
                            size="small"
                            openOnFocus
                            options={asesoresList}
                            value={formData.asesor}
                            onChange={(_, nuevoAsesor) =>
                                setFormData((prev) => ({ ...prev, asesor: nuevoAsesor }))
                            }
                            getOptionLabel={(option) => option.asesor || option.nombre || ''}
                            getOptionKey={(option) => option.id}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            filterOptions={filtrarAsesores}
                            noOptionsText="No se encontraron asesores"
                            renderInput={(params) => {
                                const inputProps = params.slotProps?.input ?? params.InputProps;
                                return (
                                    <TextField
                                        {...params}
                                        label="Asesor"
                                        placeholder="Escribe nombre del asesor"
                                        slotProps={{
                                            ...params.slotProps,
                                            input: {
                                                ...inputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <SearchIcon fontSize="small" />
                                                        </InputAdornment>
                                                        {inputProps?.startAdornment}
                                                    </>
                                                )
                                            }
                                        }}
                                    />
                                );
                            }}
                        />

                        <TextField
                            select
                            label="Materia"
                            name="materiaId"
                            size="small"
                            fullWidth
                            value={formData.materiaId}
                            onChange={handleChange}
                        >
                            {materiasList.map((item) => (
                                <MenuItem key={item.id_materia} value={String(item.id_materia)}>
                                    {item.materia}
                                </MenuItem>
                            ))}
                        </TextField>

                        <DatePicker
                            label="Fecha"
                            value={formData.inicio}
                            onChange={(nuevaFecha) => setFormData((prev) => ({ ...prev, inicio: nuevaFecha }))}
                            format="DD/MM/YYYY"
                            open={calendarioOpen}
                            onOpen={abrirCalendario}
                            onClose={() => setCalendarioOpen(false)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    onClick: abrirCalendario
                                }
                            }}
                        />

                        <TextField
                            select
                            label="Horario"
                            name="horarioId"
                            size="small"
                            fullWidth
                            value={formData.horarioId}
                            onChange={handleChange}
                        >
                            {horariosList.map((item) => (
                                <MenuItem key={item.id_horario} value={String(item.id_horario)}>
                                    {item.horario}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Modalidad"
                            name="modalidadId"
                            size="small"
                            fullWidth
                            value={formData.modalidadId}
                            onChange={handleChange}
                        >
                            {modalidadesList.map((item) => (
                                <MenuItem key={item.id_modalidad} value={String(item.id_modalidad)}>
                                    {item.modalidad}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Nota para el asesor (opcional)"
                            name="nota"
                            placeholder="Agrega un comentario..."
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.nota}
                            onChange={handleChange}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5, justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCrear}
                        disabled={!formularioCompleto || guardando}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}

// ==========================================
// 2. MODAL INFORMACIÓN
// ==========================================
export function ModalInformacion({ open, onClose, asesor }) {
    if (!asesor) return null;

    const materias = Array.isArray(asesor.materias) ? asesor.materias.join(', ') : asesor.materias;
    const horarios = Array.isArray(asesor.horarios)
        ? asesor.horarios.join('\n')
        : (asesor.horarios || asesor.horario || 'No especificado');

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
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
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Teléfono:</Typography>
                        <Typography variant="body2">{asesor.telefono || 'N/A'}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Materias:</Typography>
                        <Typography variant="body2">{materias || 'N/A'}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Horarios:</Typography>
                        <Typography variant="body2" sx={{ whitespace: 'pre-line' }}>{horarios}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Licenciatura:</Typography>
                        <Typography variant="body2">{asesor.licenciatura || 'N/A'}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Grupo:</Typography>
                        <Typography variant="body2">{asesor.grupo || 'N/A'}</Typography>
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

// ==========================================
// 3. MODAL SOLICITAR (Asesor fijo / bloqueado)
// ==========================================
const FORMULARIO_SOLICITAR_INICIAL = {
    materiaId: '',
    inicio: null,
    horarioId: '',
    modalidadId: '',
    nota: ''
};

export function ModalSolicitar({ open, onClose, onSave, showToast, asesor }) {
    const [formData, setFormData] = useState(FORMULARIO_SOLICITAR_INICIAL);
    const [calendarioOpen, setCalendarioOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (!open) return;
        setFormData(FORMULARIO_SOLICITAR_INICIAL);
        setCalendarioOpen(false);
    }, [open]);

    const materiasList = catalogoService?.getMaterias ? catalogoService.getMaterias() : [];
    const horariosList = catalogoService?.getHorarios ? catalogoService.getHorarios() : [];
    const modalidadesList = catalogoService?.getModalidades ? catalogoService.getModalidades() : [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const abrirCalendario = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setCalendarioOpen(true);
    };

    const formularioCompleto =
        Boolean(formData.materiaId) &&
        Boolean(formData.inicio?.isValid()) &&
        Boolean(formData.horarioId) &&
        Boolean(formData.modalidadId);

    const handleCrear = async () => {
        if (!formularioCompleto || guardando) return;

        setGuardando(true);
        try {
            const nuevaSolicitud = {
                asesorId: asesor?.id,
                asesor: asesor?.asesor || asesor?.nombre,
                asesorEmail: asesor?.email,
                materiaId: formData.materiaId,
                inicio: formData.inicio.format('YYYY-MM-DD'),
                fecha: formData.inicio.format('DD/MM/YYYY'),
                horarioId: formData.horarioId,
                modalidadId: formData.modalidadId,
                nota: formData.nota.trim()
            };

            if (onSave) await onSave(nuevaSolicitud);
            if (showToast) showToast('Solicitud enviada correctamente', 'success');
            if (onClose) onClose();
        } catch (error) {
            if (showToast) showToast('Error al procesar la solicitud', 'error');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
                sx={{
                    '& .MuiPaper-root': {
                        width: '500px',
                        maxWidth: '90vw',
                        borderRadius: '12px',
                        p: 1.5
                    }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.25rem', textAlign: 'center'}}>
                    Solicitar Asesoría
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
                        <TextField
                            label="Asesor"
                            size="small"
                            fullWidth
                            disabled
                            value={asesor?.asesor || asesor?.nombre || ''}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon fontSize="small" />
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />

                        <TextField
                            select
                            label="Materia"
                            name="materiaId"
                            size="small"
                            fullWidth
                            value={formData.materiaId}
                            onChange={handleChange}
                        >
                            {materiasList.map((item) => (
                                <MenuItem key={item.id_materia} value={String(item.id_materia)}>
                                    {item.materia}
                                </MenuItem>
                            ))}
                        </TextField>

                        <DatePicker
                            label="Fecha"
                            value={formData.inicio}
                            onChange={(nuevaFecha) => setFormData((prev) => ({ ...prev, inicio: nuevaFecha }))}
                            format="DD/MM/YYYY"
                            open={calendarioOpen}
                            onOpen={abrirCalendario}
                            onClose={() => setCalendarioOpen(false)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    onClick: abrirCalendario
                                }
                            }}
                        />

                        <TextField
                            select
                            label="Horario"
                            name="horarioId"
                            size="small"
                            fullWidth
                            value={formData.horarioId}
                            onChange={handleChange}
                        >
                            {horariosList.map((item) => (
                                <MenuItem key={item.id_horario} value={String(item.id_horario)}>
                                    {item.horario}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Modalidad"
                            name="modalidadId"
                            size="small"
                            fullWidth
                            value={formData.modalidadId}
                            onChange={handleChange}
                        >
                            {modalidadesList.map((item) => (
                                <MenuItem key={item.id_modalidad} value={String(item.id_modalidad)}>
                                    {item.modalidad}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Nota para el asesor (opcional)"
                            name="nota"
                            placeholder="Agrega un comentario..."
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.nota}
                            onChange={handleChange}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCrear}
                        disabled={!formularioCompleto || guardando}
                        sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1b5e20' } }}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}