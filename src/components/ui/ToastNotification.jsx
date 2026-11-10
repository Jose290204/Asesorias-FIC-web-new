import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { Alert, AlertTitle, Snackbar } from '@mui/material';

/**
 * Toast global: tarjeta de color sólido con ícono, título y mensaje.
 * Escritorio: arriba a la derecha. Móvil: arriba, casi a todo el ancho.
 *
 * @param {boolean} open - Controla si se muestra el toast.
 * @param {function} onClose - Función para cerrar el toast.
 * @param {string} message - Mensaje a mostrar (una frase corta).
 * @param {'info' | 'success' | 'error' | 'warning'} type - Tipo de aviso.
 * @param {string} [title] - Título opcional. Si no se manda, se usa el de por defecto.
 */

// Todo lo que cambia por tipo, en un solo lugar
const estilos = {
  success: { color: '#4CA154', titulo: 'Éxito', Icono: CheckCircleIcon },
  error:   { color: '#C94047', titulo: 'Error', Icono: ErrorIcon },
  info:    { color: '#2FA3C7', titulo: 'Información', Icono: InfoIcon },
  warning: { color: '#E0954A', titulo: 'Atención', Icono: WarningIcon },
};

export function ToastNotification({ open, onClose, message, type = 'info', title }) {
  const { color, titulo, Icono } = estilos[type] || estilos.info;

  // Duración en milisegundos. Los errores y advertencias duran un poco más
  const duracion = type === 'error' || type === 'warning' ? 3500 : 2500;

  // Evita que desaparezca al tocar fuera del toast
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    onClose(event, reason);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duracion}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        // env(safe-area-inset-top) respeta el notch del celular (Capacitor)
        top: { xs: 'calc(env(safe-area-inset-top) + 90px)', sm: 'calc(env(safe-area-inset-top) + 24px)' },
        right: { sm: 24 },
        width: { sm: 430 },
      }}
    >
      <Alert
        icon={<Icono sx={{ fontSize: 32 }} />}
        onClose={onClose}
        sx={{
          width: '100%',
          alignItems: 'center',
          backgroundColor: color,
          color: '#ffffff',
          borderRadius: '6px',
          boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.25)',
          py: 1.25,
          px: 2.25,
          '& .MuiAlert-icon': { color: '#ffffff', mr: 1.5, alignItems: 'center' },
          '& .MuiAlert-message': { p: 0, flex: 1 },
          // La X arriba a la derecha
          '& .MuiAlert-action': { color: '#ffffff', alignSelf: 'flex-start', p: 0, m: 0 },
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 0.25 }}>
          {title || titulo}
        </AlertTitle>
        <span style={{ fontSize: '0.95rem' }}>{message}</span>
      </Alert>
    </Snackbar>
  );
}

export default ToastNotification;