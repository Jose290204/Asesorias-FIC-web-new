import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    TextField,
    useMediaQuery
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useState } from 'react';

import { catalogoService } from '../../../services/catalogoService';

export default function ModalInfoAsesoria({ open, onClose, data, onSave, showToast }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const [formData, setFormData] = useState({
        estudiante: '',
        asesor: '',
        licenciatura: '',
        gradoGrupo: '3-1',
        materia: '',
        materiaId: '',
        horario: '',
        horarioId: '',
        modalidad: '',
        modalidadId: '',
        inicio: '',
        razonAsesoria: '',
        razonId: '',
        observaciones: ''
    });

    const [initialFormData, setInitialFormData] = useState(null);

    // Cargar y normalizar los datos al abrir el modal, asegurando los valores por defecto desde el servicio/data
    useEffect(() => {
        if (data) {
            const rawFecha = data.raw?.fecha_inicio || data.inicio;
            const fechaValida = rawFecha && dayjs(rawFecha).isValid()
                ? dayjs(rawFecha).format('YYYY-MM-DD')
                : '';

            const normalizedData = {
                estudiante:
                    data.estudiante ||
                    data.raw?.estudiante_nombre ||
                    '',


                asesor:
                    data.asesor ||
                    data.raw?.asesor_nombre ||
                    '',


                licenciatura:
                    data.licenciatura ||
                    data.raw?.licenciatura_nombre ||
                    'Licenciatura en Informática',


                gradoGrupo:
                    data.gradoGrupo ||
                    data.raw?.grado_grupo ||
                    '3-1',

                // Nombre de la materia
                materia:
                    data.materia ||
                    data.raw?.materia_nombre ||
                    '',

                // ID de la materia
                materiaId: String(
                    data.materiaId ??
                    data.raw?.id_materia ??
                    ''
                ),

                horarioId: String(
                    data.horarioId ??
                    data.raw?.id_horario ??
                    ''
                ),

                modalidad:
                    data.modalidad ||
                    data.raw?.modalidad_nombre ||
                    '',

                modalidadId: String(
                    data.modalidadId ??
                    data.raw?.id_modalidad ??
                    ''
                ),


                inicio: fechaValida,


                razonAsesoria:
                    data.razonAsesoria ||
                    data.raw?.razon_texto ||
                    '',

                razonId: String(
                    data.razonId ??
                    data.raw?.id_razon ??
                    ''
                ),


                observaciones:
                    data.observaciones ||
                    data.raw?.observaciones ||
                    ''
            };

            setFormData(normalizedData);
            setInitialFormData(normalizedData);
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isModified = initialFormData ? Object.keys(formData).some(
        (key) => formData[key] !== initialFormData[key]
    ) : false;

    const handleApply = () => {
        if (!isModified) return;
        if (onSave) onSave({ ...data, ...formData });
        if (showToast) showToast('Cambios aplicados correctamente', 'info');
        onClose();
    };

    const parsedDate = formData.inicio && dayjs(formData.inicio).isValid()
        ? dayjs(formData.inicio)
        : null;

    // Obtenemos los catálogos directamente desde la instancia de catalogoService
    const materiasList = catalogoService.getMaterias();
    const horariosList = catalogoService.getHorarios();
    const modalidadesList = catalogoService.getModalidades();
    const razonesList = catalogoService.getRazonesAsesoria();

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog
                open={open}
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
                            display: 'flex',
                            flexDirection: 'column',
                            p: 1.5
                        }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Información Asesoría
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
                            label="Nombre del Estudiante"
                            name="estudiante"
                            size="small"
                            fullWidth
                            value={formData.estudiante}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <TextField
                            label="Nombre Asesor"
                            name="asesor"
                            size="small"
                            fullWidth
                            value={formData.asesor}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <TextField
                            label="Licenciatura del Estudiante"
                            name="licenciatura"
                            size="small"
                            fullWidth
                            value={formData.licenciatura}
                            slotProps={{ input: { readOnly: true } }}
                        />

                        <TextField
                            label="Grado y Grupo"
                            name="gradoGrupo"
                            size="small"
                            fullWidth
                            value={formData.gradoGrupo}
                            slotProps={{ input: { readOnly: true } }}
                            onChange={handleChange}
                        />

                        {/* Campo Materia como Select utilizando el valor por defecto de cada asesoría */}
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
                                <MenuItem
                                    key={item.id_materia}
                                    value={String(item.id_materia)}
                                >
                                    {item.materia}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Campo Horario como Select utilizando el valor por defecto de cada asesoría */}
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
                                <MenuItem
                                    key={item.id_horario}
                                    value={String(item.id_horario)}
                                >
                                    {item.horario}
                                </MenuItem>
                            ))}
                        </TextField>

                        <DatePicker
                            label="Fecha de Inicio"
                            value={parsedDate}
                            disabled
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true
                                }
                            }}
                        />

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
                                <MenuItem
                                    key={item.id_modalidad}
                                    value={String(item.id_modalidad)}
                                >
                                    {item.modalidad}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Razón de Asesoría"
                            name="razonId"
                            size="small"
                            fullWidth
                            value={formData.razonId}
                            onChange={handleChange}
                        >
                            {razonesList.map((item) => (
                                <MenuItem
                                    key={item.id_razon}
                                    value={String(item.id_razon)}
                                >
                                    {item.razon}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Observaciones"
                            name="observaciones"
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.observaciones}
                            onChange={handleChange}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, pt: 1.5, pb: esCelular ? 'calc(16px + env(safe-area-inset-bottom))' : 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApply}
                        disabled={!isModified}
                        fullWidth
                    >
                        Aplicar Cambios
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}