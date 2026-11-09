import {
  CircularProgress, MenuItem, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TextField,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCallback, useEffect, useState } from 'react';
import ChipAccion from '../components/ChipAccion';
import TarjetaBitacora from '../components/TarjetaBitacora';
import { ACCIONES, listarBitacora } from '../services/bitacoraService';
import { listarFacultades } from '../services/facultadesService';

const FILTROS_VACIOS = { facultadId: '', accion: '', buscar: '', desde: '', hasta: '' };

// "8 nov 2026, 4:31 p.m." en la zona horaria del navegador
const formatoFecha = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
const mostrarFecha = (iso) => formatoFecha.format(new Date(iso));

// Bitácora global: qué pasó, quién lo hizo, cuándo y desde dónde.
// Es solo de lectura: la bitácora no se edita ni se borra desde la app.
export default function Bitacora() {
  // Mismo corte que el resto del admin: menos de 768 px = celular (tarjetas en vez de tabla)
  const esMovil = useMediaQuery('(max-width:767px)');

  const [facultades, setFacultades] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const cargar = useCallback(async (f) => {
    try {
      const [fac, reg] = await Promise.all([listarFacultades(), listarBitacora(f)]);
      setFacultades(fac);
      setRegistros(reg);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar(filtros);
  }, [cargar, filtros]);

  const cambiarFiltro = (campo) => (e) => {
    setFiltros((f) => ({ ...f, [campo]: e.target.value }));
    setPage(0); // al filtrar se vuelve a la primera página
  };

  const siglas = (id) => facultades.find((f) => f.id === id)?.siglas ?? '—';
  const visibles = registros.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const hayFiltros = Object.values(filtros).some(Boolean);

  const campoFiltro = { size: 'small', fullWidth: true, sx: { bgcolor: '#fff' } };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <h1 className="mb-1 text-2xl font-bold text-[#08338F]">Bitácora</h1>
      <p className="mb-5 text-sm text-gray-600">
        Registro de las acciones importantes de todas las facultades. Solo lectura.
      </p>

      {/* Filtros: en celular uno debajo del otro; en escritorio en una cuadrícula */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <TextField {...campoFiltro} label="Buscar" placeholder="Usuario, registro, IP…" value={filtros.buscar} onChange={cambiarFiltro('buscar')} />
        <TextField {...campoFiltro} select label="Facultad" value={filtros.facultadId} onChange={cambiarFiltro('facultadId')}>
          <MenuItem value="">Todas</MenuItem>
          {facultades.map((f) => (
            <MenuItem key={f.id} value={f.id}>{f.siglas}</MenuItem>
          ))}
        </TextField>
        <TextField {...campoFiltro} select label="Acción" value={filtros.accion} onChange={cambiarFiltro('accion')}>
          <MenuItem value="">Todas</MenuItem>
          {Object.entries(ACCIONES).map(([codigo, { etiqueta }]) => (
            <MenuItem key={codigo} value={codigo}>{etiqueta}</MenuItem>
          ))}
        </TextField>
        <TextField {...campoFiltro} type="date" label="Desde" value={filtros.desde} onChange={cambiarFiltro('desde')} slotProps={{ inputLabel: { shrink: true } }} />
        <TextField {...campoFiltro} type="date" label="Hasta" value={filtros.hasta} onChange={cambiarFiltro('hasta')} slotProps={{ inputLabel: { shrink: true } }} />
      </div>

      {hayFiltros && (
        <button
          className="mb-4 text-sm text-blue-700 underline"
          onClick={() => { setFiltros(FILTROS_VACIOS); setPage(0); }}
        >
          Limpiar filtros
        </button>
      )}

      {cargando && <div className="flex justify-center py-16"><CircularProgress /></div>}

      {!cargando && error && (
        <p className="py-10 text-center text-gray-600">
          No se pudo cargar la bitácora.{' '}
          <button className="text-blue-700 underline" onClick={() => cargar(filtros)}>Reintentar</button>
        </p>
      )}

      {!cargando && !error && registros.length === 0 && (
        <p className="py-10 text-center text-gray-600">No hay registros con esos filtros.</p>
      )}

      {/* Celular: tarjetas */}
      {!cargando && !error && esMovil && registros.length > 0 && (
        <div className="flex flex-col gap-5">
          {visibles.map((r) => (
            <TarjetaBitacora key={r.id} registro={r} siglasFacultad={siglas(r.facultadId)} fecha={mostrarFecha(r.fecha)} />
          ))}
        </div>
      )}

      {/* Escritorio: tabla */}
      {!cargando && !error && !esMovil && registros.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: '5px' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#08338F' }}>
                {['Fecha', 'Usuario', 'Acción', 'Registro', 'Detalle', 'Facultad', 'IP'].map((h) => (
                  <TableCell key={h} sx={{ color: '#fff', fontWeight: 700 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibles.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{mostrarFecha(r.fecha)}</TableCell>
                  <TableCell>{r.usuario}</TableCell>
                  <TableCell><ChipAccion accion={r.accion} /></TableCell>
                  <TableCell>{r.entidad}</TableCell>
                  <TableCell sx={{ color: '#555' }}>{r.detalle}</TableCell>
                  <TableCell>{siglas(r.facultadId)}</TableCell>
                  <TableCell sx={{ color: '#555', whiteSpace: 'nowrap' }}>{r.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!cargando && !error && registros.length > 0 && (
        <TablePagination
          component="div"
          count={registros.length}
          page={page}
          onPageChange={(_, nueva) => setPage(nueva)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
          rowsPerPageOptions={esMovil ? [] : [10, 25, 50]}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      )}
    </div>
  );
}
