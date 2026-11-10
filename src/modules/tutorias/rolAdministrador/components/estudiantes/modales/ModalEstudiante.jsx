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

const VALORES_VACIOS = {
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
// Largo de la contraseña (solo se valida si se escribe una nueva; el backend pide de 8 a 72)
const MIN_CONTRASENA = 8;
const MAX_CONTRASENA = 72;
// El teléfono es opcional, pero si se escribe debe tener entre 10 y 15 dígitos
const MIN_TELEFONO = 10;

/**
 * Datos de un estudiante, en dos modos según `soloLectura`:
 *  - soloLectura: "Información del Estudiante". Todo bloqueado y sin contraseña; solo se puede cerrar.
 *  - edición (por defecto): "Editar Estudiante". Todo se puede cambiar. La contraseña aparece al final y empieza
 *    vacía: si no se escribe, no cambia; si se escribe una nueva, se pide confirmarla (útil cuando el estudiante
 *    la olvidó).
 *
 * Props:
 *  - open, onClose
 *  - data: estudiante seleccionado (formato de estudiantesAdminService)
 *  - soloLectura: true para solo ver
 *  - onSave: recibe el formulario y regresa una promesa con true si se guardó (el modal se cierra)
 *    o false si falló (el modal sigue abierto; el aviso lo da quien lo usa)
 */
export default function ModalEstudiante({ open, onClose, data, onSave, soloLectura = false }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const [formData, setFormData] = useState(VALORES_VACIOS);
    // Copia inicial para saber si hubo cambios
    const [initialData, setInitialData] = useState(null);
    const [intentoGuardar, setIntentoGuardar] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const editando = !soloLectura;

    useEffect(() => {
        if (!data || !open) return;

        const valoresIniciales = {
            nombres: data.nombres || '',
            apellido_paterno: data.apellido_paterno || '',
            apellido_materno: data.apellido_materno || '',
            numeroCuenta: data.numeroCuenta || '',
            correo: data.correo || '',
            telefono: data.telefono || '',
            licenciaturaId: data.licenciatura_id || '',
            grupo_id: data.grupo_id || '',
            contrasena: '',
            confirmarContrasena: ''
        };

        setFormData(valoresIniciales);
        setInitialData(valoresIniciales);
        setIntentoGuardar(false);
        setGuardando(false);
    }, [data, open]);

    // Hay cambios reales respecto a lo que se abrió
    const hasChanges = () => {
        if (!initialData) return false;
        return JSON.stringify(formData) !== JSON.stringify(initialData);
    };

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

    // Contraseña nueva: solo se valida si se escribió algo
    const contrasenaModificada = formData.contrasena !== '';
    const contrasenaCorta = contrasenaModificada && formData.contrasena.length < MIN_CONTRASENA;
    const contrasenaNoCoincide = contrasenaModificada && formData.contrasena !== formData.confirmarContrasena;

    const errorCorreo = correoVacio ? 'Campo obligatorio' : correoInvalido ? 'Correo no válido' : '';

    const handleApply = async () => {
        if (!hasChanges()) return;

        setIntentoGuardar(true);
        if (
            nombresVacio ||
            paternoVacio ||
            correoVacio ||
            correoInvalido ||
            cuentaVacia ||
            telefonoInvalido ||
            grupoVacio ||
            contrasenaCorta ||
            contrasenaNoCoincide
        ) {
            return;
        }

        setGuardando(true);
        document.activeElement?.blur();

        const guardado = await onSave?.(data, {
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
                {soloLectura ? 'Información del Estudiante' : 'Editar Estudiante'}
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
                    // En solo lectura los campos siguen legibles (MUI los pone en gris claro al deshabilitarlos)
                    '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#1F2937' },
                    '& .MuiInputLabel-root.Mui-disabled': { color: 'text.secondary' },
                    // Se nota que está bloqueado: fondo gris suave, borde tenue y sin flecha en las listas
                    '& .MuiOutlinedInput-root.Mui-disabled': { backgroundColor: '#F3F5F9' },
                    '& .Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: '#E1E5EC' },
                    '& .MuiSelect-icon.Mui-disabled': { display: 'none' }
                }}
            >
                {/* Solo letras y espacios */}
                <TextField
                    label="Nombre(s)"
                    placeholder={soloLectura ? '—' : undefined}
                    disabled={!editando}
                    size="small"
                    fullWidth
                    required={editando}
                    value={formData.nombres}
                    onChange={handleChange('nombres', (v) => v.replace(SOLO_LETRAS, ''))}
                    error={intentoGuardar && nombresVacio}
                    helperText={intentoGuardar && nombresVacio ? 'Campo obligatorio' : ''}
                    slotProps={{ inputLabel: { shrink: soloLectura || undefined }, htmlInput: { maxLength: 60 } }}
                />

                <div className="flex flex-col gap-5 sm:flex-row sm:gap-4">
                    <TextField
                        label="Apellido paterno"
                        placeholder={soloLectura ? '—' : undefined}
                    disabled={!editando}
                        size="small"
                        sx={{ flex: 1 }}
                        required={editando}
                        value={formData.apellido_paterno}
                        onChange={handleChange('apellido_paterno', (v) => v.replace(SOLO_LETRAS, ''))}
                        error={intentoGuardar && paternoVacio}
                        helperText={intentoGuardar && paternoVacio ? 'Campo obligatorio' : ''}
                        slotProps={{ inputLabel: { shrink: soloLectura || undefined }, htmlInput: { maxLength: 60 } }}
                    />

                    <TextField
                        label="Apellido materno"
                        placeholder={soloLectura ? '—' : undefined}
                    disabled={!editando}
                        size="small"
                        sx={{ flex: 1 }}
                        value={formData.apellido_materno}
                        onChange={handleChange('apellido_materno', (v) => v.replace(SOLO_LETRAS, ''))}
                        slotProps={{ inputLabel: { shrink: soloLectura || undefined }, htmlInput: { maxLength: 60 } }}
                    />
                </div>

                {/* Solo números */}
                <TextField
                    label="Número de cuenta"
                    placeholder={soloLectura ? '—' : undefined}
                    disabled={!editando}
                    size="small"
                    fullWidth
                    required={editando}
                    value={formData.numeroCuenta}
                    onChange={handleChange('numeroCuenta', (v) => v.replace(SOLO_NUMEROS, ''))}
                    error={intentoGuardar && cuentaVacia}
                    helperText={intentoGuardar && cuentaVacia ? 'Campo obligatorio' : ''}
                    slotProps={{ inputLabel: { shrink: soloLectura || undefined }, htmlInput: { inputMode: 'numeric', maxLength: 20 } }}
                />

                {/* Formato de correo: algo@dominio.ext */}
                <TextField
                    label="Correo institucional"
                    placeholder={soloLectura ? '—' : undefined}
                    disabled={!editando}
                    type="email"
                    size="small"
                    fullWidth
                    required={editando}
                    value={formData.correo}
                    onChange={handleChange('correo', (v) => v.replace(/\s/g, ''))}
                    error={intentoGuardar && Boolean(errorCorreo)}
                    helperText={intentoGuardar ? errorCorreo : ''}
                />

                {/* Solo números, opcional */}
                <TextField
                    label="Teléfono"
                    placeholder={soloLectura ? '—' : undefined}
                    disabled={!editando}
                    size="small"
                    fullWidth
                    value={formData.telefono}
                    onChange={handleChange('telefono', (v) => v.replace(SOLO_NUMEROS, ''))}
                    error={intentoGuardar && telefonoInvalido}
                    helperText={intentoGuardar && telefonoInvalido ? `Mínimo ${MIN_TELEFONO} dígitos` : ''}
                    slotProps={{ inputLabel: { shrink: soloLectura || undefined }, htmlInput: { inputMode: 'numeric', maxLength: 15 } }}
                />

                {/* Los grupos mostrados dependen de la licenciatura elegida; el grupo es obligatorio */}
                <CamposLicenciaturaGrupo
                    licenciaturaId={formData.licenciaturaId}
                    grupoId={formData.grupo_id}
                    onChange={({ licenciaturaId, grupoId }) =>
                        setFormData((prev) => ({ ...prev, licenciaturaId, grupo_id: grupoId }))
                    }
                    mostrarErrores={intentoGuardar}
                    soloLectura={!editando}
                />

                {editando && (
                    <>
                    {/* Vacía = no se cambia. Sirve para ponerle una nueva si el estudiante la olvidó */}
                    <CampoContrasena
                        label="Nueva contraseña"
                        value={formData.contrasena}
                        onChange={handleChange('contrasena', (v) => v.replace(/\s/g, ''))}
                        error={contrasenaCorta}
                        helperText={
                            contrasenaCorta
                                ? `Mínimo ${MIN_CONTRASENA} caracteres`
                                : 'Déjala vacía para conservar la actual. Al cambiarla se cierran sus sesiones abiertas.'
                        }
                        slotProps={{ inputLabel: { shrink: soloLectura || undefined }, htmlInput: { maxLength: MAX_CONTRASENA } }}
                    />

                    {/* Solo aparece cuando se escribe una contraseña nueva */}
                    {contrasenaModificada && (
                        <CampoContrasena
                            label="Confirmar contraseña"
                            value={formData.confirmarContrasena}
                            onChange={handleChange('confirmarContrasena', (v) => v.replace(/\s/g, ''))}
                            error={contrasenaNoCoincide && (intentoGuardar || formData.confirmarContrasena.length > 0)}
                            helperText={
                                contrasenaNoCoincide && (intentoGuardar || formData.confirmarContrasena.length > 0)
                                    ? 'Las contraseñas no coinciden'
                                    : ''
                            }
                            slotProps={{ inputLabel: { shrink: soloLectura || undefined }, htmlInput: { maxLength: MAX_CONTRASENA } }}
                        />
                    )}
                    </>
                )}
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
                {editando ? (
                    <>
                        <Button variant="outlined" color="inherit" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            disabled={!hasChanges() || guardando}
                            sx={{
                                backgroundColor: '#2e7d32',
                                '&:hover': { backgroundColor: '#1b5e20' },
                                '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' }
                            }}
                            onClick={handleApply}
                        >
                            Aplicar Cambios
                        </Button>
                    </>
                ) : (
                    <Button variant="outlined" color="inherit" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
