import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FormularioLogin from '../../../components/auth/formularioLogin';
import ToastNotification from '../../../components/ui/ToastNotification';
import LayoutPublico from '../../../layouts/LayoutPublico';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Si venimos de recuperar la contraseña, la página anterior manda un aviso
  // por el "state" de la navegación y aquí se muestra como toast
  const aviso = location.state?.aviso;

  const [toast, setToast] = useState(
    aviso
      ? { open: true, message: aviso, type: 'success' }
      : { open: false, message: '', type: 'info' }
  );

  // Limpia el aviso del historial para que no reaparezca al recargar con F5
  useEffect(() => {
    if (aviso) navigate(location.pathname, { replace: true, state: null });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (message, type = 'info') => {
    setToast({ open: true, message, type });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <LayoutPublico>
      <FormularioLogin
        onOlvide={() => navigate('/recuperar-contrasena')}
        showToast={showToast}
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