import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Button, Chip, CircularProgress, Fab, MenuItem, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCallback, useEffect, useState } from 'react';
import { ToastNotification } from '../../../components/ui/ToastNotification';
import { mensajesDeError } from '../../../Services/errores';
import TarjetaAdministrador from '../components/TarjetaAdministrador';
import ModalAdministrador from '../components/ModalAdministrador';
import ModalEliminarAdministrador from '../components/ModalEliminarAdministrador';
import ModalDesactivarAdministrador from '../components/ModalDesactivarAdministrador';
import {
  cambiarEstadoAdministrador,
  crearAdministrador,
  editarAdministrador,
  eliminarAdministrador,
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
  // Mismo corte que el resto del admin: menos de 768 px = celular (tarjetas en vez de tabla)
  const esMovil = useMediaQuery('(max-width:767px)');

  const [facultades, setFacultades] = useState([]);
  const [administradores, setAdministradores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Modal crear/editar: `modal` guarda { administrador } (null = crear). `llave` fuerza formulario limpio.
  const [modal, setModal] = useState(null);
  const [llave, setLlave] = useState(0);

  // Administrador que se está por desactivar (null = modal cerrado)
  const [porDesactivar, setPorDesactivar] = useState(null);

  // Administrador que se está por eliminar (null = modal cerrado)
  const [porEliminar, setPorEliminar] = useState(null);

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

  const abrirModal = (administrador = null) => {
    setLlave((k) => k + 1);
    setModal({ administrador });
  };

  const handleGuardar = async (datos) => {
    if (modal.administrador) {
      await editarAdministrador(modal.administrador.id, datos);
      avisar('Administrador actualizado.');
    } else {
      await crearAdministrador(datos);
      avisar('Administrador creado.');
    }
    await cargar(filtro);
  };

  const cambiarEstado = async (admin) => {
    const nuevo = admin.estatus === 'inactivo' ? 'activo' : 'inactivo';
    try {
      await cambiarEstadoAdministrador(admin.id, nuevo);
      avisar(nuevo === 'activo' ? 'Administrador activado.' : 'Administrador desactivado.');
      await cargar(filtro);
    } catch (e) {
      avisar(mensajesDeError(e)[0] ?? 'No se pudo cambiar el estado.', 'error');
    }
  };

  const eliminar = async (admin) => {
    try {
      await eliminarAdministrador(admin.id);
      avisar('Administrador eliminado.');
      await cargar(filtro);
    } catch (e) {
      avisar(mensajesDeError(e)[0] ?? 'No se pudo eliminar al administrador.', 'error');
    }
  };

  // Desactivar pide confirmación; activar se hace directo
  const handleCambiarEstado = (admin) => {
    if (admin.estatus !== 'inactivo') {
      setPorDesactivar(admin);
      return;
    }
    cambiarEstado(admin);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      {/* En celular: título, filtro chico a la izquierda y el botón de crear flotante abajo */}
      <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        <h1 className="text-2xl font-bold text-[#08338F] sm:flex-1">Administradores</h1>
        <TextField
          select
          size="small"
          label="Facultad"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          sx={{ minWidth: { xs: 150, sm: 200 }, width: { xs: 170, sm: 'auto' }, bgcolor: '#fff' }}
        >
          <MenuItem value="">Todas</MenuItem>
          {facultades.map((f) => (
            <MenuItem key={f.id} value={f.id}>{f.siglas}</MenuItem>
          ))}
        </TextField>

        {/* Botón normal: solo tablet y escritorio */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => abrirModal()}
          sx={{ textTransform: 'none', display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Nuevo administrador
        </Button>
      </div>

      {/* Botón flotante: solo celular */}
      <Fab
        variant="extended"
        aria-label="Nuevo administrador"
        onClick={() => abrirModal()}
        sx={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 10,
          textTransform: 'none',
          color: '#ffffff',
          backgroundColor: '#08338F',
          '&:hover': { backgroundColor: '#1B3A73' },
          display: { xs: 'inline-flex', sm: 'none' },
        }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Nuevo administrador
      </Fab>

      {cargando && <div className="flex justify-center py-16"><CircularProgress /></div>}

      {!cargando && error && (
        <p className="py-10 text-center text-gray-600">
          No se pudieron cargar los administradores.{' '}
          <button className="text-blue-700 underline" onClick={() => cargar(filtro)}>Reintentar</button>
        </p>
      )}

      {/* Celular: tarjetas. Se deja espacio abajo para que el botón flotante no tape la última */}
      {!cargando && !error && esMovil && (
        <div className="flex flex-col gap-5 pb-24">
          {administradores.length === 0 && (
            <p className="py-10 text-center text-gray-600">No hay administradores para mostrar.</p>
          )}
          {administradores.map((a) => (
            <TarjetaAdministrador
              key={a.id}
              administrador={a}
              siglasFacultad={nombreFacultad(a.facultadId)}
              onEditar={abrirModal}
              onCambiarEstado={handleCambiarEstado}
              onEliminar={setPorEliminar}
            />
          ))}
        </div>
      )}

      {!cargando && !error && !esMovil && (
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
                  <TableCell>{a.nombreCompleto}</TableCell>
                  <TableCell>{a.correo}</TableCell>
                  <TableCell>{nombreFacultad(a.facultadId)}</TableCell>
                  <TableCell>
                    <Chip label={a.estatus.toUpperCase()} size="small" sx={estiloEstatus[a.estatus]} />
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Button
                      size="small"
                      startIcon={<EditOutlinedIcon fontSize="small" />}
                      onClick={() => abrirModal(a)}
                      sx={{ textTransform: 'none', mr: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      color={a.estatus === 'inactivo' ? 'error' : 'success'}
                      onClick={() => handleCambiarEstado(a)}
                      sx={{ textTransform: 'none' }}
                    >
                      {a.estatus === 'inactivo' ? 'Activar' : 'Desactivar'}
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteOutlinedIcon fontSize="small" />}
                      onClick={() => setPorEliminar(a)}
                      sx={{ textTransform: 'none', ml: 1 }}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {modal && (
        <ModalAdministrador
          key={llave}
          open
          administrador={modal.administrador}
          facultades={facultades}
          facultadInicial={filtro}
          onClose={() => setModal(null)}
          onGuardar={handleGuardar}
        />
      )}

      <ModalDesactivarAdministrador
        open={Boolean(porDesactivar)}
        data={porDesactivar}
        onClose={() => setPorDesactivar(null)}
        onConfirm={cambiarEstado}
      />

      <ModalEliminarAdministrador
        open={Boolean(porEliminar)}
        data={porEliminar}
        onClose={() => setPorEliminar(null)}
        onConfirm={eliminar}
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
