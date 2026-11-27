import CloseIcon from '@mui/icons-material/Close';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Button, IconButton, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const CLAVE_OCULTO = 'pwa_aviso_oculto_hasta';
const DIAS_OCULTO = 7;

const yaInstalada = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

const esIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const estaOculto = () => {
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
    // sin localStorage el aviso simplemente volverá a salir
  }
};

// Aviso para instalar la app (PWA).
// - Android/Chrome: usa el evento `beforeinstallprompt` y abre el diálogo nativo.
// - iPhone (Safari): no existe ese evento, así que se muestran los pasos manuales.
export default function AvisoInstalarApp() {
  const [evento, setEvento] = useState(null);
  const [visible, setVisible] = useState(false);
  const [modoIOS] = useState(() => esIOS());

  useEffect(() => {
    if (yaInstalada() || estaOculto()) return undefined;

    // iPhone: se muestra el aviso con instrucciones
    if (modoIOS) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }

    const alPrompt = (e) => {
      e.preventDefault(); // evita la mini-barra automática de Chrome; lo mostramos nosotros
      setEvento(e);
      setVisible(true);
    };
    const alInstalar = () => {
      setVisible(false);
      setEvento(null);
    };

    window.addEventListener('beforeinstallprompt', alPrompt);
    window.addEventListener('appinstalled', alInstalar);
    return () => {
      window.removeEventListener('beforeinstallprompt', alPrompt);
      window.removeEventListener('appinstalled', alInstalar);
    };
  }, [modoIOS]);

  const instalar = async () => {
    if (!evento) return;
    evento.prompt();
    const { outcome } = await evento.userChoice;
    setEvento(null);
    setVisible(false);
    if (outcome === 'dismissed') ocultarUnosDias();
  };

  const cerrar = () => {
    ocultarUnosDias();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Paper
      elevation={8}
      role="dialog"
      aria-label="Instalar la aplicación"
      sx={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 12,
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
      <img src="/icons/icon-192.png" alt="" width={44} height={44} style={{ borderRadius: 10 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Instala Asesorías FIC
        </Typography>

        {modoIOS ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Toca <IosShareIcon sx={{ fontSize: 16, verticalAlign: 'text-bottom' }} /> Compartir y luego
            “Añadir a pantalla de inicio”.
          </Typography>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Ábrela como una app desde tu pantalla de inicio.
            </Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<GetAppOutlinedIcon />}
              onClick={instalar}
              sx={{ mt: 1, textTransform: 'none' }}
            >
              Instalar app
            </Button>
          </>
        )}
      </div>

      <IconButton size="small" onClick={cerrar} aria-label="Cerrar aviso">
        <CloseIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
}
