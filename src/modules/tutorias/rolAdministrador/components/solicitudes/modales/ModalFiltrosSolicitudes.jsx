import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { ETIQUETA_ESTATUS } from '../estatusSolicitud';

/**
 * Filtros de solicitudes del administrador. La API filtra por estatus.
 *
 * Props:
 *  - open, onClose
 *  - estatus: valor actual ("" = todas)
 *  - onChange: (valor) => void
 *  - onApply: () => void
 */
export default function ModalFiltrosSolicitudes({ open, onClose, estatus = '', onChange, onApply }) {
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
                        margin: '16px'
                    }
                }
            }}
        >
            <DialogContent className="flex flex-col gap-4">
                <TextField
                    select
                    fullWidth
                    size="small"
                    label="Estatus"
                    value={estatus}
                    onChange={(e) => onChange?.(e.target.value)}
                    slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
                >
                    <MenuItem value="">
                        <em>Todas</em>
                    </MenuItem>
                    {Object.entries(ETIQUETA_ESTATUS).map(([valor, etiqueta]) => (
                        <MenuItem key={valor} value={valor}>
                            {etiqueta}
                        </MenuItem>
                    ))}
                </TextField>

                <div className="flex flex-col items-center gap-3 mt-4">
                    <button
                        type="button"
                        onClick={onApply}
                        className="w-full bg-[#244b91] text-white font-semibold py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
