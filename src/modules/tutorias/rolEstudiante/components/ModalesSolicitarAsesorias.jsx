import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    MenuItem,
    TextField,
    Typography,
    createFilterOptions
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/es';
import { useEffect, useState } from 'react';

import { catalogoService } from '../../rolAdministrador/services/catalogoService';

// --- HELPERS ---
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

// Convierte ["A, B", "C"] o "A / B" en ["A", "B", "C"]
const aLista = (valor) =>
    (Array.isArray(valor) ? valor : [valor])
        .flatMap((v) => String(v ?? '').split(/[,/]/))
        .map((v) => v.trim())
        .filter(Boolean);

// Opciones SOLO del asesor elegido, tomadas del objeto del asesor.
// 1) Si el padre manda el prop (array o función (asesor) => array), se usa tal cual.
// 2) Si no, se leen los nombres que trae el asesor (asesor.materias, asesor.horarios,
//    asesor.modalidad). Si el nombre existe en el catálogo se usa su id real; si no,
//    se genera un id temporal para poder mostrarlo y seleccionarlo.
const opcionesDelAsesor = (propOpciones, asesor, catalogo, campoId, campoNombre, valoresAsesor) => {
    if (!asesor) return [];
    if (propOpciones) {
        const lista = typeof propOpciones === 'function' ? propOpciones(asesor) : propOpciones;
        return Array.isArray(lista) ? lista : [];
    }
    return aLista(valoresAsesor).map((nombre, indice) => {
        const enCatalogo = catalogo.find(
            (item) => String(item[campoNombre] ?? '').trim().toLowerCase() === nombre.toLowerCase()
        );
        return enCatalogo ?? { [campoId]: `${campoId}-${asesor.id ?? 'x'}-${indice}`, [campoNombre]: nombre };
    });
};

// --- DATOS DE PRUEBA (borrar cuando el asesor traiga sus opciones reales) ---
const MATERIAS_DEMO = [
    { id_materia: 9001, materia: 'Programación Web' },
    { id_materia: 9002, materia: 'Bases de Datos' },
    { id_materia: 9003, materia: 'Estructura de Datos' },
    { id_materia: 9004, materia: 'Cálculo Diferencial' },
    { id_materia: 9005, materia: 'Cálculo Integral' },
    { id_materia: 9006, materia: 'Álgebra Lineal' },
    { id_materia: 9007, materia: 'Redes de Computadoras' },
    { id_materia: 9008, materia: 'Sistemas Operativos' },
    { id_materia: 9009, materia: 'Ingeniería de Software' },
    { id_materia: 9010, materia: 'Programación Orientada a Objetos' },
    { id_materia: 9011, materia: 'Probabilidad y Estadística' },
    { id_materia: 9012, materia: 'Matemáticas Discretas' }
];
const HORARIOS_DEMO = [
    { id_horario: 9001, horario: '08:00 - 09:00' },
    { id_horario: 9002, horario: '09:00 - 10:00' },
    { id_horario: 9003, horario: '10:00 - 11:00' },
    { id_horario: 9004, horario: '11:00 - 12:00' },
    { id_horario: 9005, horario: '12:00 - 13:00' },
    { id_horario: 9006, horario: '13:00 - 14:00' },
    { id_horario: 9007, horario: '14:00 - 15:00' },
    { id_horario: 9008, horario: '15:00 - 16:00' },
    { id_horario: 9009, horario: '16:00 - 17:00' },
    { id_horario: 9010, horario: '17:00 - 18:00' },
    { id_horario: 9011, horario: '18:00 - 19:00' },
    { id_horario: 9012, horario: '19:00 - 20:00' }
];
const MODALIDADES_DEMO = [
    { id_modalidad: 9001, modalidad: 'Presencial' },
    { id_modalidad: 9002, modalidad: 'Virtual' }
];
// Si el asesor no trae opciones, se usan las de prueba
const conDemo = (lista, demo) => (lista.length > 0 ? lista : demo);

// Lista desplegable de los select: altura máxima con scroll interno
const MENU_CON_SCROLL = {
    slotProps: { paper: { sx: { maxHeight: 240 } } }
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
// 1. MODAL CREAR SOLICITUD (buscador global o, con asesorFijo, desde la tarjeta)
// Flujo: asesor -> materia -> fecha / horario / modalidad -> nota
// ==========================================
export function ModalCrearSolicitud({ open, onClose, onSave, showToast, asesores = [], asesorFijo = null, materiasAsesor, horariosAsesor, modalidadesAsesor }) {
    // asesorFijo: si viene (desde la tarjeta), el asesor ya está elegido y bloqueado
    const [formData, setFormData] = useState({ ...FORMULARIO_CREAR_INICIAL, asesor: asesorFijo });
    const [calendarioOpen, setCalendarioOpen] = useState(false);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (!open) return;
        setFormData({ ...FORMULARIO_CREAR_INICIAL, asesor: asesorFijo });
        setCalendarioOpen(false);
    }, [open, asesorFijo]);

    const asesoresList = sinDuplicados(asesores, (item) => item.email || claveNombre(item.asesor));

    const materiasCatalogo = catalogoService?.getMaterias ? catalogoService.getMaterias() : [];
    const horariosCatalogo = catalogoService?.getHorarios ? catalogoService.getHorarios() : [];
    const modalidadesCatalogo = catalogoService?.getModalidades ? catalogoService.getModalidades() : [];

    // Solo lo que ofrece el asesor elegido (props materiasAsesor / horariosAsesor / modalidadesAsesor)
    const asesorElegido = formData.asesor;
    const materiasList = conDemo(opcionesDelAsesor(materiasAsesor, asesorElegido, materiasCatalogo, 'id_materia', 'materia', asesorElegido?.materias), MATERIAS_DEMO);
    const horariosList = conDemo(opcionesDelAsesor(horariosAsesor, asesorElegido, horariosCatalogo, 'id_horario', 'horario', asesorElegido?.horarios), HORARIOS_DEMO);
    const modalidadesList = conDemo(opcionesDelAsesor(modalidadesAsesor, asesorElegido, modalidadesCatalogo, 'id_modalidad', 'modalidad', asesorElegido?.modalidad), MODALIDADES_DEMO);

    // Cadena: asesor -> materia -> resto. Leyenda solo en el campo que toca desbloquear.
    const sinAsesor = !formData.asesor;
    const sinMateria = !formData.materiaId;
    const leyendaMateria = sinAsesor ? 'Elige primero al asesor' : '';
    const leyendaResto = !sinAsesor && sinMateria ? 'Elige primero una materia' : '';

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
                        {/* 1. ASESOR: lo primero que se elige */}
                        <Autocomplete
                            fullWidth
                            size="small"
                            openOnFocus
                            disabled={Boolean(asesorFijo)}
                            options={asesoresList}
                            value={formData.asesor}
                            onChange={(_, nuevoAsesor) =>
                                // Al cambiar de asesor se limpia todo (menos la nota)
                                setFormData((prev) => ({ ...FORMULARIO_CREAR_INICIAL, nota: prev.nota, asesor: asesorFijo ?? nuevoAsesor }))
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

                        {/* 2. MATERIA: se habilita al elegir asesor */}
                        <Box>
                            <TextField
                                select
                                slotProps={{ select: { MenuProps: MENU_CON_SCROLL } }}
                                label="Materia"
                                name="materiaId"
                                size="small"
                                fullWidth
                                disabled={sinAsesor}
                                helperText={leyendaMateria}
                                value={formData.materiaId}
                                onChange={handleChange}
                            >
                                {materiasList.map((item) => (
                                    <MenuItem key={item.id_materia} value={String(item.id_materia)}>
                                        {item.materia}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {/* 3. FECHA / HORARIO / MODALIDAD: se habilitan al elegir materia */}
                        <Box>
                            <DatePicker
                                label="Fecha"
                                value={formData.inicio}
                                onChange={(nuevaFecha) => setFormData((prev) => ({ ...prev, inicio: nuevaFecha }))}
                                format="DD/MM/YYYY"
                                disabled={sinMateria}
                                open={calendarioOpen && !sinMateria}
                                onOpen={() => { if (!sinMateria) abrirCalendario(); }}
                                onClose={() => setCalendarioOpen(false)}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        helperText: leyendaResto,
                                        fullWidth: true,
                                        InputLabelProps: { shrink: true },
                                        onClick: () => { if (!sinMateria) abrirCalendario(); }
                                    }
                                }}
                            />
                        </Box>

                        <Box>
                            <TextField
                                select
                                slotProps={{ select: { MenuProps: MENU_CON_SCROLL } }}
                                label="Horario"
                                name="horarioId"
                                size="small"
                                fullWidth
                                disabled={sinMateria}
                                helperText={leyendaResto}
                                value={formData.horarioId}
                                onChange={handleChange}
                            >
                                {horariosList.map((item) => (
                                    <MenuItem key={item.id_horario} value={String(item.id_horario)}>
                                        {item.horario}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Box>
                            <TextField
                                select
                                slotProps={{ select: { MenuProps: MENU_CON_SCROLL } }}
                                label="Modalidad"
                                name="modalidadId"
                                size="small"
                                fullWidth
                                disabled={sinMateria}
                                helperText={leyendaResto}
                                value={formData.modalidadId}
                                onChange={handleChange}
                            >
                                {modalidadesList.map((item) => (
                                    <MenuItem key={item.id_modalidad} value={String(item.id_modalidad)}>
                                        {item.modalidad}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {/* 4. NOTA */}
                        <Box>
                            <TextField
                                label="Nota para el asesor (opcional)"
                                name="nota"
                                placeholder="Agrega un comentario..."
                                size="small"
                                fullWidth
                                multiline
                                rows={3}
                                disabled={sinMateria}
                                helperText={leyendaResto}
                                value={formData.nota}
                                onChange={handleChange}
                            />
                        </Box>
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

    // Lo que trae el objeto del asesor (una línea por materia / horario).
    // Si no trae nada, se muestran datos de prueba.
    const materiasAsesor = aLista(asesor.materias);
    const horariosAsesor = aLista(asesor.horarios ?? asesor.horario);
    const modalidadesAsesor = aLista(asesor.modalidad ?? asesor.modalidades);
    const materias = (materiasAsesor.length > 0 ? materiasAsesor : MATERIAS_DEMO.slice(0, 4).map((m) => m.materia)).join('\n');
    const horarios = (horariosAsesor.length > 0 ? horariosAsesor : HORARIOS_DEMO.slice(0, 4).map((h) => h.horario)).join('\n');
    const modalidades = (modalidadesAsesor.length > 0 ? modalidadesAsesor : MODALIDADES_DEMO.map((m) => m.modalidad)).join('\n');

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
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Materias:</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{materias}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Horarios:</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{horarios}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6A6A6A' }}>Modalidad:</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{modalidades}</Typography>
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
// 3. MODAL SOLICITAR (desde la tarjeta): mismo modal, con el asesor ya elegido
// ==========================================
export function ModalSolicitar({ asesor, ...props }) {
    return <ModalCrearSolicitud {...props} asesorFijo={asesor} asesores={asesor ? [asesor] : []} />;
}