import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import EncabezadoModal from '../../compartidos/EncabezadoModal';
import { ESTILO_BOTON_AZUL, ESTILO_BOTON_SECUNDARIO, paperModal } from '../../compartidos/estilosAdmin';

// Lista desplegable con scroll interno
const MENU_CON_SCROLL = {
    slotProps: { paper: { sx: { maxHeight: 240 } } }
};

/**
 * Modal de filtros del administrador (mismo estilo que el del estudiante):
 * licenciatura, grupo, modalidad, horario y razón.
 *
 * Props:
 *  - open, onClose
 *  - opciones: { licenciaturas, grupos, modalidades, horarios, razones }, cada lista de { valor, etiqueta }
 *      "valor" es lo que se guarda en el filtro (id); "etiqueta" es lo que ve el usuario.
 *  - filtros: { licenciatura, grupo, modalidad, horario, razon } (valores actuales; "" = sin filtrar)
 *  - onChange: (e) => void   (e.target.name / e.target.value). "Aplicar Filtros" los manda a la lista.
 *  - onApply: () => void
 */
export default function ModalFiltrosAdmin({
    open,
    onClose,
    opciones = { licenciaturas: [], grupos: [], modalidades: [], horarios: [], razones: [] },
    filtros = { licenciatura: '', grupo: '', modalidad: '', horario: '', razon: '' },
    onChange,
    onApply
}) {
    const campos = [
        { name: 'licenciatura', label: 'Licenciatura', placeholder: 'Todas las licenciaturas', lista: opciones.licenciaturas },
        { name: 'grupo', label: 'Grupo', placeholder: 'Todos los grupos', lista: opciones.grupos },
        { name: 'modalidad', label: 'Modalidad', placeholder: 'Todas las modalidades', lista: opciones.modalidades },
        { name: 'horario', label: 'Horario', placeholder: 'Todos los horarios', lista: opciones.horarios },
        { name: 'razon', label: 'Razón', placeholder: 'Todas las razones', lista: opciones.razones }
    ];

    return (
        <Dialog open={Boolean(open)} onClose={onClose} disableAutoFocus sx={paperModal(450)}>
            <EncabezadoModal
                icono={<FilterListOutlinedIcon />}
                titulo="Filtros"
                subtitulo="Filtra la lista de asesorías"
                onClose={onClose}
            />

            <DialogContent dividers className="flex flex-col gap-4" sx={{ pt: 3 }}>
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
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={onClose} sx={ESTILO_BOTON_SECUNDARIO}>
                    Cancelar
                </Button>
                <Button variant="contained" onClick={onApply} sx={ESTILO_BOTON_AZUL}>
                    Aplicar filtros
                </Button>
            </DialogActions>
        </Dialog>
    );
}
