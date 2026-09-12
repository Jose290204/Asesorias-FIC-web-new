import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

export default function ModalFiltros({ open, onClose, onApply, onClear, children }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: '16px',
          border: '2px solid #0091ff',
          padding: '25px',
          maxWidth: '600px',
          width: '100%'
        }
      }}
    >
      <DialogContent className="flex flex-col gap-4">
        {children}

        <div className="flex flex-col items-center gap-3 mt-4">
          <button
            type="button"
            onClick={onApply}
            className="w-full bg-[#0088ff] hover:bg-[#0070e0] text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Aplicar Filtros
          </button>

          <button
            type="button"
            onClick={onClear}
            className="font-bold text-black hover:underline text-sm"
          >
            Limpiar Filtros
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}