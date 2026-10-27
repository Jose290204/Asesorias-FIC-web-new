import CloseIcon from '@mui/icons-material/Close';
import {
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
import { useEffect, useState } from 'react';

import { catalogoService } from '../../../services/catalogoService';
// TODO: mover estos componentes a una carpeta compartida cuando se haga la limpieza de duplicados
import CampoContrasena from '../../asesoresDisciplinares/modales/CampoContrasena';
import ModalSeleccionCatalogo from '../../asesoresDisciplinares/modales/ModalSeleccionCatalogo';
import SeccionCatalogoAsesor from '../../asesoresDisciplinares/modales/SeccionCatalogoAsesor';

const VALORES_VACIOS = {
    nombre: '',
    numeroCuenta: '',
    contrasena: '',
    correo: '',
    telefono: '',
    licenciatura: '',
    grupo: '',
    promedio: '',
    materias: [],
    horarios: []
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

// Altura máxima del menú de las listas desplegables, para que no se desborden
const MENU_LISTA = { slotProps: { paper: { sx: { maxHeight: 240 } } } };

/**
 * Información y edición de un asesor par.
 * Aunque sea un estudiante, desde aquí se puede modificar toda su información,
 * incluida la contraseña (se ve con el ojito; si se cambia, hay que confirmarla).
 *
 * Props:
 *  - open, onClose
 *  - data: asesor seleccionado
 *  - onSave: recibe el asesor con los cambios aplicados
 *  - showToast: (mensaje, tipo) para avisar que se guardó
 */
export default function ModalInfoAsesorPar({ open, onClose, data, onSave, showToast }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const [formData, setFormData] = useState(VALORES_VACIOS);
    // Copia inicial para saber si hubo cambios
    const [initialData, setInitialData] = useState(null);
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [intentoGuardar, setIntentoGuardar] = useState(false);

    const [openModalMateria, setOpenModalMateria] = useState(false);
    const [openModalHorario, setOpenModalHorario] = useState(false);

    const [catalogoMaterias, setCatalogoMaterias] = useState([]);
    const [catalogoHorarios, setCatalogoHorarios] = useState([]);
    const [catalogoLicenciaturas, setCatalogoLicenciaturas] = useState([]);
    const [catalogoGrupos, setCatalogoGrupos] = useState([]);

    useEffect(() => {
        if (!data || !open) return;

        let materiasCat = [];
        let horariosCat = [];
        let licenciaturasCat = [];
        let gruposCat = [];

        try {
            // TODO: reemplazar por la consulta real de catálogos al backend
            const catalogos = catalogoService.getCatalogos();
            materiasCat = catalogos.materias || [];
            horariosCat = catalogos.horarios || [];
            licenciaturasCat = (catalogos.licenciaturas || []).map((l) => l.licenciatura);
            gruposCat = (catalogos.grupos || []).map((g) => g.grupo);
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
        }

        // La licenciatura del estudiante puede venir con otras mayúsculas; se empareja con la del catálogo
        const licenciaturaActual = data.licenciatura || '';
        const licenciaturaEnCatalogo =
            licenciaturasCat.find((l) => l.toUpperCase() === licenciaturaActual.toUpperCase()) || licenciaturaActual;

        // Si el valor actual no está en el catálogo se agrega para que la lista pueda mostrarlo
        setCatalogoMaterias(materiasCat);
        setCatalogoHorarios(horariosCat);
        setCatalogoLicenciaturas(
            licenciaturaEnCatalogo && !licenciaturasCat.includes(licenciaturaEnCatalogo)
                ? [licenciaturaEnCatalogo, ...licenciaturasCat]
                : licenciaturasCat
        );
        setCatalogoGrupos(data.grupo && !gruposCat.includes(data.grupo) ? [data.grupo, ...gruposCat] : gruposCat);

        const valoresIniciales = {
            nombre: data.nombre || '',
            numeroCuenta: data.numeroCuenta || '',
            // TODO: la contraseña actual depende de lo que entregue el backend
            contrasena: data.contrasena || '',
            correo: data.correo || '',
            telefono: data.telefono || '',
            licenciatura: licenciaturaEnCatalogo,
            grupo: data.grupo || '',
            promedio: data.promedio !== undefined && data.promedio !== null ? String(data.promedio) : '',
            materias: data.materias ? [...data.materias] : [],
            horarios: data.horarios ? [...data.horarios] : []
        };

        setFormData(valoresIniciales);
        setInitialData(valoresIniciales);
        setConfirmarContrasena('');
        setIntentoGuardar(false);
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
    const promedioInvalido = formData.promedio !== '' && !(Number(formData.promedio) >= 0 && Number(formData.promedio) <= 10);

    // La contraseña cambió respecto a la que traía el asesor
    const contrasenaModificada = Boolean(initialData) && formData.contrasena !== initialData.contrasena;
    const contrasenaCorta = contrasenaModificada && formData.contrasena.length < MIN_CONTRASENA;
    const contrasenaNoCoincide = contrasenaModificada && formData.contrasena !== confirmarContrasena;

    const errorCorreo = correoVacio ? 'Campo obligatorio' : correoInvalido ? 'Correo no válido' : '';

    const handleApply = () => {
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
                Información del Asesor Par
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

                <TextField
                    select
                    label="Licenciatura"
                    size="small"
                    fullWidth
                    value={formData.licenciatura}
                    onChange={handleChange('licenciatura')}
                    slotProps={{ select: { MenuProps: MENU_LISTA } }}
                >
                    {catalogoLicenciaturas.map((licenciatura) => (
                        <MenuItem key={licenciatura} value={licenciatura} sx={{ whiteSpace: 'normal' }}>
                            {licenciatura}
                        </MenuItem>
                    ))}
                </TextField>

                <div className="flex gap-4">
                    <TextField
                        select
                        label="Grupo"
                        size="small"
                        sx={{ flex: 1 }}
                        value={formData.grupo}
                        onChange={handleChange('grupo')}
                        slotProps={{ select: { MenuProps: MENU_LISTA } }}
                    >
                        {catalogoGrupos.map((grupo) => (
                            <MenuItem key={grupo} value={grupo}>
                                {grupo}
                            </MenuItem>
                        ))}
                    </TextField>

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
                </div>

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