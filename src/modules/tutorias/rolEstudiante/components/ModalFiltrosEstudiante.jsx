import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// Lista desplegable con scroll interno
const MENU_CON_SCROLL = {
    slotProps: { paper: { sx: { maxHeight: 240 } } }
};

/**
 * Modal de filtros del estudiante: materia, horario y modalidad.
 *
 * Props:
 *  - open, onClose
 *  - opciones: { materias, horarios, modalidades }, cada lista de { valor, etiqueta }
 *      "valor" es lo que se guarda en el filtro y se manda al backend (id o texto del enum);
 *      "etiqueta" es lo que ve el usuario.
 *  - filtros: { materia, horario, modalidad } (valores actuales; "" = sin filtrar)
 *  - onChange: (e) => void   (e.target.name / e.target.value)
 *  - onApply, onClear
 */
export default function ModalFiltrosEstudiante({
    open,
    onClose,
    opciones = { materias: [], horarios: [], modalidades: [] },
    filtros = { materia: '', horario: '', modalidad: '' },
    onChange,
    onApply,
    onClear
}) {
    const campos = [
        { name: 'materia', label: 'Materia', placeholder: 'Todas las materias', lista: opciones.materias },
        { name: 'horario', label: 'Horario', placeholder: 'Todos los horarios', lista: opciones.horarios },
        { name: 'modalidad', label: 'Modalidad', placeholder: 'Todas las modalidades', lista: opciones.modalidades }
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
                        {campo.lista.map((opcion) => (
                            <MenuItem key={opcion.valor} value={opcion.valor}>
                                {opcion.etiqueta}
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