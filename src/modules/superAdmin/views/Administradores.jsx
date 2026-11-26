import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Button, Chip, CircularProgress, Fab, IconButton, MenuItem, Paper, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Tooltip,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCallback, useEffect, useState } from 'react';
import useRefrescoPorAvisos from '../../../hooks/useRefrescoPorAvisos';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import TituloVista from '../../../components/ui/TituloVista';
import { ToastNotification } from '../../../components/ui/ToastNotification';
import { mensajesDeError } from '../../../Services/errores';
import { ESTILO_BOTON_CREAR } from '../../tutorias/rolAdministrador/components/compartidos/estilosAdmin';
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

// Encabezado de la tabla: igual que las demás tablas del administrador
const ESTILO_ENCABEZADO = {
  backgroundColor: '#244B91',
  color: '#FFFFFF',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  borderBottom: 0,
  py: 1.75,
  whiteSpace: 'nowrap',
};

// Botón de acción redondo y suave: ícono con su color y fondo tenue al pasar el mouse
const estiloAccion = (color, fondo) => ({ color, '&:hover': { backgroundColor: fondo } });

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

  // silencioso = recarga sin mostrar error (la usa el refresco automático)
  const cargar = useCallback(async (facultadId, silencioso = false) => {
    try {
      const [fac, adm] = await Promise.all([
        listarFacultades(),
        listarAdministradores(facultadId || null),
      ]);
      setFacultades(fac);
      setAdministradores(adm);
      setError(false);
    } catch {
      if (!silencioso) setError(true);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar(filtro);
  }, [cargar, filtro]);

  useRefrescoPorAvisos(() => cargar(filtro, true));

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
        <div className="sm:flex-1">
          <TituloVista titulo="Administradores" subtitulo="De todas las facultades" />
        </div>
        <TextField
          select
          size="small"
          label="Facultad"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          sx={{ minWidth: { xs: 150, sm: 200 }, width: { xs: 170, sm: 'auto' }, bgcolor: '#fff', borderRadius: '8px' }}
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
          sx={{ ...ESTILO_BOTON_CREAR, borderRadius: '8px', display: { xs: 'none', sm: 'inline-flex' } }}
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
          ...ESTILO_BOTON_CREAR,
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 10,
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
        <Paper
          variant="outlined"
          sx={{ width: '100%', borderRadius: '12px', borderColor: '#E5E7EB', overflow: 'hidden', boxShadow: '0px 2px 8px rgba(16, 24, 40, 0.06)' }}
        >
          <TableContainer sx={{ maxHeight: '560px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ '& th': ESTILO_ENCABEZADO, '& th:first-of-type': { pl: 3 }, '& th:last-child': { pr: 3 } }}>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell align="center">Facultad</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center" sx={{ width: '130px' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {administradores.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5, color: '#6B7280', border: 0 }}>
                      No hay administradores para mostrar.
                    </TableCell>
                  </TableRow>
                )}
                {administradores.map((a) => (
                  <TableRow
                    key={a.id}
                    hover
                    sx={{
                      '& td': { color: '#1F2937', fontSize: '14.5px', borderBottom: '1px solid #EEF1F6', py: 1.75 },
                      '& td:first-of-type': { pl: 3 },
                      '& td:last-child': { pr: 3 },
                      '&:hover': { backgroundColor: '#EAF0FB !important' },
                      '&:last-child td': { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: '#111827 !important' }}>{a.nombreCompleto}</TableCell>
                    <TableCell>{a.correo}</TableCell>
                    <TableCell align="center">{nombreFacultad(a.facultadId)}</TableCell>
                    <TableCell align="center">
                      <Chip label={a.estatus.toUpperCase()} size="small" sx={{ ...estiloEstatus[a.estatus], fontWeight: 600, fontSize: '12px' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                        <Tooltip title="Editar">
                          <IconButton size="small" sx={estiloAccion('#8A6D2B', 'rgba(196, 158, 13, 0.12)')} onClick={() => abrirModal(a)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={a.estatus === 'inactivo' ? 'Activar' : 'Desactivar'}>
                          <IconButton
                            size="small"
                            sx={a.estatus === 'inactivo' ? estiloAccion('#2E7D32', 'rgba(46, 125, 50, 0.10)') : estiloAccion('#B26A00', 'rgba(178, 106, 0, 0.10)')}
                            onClick={() => handleCambiarEstado(a)}
                          >
                            <PowerSettingsNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" sx={estiloAccion('#C62828', 'rgba(198, 40, 40, 0.10)')} onClick={() => setPorEliminar(a)}>
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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
