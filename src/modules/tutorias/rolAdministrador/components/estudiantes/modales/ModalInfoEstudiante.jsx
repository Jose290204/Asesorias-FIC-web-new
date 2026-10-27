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
// Largo mínimo de la contraseña (solo se valida si se modifica)
const MIN_CONTRASENA = 8;

// Deja solo dígitos y un punto decimal con hasta dos decimales (ej. 8.75)
const limpiarPromedio = (valor) => {
    const soloValido = valor.replace(/[^\d.]/g, '');
    const [entero, ...decimales] = soloValido.split('.');
    return decimales.length ? `${entero}.${decimales.join('').slice(0, 2)}` : entero;
};

/**
 * Información y edición de un estudiante.
 * La contraseña va al final y se ve con el ojito. Si no se toca, no pasa nada;
 * si se cambia, aparece "Confirmar contraseña" y deben coincidir.
 *
 * Props:
 *  - open, onClose
 *  - data: estudiante seleccionado
 *  - onSave: recibe el estudiante con los cambios (puede ser asíncrona; si falla, se avisa con un error)
 *  - showToast: (mensaje, tipo) para avisar el resultado
 */
export default function ModalInfoEstudiante({ open, onClose, data, onSave, showToast }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const [formData, setFormData] = useState(VALORES_VACIOS);
    // Copia inicial para saber si hubo cambios
    const [initialData, setInitialData] = useState(null);
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [intentoGuardar, setIntentoGuardar] = useState(false);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (!data || !open) return;

        const promedioActual = data.promedio ?? data.raw?.promedio;

        const valoresIniciales = {
            nombre: data.nombre || '',
            numeroCuenta: data.numeroCuenta || '',
            correo: data.correo || '',
            telefono: data.telefono || '',
            licenciatura: data.licenciatura || data.raw?.licenciatura || '',
            grupo: data.grupo || data.raw?.grupo || '',
            promedio: promedioActual !== undefined && promedioActual !== null ? String(promedioActual) : '',
            // TODO: la contraseña actual depende de lo que entregue el backend
            contrasena: data.contrasena || ''
        };

        setFormData(valoresIniciales);
        setInitialData(valoresIniciales);
        setConfirmarContrasena('');
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
    const nombreVacio = !formData.nombre.trim();
    const correoVacio = !formData.correo.trim();
    const correoInvalido = !correoVacio && !FORMATO_CORREO.test(formData.correo.trim());
    const cuentaVacia = !formData.numeroCuenta.trim();
    const promedioInvalido = formData.promedio !== '' && !(Number(formData.promedio) >= 0 && Number(formData.promedio) <= 10);

    // La contraseña cambió respecto a la que traía el estudiante
    const contrasenaModificada = Boolean(initialData) && formData.contrasena !== initialData.contrasena;
    const contrasenaCorta = contrasenaModificada && formData.contrasena.length < MIN_CONTRASENA;
    const contrasenaNoCoincide = contrasenaModificada && formData.contrasena !== confirmarContrasena;

    const errorCorreo = correoVacio ? 'Campo obligatorio' : correoInvalido ? 'Correo no válido' : '';

    const handleApply = async () => {
        if (!hasChanges()) return;

        setIntentoGuardar(true);
        if (
            nombreVacio ||
            correoVacio ||
            correoInvalido ||
            cuentaVacia ||
            promedioInvalido ||
            contrasenaCorta ||
            contrasenaNoCoincide
        ) {
            return;
        }

        try {
            setGuardando(true);
            document.activeElement?.blur();

            // La contraseña solo se actualiza si se modificó
            const { contrasena, ...resto } = formData;
            const cambios = {
                ...data,
                ...resto,
                nombre: resto.nombre.trim(),
                correo: resto.correo.trim(),
                telefono: resto.telefono.trim(),
                numeroCuenta: resto.numeroCuenta.trim()
            };
            if (contrasenaModificada) cambios.contrasena = contrasena;

            // TODO: enviar los cambios al backend (la contraseña solo viaja en esta petición)
            await onSave?.(cambios);
            showToast?.('Información del estudiante actualizada', 'info');
            onClose();
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
            showToast?.('Error al guardar los cambios', 'error');
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
                Información del Estudiante
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
                    value={formData.contrasena}
                    onChange={handleChange('contrasena', (v) => v.replace(/\s/g, ''))}
                    error={contrasenaCorta}
                    helperText={contrasenaCorta ? `Mínimo ${MIN_CONTRASENA} caracteres` : ''}
                />

                {/* Solo aparece cuando se modifica la contraseña */}
                {contrasenaModificada && (
                    <CampoContrasena
                        label="Confirmar contraseña"
                        value={confirmarContrasena}
                        onChange={(e) => setConfirmarContrasena(e.target.value.replace(/\s/g, ''))}
                        error={contrasenaNoCoincide && (intentoGuardar || confirmarContrasena.length > 0)}
                        helperText={
                            contrasenaNoCoincide && (intentoGuardar || confirmarContrasena.length > 0)
                                ? 'Las contraseñas no coinciden'
                                : ''
                        }
                    />
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
            </DialogActions>
        </Dialog>
    );
}