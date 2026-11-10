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
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    numeroCuenta: '',
    correo: '',
    telefono: '',
    licenciaturaId: '',
    grupo_id: '',
    contrasena: '',
    confirmarContrasena: ''
};

// Letras (con acentos y ñ) y espacios
const SOLO_LETRAS = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g;
// Dígitos
const SOLO_NUMEROS = /\D/g;
// Formato básico de correo: algo@dominio.ext
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Largo de la contraseña (el backend pide de 8 a 72)
const MIN_CONTRASENA = 8;
const MAX_CONTRASENA = 72;
// El teléfono es opcional, pero si se escribe debe tener entre 10 y 15 dígitos
const MIN_TELEFONO = 10;

/**
 * Alta de un estudiante. Se crea ACTIVO y con la contraseña que escribe el administrador.
 *
 * Props:
 *  - open, onClose
 *  - onSave: recibe el formulario y regresa una promesa con true si se creó (el modal se cierra)
 *    o false si falló (el modal sigue abierto con lo escrito; el aviso lo da quien lo usa)
 */
export default function ModalCrearEstudiante({ open, onClose, onSave }) {
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
    const nombresVacio = !formData.nombres.trim();
    const paternoVacio = !formData.apellido_paterno.trim();
    const correoVacio = !formData.correo.trim();
    const correoInvalido = !correoVacio && !FORMATO_CORREO.test(formData.correo.trim());
    const cuentaVacia = !formData.numeroCuenta.trim();
    const telefonoInvalido = formData.telefono !== '' && formData.telefono.length < MIN_TELEFONO;
    const grupoVacio = !formData.grupo_id;
    const contrasenaVacia = !formData.contrasena;
    const contrasenaCorta = !contrasenaVacia && formData.contrasena.length < MIN_CONTRASENA;
    const contrasenaNoCoincide = !contrasenaVacia && formData.contrasena !== formData.confirmarContrasena;

    const errorCorreo = correoVacio ? 'Campo obligatorio' : correoInvalido ? 'Correo no válido' : '';
    const errorContrasena = contrasenaVacia
        ? 'Campo obligatorio'
        : contrasenaCorta
            ? `Mínimo ${MIN_CONTRASENA} caracteres`
            : '';

    const handleCrear = async () => {
        setIntentoGuardar(true);
        if (
            nombresVacio ||
            paternoVacio ||
            correoVacio ||
            correoInvalido ||
            cuentaVacia ||
            telefonoInvalido ||
            grupoVacio ||
            contrasenaVacia ||
            contrasenaCorta ||
            contrasenaNoCoincide
        ) {
            return;
        }

        setGuardando(true);
        document.activeElement?.blur();

        const guardado = await onSave?.({
            ...formData,
            nombres: formData.nombres.trim(),
            apellido_paterno: formData.apellido_paterno.trim(),
            apellido_materno: formData.apellido_materno.trim(),
            correo: formData.correo.trim(),
            telefono: formData.telefono.trim(),
            numeroCuenta: formData.numeroCuenta.trim()
        });

        setGuardando(false);
        if (guardado) onClose();
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
                    label="Nombre(s)"
                    size="small"
                    fullWidth
                    required
                    value={formData.nombres}
                    onChange={handleChange('nombres', (v) => v.replace(SOLO_LETRAS, ''))}
                    error={intentoGuardar && nombresVacio}
                    helperText={intentoGuardar && nombresVacio ? 'Campo obligatorio' : ''}
                    slotProps={{ htmlInput: { maxLength: 60 } }}
                />

                <div className="flex flex-col gap-5 sm:flex-row sm:gap-4">
                    <TextField
                        label="Apellido paterno"
                        size="small"
                        sx={{ flex: 1 }}
                        required
                        value={formData.apellido_paterno}
                        onChange={handleChange('apellido_paterno', (v) => v.replace(SOLO_LETRAS, ''))}
                        error={intentoGuardar && paternoVacio}
                        helperText={intentoGuardar && paternoVacio ? 'Campo obligatorio' : ''}
                        slotProps={{ htmlInput: { maxLength: 60 } }}
                    />

                    <TextField
                        label="Apellido materno"
                        size="small"
                        sx={{ flex: 1 }}
                        value={formData.apellido_materno}
                        onChange={handleChange('apellido_materno', (v) => v.replace(SOLO_LETRAS, ''))}
                        slotProps={{ htmlInput: { maxLength: 60 } }}
                    />
                </div>

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
                    slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 20 } }}
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

                {/* Solo números, opcional */}
                <TextField
                    label="Teléfono"
                    size="small"
                    fullWidth
                    value={formData.telefono}
                    onChange={handleChange('telefono', (v) => v.replace(SOLO_NUMEROS, ''))}
                    error={intentoGuardar && telefonoInvalido}
                    helperText={intentoGuardar && telefonoInvalido ? `Mínimo ${MIN_TELEFONO} dígitos` : ''}
                    slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 15 } }}
                />

                {/* Los grupos mostrados dependen de la licenciatura elegida; el grupo es obligatorio */}
                <CamposLicenciaturaGrupo
                    licenciaturaId={formData.licenciaturaId}
                    grupoId={formData.grupo_id}
                    onChange={({ licenciaturaId, grupoId }) =>
                        setFormData((prev) => ({ ...prev, licenciaturaId, grupo_id: grupoId }))
                    }
                    mostrarErrores={intentoGuardar}
                />

                <CampoContrasena
                    label="Contraseña"
                    required
                    value={formData.contrasena}
                    onChange={handleChange('contrasena', (v) => v.replace(/\s/g, ''))}
                    error={intentoGuardar && Boolean(errorContrasena)}
                    helperText={intentoGuardar && errorContrasena ? errorContrasena : `Mínimo ${MIN_CONTRASENA} caracteres`}
                    slotProps={{ htmlInput: { maxLength: MAX_CONTRASENA } }}
                />

                <CampoContrasena
                    label="Confirmar contraseña"
                    required
                    value={formData.confirmarContrasena}
                    onChange={handleChange('confirmarContrasena', (v) => v.replace(/\s/g, ''))}
                    error={contrasenaNoCoincide && (intentoGuardar || formData.confirmarContrasena.length > 0)}
                    helperText={
                        contrasenaNoCoincide && (intentoGuardar || formData.confirmarContrasena.length > 0)
                            ? 'Las contraseñas no coinciden'
                            : ''
                    }
                    slotProps={{ htmlInput: { maxLength: MAX_CONTRASENA } }}
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
