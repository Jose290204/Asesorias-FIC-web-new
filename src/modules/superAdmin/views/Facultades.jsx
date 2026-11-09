import AddIcon from '@mui/icons-material/Add';
import { Button, CircularProgress } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastNotification } from '../../../components/ui/ToastNotification';
import { useFacultadActiva } from '../../../context/FacultadActivaContext';
import { mensajesDeError } from '../../../Services/errores';
import ModalDesactivarFacultad from '../components/ModalDesactivarFacultad';
import ModalFacultad from '../components/ModalFacultad';
import TarjetaFacultad from '../components/TarjetaFacultad';
import {
  cambiarEstadoFacultad,
  crearFacultad,
  editarFacultad,
  listarFacultades,
} from '../services/facultadesService';

// Pantalla de inicio del super admin: todas las facultades y la puerta a su panel.
// Tarjeta pequeña del resumen de arriba
function DatoResumen({ valor, etiqueta }) {
  return (
    <div className="rounded-[5px] bg-white px-4 py-3 shadow-md">
      <p className="text-2xl font-bold text-[#08338F]">{valor}</p>
      <p className="text-sm text-gray-600">{etiqueta}</p>
    </div>
  );
}

export default function Facultades() {
  const navigate = useNavigate();
  const { facultadActiva, entrar, salir } = useFacultadActiva();

  const [facultades, setFacultades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Modal crear/editar: `modal` guarda { facultad } y `llave` fuerza formulario limpio en cada apertura
  const [modal, setModal] = useState(null);
  const [llave, setLlave] = useState(0);

  // Facultad que se está por desactivar (null = modal cerrado)
  const [porDesactivar, setPorDesactivar] = useState(null);

  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const avisar = (message, type = 'success') => setToast({ open: true, message, type });

  const cargar = useCallback(async () => {
    try {
      setFacultades(await listarFacultades());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Totales de todo el sistema, calculados con las facultades que ya cargamos
  const resumen = {
    total: facultades.length,
    activas: facultades.filter((f) => f.activa).length,
    estudiantes: facultades.reduce((suma, f) => suma + f.estudiantes, 0),
    asesorias: facultades.reduce((suma, f) => suma + f.asesorias, 0),
  };

  const abrirModal = (facultad = null) => {
    setLlave((k) => k + 1);
    setModal({ facultad });
  };

  const handleEntrar = (facultad) => {
    entrar(facultad);
    navigate('/admin/asesorias');
  };

  const handleGuardar = async (datos) => {
    if (modal.facultad) {
      const actualizada = await editarFacultad(modal.facultad.id, datos);
      // Si es la facultad en la que está trabajando, la barra "Estás viendo" debe mostrar los datos nuevos
      if (facultadActiva?.id === actualizada.id) entrar(actualizada);
      avisar('Facultad actualizada.');
    } else {
      await crearFacultad(datos);
      avisar('Facultad creada.');
    }
    await cargar();
  };

  const cambiarEstado = async (facultad) => {
    try {
      await cambiarEstadoFacultad(facultad.id, !facultad.activa);
      // Una facultad desactivada ya no se puede usar como contexto
      if (facultad.activa && facultadActiva?.id === facultad.id) salir();
      avisar(facultad.activa
        ? 'Facultad desactivada. Sus usuarios ya no pueden iniciar sesión.'
        : 'Facultad activada. Sus usuarios ya pueden iniciar sesión.');
      await cargar();
    } catch (e) {
      avisar(mensajesDeError(e)[0] ?? 'No se pudo cambiar el estado.', 'error');
    }
  };

  // Desactivar pide confirmación; activar se hace directo
  const handleCambiarEstado = (facultad) => {
    if (facultad.activa) {
      setPorDesactivar(facultad);
      return;
    }
    cambiarEstado(facultad);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="flex-1 text-2xl font-bold text-[#08338F]">Facultades</h1>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => abrirModal()} sx={{ textTransform: 'none' }}>
          Nueva facultad
        </Button>
      </div>

      {!cargando && !error && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <DatoResumen valor={resumen.total} etiqueta="Facultades" />
          <DatoResumen valor={resumen.activas} etiqueta="Activas" />
          <DatoResumen valor={resumen.estudiantes} etiqueta="Estudiantes" />
          <DatoResumen valor={resumen.asesorias} etiqueta="Asesorías" />
        </div>
      )}

      {cargando && (
        <div className="flex justify-center py-16"><CircularProgress /></div>
      )}

      {!cargando && error && (
        <p className="py-10 text-center text-gray-600">
          No se pudieron cargar las facultades.{' '}
          <button className="text-blue-700 underline" onClick={cargar}>Reintentar</button>
        </p>
      )}

      {!cargando && !error && facultades.length === 0 && (
        <p className="py-10 text-center text-gray-600">Aún no hay facultades. Crea la primera.</p>
      )}

      {!cargando && !error && (
        <div className="grid gap-5 md:grid-cols-2">
          {facultades.map((f) => (
            <TarjetaFacultad
              key={f.id}
              facultad={f}
              onEntrar={handleEntrar}
              onEditar={abrirModal}
              onCambiarEstado={handleCambiarEstado}
            />
          ))}
        </div>
      )}

      {modal && (
        <ModalFacultad
          key={llave}
          open
          facultad={modal.facultad}
          onClose={() => setModal(null)}
          onGuardar={handleGuardar}
        />
      )}

      <ModalDesactivarFacultad
        open={Boolean(porDesactivar)}
        data={porDesactivar}
        onClose={() => setPorDesactivar(null)}
        onConfirm={cambiarEstado}
      />

      <ToastNotification
        open={toast.open}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}
