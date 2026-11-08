import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';

const VACIO = { nombre: '', siglas: '' };

// Crear o editar una facultad. Si recibe `facultad` es edición.
// El logo queda pendiente (necesita subida de archivos en el backend).
// El padre lo monta con `key` distinto en cada apertura, así el formulario siempre inicia limpio.
export default function ModalFacultad({ open, onClose, onGuardar, facultad = null }) {
  const [form, setForm] = useState(
    facultad ? { nombre: facultad.nombre, siglas: facultad.siglas } : VACIO
  );
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const cambiar = (campo) => (e) => {
    setForm((f) => ({ ...f, [campo]: e.target.value }));
    setErrores((er) => ({ ...er, [campo]: undefined, general: undefined }));
  };

  const validar = () => {
    const er = {};
    if (!form.nombre.trim()) er.nombre = 'El nombre es obligatorio.';
    else if (form.nombre.trim().length > 150) er.nombre = 'Máximo 150 caracteres.';
    if (!form.siglas.trim()) er.siglas = 'Las siglas son obligatorias.';
    else if (form.siglas.trim().length > 20) er.siglas = 'Máximo 20 caracteres.';
    setErrores(er);
    return Object.keys(er).length === 0;
  };

  const handleGuardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    try {
      await onGuardar({ nombre: form.nombre.trim(), siglas: form.siglas.trim().toUpperCase() });
      document.activeElement?.blur();
      onClose();
    } catch (e) {
      setErrores({ general: e.message ?? 'No se pudo guardar.' });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog
      open={Boolean(open)}
      onClose={guardando ? undefined : onClose}
      disableRestoreFocus
      sx={{ '& .MuiPaper-root': { width: '480px', maxWidth: '92vw', borderRadius: '12px', p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>{facultad ? 'Editar facultad' : 'Nueva facultad'}</DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        <TextField
          label="Nombre"
          value={form.nombre}
          onChange={cambiar('nombre')}
          error={Boolean(errores.nombre)}
          helperText={errores.nombre}
          fullWidth
          autoFocus
        />
        <TextField
          label="Siglas"
          value={form.siglas}
          onChange={cambiar('siglas')}
          error={Boolean(errores.siglas)}
          helperText={errores.siglas ?? 'Deben ser únicas. Ej.: FIC'}
          fullWidth
        />
        {errores.general && <p className="text-sm text-red-600">{errores.general}</p>}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={guardando}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar} disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
