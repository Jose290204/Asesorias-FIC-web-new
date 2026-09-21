import { useState, useEffect } from "react";
import BotonFiltro from "../../../../components/ui/BotonFlitro";
import TablaAsesorias from "../components/TablaAsesorias";
import InputBuscar from "../../../../components/ui/InputBuscar";
import ModalFiltros from "../../../../components/ui/ModalFiltros";
import {asesoriasService} from "../services/asesoriasService1" 
import ModalCargaExcel from "../components/ModalCargaExel";
import { catalogoService } from "../services/catalogoService";

// Ajusta esta ruta si tu archivo de modales está en otra carpeta
import { ModalCrearAsesoria } from "../components/ModalesAsesorias";
import ToastNotification from "../../../../components/ui/ToastNotification";

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
  const [modalExcelOpen, setModalExcelOpen] = useState(false);
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

  // Carga de catálogo e información al montar el componente
  useEffect(() => {
    // Cargar catálogos desde el servicio
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

    // Cargar asesorías usando el nuevo método del servicio
    asesoriasService.getAsesoriasEnCurso()
      .then((data) => {
        setAsesorias(data || []);
      })
      .catch((error) => {
        console.error("Error al obtener las asesorías:", error);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

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

  const handleOpenModalExcel = (e) => {
    if (e?.currentTarget) e.currentTarget.blur();
    document.activeElement?.blur();
    setModalExcelOpen(true);
  };

  const handleOpenModalCrear = (e) => {
    if (e?.currentTarget) e.currentTarget.blur();
    document.activeElement?.blur();
    setModalCrearOpen(true);
  };

  const handleExcelData = (datosCargados) => {
    console.log("Datos cargados desde Excel:", datosCargados);
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

  const handleFocus = (e) => {
    e.target.size = 5;
  };

  const handleBlur = (e) => {
    e.target.size = 1;
  };

  const handleSelectOption = (e) => {
    handleChange(e);
    e.target.size = 1;
    e.target.blur();
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
    <div className="h-[calc(100vh-1rem)] w-full rounded-2xl pl-17 py-10 pr-17 flex flex-col items-start justify-start gap-11 bg-gray-100 overflow-hidden">
      <div>
        <p className="text-2xl font-bold">Asesorías</p>
      </div>

      <div className="flex gap-8 items-center w-full">
        <BotonFiltro onClick={handleOpenModalFiltros} />

        <InputBuscar
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <button
          onClick={handleOpenModalExcel}
          className="bg-[#2e7d32] hover:bg-[#1b5e20] text-sm text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1.8 14.8l-1.4 1.4L12 15.8l-2.4 2.4-1.4-1.4 2.4-2.4-2.4-2.4 1.4-1.4 2.4 2.4 2.4-2.4 1.4 1.4-2.4 2.4 2.4 2.4zM13 9V3.5L18.5 9H13z" />
          </svg>
          Cargar Asesorias
        </button>

        <button
          onClick={handleOpenModalCrear}
          className="bg-[#2e7d32] hover:bg-[#1b5e20]  text-sm text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Crear Asesoria
        </button>
      </div>

      {cargando ? (
        <p className="text-gray-500 font-medium">Cargando asesorías...</p>
      ) : (
        <TablaAsesorias rows={filasFiltradas} />
      )}

      {/* Modal de Filtros Dinámicos */}
      <ModalFiltros
        open={openModalFiltros}
        onClose={() => setopenModalFiltros(false)}
        onApply={handleApply}
        onClear={handleClear}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="font-bold text-sm block mb-1">Licenciatura</label>
            <select
              name="licenciatura"
              value={filtros.licenciatura}
              onChange={handleSelectOption}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer text-sm"
            >
              <option value="">Selecciona una licenciatura</option>
              {licenciaturas.map((item) => (
                <option key={item.id_licenciatura} value={item.id_licenciatura}>
                  {item.licenciatura}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-sm block mb-1">Grupo</label>
            <select
              name="grupo"
              value={filtros.grupo}
              onChange={handleSelectOption}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer text-sm"
            >
              <option value="">Selecciona un grupo</option>
              {gruposFiltrados.map((item) => (
                <option key={item.id_grupo} value={item.id_grupo}>
                  {item.grupo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-sm block mb-1">Modalidad</label>
            <select
              name="modalidad"
              value={filtros.modalidad}
              onChange={handleSelectOption}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer text-sm"
            >
              <option value="">Selecciona modalidad</option>
              {modalidades.map((item) => (
                <option key={item.id_modalidad} value={item.id_modalidad}>
                  {item.modalidad}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-sm block mb-1">Horario</label>
            <select
              name="horario"
              value={filtros.horario}
              onChange={handleSelectOption}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer text-sm"
            >
              <option value="">Selecciona un horario</option>
              {horarios.map((item) => (
                <option key={item.id_horario} value={item.id_horario}>
                  {item.horario}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-sm block mb-1">Razón</label>
            <select
              name="razon"
              value={filtros.razon}
              onChange={handleSelectOption}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full border border-gray-400 rounded-lg p-2 outline-none bg-white cursor-pointer text-sm"
            >
              <option value="">Selecciona una razón</option>
              {razones.map((item) => (
                <option key={item.id_razon} value={item.id_razon}>
                  {item.razon}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ModalFiltros>

      <ModalCargaExcel
        open={modalExcelOpen}
        onClose={() => setModalExcelOpen(false)}
        onDataLoaded={handleExcelData}
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
