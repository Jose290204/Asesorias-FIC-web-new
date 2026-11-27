import CloseIcon from '@mui/icons-material/Close';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { Button, CircularProgress, IconButton, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { activarPush, estadoPush } from '../../Services/pushService';

const ROL_ASESOR = 3;
const ROL_ESTUDIANTE = 4;
const CLAVE_OCULTO = 'push_invitacion_oculta_hasta';
const DIAS_OCULTO = 3;

const estaOculta = () => {
  try {
    return Number(localStorage.getItem(CLAVE_OCULTO) || 0) > Date.now();
  } catch {
    return false;
  }
};

const ocultarUnosDias = () => {
  try {
    localStorage.setItem(CLAVE_OCULTO, String(Date.now() + DIAS_OCULTO * 24 * 60 * 60 * 1000));
  } catch {
    // sin localStorage la invitación simplemente volverá a salir
  }
};

// Invitación para activar los avisos push al entrar a la app (estudiante y asesor).
// El navegador solo deja pedir el permiso desde un toque del usuario, por eso hay un botón:
// al tocarlo sale el cuadro nativo "¿Permitir notificaciones?" y, si acepta, queda suscrito.
// Solo aparece si este dispositivo puede activarlos y todavía no lo está.
export default function InvitacionAvisos() {
  const { usuario, rol } = useAuth();
  const [visible, setVisible] = useState(false);
  const [trabajando, setTrabajando] = useState(false);
  const [error, setError] = useState('');

  const recibeAvisos = Boolean(usuario) && (rol === ROL_ESTUDIANTE || rol === ROL_ASESOR);

  useEffect(() => {
    if (!recibeAvisos || estaOculta()) return undefined;

    let vigente = true;
    const t = setTimeout(() => {
      estadoPush()
        .then((e) => vigente && e === 'inactivo' && setVisible(true))
        .catch(() => {});
    }, 2500);

    return () => {
      vigente = false;
      clearTimeout(t);
    };
  }, [recibeAvisos, usuario?.id]);

  const activar = async () => {
    setError('');
    setTrabajando(true);
    try {
      await activarPush();
      setVisible(false);
    } catch (e) {
      if (e?.message === 'permiso_denegado') {
        // Si lo bloqueó, no se vuelve a insistir pronto; puede activarlo después desde la campana
        ocultarUnosDias();
        setError('No se concedió el permiso. Puedes activarlo después desde la campanita.');
      } else {
        setError('No se pudieron activar los avisos. Inténtalo de nuevo desde la campanita.');
      }
    } finally {
      setTrabajando(false);
    }
  };

  const cerrar = () => {
    ocultarUnosDias();
    setVisible(false);
  };

  // Si cierra sesión o cambia a un rol sin avisos, la invitación no se muestra
  if (!visible || !recibeAvisos) return null;

  return (
    <Paper
      elevation={8}
      role="dialog"
      aria-label="Activar avisos"
      sx={{
        position: 'fixed',
        left: 12,
        right: 12,
        top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        mx: 'auto',
        maxWidth: 420,
        zIndex: 1400,
        p: 2,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
      }}
    >
      <NotificationsActiveOutlinedIcon sx={{ color: '#244B91', mt: 0.25 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          ¿Activar los avisos?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Te avisamos de solicitudes, cambios en tus asesorías y mensajes, aunque tengas la app cerrada.
        </Typography>

        {error && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
            {error}
          </Typography>
        )}

        <Button
          size="small"
          variant="contained"
          onClick={activar}
          disabled={trabajando}
          startIcon={trabajando ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{ mt: 1, textTransform: 'none' }}
        >
          Activar avisos
        </Button>
      </div>

      <IconButton size="small" onClick={cerrar} aria-label="Cerrar invitación">
        <CloseIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
}
