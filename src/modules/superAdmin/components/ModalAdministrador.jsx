import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Crear un administrador de facultad.
// Pendiente de decidir: contraseña inicial o código de activación (por ahora solo datos básicos).
// El padre lo monta con `key` distinto en cada apertura para que inicie limpio.
export default function ModalAdministrador({ open, onClose, onGuardar, facultades, facultadInicial = '' }) {
  const [form, setForm] = useState({
    facultadId: facultadInicial,
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const cambiar = (campo) => (e) => {
    setForm((f) => ({ ...f, [campo]: e.target.value }));
    setErrores((er) => ({ ...er, [campo]: undefined, general: undefined }));
  };

  const validar = () => {
    const er = {};
    if (!form.facultadId) er.facultadId = 'Elige una facultad.';
    if (!form.nombre.trim()) er.nombre = 'El nombre es obligatorio.';
    if (!form.apellidoPaterno.trim()) er.apellidoPaterno = 'El apellido paterno es obligatorio.';
    if (!form.correo.trim()) er.correo = 'El correo es obligatorio.';
    else if (!REGEX_CORREO.test(form.correo.trim())) er.correo = 'Correo no válido.';
    setErrores(er);
    return Object.keys(er).length === 0;
  };

  const handleGuardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    try {
      await onGuardar({
        facultadId: Number(form.facultadId),
        nombre: form.nombre.trim(),
        apellidoPaterno: form.apellidoPaterno.trim(),
        apellidoMaterno: form.apellidoMaterno.trim(),
        correo: form.correo.trim(),
      });
      document.activeElement?.blur();
      onClose();
    } catch (e) {
      setErrores({ general: e.message ?? 'No se pudo guardar.' });
    } finally {
      setGuardando(false);
    }
  };

  const campo = (name, label, extra = {}) => (
    <TextField
      label={label}
      value={form[name]}
      onChange={cambiar(name)}
      error={Boolean(errores[name])}
      helperText={errores[name]}
      fullWidth
      {...extra}
    />
  );

  return (
    <Dialog
      open={Boolean(open)}
      onClose={guardando ? undefined : onClose}
      disableRestoreFocus
      fullWidth
      sx={{ '& .MuiPaper-root': { maxWidth: '520px', borderRadius: '12px', p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Nuevo administrador</DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        {campo('facultadId', 'Facultad', {
          select: true,
          children: facultades.map((f) => (
            <MenuItem key={f.id} value={f.id}>{f.siglas} · {f.nombre}</MenuItem>
          )),
        })}
        {campo('nombre', 'Nombre(s)')}
        {campo('apellidoPaterno', 'Apellido paterno')}
        {campo('apellidoMaterno', 'Apellido materno (opcional)')}
        {campo('correo', 'Correo', { type: 'email' })}
        {errores.general && <p className="text-sm text-red-600">{errores.general}</p>}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={guardando}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar} disabled={guardando}>
          {guardando ? 'Guardando…' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
