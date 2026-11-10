import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ToastNotification from '../ui/ToastNotification'; // Asegúrate de ajustar esta ruta
import LogoFicAsesorias from './LogoFicAsesorias';


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
    <>
    <div className="relative overflow-hidden bg-white/95 backdrop-blur-sm rounded-[16px] shadow-[0_12px_40px_rgba(18,42,136,0.28)] w-[300px] sm:w-[380px] p-[25px] sm:p-[40px] pt-[30px] sm:pt-[44px] flex flex-col items-center">

      {/* Franja de acento azul-dorado arriba de la tarjeta */}
      <div className="absolute inset-x-0 top-0 h-[5px] bg-[linear-gradient(90deg,#244B91,#D4A017)]" />

      {/* Logo Asesorías */}
      <LogoFicAsesorias />

      {/* Título de bienvenida */}
      <div className="mt-[18px] mb-[22px] text-center sm:mt-[26px] sm:mb-[30px]">
        <h1 className="text-[20px] font-bold text-[#122a88] sm:text-[22px]">Bienvenido</h1>
        <p className="mt-1 text-[13px] text-slate-500">Inicia sesión con tu correo institucional</p>
      </div>

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
            className="w-full h-[45px] pl-[45px] pr-[15px] bg-slate-50 text-[14px] text-slate-700 placeholder-[#A8A7A7] rounded-[8px] border border-slate-300 focus:border-[#244B91] focus:bg-white focus:ring-4 focus:ring-[#244B91]/15 focus:outline-none transition-all"
          />
        </div>

        {/* Separación exacta entre inputs */}
        <div className="h-[18px]"></div>

        {/* Input Contraseña con ojito */}
        <div className="relative flex items-center">
          <Lock className="absolute left-[15px] w-[18px] h-[18px] text-[#244B91]" />
          <input
            // type cambia entre "text" y "password" según el ojo
            type={mostrarPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // pr-[45px] deja espacio a la derecha para que el texto no quede bajo el ojo
            className="w-full h-[45px] pl-[45px] pr-[45px] bg-slate-50 text-[14px] text-slate-700 placeholder-[#A8A7A7] rounded-[8px] border border-slate-300 focus:border-[#244B91] focus:bg-white focus:ring-4 focus:ring-[#244B91]/15 focus:outline-none transition-all"
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
            className="cursor-pointer text-[13px] font-medium text-[#244B91] hover:underline"
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
            className="w-full h-[46px] cursor-pointer rounded-[8px] bg-[linear-gradient(135deg,#e0b63a,#D4A017_55%,#bf8f12)] text-[15px] font-bold tracking-wide text-white shadow-[0_6px_16px_rgba(212,160,23,0.4)] transition-all hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(212,160,23,0.5)] active:translate-y-0 disabled:cursor-not-allowed disabled:bg-none disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center"
          >
            {loading ? 'INGRESANDO...' : 'INGRESAR'}
          </button>
        </div>
      </form>

    </div>

    {/* Toast fuera de la tarjeta: ahí lo recortaban el overflow y el blur */}
    <ToastNotification
      open={toast.open}
      onClose={handleCloseToast}
      message={toast.message}
      type={toast.type}
    />
    </>
  );
}