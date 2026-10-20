import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecuperarPassword from '../../../components/auth/RecuperarPassword';
import ToastNotification from '../../../components/ui/ToastNotification';
import LayoutPublico from '../../../layouts/LayoutPublico';

export default function RecuperarContrasena() {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ open: true, message, type });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    // Mismo fondo y encabezado que el login, sin footer
    <LayoutPublico mostrarFooter={false}>
      <RecuperarPassword
        showToast={showToast}
        onVolver={() => navigate('/')}
        // El toast de esta página se destruye al navegar, así que el aviso viaja al login
        onExito={() =>
          navigate('/', { state: { aviso: 'Contraseña actualizada. Ya puedes iniciar sesión' } })
        }
      />

      <ToastNotification
        open={toast.open}
        onClose={handleCloseToast}
        message={toast.message}
        type={toast.type}
      />
    </LayoutPublico>
  );
}