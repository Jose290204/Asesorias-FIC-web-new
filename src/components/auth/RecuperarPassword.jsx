import { Eye, EyeOff, KeyRound, Lock, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import LogoTutorias from '../../assets/Logo_tutorias.png';
import {
    restablecerPassword,
    solicitarCodigo,
    verificarCodigo,
} from '../../Services/authService';

const ESPERA_REENVIO = 60; // el backend solo deja pedir 1 código por minuto

// Mismo criterio que el login: convierte el error de la API en texto
const mensajeDeError = (error) => {
  const data = error.response?.data;
  // Sin respuesta: el backend está apagado o no hay red
  if (!data) return 'No se pudo conectar con el servidor';
  // Errores del servidor (5xx): no se muestra el detalle técnico al usuario
  if (error.response.status >= 500) return 'Error del servidor. Intenta de nuevo en un momento';
  if (data.errors) return Object.values(data.errors).flat().join(' ');
  return data.message ?? 'Ocurrió un error inesperado';
};

const claseInput =
  'w-full h-[45px] pl-[45px] pr-[15px] bg-[#F0F0F0] text-[14px] text-slate-700 placeholder-[#A8A7A7] rounded-[5px] border border-[#C7C6C6] focus:border-[#A5A5A5] focus:outline-none transition-colors';
// Igual que claseInput pero con más espacio a la derecha para el ojo.
// Va como clase aparte porque dos clases de padding en el mismo elemento
// se pisan según el orden del CSS, no el del texto.
const claseInputPassword =
  'w-full h-[45px] pl-[45px] pr-[45px] bg-[#F0F0F0] text-[14px] text-slate-700 placeholder-[#A8A7A7] rounded-[5px] border border-[#C7C6C6] focus:border-[#A5A5A5] focus:outline-none transition-colors';
const claseBoton =
  'bg-[#D4A017] hover:bg-[#c29115] disabled:bg-gray-400 text-white text-[15px] font-bold rounded-[8px] w-[180px] h-[45px] transition-colors flex items-center justify-center';
const claseLeyenda = 'text-[14px] font-semibold text-[#244B91] text-center';

// onVolver: regresa al login. onExito: se llama al cambiar la contraseña.
// showToast: el toast vive en la página.
export default function RecuperarPassword({ onVolver, onExito, showToast }) {
  // 1 = correo, 2 = código, 3 = contraseña nueva
  const [paso, setPaso] = useState(1);
  // El correo y el código viven solo en memoria: el backend no guarda en qué paso vas
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  // true = las contraseñas se ven como texto. Un solo interruptor para los dos campos
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [segundos, setSegundos] = useState(0); // cuenta regresiva del reenvío

  // Cuenta regresiva: baja 1 cada segundo hasta llegar a 0
  useEffect(() => {
    if (segundos <= 0) return;
    const id = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [segundos]);

  // Paso 1 (y reenvío): pide el código
  async function pedirCodigo(e) {
    e?.preventDefault();
    if (!correo) return showToast('Escribe tu correo', 'error');

    setLoading(true);
    try {
      await solicitarCodigo(correo.trim());
      setSegundos(ESPERA_REENVIO);
      setPaso(2);
      showToast('Si el correo está registrado, te enviamos un código', 'info');
    } catch (error) {
      showToast(mensajeDeError(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  // Paso 2: comprueba el código
  async function comprobarCodigo(e) {
    e.preventDefault();
    if (codigo.length !== 6) return showToast('El código tiene 6 dígitos', 'error');

    setLoading(true);
    try {
      await verificarCodigo(correo.trim(), codigo);
      setPaso(3);
    } catch (error) {
      showToast(mensajeDeError(error), 'error');
    } finally {
      setLoading(false);
    }
  }

  // Paso 3: cambia la contraseña
  async function cambiarPassword(e) {
    e.preventDefault();
    if (password.length < 8) return showToast('Mínimo 8 caracteres', 'error');
    if (password !== confirmar) return showToast('Las contraseñas no coinciden', 'error');

    setLoading(true);
    try {
      await restablecerPassword(correo.trim(), codigo, password, confirmar);
      onExito(); // la página navega al login con el aviso de éxito
    } catch (error) {
      // Si el código ya no sirve (venció mientras escribías), se vuelve al paso 1
      if (error.response?.data?.codigo === 'codigo_invalido') {
        setCodigo('');
        setPaso(1);
      }
      showToast(mensajeDeError(error), 'error');
      setLoading(false);
    }
  }

  // Botón del ojo, igual para los dos campos. type="button" evita que envíe el formulario
  const botonOjo = (
    <button
      type="button"
      onClick={() => setMostrarPassword((v) => !v)}
      aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      className="absolute right-[10px] p-[5px] text-slate-500 hover:text-slate-700"
    >
      {mostrarPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
    </button>
  );

  return (
    <div className="bg-white rounded-[15px] shadow-[0_0_7px_4px_rgba(158,158,158,0.3)] w-[300px] sm:w-[380px] min-h-[450px] sm:min-h-[530px] p-[25px] sm:p-[40px] flex flex-col items-center">

      {/* Logo FIC Asesorías (igual que el login) */}
      <img
        src={LogoTutorias}
        alt="Logo Asesorías FIC"
        className="w-[200px] sm:w-[227px] object-contain"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/227x100/ffffff/000000?text=FIC+Asesorias';
        }}
      />

      <div className="h-[30px] sm:h-[45px]"></div>

      {paso === 1 && (
        <form onSubmit={pedirCodigo} className="w-full flex flex-col gap-[25px]">
          <p className={claseLeyenda}>
            Escribe tu correo para recuperar la contraseña
          </p>
          <div className="relative flex items-center">
            <Mail className="absolute left-[15px] w-[18px] h-[18px] text-[#244B91]" />
            <input
              type="email"
              autoComplete="username"
              placeholder="Correo institucional"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className={claseInput}
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" disabled={loading} className={claseBoton}>
              {loading ? 'ENVIANDO...' : 'ENVIAR CÓDIGO'}
            </button>
          </div>
        </form>
      )}

      {paso === 2 && (
        <form onSubmit={comprobarCodigo} className="w-full flex flex-col gap-[25px]">
          <p className={claseLeyenda}>
            Escribe el código de 6 dígitos que llegó a tu correo
          </p>
          <div className="relative flex items-center">
            <KeyRound className="absolute left-[15px] w-[18px] h-[18px] text-[#244B91]" />
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="Código"
              value={codigo}
              // Solo deja pasar dígitos
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              className={claseInput}
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" disabled={loading} className={claseBoton}>
              {loading ? 'VERIFICANDO...' : 'VERIFICAR'}
            </button>
          </div>
          <button
            type="button"
            onClick={() => pedirCodigo()}
            disabled={segundos > 0 || loading}
            className="text-[13px] text-[#244B91] disabled:text-gray-400"
          >
            {segundos > 0 ? `Reenviar código en ${segundos} s` : 'Reenviar código'}
          </button>
        </form>
      )}

      {paso === 3 && (
        <form onSubmit={cambiarPassword} className="w-full flex flex-col gap-[20px]">
          <p className={claseLeyenda}>
            Elige tu nueva contraseña (mínimo 8 caracteres)
          </p>
          <div className="relative flex items-center">
            <Lock className="absolute left-[15px] w-[18px] h-[18px] text-[#D4A017]" />
            <input
              // type cambia entre "text" y "password" según el ojo
              type={mostrarPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={claseInputPassword}
            />
            {botonOjo}
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-[15px] w-[18px] h-[18px] text-[#D4A017]" />
            <input
              type={mostrarPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Confirmar contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className={claseInputPassword}
            />
            {botonOjo}
          </div>
          <div className="flex justify-center">
            <button type="submit" disabled={loading} className={claseBoton}>
              {loading ? 'GUARDANDO...' : 'GUARDAR'}
            </button>
          </div>
        </form>
      )}

      <button
        type="button"
        onClick={onVolver}
        className="mt-[25px] text-[13px] text-slate-500 hover:text-slate-700"
      >
        ← Volver al inicio de sesión
      </button>
    </div>
  );
}