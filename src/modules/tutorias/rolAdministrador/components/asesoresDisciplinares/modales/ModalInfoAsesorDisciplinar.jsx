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

const VALORES_VACIOS = {
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
// Largo mínimo de la contraseña (solo se valida si se escribe una nueva)
const MIN_CONTRASENA = 8;

/**
 * Información y edición de un asesor disciplinar.
 * El estado no se edita aquí; se conserva el que ya tiene el asesor.
 * La contraseña no se muestra: si se deja vacía no cambia, y si se escribe una se manda como nueva.
 *
 * Props:
 *  - open, onClose
 *  - data: asesor seleccionado
 *  - onSave: recibe el asesor con los cambios aplicados
 *  - showToast: (mensaje, tipo) para avisar que se guardó
 */
export default function ModalInfoAsesorDisciplinar({ open, onClose, data, onSave, showToast }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const [formData, setFormData] = useState(VALORES_VACIOS);
    // Copia inicial para saber si hubo cambios
    const [initialData, setInitialData] = useState(null);
    const [intentoGuardar, setIntentoGuardar] = useState(false);

    const [openModalMateria, setOpenModalMateria] = useState(false);
    const [openModalHorario, setOpenModalHorario] = useState(false);

    const [catalogoMaterias, setCatalogoMaterias] = useState([]);
    const [catalogoHorarios, setCatalogoHorarios] = useState([]);

    useEffect(() => {
        if (data && open) {
            const valoresIniciales = {
                nombre: data.nombre || '',
                correo: data.correo || '',
                telefono: data.telefono || '',
                numeroCuenta: data.numeroCuenta || '',
                contrasena: '',
                materias: data.materias ? [...data.materias] : [],
                horarios: data.horarios ? [...data.horarios] : []
            };

            setFormData(valoresIniciales);
            setInitialData(valoresIniciales);
            setIntentoGuardar(false);

            try {
                // TODO: reemplazar por la consulta real de catálogos al backend
                const catalogos = catalogoService.getCatalogos();
                setCatalogoMaterias(catalogos.materias || []);
                setCatalogoHorarios(catalogos.horarios || []);
            } catch (error) {
                console.error('Error al cargar catálogos:', error);
            }
        }
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
    const contrasenaCorta = formData.contrasena.length > 0 && formData.contrasena.length < MIN_CONTRASENA;

    const errorCorreo = correoVacio ? 'Campo obligatorio' : correoInvalido ? 'Correo no válido' : '';

    const handleApply = () => {
        if (!hasChanges()) return;

        setIntentoGuardar(true);
        if (nombreVacio || correoVacio || correoInvalido || cuentaVacia || contrasenaCorta) return;

        document.activeElement?.blur();

        // La contraseña solo se envía si se escribió una nueva
        const { contrasena, ...resto } = formData;
        const cambios = {
            ...data,
            ...resto,
            nombre: resto.nombre.trim(),
            correo: resto.correo.trim(),
            telefono: resto.telefono.trim(),
            numeroCuenta: resto.numeroCuenta.trim()
        };
        if (contrasena) cambios.contrasena = contrasena;

        // TODO: enviar los cambios al backend (la contraseña solo viaja en esta petición)
        onSave?.(cambios);
        showToast?.('Cambios aplicados correctamente', 'info');
        onClose();
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
                Información del Asesor Disciplinar
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
                    label="Nueva contraseña"
                    value={formData.contrasena}
                    onChange={handleChange('contrasena', (v) => v.replace(/\s/g, ''))}
                    error={intentoGuardar && contrasenaCorta}
                    helperText={
                        intentoGuardar && contrasenaCorta
                            ? `Mínimo ${MIN_CONTRASENA} caracteres`
                            : 'Déjala vacía para conservar la actual'
                    }
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
                    disabled={!hasChanges()}
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