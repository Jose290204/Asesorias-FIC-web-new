import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import Pagination from '@mui/material/Pagination';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BotonFiltro from '../../../../components/ui/BotonFlitro';
import InputBuscar from '../../../../components/ui/InputBuscar';
import ToastNotification from '../../../../components/ui/ToastNotification';
import {
  cancelarAsesoriaAdmin,
  completarAsesoriaAdmin,
  crearAsesoriaAdmin,
  editarAsesoriaAdmin,
  traerAsesoriasAdmin
} from '../../../../Services/asesoriasAdminService';
import { catalogosService } from '../../../../Services/catalogosService';
import { mensajesDeError } from '../../../../Services/errores';
import ModalCrearAsesoria from '../components/asesorias/modales/ModalCrearAsesoria';
import ModalFiltrosAdmin from '../components/asesorias/modales/ModalFiltrosAdmin';
import TablaAsesorias from '../components/asesorias/TablaAsesorias';

const initialFiltros = {
  licenciatura: '',
  grupo: '',
  modalidad: '',
  horario: '',
  razon: ''
};

export default function Asesorias() {
  // Lo que se escribe en el buscador, y el texto que ya se mandó a la API (con una pausa al escribir)
  const [busqueda, setBusqueda] = useState('');
  const [buscar, setBuscar] = useState('');

  // La API pagina de 10 en 10: "meta" trae la última página y el total
  const [pagina, setPagina] = useState(1);
  const [meta, setMeta] = useState(null);

  const [asesorias, setAsesorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // "filtros" es lo que se está eligiendo en el modal; "aplicados" es lo que ya se mandó a la API
  const [openModalFiltros, setOpenModalFiltros] = useState(false);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [filtros, setFiltros] = useState(initialFiltros);
  const [aplicados, setAplicados] = useState(initialFiltros);

  // Catálogos de los selects del modal de filtros
  const [catalogos, setCatalogos] = useState({
    licenciaturas: [],
    grupos: [],
    modalidades: [],
    horarios: [],
    razones: []
  });

  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ open: true, message, type });
  }, []);

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Catálogos: una sola vez al entrar
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const datos = await catalogosService.obtenerCatalogos();
        setCatalogos({
          licenciaturas: datos.licenciaturas ?? [],
          grupos: datos.grupos ?? [],
          modalidades: datos.modalidades ?? [],
          horarios: datos.horarios ?? [],
          razones: datos.razones ?? []
        });
      } catch (err) {
        console.error('Error al cargar catálogos', err);
        showToast('No se pudieron cargar las opciones de los filtros', 'error');
      }
    };

    cargarCatalogos();
  }, [showToast]);

  // Al dejar de escribir 400 ms se busca en la API y se vuelve a la página 1
  useEffect(() => {
    const temporizador = setTimeout(() => {
      setBuscar(busqueda.trim());
      setPagina(1);
    }, 400);

    return () => clearTimeout(temporizador);
  }, [busqueda]);

  // silencioso = recarga sin quitar la lista (se usa después de completar o cancelar)
  const cargarAsesorias = useCallback(async ({ silencioso = false } = {}) => {
    try {
      if (!silencioso) setCargando(true);
      setError(false);

      const { asesorias: lista, meta: metaNueva } = await traerAsesoriasAdmin({
        buscar,
        page: pagina,
        filtros: aplicados
      });

      // Si se atendió la última asesoría de esta página, la página queda vacía:
      // se regresa a la anterior (el efecto de abajo vuelve a cargar solo)
      if (lista.length === 0 && pagina > 1) {
        setPagina(pagina - 1);
        return;
      }

      setAsesorias(lista);
      setMeta(metaNueva);
    } catch (err) {
      console.error('Error al obtener las asesorías:', err);
      if (!silencioso) {
        setError(true);
        showToast(mensajesDeError(err)[0], 'error');
      }
    } finally {
      setCargando(false);
    }
  }, [buscar, pagina, aplicados, showToast]);

  useEffect(() => {
    cargarAsesorias();
  }, [cargarAsesorias]);

  // Las acciones regresan true si salió bien (el modal se cierra) y false si falló (el modal sigue abierto).
  // Aquí caen los errores de la API, por ejemplo 409 asesoria_no_en_curso.
  const ejecutar = async (accion, mensajeExito) => {
    try {
      await accion();
      showToast(mensajeExito, 'success');
      cargarAsesorias({ silencioso: true });
      return true;
    } catch (err) {
      showToast(mensajesDeError(err)[0], 'error');
      return false;
    }
  };

  // Solo viaja lo que cambió (el modal arma "cambios")
  const handleGuardarInfo = (id, cambios) =>
    ejecutar(() => editarAsesoriaAdmin(id, cambios), 'Cambios aplicados correctamente');

  const handleCompletar = (asesoria) =>
    ejecutar(() => completarAsesoriaAdmin(asesoria.id), 'Asesoría completada con éxito');

  const handleCancelar = (asesoria, motivo) =>
    ejecutar(() => cancelarAsesoriaAdmin(asesoria.id, motivo), 'Asesoría cancelada correctamente');

  // Handler para abrir el modal quitando el foco activo
  const handleOpenModalFiltros = (e) => {
    if (e?.currentTarget) e.currentTarget.blur();
    document.activeElement?.blur();
    setOpenModalFiltros(true);
  };

  const handleOpenModalCrear = (e) => {
    if (e?.currentTarget) e.currentTarget.blur();
    document.activeElement?.blur();
    setModalCrearOpen(true);
  };

  // El modal arma { asesorId, estudianteId, materiaId, horarioId, fechaInicio, modalidad, razon, observaciones }.
  // El backend valida contra la disponibilidad de ese asesor y regresa el error (409/422) si no coincide.
  const handleCrearAsesoria = (datos) =>
    ejecutar(() => crearAsesoriaAdmin(datos), 'Asesoría creada correctamente');

  // Manejo de cambios en los inputs del filtro: al cambiar de licenciatura se limpia el grupo
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFiltros((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'licenciatura' ? { grupo: '' } : {})
    }));
  };

  const handleApply = () => {
    setAplicados(filtros);
    setPagina(1);
    setOpenModalFiltros(false);
  };

  const handleClear = () => {
    setFiltros(initialFiltros);
    setAplicados(initialFiltros);
    setPagina(1);
  };

  // Listas del modal de filtros: cada opción es { valor, etiqueta }
  const opcionesFiltros = useMemo(() => {
    const gruposVisibles = filtros.licenciatura
      ? catalogos.grupos.filter((g) => g.licenciatura_id === Number(filtros.licenciatura))
      : catalogos.grupos;

    return {
      licenciaturas: catalogos.licenciaturas.map((l) => ({ valor: l.id, etiqueta: l.nombre })),
      // Un mismo nombre de grupo puede existir en presencial y en virtual: se distingue en la etiqueta
      // y se agrega al lado la licenciatura a la que pertenece el grupo
      grupos: gruposVisibles.map((g) => {
        const nombreLic = catalogos.licenciaturas.find((l) => l.id === g.licenciatura_id)?.nombre;
        const base = g.modalidad === 'virtual' ? `${g.nombre} (virtual)` : g.nombre;
        return { valor: g.id, etiqueta: nombreLic ? `${base} · ${nombreLic}` : base };
      }),
      modalidades: catalogos.modalidades.map((m) => ({ valor: m.valor, etiqueta: m.etiqueta })),
      horarios: catalogos.horarios.map((h) => ({ valor: h.id, etiqueta: h.etiqueta })),
      razones: catalogos.razones.map((r) => ({ valor: r.valor, etiqueta: r.etiqueta }))
    };
  }, [catalogos, filtros.licenciatura]);

  const hayFiltros = Object.values(aplicados).some(Boolean);
  const total = meta?.total ?? asesorias.length;

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-transparent px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
      <p className="text-2xl font-bold">Asesorías</p>

      {/* Barra de herramientas: en celular el filtro va arriba y el buscador abajo (igual que las otras vistas) */}
      <div className="w-full flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex flex-col items-start gap-3">
          <BotonFiltro onClick={handleOpenModalFiltros} />
          {hayFiltros && (
            <button
              type="button"
              onClick={handleClear}
              className="text-sm font-bold text-black hover:underline cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="w-full min-w-0 sm:flex-1">
          <InputBuscar
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por materia, estudiante o asesor..."
          />
        </div>

        <Button
          variant="contained"
          sx={{
            borderRadius: '5px',
            textTransform: 'none',
            backgroundColor: '#2E7D32',
            flexShrink: 0,
            // Botón normal: solo tablet y escritorio
            display: { xs: 'none', sm: 'inline-flex' }
          }}
          size="medium"
          startIcon={<AddOutlinedIcon />}
          onClick={handleOpenModalCrear}
        >
          Crear Asesoria
        </Button>
      </div>

      {/* Botón flotante: solo celular */}
      <Fab
        variant="extended"
        color="success"
        aria-label="Crear asesoría"
        onClick={handleOpenModalCrear}
        sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 10, textTransform: 'none', display: { xs: 'inline-flex', sm: 'none' } }}
      >
        <AddOutlinedIcon sx={{ mr: 1 }} />
        Crear asesoría
      </Fab>

      {/* Leyenda de resultados */}
      {!cargando && !error && (
        <p className="-mt-3 text-sm text-gray-600 md:-mt-4">
          {total} {total === 1 ? 'asesoría' : 'asesorías'}
          {buscar || hayFiltros ? ' encontradas' : ' en curso'}
        </p>
      )}

      {/* Contenido: título y filtros quedan visibles, el estado va al centro del área */}
      <div className="w-full flex flex-1 flex-col pb-24 sm:pb-5">
        {cargando ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
            <CircularProgress sx={{ color: '#244B91' }} />
            <p className="text-sm text-gray-600">Cargando asesorías...</p>
          </div>
        ) : error ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
            <p className="text-sm text-gray-600">No se pudieron cargar las asesorías.</p>
            <Button
              variant="contained"
              size="small"
              onClick={() => cargarAsesorias()}
              sx={{ textTransform: 'none', borderRadius: '5px', backgroundColor: '#244B91' }}
            >
              Reintentar
            </Button>
          </div>
        ) : total === 0 && !buscar && !hayFiltros ? (
          <p className="py-10 text-center text-sm text-gray-600">No hay asesorías en curso.</p>
        ) : (
          <>
            <TablaAsesorias
              rows={asesorias}
              onCompletar={handleCompletar}
              onCancelar={handleCancelar}
              onGuardarInfo={handleGuardarInfo}
              onRefresh={() => cargarAsesorias({ silencioso: true })}
            />

            {/* Paginación: solo aparece si hay más de una página */}
            {meta && meta.last_page > 1 && (
              <div className="mt-6 flex w-full justify-center">
                <Pagination
                  count={meta.last_page}
                  page={pagina}
                  onChange={(_, nueva) => setPagina(nueva)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Filtros */}
      <ModalFiltrosAdmin
        open={openModalFiltros}
        onClose={() => setOpenModalFiltros(false)}
        opciones={opcionesFiltros}
        filtros={filtros}
        onChange={handleChange}
        onApply={handleApply}
      />

      {/* Modal de Crear Asesoría */}
      <ModalCrearAsesoria
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onSave={handleCrearAsesoria}
      />

      <ToastNotification
        open={toast.open}
        onClose={handleCloseToast}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}
