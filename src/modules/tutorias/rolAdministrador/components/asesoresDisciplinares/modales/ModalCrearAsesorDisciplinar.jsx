import CloseIcon from '@mui/icons-material/Close';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    useMediaQuery
} from '@mui/material';
import { useEffect, useState } from 'react';

import { catalogoService } from '../../../services/catalogoService';
import CampoContrasena from './CampoContrasena';
import ModalSeleccionCatalogo from './ModalSeleccionCatalogo';
import SeccionCatalogoAsesor from './SeccionCatalogoAsesor';

const FORMULARIO_INICIAL = {
    nombre: '',
    correo: '',
    telefono: '',
    numeroCuenta: '',
    contrasena: '',
    materias: [],
    horarios: []
};

// Letras (con acentos y ñ) y espacios
const SOLO_LETRAS = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g;
// Dígitos
const SOLO_NUMEROS = /\D/g;
// Formato básico de correo: algo@dominio.ext
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Largo mínimo de la contraseña
const MIN_CONTRASENA = 8;

/**
 * Alta de un asesor disciplinar.
 * El asesor siempre se crea con estado ACTIVO.
 *
 * Props:
 *  - open, onClose
 *  - onSave: recibe el asesor nuevo (sin id; el id lo asigna quien lo guarda)
 *  - showToast: (mensaje, tipo) para avisar que se creó
 */
export default function ModalCrearAsesorDisciplinar({ open, onClose, onSave, showToast }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const [formData, setFormData] = useState(FORMULARIO_INICIAL);
    const [intentoGuardar, setIntentoGuardar] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const [openModalMateria, setOpenModalMateria] = useState(false);
    const [openModalHorario, setOpenModalHorario] = useState(false);

    const [catalogoMaterias, setCatalogoMaterias] = useState([]);
    const [catalogoHorarios, setCatalogoHorarios] = useState([]);

    // Al abrir: formulario limpio y catálogos cargados
    useEffect(() => {
        if (!open) return;

        setFormData(FORMULARIO_INICIAL);
        setIntentoGuardar(false);
        setGuardando(false);

        try {
            // TODO: reemplazar por la consulta real de catálogos al backend
            const catalogos = catalogoService.getCatalogos();
            setCatalogoMaterias(catalogos.materias || []);
            setCatalogoHorarios(catalogos.horarios || []);
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
        }
    }, [open]);

    // Actualiza un campo aplicando un filtro a lo que se escribe (o pega)
    const handleChange = (campo, limpiar = (valor) => valor) => (e) => {
        const valor = limpiar(e.target.value);
        setFormData((prev) => ({ ...prev, [campo]: valor }));
    };

    const agregarElemento = (campo, valor) => {
        setFormData((prev) =>
            prev[campo].includes(valor) ? prev : { ...prev, [campo]: [...prev[campo], valor] }
        );
    };

    const quitarElemento = (campo, index) => {
        setFormData((prev) => ({ ...prev, [campo]: prev[campo].filter((_, i) => i !== index) }));
    };

    // Validaciones
    const nombreVacio = !formData.nombre.trim();
    const correoVacio = !formData.correo.trim();
    const correoInvalido = !correoVacio && !FORMATO_CORREO.test(formData.correo.trim());
    const cuentaVacia = !formData.numeroCuenta.trim();
    const contrasenaVacia = !formData.contrasena;
    const contrasenaCorta = !contrasenaVacia && formData.contrasena.length < MIN_CONTRASENA;

    const errorCorreo = correoVacio ? 'Campo obligatorio' : correoInvalido ? 'Correo no válido' : '';
    const errorContrasena = contrasenaVacia
        ? 'Campo obligatorio'
        : contrasenaCorta
            ? `Mínimo ${MIN_CONTRASENA} caracteres`
            : '';

    const handleCrear = async () => {
        setIntentoGuardar(true);
        if (nombreVacio || correoVacio || correoInvalido || cuentaVacia || contrasenaVacia || contrasenaCorta) return;

        try {
            setGuardando(true);
            document.activeElement?.blur();
            // TODO: enviar el alta al backend (la contraseña solo viaja en esta petición) y usar el id que regrese
            await onSave?.({
                ...formData,
                nombre: formData.nombre.trim(),
                correo: formData.correo.trim(),
                telefono: formData.telefono.trim(),
                numeroCuenta: formData.numeroCuenta.trim(),
                estado: 'ACTIVO'
            });
            showToast?.('Asesor creado correctamente', 'success');
            onClose();
        } catch (error) {
            console.error('Error al crear el asesor:', error);
            showToast?.('No se pudo crear el asesor', 'error');
        } finally {
            setGuardando(false);
        }
    };

    const handleCloseModal = () => {
        document.activeElement?.blur();
        onClose();
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
                    : {
                        width: '500px',
                        maxWidth: '90vw',
                        maxHeight: '90dvh',
                        borderRadius: '12px',
                        p: 1.5
                    }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, pr: 7, fontWeight: 'bold', fontSize: '1.2rem' }}>
                Crear Asesor Disciplinar
                <IconButton
                    aria-label="close"
                    onClick={handleCloseModal}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 3 }}>
                {/* Solo letras y espacios */}
                <TextField
                    label="Nombre Completo"
                    size="small"
                    fullWidth
                    required
                    value={formData.nombre}
                    onChange={handleChange('nombre', (v) => v.replace(SOLO_LETRAS, ''))}
                    error={intentoGuardar && nombreVacio}
                    helperText={intentoGuardar && nombreVacio ? 'Campo obligatorio' : ''}
                    slotProps={{ htmlInput: { maxLength: 100 } }}
                />

                {/* Formato de correo: algo@dominio.ext */}
                <TextField
                    label="Correo Electrónico"
                    type="email"
                    size="small"
                    fullWidth
                    required
                    value={formData.correo}
                    onChange={handleChange('correo', (v) => v.replace(/\s/g, ''))}
                    error={intentoGuardar && Boolean(errorCorreo)}
                    helperText={intentoGuardar ? errorCorreo : ''}
                />

                {/* Solo números */}
                <TextField
                    label="Teléfono"
                    size="small"
                    fullWidth
                    value={formData.telefono}
                    onChange={handleChange('telefono', (v) => v.replace(SOLO_NUMEROS, ''))}
                    slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 10 } }}
                />

                {/* Solo números */}
                <TextField
                    label="Número de Cuenta"
                    size="small"
                    fullWidth
                    required
                    value={formData.numeroCuenta}
                    onChange={handleChange('numeroCuenta', (v) => v.replace(SOLO_NUMEROS, ''))}
                    error={intentoGuardar && cuentaVacia}
                    helperText={intentoGuardar && cuentaVacia ? 'Campo obligatorio' : ''}
                    slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 15 } }}
                />

                <CampoContrasena
                    label="Contraseña"
                    required
                    value={formData.contrasena}
                    onChange={handleChange('contrasena', (v) => v.replace(/\s/g, ''))}
                    error={intentoGuardar && Boolean(errorContrasena)}
                    helperText={intentoGuardar && errorContrasena ? errorContrasena : `Mínimo ${MIN_CONTRASENA} caracteres`}
                />

                <SeccionCatalogoAsesor
                    titulo="Materias que asesora"
                    items={formData.materias}
                    textoVacio="No hay materias añadidas."
                    onAdd={() => setOpenModalMateria(true)}
                    onRemove={(index) => quitarElemento('materias', index)}
                />

                <SeccionCatalogoAsesor
                    titulo="Horarios de asesoría"
                    items={formData.horarios}
                    textoVacio="No hay horarios añadidos."
                    onAdd={() => setOpenModalHorario(true)}
                    onRemove={(index) => quitarElemento('horarios', index)}
                />
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2,
                    pt: 1.5,
                    justifyContent: 'flex-end',
                    gap: 1,
                    pb: esCelular ? 'calc(16px + env(safe-area-inset-bottom))' : 2,
                    '& > button': { flex: esCelular ? 1 : 'none', minHeight: 40 }
                }}
            >
                <Button variant="outlined" color="inherit" onClick={handleCloseModal}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    disabled={guardando}
                    sx={{ backgroundColor: '#244B91', '&:hover': { backgroundColor: '#1B3A73' } }}
                    onClick={handleCrear}
                >
                    Crear Asesor
                </Button>
            </DialogActions>

            <ModalSeleccionCatalogo
                open={openModalMateria}
                onClose={() => setOpenModalMateria(false)}
                titulo="Seleccionar Materia"
                elementos={catalogoMaterias}
                renderTexto={(item) => item.materia}
                onSelect={(item) => {
                    agregarElemento('materias', item.materia);
                    setOpenModalMateria(false);
                }}
            />

            <ModalSeleccionCatalogo
                open={openModalHorario}
                onClose={() => setOpenModalHorario(false)}
                titulo="Seleccionar Horario"
                elementos={catalogoHorarios}
                renderTexto={(item) => item.horario}
                onSelect={(item) => {
                    agregarElemento('horarios', item.horario);
                    setOpenModalHorario(false);
                }}
            />
        </Dialog>
    );
}