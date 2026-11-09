import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import { mensajesDeError } from '../../../Services/errores';
import CampoContrasena from '../../tutorias/rolAdministrador/components/asesoresDisciplinares/modales/CampoContrasena';

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Nombre y apellidos: solo letras (con acentos y ñ) y espacios. Lo demás se descarta al escribir o pegar.
const NO_ES_LETRA = /[^\p{L}\s]/gu;
const CAMPOS_DE_NOMBRE = ['nombre', 'apellidoPaterno', 'apellidoMaterno'];

// Nombre de cada campo del backend (snake_case) en el formulario (camelCase)
const CAMPO_DE_API = {
  facultad_id: 'facultadId',
  nombre: 'nombre',
  apellido_paterno: 'apellidoPaterno',
  apellido_materno: 'apellidoMaterno',
  correo: 'correo',
  password: 'password',
};

// Crear o editar un administrador de facultad. Si recibe `administrador` es edición.
// El super admin define la contraseña: la cuenta nace activa. Al editar, la contraseña es opcional
// (vacía = no cambiarla). Cambiarla o mover al administrador de facultad le cierra la sesión.
// El padre lo monta con `key` distinto en cada apertura para que inicie limpio.
export default function ModalAdministrador({ open, onClose, onGuardar, facultades, facultadInicial = '', administrador = null }) {
  const [form, setForm] = useState({
    facultadId: administrador?.facultadId ?? facultadInicial,
    nombre: administrador?.nombre ?? '',
    apellidoPaterno: administrador?.apellidoPaterno ?? '',
    apellidoMaterno: administrador?.apellidoMaterno ?? '',
    correo: administrador?.correo ?? '',
    password: '',
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const cambiar = (campo) => (e) => {
    const escrito = e.target.value;
    const esNombre = CAMPOS_DE_NOMBRE.includes(campo);
    const valor = esNombre ? escrito.replace(NO_ES_LETRA, '') : escrito;

    setForm((f) => ({ ...f, [campo]: valor }));
    // Si se descartó algún carácter se avisa bajo el campo
    setErrores((er) => ({
      ...er,
      [campo]: valor !== escrito ? 'Solo se permiten letras.' : undefined,
      general: undefined,
    }));
  };

  const validar = () => {
    const er = {};
    if (!form.facultadId) er.facultadId = 'Elige una facultad.';
    if (!form.nombre.trim()) er.nombre = 'El nombre es obligatorio.';
    if (!form.apellidoPaterno.trim()) er.apellidoPaterno = 'El apellido paterno es obligatorio.';
    if (!form.correo.trim()) er.correo = 'El correo es obligatorio.';
    else if (!REGEX_CORREO.test(form.correo.trim())) er.correo = 'Correo no válido.';

    if (!administrador && !form.password) er.password = 'La contraseña es obligatoria.';
    else if (form.password && form.password.length < 8) er.password = 'Debe tener al menos 8 caracteres.';

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
        password: form.password,
      });
      document.activeElement?.blur();
      onClose();
    } catch (e) {
      // 422: el backend dice qué campo falló (correo repetido, facultad inactiva, contraseña corta...)
      const campos = e.response?.data?.errors;
      if (campos) {
        const porCampo = {};
        for (const [apiCampo, mensajes] of Object.entries(campos)) {
          const campo = CAMPO_DE_API[apiCampo];
          if (campo) porCampo[campo] = mensajes[0];
        }
        setErrores(
          Object.keys(porCampo).length ? porCampo : { general: mensajesDeError(e)[0] }
        );
      } else {
        setErrores({ general: mensajesDeError(e)[0] });
      }
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

  // Aviso solo en edición, cuando se elige otra facultad distinta de la actual
  const moviendo = administrador && form.facultadId && form.facultadId !== administrador.facultadId;

  return (
    <Dialog
      open={Boolean(open)}
      onClose={guardando ? undefined : onClose}
      disableRestoreFocus
      fullWidth
      sx={{ '& .MuiPaper-root': { maxWidth: '520px', borderRadius: '12px', p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>{administrador ? 'Editar administrador' : 'Nuevo administrador'}</DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        {campo('facultadId', 'Facultad', {
          select: true,
          helperText: errores.facultadId ?? (moviendo ? 'Al moverlo de facultad se cerrará su sesión.' : undefined),
          children: facultades.map((f) => (
            <MenuItem
              key={f.id}
              value={f.id}
              // El backend no deja asignar a una facultad inactiva (salvo la que ya tiene)
              disabled={!f.activa && f.id !== administrador?.facultadId}
            >
              {f.siglas} · {f.nombre}{f.activa ? '' : ' (inactiva)'}
            </MenuItem>
          )),
        })}
        {campo('nombre', 'Nombre(s)')}
        {campo('apellidoPaterno', 'Apellido paterno')}
        {campo('apellidoMaterno', 'Apellido materno (opcional)')}
        {campo('correo', 'Correo', { type: 'email' })}

        <CampoContrasena
          size="medium"
          label={administrador ? 'Nueva contraseña (opcional)' : 'Contraseña'}
          value={form.password}
          onChange={cambiar('password')}
          error={Boolean(errores.password)}
          helperText={
            errores.password ??
            (administrador
              ? 'Déjala vacía para no cambiarla. Si la cambias, se cierra su sesión.'
              : 'Mínimo 8 caracteres. Compártesela al administrador; él podrá cambiarla desde "Olvidé mi contraseña".')
          }
        />

        {errores.general && <p className="text-sm text-red-600">{errores.general}</p>}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={guardando}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar} disabled={guardando}>
          {guardando ? 'Guardando…' : administrador ? 'Guardar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
