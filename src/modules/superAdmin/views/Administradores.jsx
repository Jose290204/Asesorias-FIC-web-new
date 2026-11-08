import AddIcon from '@mui/icons-material/Add';
import {
  Button, Chip, CircularProgress, MenuItem, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { ToastNotification } from '../../../components/ui/ToastNotification';
import ModalAdministrador from '../components/ModalAdministrador';
import {
  cambiarEstadoAdministrador,
  crearAdministrador,
  listarAdministradores,
} from '../services/administradoresService';
import { listarFacultades } from '../services/facultadesService';

const estiloEstatus = {
  activo: { bgcolor: '#E6F4EA', color: '#1B5E20' },
  pendiente: { bgcolor: '#FFF4E0', color: '#8A5A00' },
  inactivo: { bgcolor: '#F1F3F4', color: '#5F6368' },
};

// Administradores de todas las facultades, con filtro por facultad.
export default function Administradores() {
  const [facultades, setFacultades] = useState([]);
  const [administradores, setAdministradores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [llave, setLlave] = useState(0);

  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const avisar = (message, type = 'success') => setToast({ open: true, message, type });

  const cargar = useCallback(async (facultadId) => {
    try {
      const [fac, adm] = await Promise.all([
        listarFacultades(),
        listarAdministradores(facultadId || null),
      ]);
      setFacultades(fac);
      setAdministradores(adm);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar(filtro);
  }, [cargar, filtro]);

  const nombreFacultad = (id) => facultades.find((f) => f.id === id)?.siglas ?? '—';

  const abrirModal = () => {
    setLlave((k) => k + 1);
    setModalAbierto(true);
  };

  const handleCrear = async (datos) => {
    await crearAdministrador(datos);
    avisar('Administrador creado.');
    await cargar(filtro);
  };

  const handleCambiarEstado = async (admin) => {
    const nuevo = admin.estatus === 'inactivo' ? 'activo' : 'inactivo';
    try {
      await cambiarEstadoAdministrador(admin.id, nuevo);
      avisar(nuevo === 'activo' ? 'Administrador activado.' : 'Administrador desactivado.');
      await cargar(filtro);
    } catch {
      avisar('No se pudo cambiar el estado.', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="flex-1 text-2xl font-bold text-[#08338F]">Administradores</h1>
        <TextField
          select
          size="small"
          label="Facultad"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          sx={{ minWidth: 200, bgcolor: '#fff' }}
        >
          <MenuItem value="">Todas</MenuItem>
          {facultades.map((f) => (
            <MenuItem key={f.id} value={f.id}>{f.siglas}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" startIcon={<AddIcon />} onClick={abrirModal} sx={{ textTransform: 'none' }}>
          Nuevo administrador
        </Button>
      </div>

      {cargando && <div className="flex justify-center py-16"><CircularProgress /></div>}

      {!cargando && error && (
        <p className="py-10 text-center text-gray-600">
          No se pudieron cargar los administradores.{' '}
          <button className="text-blue-700 underline" onClick={() => cargar(filtro)}>Reintentar</button>
        </p>
      )}

      {!cargando && !error && (
        <TableContainer component={Paper} sx={{ borderRadius: '5px' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#08338F' }}>
                {['Nombre', 'Correo', 'Facultad', 'Estado', ''].map((h) => (
                  <TableCell key={h} sx={{ color: '#fff', fontWeight: 700 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {administradores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#5F6368' }}>
                    No hay administradores para mostrar.
                  </TableCell>
                </TableRow>
              )}
              {administradores.map((a) => (
                <TableRow key={a.id} hover>
                  <TableCell>{a.nombre}</TableCell>
                  <TableCell>{a.correo}</TableCell>
                  <TableCell>{nombreFacultad(a.facultadId)}</TableCell>
                  <TableCell>
                    <Chip label={a.estatus.toUpperCase()} size="small" sx={estiloEstatus[a.estatus]} />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      color={a.estatus === 'inactivo' ? 'success' : 'error'}
                      onClick={() => handleCambiarEstado(a)}
                      sx={{ textTransform: 'none' }}
                    >
                      {a.estatus === 'inactivo' ? 'Activar' : 'Desactivar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {modalAbierto && (
        <ModalAdministrador
          key={llave}
          open
          facultades={facultades}
          facultadInicial={filtro}
          onClose={() => setModalAbierto(false)}
          onGuardar={handleCrear}
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
