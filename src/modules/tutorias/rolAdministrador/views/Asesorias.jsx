import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import { useCallback, useEffect, useState } from "react";
import BotonFiltro from "../../../../components/ui/BotonFlitro";
import InputBuscar from "../../../../components/ui/InputBuscar";
import ModalFiltrosAdmin from "../components/asesorias/modales/ModalFiltrosAdmin";
import TablaAsesorias from "../components/asesorias/TablaAsesorias";
import { asesoriasService } from "../services/asesoriasService1";
import { catalogoService } from "../services/catalogoService";

// Ajusta esta ruta si tu archivo de modales está en otra carpeta
import ToastNotification from "../../../../components/ui/ToastNotification";
import ModalCrearAsesoria from "../components/asesorias/modales/ModalCrearAsesoria";
import { ASESORIAS_ADMIN_PRUEBA, USAR_DATOS_PRUEBA_ADMIN } from "../datosPrueba";

const initialFiltros = {
  licenciatura: "",
  grupo: "",
  modalidad: "",
  horario: "",
  razon: ""
};

export default function Asesorias() {
  const [asesorias, setAsesorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [openModalFiltros, setopenModalFiltros] = useState(false);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState(initialFiltros);

  // Estado para el Toast Global
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info"
  });

  // Estados para almacenar los datos de los catálogos
  const [licenciaturas, setLicenciaturas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [gruposFiltrados, setGruposFiltrados] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [razones, setRazones] = useState([]);

  // Carga las asesorías: con datos de prueba si el interruptor está activo
  const cargarAsesorias = useCallback(async () => {
    if (USAR_DATOS_PRUEBA_ADMIN) {
      setAsesorias(ASESORIAS_ADMIN_PRUEBA);
      setCargando(false);
      return;
    }

    try {
      const data = await asesoriasService.getAsesoriasEnCurso();
      setAsesorias(data || []);
    } catch (error) {
      console.error("Error al obtener las asesorías:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  // Quita una asesoría de la lista (solo se usa con datos de prueba)
  const quitarAsesoria = (id) => {
    setAsesorias((prev) => prev.filter((a) => a.id !== id));
  };

  // Carga de catálogos e información al montar el componente
  useEffect(() => {
    const licData = catalogoService.getLicenciaturas();
    const grpData = catalogoService.getGrupos();
    const modData = catalogoService.getModalidades();
    const horData = catalogoService.getHorarios();
    const razData = catalogoService.getRazonesAsesoria();

    setLicenciaturas(licData);
    setGrupos(grpData);
    setGruposFiltrados(grpData);
    setModalidades(modData);
    setHorarios(horData);
    setRazones(razData);

    cargarAsesorias();
  }, [cargarAsesorias]);

  const showToast = (message, type = "info") => {
    setToast({ open: true, message, type });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Handler para abrir modales removiendo foco activo
  const handleOpenModalFiltros = (e) => {
    if (e?.currentTarget) e.currentTarget.blur();
    document.activeElement?.blur();
    setopenModalFiltros(true);
  };

  const handleOpenModalCrear = (e) => {
    if (e?.currentTarget) e.currentTarget.blur();
    document.activeElement?.blur();
    setModalCrearOpen(true);
  };

  // Aquí va tu llamada a la API para crear la asesoría (y de ahí tomar el id real)
  // El modal ya se encarga de mostrar el toast y de cerrarse.
  const handleCrearAsesoria = async (nuevaAsesoria) => {
    console.log("Asesoría creada:", nuevaAsesoria);

    setAsesorias((prev) => {
      const nuevoId = prev.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
      return [{ ...nuevaAsesoria, id: nuevoId }, ...prev];
    });
  };

  // Manejo de cambios en los inputs del filtro
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "licenciatura") {
      const idLic = Number(value);
      if (idLic) {
        const filtrados = grupos.filter((g) => g.id_licenciatura === idLic);
        setGruposFiltrados(filtrados.length > 0 ? filtrados : grupos);
      } else {
        setGruposFiltrados(grupos);
      }
      setFiltros((prev) => ({
        ...prev,
        licenciatura: value,
        grupo: ""
      }));
    } else {
      setFiltros((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Listas para el modal de filtros: cada opción es { valor, etiqueta }
  const opcionesFiltros = {
    licenciaturas: licenciaturas.map((i) => ({ valor: i.id_licenciatura, etiqueta: i.licenciatura })),
    grupos: gruposFiltrados.map((i) => ({ valor: i.id_grupo, etiqueta: i.grupo })),
    modalidades: modalidades.map((i) => ({ valor: i.id_modalidad, etiqueta: i.modalidad })),
    horarios: horarios.map((i) => ({ valor: i.id_horario, etiqueta: i.horario })),
    razones: razones.map((i) => ({ valor: i.id_razon, etiqueta: i.razon }))
  };

  const handleApply = () => {
    console.log("Filtros aplicados:", filtros);
    setopenModalFiltros(false);
  };

  const handleClear = () => {
    setFiltros(initialFiltros);
    setGruposFiltrados(grupos);
  };

  // Filtrado de filas en la tabla según búsqueda por texto
  const filasFiltradas = asesorias.filter((row) => {
    const texto = busqueda.toLowerCase().trim();
    if (!texto) return true;

    const materia = (row.materia_nombre || row.materia || "").toLowerCase();
    const estudiante = (row.estudiante_nombre || row.estudiante || "").toLowerCase();
    const asesor = (row.asesor_nombre || row.asesor || "").toLowerCase();

    return (
      materia.includes(texto) ||
      estudiante.includes(texto) ||
      asesor.includes(texto)
    );
  });

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-[#F4F7FC] px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
      <p className="text-2xl font-bold">Asesorías</p>

      {/* Barra de herramientas: en celular el filtro va arriba y el buscador abajo (igual que las otras vistas) */}
      <div className="w-full flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
        <BotonFiltro onClick={handleOpenModalFiltros} />

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

      {/* Contenido: en celular se deja espacio abajo para que el botón flotante no tape la paginación */}
      <div className="w-full flex flex-1 flex-col pb-24 sm:pb-5">
        {cargando ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
              <CircularProgress sx={{ color: '#244B91' }} />
              <p className="text-sm text-gray-600">Cargando asesorías...</p>
          </div>
        ) : (
          <TablaAsesorias
            rows={filasFiltradas}
            onRefresh={cargarAsesorias}
            onRemove={quitarAsesoria}
          />
        )}
      </div>

      {/* Modal de Filtros (mismo estilo que el del estudiante) */}
      <ModalFiltrosAdmin
        open={openModalFiltros}
        onClose={() => setopenModalFiltros(false)}
        opciones={opcionesFiltros}
        filtros={filtros}
        onChange={handleChange}
        onApply={handleApply}
        onClear={handleClear}
      />

      {/* Modal de Crear Asesoría */}
      <ModalCrearAsesoria
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onSave={handleCrearAsesoria}
        showToast={showToast}
      />

      {/* Toast Global */}
      <ToastNotification
        open={toast.open}
        onClose={handleCloseToast}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}