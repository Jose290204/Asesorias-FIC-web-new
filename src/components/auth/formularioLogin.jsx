import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoTutorias from '../../assets/Logo_tutorias.png';
import { useAuth } from '../../context/AuthContext';
import ToastNotification from '../ui/ToastNotification'; // Asegúrate de ajustar esta ruta


export default function FormularioLogin() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  // true = la contraseña se ve como texto
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Estado unificado para controlar el Toast
  const [toast, setToast] = useState({
    open: false,
    message: '',
    type: 'info'
  });

  // Función para cerrar el Toast
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Función auxiliar para mostrar notificaciones fácilmente
  const showToast = (message, type = 'info') => {
    setToast({
      open: true,
      message,
      type
    });
  };

  // Convierte cualquier error de la API en un texto listo para mostrar
  const mensajeDeError = (error) => {
    const data = error.response?.data;

    // Sin respuesta: el backend está apagado o no hay red
    if (!data) return 'No se pudo conectar con el servidor';
    // Errores del servidor (5xx): no se muestra el detalle técnico al usuario
    if (error.response.status >= 500) return 'Error del servidor. Intenta de nuevo en un momento';
    // 422: un mensaje por campo (el de credenciales viene en español)
    if (data.errors) return Object.values(data.errors).flat().join(' ');
    // 403 (cuenta inactiva), 429 (demasiados intentos)...: ya vienen en español
    return data.message ?? 'Ocurrió un error inesperado';
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!correo || !password) {
      showToast('Por favor rellene los campos', 'error');
      return;
    }

    setLoading(true);

    try {
      // login() pide la cookie CSRF e inicia sesión. Al guardar al usuario en el
      // contexto, App.jsx redirige solo según su rol: aquí no hay que navegar.
      await login(correo, password);
    } catch (error) {
      showToast(mensajeDeError(error), 'error');
      setLoading(false);
    }
    // En el éxito no se quita "loading": este formulario desaparece al cambiar la ruta.
  }

  return (
    <div className="bg-white rounded-[15px] shadow-[0_0_7px_4px_rgba(158,158,158,0.3)] w-[300px] sm:w-[380px] h-[450px] sm:h-[530px] p-[25px] sm:p-[40px] flex flex-col items-center">

      {/* Logo FIC Asesorías */}
      <img
        src={LogoTutorias}
        alt="Logo Asesorías FIC"
        className="w-[200px] sm:w-[227px] object-contain"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/227x100/ffffff/000000?text=FIC+Asesorias';
        }}
      />

      {/* Espaciado responsivo antes del formulario */}
      <div className="h-[35px] sm:h-[80px]"></div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col">

        {/* Input Correo institucional */}
        <div className="relative flex items-center">
          <Mail className="absolute left-[15px] w-[18px] h-[18px] text-[#244B91]" />
          <input
            type="email"
            autoComplete="username"
            placeholder="Correo institucional"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full h-[45px] pl-[45px] pr-[15px] bg-[#F0F0F0] text-[14px] text-slate-700 placeholder-[#A8A7A7] rounded-[5px] border border-[#C7C6C6] focus:border-[#A5A5A5] focus:outline-none transition-colors"
          />
        </div>

        {/* Separación exacta entre inputs */}
        <div className="h-[27px]"></div>

        {/* Input Contraseña con ojito */}
        <div className="relative flex items-center">
          <Lock className="absolute left-[15px] w-[18px] h-[18px] text-[#D4A017]" />
          <input
            // type cambia entre "text" y "password" según el ojo
            type={mostrarPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // pr-[45px] deja espacio a la derecha para que el texto no quede bajo el ojo
            className="w-full h-[45px] pl-[45px] pr-[45px] bg-[#F0F0F0] text-[14px] text-slate-700 placeholder-[#A8A7A7] rounded-[5px] border border-[#C7C6C6] focus:border-[#A5A5A5] focus:outline-none transition-colors"
          />
          {/* type="button" evita que el ojo envíe el formulario */}
          <button
            type="button"
            onClick={() => setMostrarPassword((v) => !v)}
            aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-[10px] p-[5px] text-slate-500 hover:text-slate-700"
          >
            {mostrarPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
          </button>
        </div>

        {/* Enlace a la recuperación, justo debajo de la contraseña.
            type="button" evita que dispare el envío del formulario */}
        <div className="flex justify-end mt-[8px]">
          <button
            type="button"
            onClick={() => navigate('/recuperar-contrasena')}
            className="text-[13px] text-[#244B91] hover:underline"
          >
            Olvidé mi contraseña
          </button>
        </div>

        {/* Separación antes del botón (se redujo de 35 a 20 por el enlace de arriba) */}
        <div className="h-[20px]"></div>

        {/* Botón INGRESAR */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#D4A017] hover:bg-[#c29115] disabled:bg-gray-400 text-white text-[15px] font-bold rounded-[8px] w-[160px] h-[45px] transition-colors flex items-center justify-center"
          >
            {loading ? 'INGRESANDO...' : 'INGRESAR'}
          </button>
        </div>
      </form>

      {/* renderización del Toast */}
      <ToastNotification
        open={toast.open}
        onClose={handleCloseToast}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}