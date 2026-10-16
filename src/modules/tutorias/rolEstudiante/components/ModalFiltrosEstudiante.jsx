import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// Lista desplegable con scroll interno
const MENU_CON_SCROLL = {
    slotProps: { paper: { sx: { maxHeight: 240 } } }
};

// Convierte ["A, B", "C"] o "A / B" en ["A", "B", "C"] sin repetidos
const aLista = (valor) =>
    [...new Set(
        (Array.isArray(valor) ? valor : [valor])
            .flatMap((v) => String(v ?? '').split(/[,/]/))
            .map((v) => v.trim())
            .filter(Boolean)
    )];

// Datos de prueba: solo se usan si el estudiante aún no trae sus opciones
const ESTUDIANTE_DEMO = {
    materias: ['Programación Web', 'Bases de Datos', 'Estructura de Datos', 'Redes de Computadoras'],
    horarios: ['08:00 - 09:00', '10:00 - 11:00', '12:00 - 13:00', '16:00 - 17:00'],
    modalidades: ['Presencial', 'Virtual']
};

/**
 * Modal de filtros del estudiante: materia, horario y modalidad.
 *
 * Las opciones salen SOLO de la info del estudiante (la que llega al iniciar sesión):
 *   estudiante = { materias: [...], horarios: [...], modalidades: [...] }
 * Cada lista puede ser un array o un texto separado por comas o "/".
 *
 * Props:
 *  - open, onClose
 *  - estudiante: info del estudiante con sus opciones
 *  - filtros: { materia, horario, modalidad } (valores actuales)
 *  - onChange: (e) => void   (e.target.name / e.target.value)
 *  - onApply, onClear
 */
export default function ModalFiltrosEstudiante({
    open,
    onClose,
    estudiante,
    filtros = { materia: '', horario: '', modalidad: '' },
    onChange,
    onApply,
    onClear
}) {
    const opcionesDe = (clave) => {
        const propias = aLista(estudiante?.[clave]);
        return propias.length > 0 ? propias : ESTUDIANTE_DEMO[clave];
    };

    const campos = [
        { name: 'materia', label: 'Materia', placeholder: 'Todas las materias', opciones: opcionesDe('materias') },
        { name: 'horario', label: 'Horario', placeholder: 'Todos los horarios', opciones: opcionesDe('horarios') },
        { name: 'modalidad', label: 'Modalidad', placeholder: 'Todas las modalidades', opciones: opcionesDe('modalidades') }
    ];

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            disableAutoFocus
            slotProps={{
                paper: {
                    style: {
                        borderRadius: '16px',
                        padding: '25px',
                        maxWidth: '450px',
                        width: '100%',
                        maxHeight: '85vh',
                        margin: '16px'
                    }
                }
            }}
        >
            <DialogContent className="flex flex-col gap-4">
                {campos.map((campo) => (
                    <TextField
                        key={campo.name}
                        select
                        fullWidth
                        size="small"
                        label={campo.label}
                        name={campo.name}
                        value={filtros[campo.name] ?? ''}
                        onChange={onChange}
                        slotProps={{
                            select: {
                                MenuProps: MENU_CON_SCROLL,
                                displayEmpty: true
                            },
                            inputLabel: { shrink: true }
                        }}
                    >
                        <MenuItem value="">
                            <em>{campo.placeholder}</em>
                        </MenuItem>
                        {campo.opciones.map((opcion) => (
                            <MenuItem key={opcion} value={opcion}>
                                {opcion}
                            </MenuItem>
                        ))}
                    </TextField>
                ))}

                <div className="flex flex-col items-center gap-3 mt-4">
                    <button
                        type="button"
                        onClick={onApply}
                        className="w-full bg-[#244b91] hover:bg-[#244b91] text-white font-semibold py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        Aplicar Filtros
                    </button>

                    <button
                        type="button"
                        onClick={onClear}
                        className="font-bold text-black hover:underline text-sm cursor-pointer"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}