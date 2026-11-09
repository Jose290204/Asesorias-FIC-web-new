import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { mensajesDeError } from '../../../Services/errores';

const VACIO = { nombre: '', siglas: '' };
const TIPOS_LOGO = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_LOGO_MB = 2;

// Crear o editar una facultad. Si recibe `facultad` es edición.
// Logo: se adjunta un archivo de imagen (PNG, JPG o WEBP, máx. 2 MB).
// onGuardar recibe { nombre, siglas, logo } donde logo es:
//   File      -> logo nuevo
//   null      -> el usuario lo quitó
//   undefined -> no se tocó (en edición se conserva el actual)
// El padre lo monta con `key` distinto en cada apertura, así el formulario siempre inicia limpio.
export default function ModalFacultad({ open, onClose, onGuardar, facultad = null }) {
  const [form, setForm] = useState(
    facultad ? { nombre: facultad.nombre, siglas: facultad.siglas } : VACIO
  );
  const [logoArchivo, setLogoArchivo] = useState(undefined);
  const [logoVista, setLogoVista] = useState(facultad?.logo ?? null);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const inputArchivo = useRef(null);

  const cambiar = (campo) => (e) => {
    setForm((f) => ({ ...f, [campo]: e.target.value }));
    setErrores((er) => ({ ...er, [campo]: undefined, general: undefined }));
  };

  const handleArchivo = (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo
    if (!archivo) return;

    if (!TIPOS_LOGO.includes(archivo.type)) {
      setErrores((er) => ({ ...er, logo: 'Usa una imagen PNG, JPG o WEBP.' }));
      return;
    }
    if (archivo.size > MAX_LOGO_MB * 1024 * 1024) {
      setErrores((er) => ({ ...er, logo: `El logo no debe pesar más de ${MAX_LOGO_MB} MB.` }));
      return;
    }

    const lector = new FileReader();
    lector.onload = () => setLogoVista(lector.result);
    lector.readAsDataURL(archivo);
    setLogoArchivo(archivo);
    setErrores((er) => ({ ...er, logo: undefined }));
  };

  const handleQuitarLogo = () => {
    setLogoArchivo(null);
    setLogoVista(null);
    setErrores((er) => ({ ...er, logo: undefined }));
  };

  const validar = () => {
    const er = {};
    if (!form.nombre.trim()) er.nombre = 'El nombre es obligatorio.';
    else if (form.nombre.trim().length > 150) er.nombre = 'Máximo 150 caracteres.';
    if (!form.siglas.trim()) er.siglas = 'Las siglas son obligatorias.';
    else if (form.siglas.trim().length > 20) er.siglas = 'Máximo 20 caracteres.';
    setErrores((prev) => ({ ...er, logo: prev.logo }));
    return Object.keys(er).length === 0 && !errores.logo;
  };

  const handleGuardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    try {
      await onGuardar({
        nombre: form.nombre.trim(),
        siglas: form.siglas.trim().toUpperCase(),
        logo: logoArchivo,
      });
      document.activeElement?.blur();
      onClose();
    } catch (e) {
      // 422: el backend dice qué campo falló (siglas repetidas, logo inválido...)
      const campos = e.response?.data?.errors;
      if (campos) {
        setErrores((er) => ({
          ...er,
          nombre: campos.nombre?.[0],
          siglas: campos.siglas?.[0],
          logo: campos.logo?.[0],
          general: campos.nombre || campos.siglas || campos.logo ? undefined : mensajesDeError(e)[0],
        }));
      } else {
        setErrores((er) => ({ ...er, general: mensajesDeError(e)[0] }));
      }
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

        {/* Logo */}
        <div>
          <div className="flex items-center gap-3">
            <Avatar
              variant="rounded"
              src={logoVista ?? undefined}
              slotProps={{ img: { style: { objectFit: 'contain' } } }}
              sx={{ width: 64, height: 64, bgcolor: '#F1F3F4', color: '#9AA0A6', border: '1px solid #E0E0E0' }}
            >
              <AddPhotoAlternateOutlinedIcon />
            </Avatar>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outlined"
                size="small"
                onClick={() => inputArchivo.current?.click()}
                disabled={guardando}
                sx={{ textTransform: 'none' }}
              >
                {logoVista ? 'Cambiar logo' : 'Adjuntar logo'}
              </Button>
              {logoVista && (
                <Button
                  size="small"
                  color="error"
                  onClick={handleQuitarLogo}
                  disabled={guardando}
                  sx={{ textTransform: 'none' }}
                >
                  Quitar
                </Button>
              )}
            </div>

            <input
              ref={inputArchivo}
              type="file"
              accept={TIPOS_LOGO.join(',')}
              onChange={handleArchivo}
              hidden
            />
          </div>
          <p className={`mt-1 text-xs ${errores.logo ? 'text-red-600' : 'text-gray-500'}`}>
            {errores.logo ?? `PNG, JPG o WEBP. Máximo ${MAX_LOGO_MB} MB. Opcional.`}
          </p>
        </div>

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
