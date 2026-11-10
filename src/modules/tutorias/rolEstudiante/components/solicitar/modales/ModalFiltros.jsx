import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { botonCerrarEncabezado, campoModal, contenidoModal, encabezadoModal, paperModal } from '../../../../../../components/ui/estilosModal';

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
export default function ModalFiltros({
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
            sx={paperModal(false, '440px')}
        >
            <DialogTitle sx={encabezadoModal}>
                Filtros
                <IconButton aria-label="close" onClick={onClose} sx={botonCerrarEncabezado}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ ...contenidoModal, ...campoModal, display: 'flex', flexDirection: 'column', gap: 2, pb: 3 }}>
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

                <div className="mt-2 flex flex-col items-center gap-3">
                    <button
                        type="button"
                        onClick={onApply}
                        className="w-full h-[44px] cursor-pointer rounded-[8px] bg-[linear-gradient(135deg,#e0b63a,#D4A017_55%,#bf8f12)] font-bold text-white shadow-[0_6px_16px_rgba(212,160,23,0.4)] transition-all hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(212,160,23,0.5)] active:translate-y-0"
                    >
                        Aplicar Filtros
                    </button>

                    <button
                        type="button"
                        onClick={onClear}
                        className="cursor-pointer text-sm font-semibold text-[#244B91] hover:underline"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}