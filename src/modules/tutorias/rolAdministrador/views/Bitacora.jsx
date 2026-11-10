// rolAdministrador/views/Bitacora.jsx
// Bitácora de la facultad del administrador: qué pasó, quién lo hizo, cuándo y desde dónde.
// Misma base que la del super admin, pero sin filtro ni columna de facultad (el backend ya limita a la facultad activa).
// Solo lectura: la bitácora no se edita ni se borra desde la app.
import {
    CircularProgress, ListSubheader, MenuItem, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, TextField
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useRef, useState } from 'react';
import ChipAccion from '../../../superAdmin/components/ChipAccion';
import TarjetaBitacora from '../../../superAdmin/components/TarjetaBitacora';
import { GRUPOS_ACCIONES_ADMIN, listarBitacoraAdmin } from '../services/bitacoraAdminService';

const FILTROS_VACIOS = { accion: '', buscar: '', desde: '', hasta: '' };

// Menú de los selects: no más alto que ~8 opciones (con scroll adentro) ni más ancho que la pantalla
const PROPS_MENU = {
    slotProps: {
        paper: {
            sx: {
                maxHeight: 320,
                maxWidth: 'calc(100vw - 32px)',
                '& .MuiMenuItem-root': { whiteSpace: 'normal', overflowWrap: 'anywhere' }
            }
        }
    }
};

// "8 nov 2026, 4:31 p.m." en la zona horaria del navegador
const formatoFecha = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
const mostrarFecha = (iso) => formatoFecha.format(new Date(iso));

export default function Bitacora() {
    // Mismo corte que el resto del admin: menos de 768 px = celular (tarjetas en vez de tabla)
    const esMovil = useMediaQuery('(max-width:767px)');

    const [registros, setRegistros] = useState([]);
    const [total, setTotal] = useState(0);
    const [filtros, setFiltros] = useState(FILTROS_VACIOS);
    // Lo que se escribe en "Buscar"; pasa a `filtros.buscar` con una pausa para no pedir una página por letra
    const [textoBuscar, setTextoBuscar] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [intento, setIntento] = useState(0); // sube al pulsar "Reintentar"

    const [page, setPage] = useState(0); // MUI cuenta desde 0; la API desde 1
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Contador de peticiones: si llega una respuesta vieja después de una nueva, se ignora
    const pedido = useRef(0);

    // Pausa de 400 ms al escribir en "Buscar"
    useEffect(() => {
        const espera = setTimeout(() => {
            setFiltros((f) => (f.buscar === textoBuscar ? f : { ...f, buscar: textoBuscar }));
            setPage(0);
        }, 400);
        return () => clearTimeout(espera);
    }, [textoBuscar]);

    // Cada cambio de filtros, página o tamaño de página vuelve a pedir al servidor
    useEffect(() => {
        const id = ++pedido.current;

        (async () => {
            setCargando(true);
            try {
                const r = await listarBitacoraAdmin({ ...filtros, page: page + 1, porPagina: rowsPerPage });
                if (id !== pedido.current) return;
                setRegistros(r.registros);
                setTotal(r.total);
                setError(false);
            } catch {
                if (id === pedido.current) setError(true);
            } finally {
                if (id === pedido.current) setCargando(false);
            }
        })();
    }, [filtros, page, rowsPerPage, intento]);

    const cambiarFiltro = (campo) => (e) => {
        setFiltros((f) => ({ ...f, [campo]: e.target.value }));
        setPage(0); // al filtrar se vuelve a la primera página
    };

    const limpiarFiltros = () => {
        setFiltros(FILTROS_VACIOS);
        setTextoBuscar('');
        setPage(0);
    };

    const hayFiltros = Object.values(filtros).some(Boolean) || textoBuscar !== '';
    const primeraCarga = cargando && registros.length === 0 && !error;

    const campoFiltro = { size: 'small', fullWidth: true, sx: { bgcolor: '#fff', minWidth: 0 } };

    return (
        <div className="mx-auto max-w-6xl p-4 sm:p-6">
            <h1 className="mb-1 text-2xl font-bold text-[#08338F]">Bitácora</h1>
            <p className="mb-5 text-sm text-gray-600">
                Registro de las acciones importantes de esta facultad. Solo lectura.
            </p>

            {/* Filtros: en celular uno debajo del otro; en escritorio en una cuadrícula */}
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
                <TextField {...campoFiltro} label="Buscar" placeholder="Usuario, registro, IP…" value={textoBuscar} onChange={(e) => setTextoBuscar(e.target.value)} />
                <TextField {...campoFiltro} select label="Acción" value={filtros.accion} onChange={cambiarFiltro('accion')} slotProps={{ select: { MenuProps: PROPS_MENU } }}>
                    <MenuItem value="">Todas</MenuItem>
                    {GRUPOS_ACCIONES_ADMIN.flatMap(({ grupo, acciones }) => [
                        <ListSubheader key={`grupo-${grupo}`}>{grupo}</ListSubheader>,
                        ...acciones.map(([codigo, { etiqueta }]) => (
                            <MenuItem key={codigo} value={codigo}>{etiqueta}</MenuItem>
                        ))
                    ])}
                </TextField>
                <TextField {...campoFiltro} type="date" label="Desde" value={filtros.desde} onChange={cambiarFiltro('desde')} slotProps={{ inputLabel: { shrink: true } }} />
                <TextField {...campoFiltro} type="date" label="Hasta" value={filtros.hasta} onChange={cambiarFiltro('hasta')} slotProps={{ inputLabel: { shrink: true } }} />
            </div>

            {hayFiltros && (
                <button className="mb-4 text-sm text-blue-700 underline" onClick={limpiarFiltros}>
                    Limpiar filtros
                </button>
            )}

            {primeraCarga && <div className="flex justify-center py-16"><CircularProgress /></div>}

            {error && (
                <p className="py-10 text-center text-gray-600">
                    No se pudo cargar la bitácora.{' '}
                    <button className="text-blue-700 underline" onClick={() => setIntento((n) => n + 1)}>Reintentar</button>
                </p>
            )}

            {!cargando && !error && total === 0 && (
                <p className="py-10 text-center text-gray-600">No hay registros con esos filtros.</p>
            )}

            {/* Mientras llega otra página se atenúa la actual en vez de saltar a un spinner */}
            <div style={{ opacity: cargando && !primeraCarga ? 0.5 : 1, transition: 'opacity .15s' }}>
                {/* Celular: tarjetas */}
                {!error && esMovil && registros.length > 0 && (
                    <div className="flex flex-col gap-5">
                        {registros.map((r) => (
                            <TarjetaBitacora key={r.id} registro={r} fecha={mostrarFecha(r.fecha)} />
                        ))}
                    </div>
                )}

                {/* Escritorio: tabla */}
                {!error && !esMovil && registros.length > 0 && (
                    <TableContainer component={Paper} sx={{ borderRadius: '5px' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#08338F' }}>
                                    {['Fecha', 'Usuario', 'Acción', 'Registro', 'Detalle', 'IP'].map((h) => (
                                        <TableCell key={h} sx={{ color: '#fff', fontWeight: 700 }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {registros.map((r) => (
                                    <TableRow key={r.id} hover>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{mostrarFecha(r.fecha)}</TableCell>
                                        <TableCell sx={{ maxWidth: 180, overflowWrap: 'anywhere' }}>{r.usuario}</TableCell>
                                        <TableCell><ChipAccion accion={r.accion} /></TableCell>
                                        <TableCell sx={{ maxWidth: 220, overflowWrap: 'anywhere' }}>{r.entidad}</TableCell>
                                        <TableCell sx={{ color: '#555', maxWidth: 320, overflowWrap: 'anywhere' }}>{r.detalle}</TableCell>
                                        <TableCell sx={{ color: '#555', whiteSpace: 'nowrap' }}>{r.ip || '—'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

            {!error && total > 0 && (
                <TablePagination
                    component="div"
                    count={total}
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
