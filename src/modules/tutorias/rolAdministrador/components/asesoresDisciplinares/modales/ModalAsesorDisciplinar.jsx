import CloseIcon from '@mui/icons-material/Close';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useEffect, useState } from 'react';

import ModalDisponibilidadAsesor from '../../asesores/ModalDisponibilidadAsesor';
import ResumenDisponibilidad from '../../asesores/ResumenDisponibilidad';
import CampoContrasena from './CampoContrasena';

const VALORES_VACIOS = {
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    numeroCuenta: '',
    correo: '',
    telefono: '',
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

const TITULOS = {
    crear: 'Crear Asesor Disciplinar',
    editar: 'Editar Asesor Disciplinar',
    info: 'Información del Asesor'
};

/**
 * Datos de un asesor disciplinar, en tres modos según `modo`:
 *  - 'crear': alta. Nace ACTIVO y con la contraseña que escribe el administrador. Sin disponibilidad:
 *    esta se arma después, desde Información o Editar.
 *  - 'info': todo bloqueado; muestra también su disponibilidad. Solo se puede cerrar.
 *  - 'editar': todo se puede cambiar. La contraseña empieza vacía: si no se escribe, no cambia.
 *    Desde aquí también se abre el editor de disponibilidad.
 *
 * Props:
 *  - open, onClose
 *  - data: asesor seleccionado (formato de asesoresAdminService); en 'crear' no se usa
 *  - onSave: crear -> onSave(formulario); editar -> onSave(asesor, formulario). Regresa una promesa con true si salió bien
 *    (el modal se cierra) o false si falló (el modal sigue abierto; el aviso lo da quien lo usa)
 *  - onGuardarDisponibilidad: onGuardarDisponibilidad(asesor, cuerpo) -> promesa con true/false
 */
export default function ModalAsesorDisciplinar({ open, onClose, modo = 'info', data, onSave, onGuardarDisponibilidad }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const crear = modo === 'crear';
    const soloLectura = modo === 'info';
    const editando = !soloLectura;

    const [formData, setFormData] = useState(VALORES_VACIOS);
    // Copia inicial para saber si hubo cambios
    const [initialData, setInitialData] = useState(VALORES_VACIOS);
    const [intentoGuardar, setIntentoGuardar] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [modalDisponibilidadOpen, setModalDisponibilidadOpen] = useState(false);

    // Al abrir (o al cambiar de asesor) se cargan los datos. No depende de "data" completo a propósito:
    // al guardar la disponibilidad la lista se recarga y no deben perderse los cambios sin guardar del formulario.
    useEffect(() => {
        if (!open) return;

        const valoresIniciales = crear || !data
            ? VALORES_VACIOS
            : {
                nombres: data.nombres || '',
                apellido_paterno: data.apellido_paterno || '',
                apellido_materno: data.apellido_materno || '',
                numeroCuenta: data.numeroCuenta || '',
                correo: data.correo || '',
                telefono: data.telefono || '',
                contrasena: '',
                confirmarContrasena: ''
            };

        setFormData(valoresIniciales);
        setInitialData(valoresIniciales);
        setIntentoGuardar(false);
        setGuardando(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, data?.id, crear]);

    // Hay cambios reales respecto a lo que se abrió (el alta siempre se puede intentar)
    const hasChanges = () => crear || JSON.stringify(formData) !== JSON.stringify(initialData);

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
    const telefonoInvalido = formData.telefono !== '' && formData.telefono.length < MIN_TELEFONO;

    // Contraseña: obligatoria en el alta; en la edición solo se valida si se escribió una nueva
    const contrasenaVacia = !formData.contrasena;
    const contrasenaModificada = !contrasenaVacia;
    const contrasenaFaltante = crear && contrasenaVacia;
    const contrasenaCorta = contrasenaModificada && formData.contrasena.length < MIN_CONTRASENA;
    const contrasenaNoCoincide = contrasenaModificada && formData.contrasena !== formData.confirmarContrasena;

    const errorCorreo = correoVacio ? 'Campo obligatorio' : correoInvalido ? 'Correo no válido' : '';

    const handleGuardar = async () => {
        if (!hasChanges()) return;

        setIntentoGuardar(true);
        if (
            nombresVacio ||
            paternoVacio ||
            correoVacio ||
            correoInvalido ||
            telefonoInvalido ||
            contrasenaFaltante ||
            contrasenaCorta ||
            contrasenaNoCoincide
        ) {
            return;
        }

        setGuardando(true);
        document.activeElement?.blur();

        const formulario = {
            ...formData,
            nombres: formData.nombres.trim(),
            apellido_paterno: formData.apellido_paterno.trim(),
            apellido_materno: formData.apellido_materno.trim(),
            correo: formData.correo.trim(),
            telefono: formData.telefono.trim(),
            numeroCuenta: formData.numeroCuenta.trim()
        };

        const guardado = crear ? await onSave?.(formulario) : await onSave?.(data, formulario);

        setGuardando(false);
        if (guardado) onClose();
    };

    const handleCloseModal = () => {
        document.activeElement?.blur();
        onClose();
    };

    const abrirDisponibilidad = (e) => {
        e.currentTarget.blur();
        setModalDisponibilidadOpen(true);
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
                {TITULOS[modo]}
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
                    // Se nota que está bloqueado: fondo gris suave y borde tenue
                    '& .MuiOutlinedInput-root.Mui-disabled': { backgroundColor: '#F3F5F9' },
                    '& .Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: '#E1E5EC' }
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
                    slotProps={{ inputLabel: { shrink: soloLectura || undefined } }}
                />

                {/* Solo números, opcional */}
                <TextField
                    label="Número de cuenta"
                    placeholder={soloLectura ? '—' : undefined}
                    disabled={!editando}
                    size="small"
                    fullWidth
                    value={formData.numeroCuenta}
                    onChange={handleChange('numeroCuenta', (v) => v.replace(SOLO_NUMEROS, ''))}
                    slotProps={{ inputLabel: { shrink: soloLectura || undefined }, htmlInput: { inputMode: 'numeric', maxLength: 20 } }}
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

                {editando && (
                    <>
                        {/* Alta: obligatoria. Edición: vacía = no se cambia (sirve si el asesor la olvidó) */}
                        <CampoContrasena
                            label={crear ? 'Contraseña' : 'Nueva contraseña'}
                            required={crear}
                            value={formData.contrasena}
                            onChange={handleChange('contrasena', (v) => v.replace(/\s/g, ''))}
                            error={intentoGuardar && (contrasenaFaltante || contrasenaCorta)}
                            helperText={
                                intentoGuardar && contrasenaFaltante
                                    ? 'Campo obligatorio'
                                    : contrasenaCorta
                                        ? `Mínimo ${MIN_CONTRASENA} caracteres`
                                        : crear
                                            ? `Mínimo ${MIN_CONTRASENA} caracteres`
                                            : 'Déjala vacía para conservar la actual. Al cambiarla se cierran sus sesiones abiertas.'
                            }
                            slotProps={{ htmlInput: { maxLength: MAX_CONTRASENA } }}
                        />

                        {/* En la edición solo aparece cuando se escribe una contraseña nueva */}
                        {(crear || contrasenaModificada) && (
                            <CampoContrasena
                                label="Confirmar contraseña"
                                required={crear}
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

                {/* Disponibilidad: en el alta no hay; se arma después desde Información o Editar */}
                {crear ? (
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        La disponibilidad (materias, horarios y modalidad) se configura después de crearlo, desde Editar.
                        Hasta entonces no aparecerá para los estudiantes.
                    </Typography>
                ) : (
                    data && (
                        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between gap-3">
                                <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#1F2937' }}>
                                    Disponibilidad
                                </Typography>

                                {editando && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<EditCalendarOutlinedIcon />}
                                        onClick={abrirDisponibilidad}
                                        sx={{ flexShrink: 0, textTransform: 'none', borderRadius: '5px', color: '#244B91', borderColor: '#244B91' }}
                                    >
                                        {data.disponibilidad.vacia ? 'Armar' : 'Editar'}
                                    </Button>
                                )}
                            </div>

                            <ResumenDisponibilidad disponibilidad={data.disponibilidad} />
                        </div>
                    )
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
                            sx={
                                crear
                                    ? { backgroundColor: '#244B91', '&:hover': { backgroundColor: '#1B3A73' } }
                                    : {
                                        backgroundColor: '#2e7d32',
                                        '&:hover': { backgroundColor: '#1b5e20' },
                                        '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' }
                                    }
                            }
                            onClick={handleGuardar}
                        >
                            {crear ? 'Crear Asesor' : 'Aplicar Cambios'}
                        </Button>
                    </>
                ) : (
                    <Button variant="outlined" color="inherit" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                )}
            </DialogActions>

            {/* Editor de disponibilidad: solo existe con un asesor ya creado */}
            {!crear && (
                <ModalDisponibilidadAsesor
                    open={modalDisponibilidadOpen}
                    onClose={() => setModalDisponibilidadOpen(false)}
                    asesor={data}
                    onGuardar={(cuerpo) => onGuardarDisponibilidad?.(data, cuerpo)}
                />
            )}
        </Dialog>
    );
}
