import AddIcon from '@mui/icons-material/Add';
import { Button, CircularProgress } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastNotification } from '../../../components/ui/ToastNotification';
import { useFacultadActiva } from '../../../context/FacultadActivaContext';
import ModalFacultad from '../components/ModalFacultad';
import TarjetaFacultad from '../components/TarjetaFacultad';
import {
  cambiarEstadoFacultad,
  crearFacultad,
  editarFacultad,
  listarFacultades,
} from '../services/facultadesService';

// Pantalla de inicio del super admin: todas las facultades y la puerta a su panel.
export default function Facultades() {
  const navigate = useNavigate();
  const { entrar } = useFacultadActiva();

  const [facultades, setFacultades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Modal crear/editar: `modal` guarda { facultad } y `llave` fuerza formulario limpio en cada apertura
  const [modal, setModal] = useState(null);
  const [llave, setLlave] = useState(0);

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
      await editarFacultad(modal.facultad.id, datos);
      avisar('Facultad actualizada.');
    } else {
      await crearFacultad(datos);
      avisar('Facultad creada.');
    }
    await cargar();
  };

  const handleCambiarEstado = async (facultad) => {
    try {
      await cambiarEstadoFacultad(facultad.id, !facultad.activa);
      avisar(facultad.activa ? 'Facultad desactivada.' : 'Facultad activada.');
      await cargar();
    } catch {
      avisar('No se pudo cambiar el estado.', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="flex-1 text-2xl font-bold text-[#08338F]">Facultades</h1>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => abrirModal()} sx={{ textTransform: 'none' }}>
          Nueva facultad
        </Button>
      </div>

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

      <ToastNotification
        open={toast.open}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}
