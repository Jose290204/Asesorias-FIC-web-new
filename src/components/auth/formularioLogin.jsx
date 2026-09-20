import { Lock, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoTutorias from '../../assets/Logo_tutorias.png';
import { useAuth } from '../../context/AuthContext';
import usuariosService from '../../Services/usuariosService';
import ToastNotification from '../ui/ToastNotification'; // Asegúrate de ajustar esta ruta


export default function FormularioLogin() {
  const [user, setUser] = useState('');
  const [nip, setNip] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Estado unificado para controlar el Toast
  const [toast, setToast] = useState({
    open: false,
    message: '',
    type: 'info'
  });

  const navigate = useNavigate();

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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user || !nip) {
      showToast('Por favor rellene los campos', 'error');
      return;
    }

    setLoading(true);

    try {
      // Llamamos a la API
      const response = await usuariosService.post('/login', {
        usuario: user,
        password_hash: nip
      });

      const data = response.data;


        login(data.usuario);

        // Notificación de éxito
        showToast('Inicio de sesión exitoso', 'success');
        
        setTimeout(() => {
        navigate('/admin/asesorias');
      }, 1000);
      
    } catch (error) {
      if (error.response) {
        const mensaje = error.response.data.details || error.response.data.message || 'Credenciales incorrectas';
        showToast(mensaje, 'error');
      } else {
        showToast('No se pudo conectar con el servidor', 'error');
      }
    } finally {
      setLoading(false);
    }
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

        {/* Input No. Cuenta */}
        <div className="relative flex items-center">
          <User className="absolute left-[15px] w-[18px] h-[18px] text-[#244B91]" />
          <input
            type="text"
            placeholder="No. Cuenta"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full h-[45px] pl-[45px] pr-[15px] bg-[#F0F0F0] text-[14px] text-slate-700 placeholder-[#A8A7A7] rounded-[5px] border border-[#C7C6C6] focus:border-[#A5A5A5] focus:outline-none transition-colors"
          />
        </div>

        {/* Separación exacta entre inputs */}
        <div className="h-[27px]"></div>

        {/* Input NIP */}
        <div className="relative flex items-center">
          <Lock className="absolute left-[15px] w-[18px] h-[18px] text-[#D4A017]" />
          <input
            type="password"
            placeholder="NIP"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            className="w-full h-[45px] pl-[45px] pr-[15px] bg-[#F0F0F0] text-[14px] text-slate-700 placeholder-[#A8A7A7] rounded-[5px] border border-[#C7C6C6] focus:border-[#A5A5A5] focus:outline-none transition-colors"
          />
        </div>

        {/* Separación antes del botón */}
        <div className="h-[35px]"></div>

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