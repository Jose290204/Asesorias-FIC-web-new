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

// TODO: mover este componente a una carpeta compartida cuando se haga la limpieza de duplicados
import CampoContrasena from '../../asesoresDisciplinares/modales/CampoContrasena';
import CamposLicenciaturaGrupo from './CamposLicenciaturaGrupo';

const FORMULARIO_INICIAL = {
    nombre: '',
    numeroCuenta: '',
    correo: '',
    telefono: '',
    licenciatura: '',
    grupo: '',
    promedio: '',
    contrasena: ''
};

// Letras (con acentos y ñ) y espacios
const SOLO_LETRAS = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g;
// Dígitos
const SOLO_NUMEROS = /\D/g;
// Formato básico de correo: algo@dominio.ext
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Largo mínimo de la contraseña
const MIN_CONTRASENA = 8;

// Deja solo dígitos y un punto decimal con hasta dos decimales (ej. 8.75)
const limpiarPromedio = (valor) => {
    const soloValido = valor.replace(/[^\d.]/g, '');
    const [entero, ...decimales] = soloValido.split('.');
    return decimales.length ? `${entero}.${decimales.join('').slice(0, 2)}` : entero;
};

/**
 * Alta de un estudiante.
 * El estudiante siempre se crea con estado ACTIVO.
 *
 * Props:
 *  - open, onClose
 *  - onSave: recibe el estudiante nuevo (sin id; el id lo asigna quien lo guarda)
 *  - showToast: (mensaje, tipo) para avisar que se creó
 */
export default function ModalCrearEstudiante({ open, onClose, onSave, showToast }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const [formData, setFormData] = useState(FORMULARIO_INICIAL);
    const [intentoGuardar, setIntentoGuardar] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // Al abrir: formulario limpio
    useEffect(() => {
        if (!open) return;

        setFormData(FORMULARIO_INICIAL);
        setIntentoGuardar(false);
        setGuardando(false);
    }, [open]);

    // Actualiza un campo aplicando un filtro a lo que se escribe (o pega)
    const handleChange = (campo, limpiar = (valor) => valor) => (e) => {
        const valor = limpiar(e.target.value);
        setFormData((prev) => ({ ...prev, [campo]: valor }));
    };

    // Validaciones
    const nombreVacio = !formData.nombre.trim();
    const correoVacio = !formData.correo.trim();
    const correoInvalido = !correoVacio && !FORMATO_CORREO.test(formData.correo.trim());
    const cuentaVacia = !formData.numeroCuenta.trim();
    const licenciaturaVacia = !formData.licenciatura;
    const promedioInvalido = formData.promedio !== '' && !(Number(formData.promedio) >= 0 && Number(formData.promedio) <= 10);
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
        if (
            nombreVacio ||
            correoVacio ||
            correoInvalido ||
            cuentaVacia ||
            licenciaturaVacia ||
            promedioInvalido ||
            contrasenaVacia ||
            contrasenaCorta
        ) {
            return;
        }

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
            showToast?.('Estudiante creado correctamente', 'success');
            onClose();
        } catch (error) {
            console.error('Error al crear el estudiante:', error);
            showToast?.('No se pudo crear el estudiante', 'error');
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
                        width: '550px',
                        maxWidth: '90vw',
                        maxHeight: '90dvh',
                        borderRadius: '12px',
                        p: 1.5
                    }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, pr: 7, fontWeight: 'bold', fontSize: '1.2rem' }}>
                Crear Estudiante
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
                    label="Nombre completo"
                    size="small"
                    fullWidth
                    required
                    value={formData.nombre}
                    onChange={handleChange('nombre', (v) => v.replace(SOLO_LETRAS, ''))}
                    error={intentoGuardar && nombreVacio}
                    helperText={intentoGuardar && nombreVacio ? 'Campo obligatorio' : ''}
                    slotProps={{ htmlInput: { maxLength: 100 } }}
                />

                {/* Solo números */}
                <TextField
                    label="Número de cuenta"
                    size="small"
                    fullWidth
                    required
                    value={formData.numeroCuenta}
                    onChange={handleChange('numeroCuenta', (v) => v.replace(SOLO_NUMEROS, ''))}
                    error={intentoGuardar && cuentaVacia}
                    helperText={intentoGuardar && cuentaVacia ? 'Campo obligatorio' : ''}
                    slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 15 } }}
                />

                {/* Formato de correo: algo@dominio.ext */}
                <TextField
                    label="Correo institucional"
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

                {/* Los grupos mostrados dependen de la licenciatura elegida */}
                <CamposLicenciaturaGrupo
                    licenciatura={formData.licenciatura}
                    grupo={formData.grupo}
                    onChange={(cambios) => setFormData((prev) => ({ ...prev, ...cambios }))}
                    required
                    mostrarErrores={intentoGuardar}
                >
                    {/* Número entre 0 y 10, con hasta dos decimales */}
                    <TextField
                        label="Promedio"
                        size="small"
                        sx={{ flex: 1 }}
                        value={formData.promedio}
                        onChange={handleChange('promedio', limpiarPromedio)}
                        error={intentoGuardar && promedioInvalido}
                        helperText={intentoGuardar && promedioInvalido ? 'Entre 0 y 10' : ''}
                        slotProps={{ htmlInput: { inputMode: 'decimal', maxLength: 5 } }}
                    />
                </CamposLicenciaturaGrupo>

                <CampoContrasena
                    label="Contraseña"
                    required
                    value={formData.contrasena}
                    onChange={handleChange('contrasena', (v) => v.replace(/\s/g, ''))}
                    error={intentoGuardar && Boolean(errorContrasena)}
                    helperText={intentoGuardar && errorContrasena ? errorContrasena : `Mínimo ${MIN_CONTRASENA} caracteres`}
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
                    Crear Estudiante
                </Button>
            </DialogActions>
        </Dialog>
    );
}