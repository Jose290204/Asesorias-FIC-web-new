import CloseIcon from '@mui/icons-material/Close';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip,
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
 * Información y edición de un estudiante.
 * Abre en solo lectura; el lápiz junto al título activa la edición (y otra vez lo desactiva, descartando los cambios).
 * En edición todo se puede cambiar. La contraseña aparece al final y empieza vacía: si no se escribe, no cambia;
 * si se escribe una nueva, se pide confirmarla (útil cuando el estudiante la olvidó).
 *
 * Props:
 *  - open, onClose
 *  - data: estudiante seleccionado (formato de estudiantesAdminService)
 *  - onSave: recibe el formulario y regresa una promesa con true si se guardó (el modal se cierra)
 *    o false si falló (el modal sigue abierto; el aviso lo da quien lo usa)
 */
export default function ModalInfoEstudiante({ open, onClose, data, onSave }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const [formData, setFormData] = useState(VALORES_VACIOS);
    // Copia inicial para saber si hubo cambios
    const [initialData, setInitialData] = useState(null);
    const [intentoGuardar, setIntentoGuardar] = useState(false);
    const [guardando, setGuardando] = useState(false);
    // false = solo lectura (así abre siempre); true = se puede editar
    const [editando, setEditando] = useState(false);

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
        setEditando(false);
    }, [data, open]);

    // Hay cambios reales respecto a lo que se abrió
    const hasChanges = () => {
        if (!initialData) return false;
        return JSON.stringify(formData) !== JSON.stringify(initialData);
    };

    // El lápiz alterna entre ver y editar. Al salir de la edición se descartan los cambios sin guardar
    const handleToggleEdicion = () => {
        document.activeElement?.blur();
        if (editando && initialData) {
            setFormData(initialData);
            setIntentoGuardar(false);
        }
        setEditando((prev) => !prev);
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
            <DialogTitle sx={{ m: 0, p: 2, pr: 7, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', fontSize: '1.2rem' }}>
                Información del Estudiante
                <Tooltip title={editando ? 'Dejar de editar' : 'Editar'}>
                    <IconButton
                        size="small"
                        aria-label={editando ? 'Dejar de editar' : 'Editar estudiante'}
                        onClick={handleToggleEdicion}
                        sx={{ color: editando ? '#244B91' : 'text.secondary', backgroundColor: editando ? 'rgba(36, 75, 145, 0.10)' : 'transparent' }}
                    >
                        {editando ? <EditOffOutlinedIcon fontSize="small" /> : <EditOutlinedIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
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
                    '& .MuiInputLabel-root.Mui-disabled': { color: 'text.secondary' }
                }}
            >
                {/* Solo letras y espacios */}
                <TextField
                    label="Nombre(s)"
                    disabled={!editando}
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
                    disabled={!editando}
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
                    disabled={!editando}
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
                    disabled={!editando}
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
                    disabled={!editando}
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
                    disabled={!editando}
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
                        slotProps={{ htmlInput: { maxLength: MAX_CONTRASENA } }}
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
                            slotProps={{ htmlInput: { maxLength: MAX_CONTRASENA } }}
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
                        <Button variant="outlined" color="inherit" onClick={handleToggleEdicion}>
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
