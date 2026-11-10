

import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';
import ToastNotification from '../../../../components/ui/ToastNotification';
import BarrasReporte from '../components/reportes/BarrasReporte';
import { estiloEstatus } from '../components/reportes/estilosReporte';
import { exportarPdf, PDF_NO_DISPONIBLE } from '../components/reportes/exportarPdf';
import ModalDetalleAsesorias from '../components/reportes/ModalDetalleAsesorias';
import PanelReporte from '../components/reportes/PanelReporte';
import ResumenReporte from '../components/reportes/ResumenReporte';
import TablaReporte from '../components/reportes/TablaReporte';
import { agrupar, campoConLupa, suma } from '../components/reportes/utilidadesReporte';
import { reportesService } from '../services/reportesService';

const AZUL = '#244B91';
const AZUL_OSCURO = '#1B3A73';

// Columnas que comparten los tres reportes generales
const COLUMNAS_ASESORIAS_DE_ENTIDAD = [
    { campo: 'solicitudes', etiqueta: 'Solicitudes' },
    { campo: 'enCurso', etiqueta: 'En curso' },
    { campo: 'completadas', etiqueta: 'Completadas' },
    { campo: 'canceladas', etiqueta: 'Canceladas' },
    { campo: 'total', etiqueta: 'Total asesorías' }
];

// Columnas del detalle (un renglón por asesoría). Cada reporte oculta la que ya es el filtro (ver `ocultarEnTabla`)
const COLUMNAS_ASESORIAS = [
    { campo: 'asesor', etiqueta: 'Asesor', alinear: 'left', principal: true },
    { campo: 'materia', etiqueta: 'Materia', alinear: 'left' },
    { campo: 'estudiante', etiqueta: 'Estudiante', alinear: 'left' },
    { campo: 'grupoTexto', etiqueta: 'Grupo', alinear: 'left' },
    { campo: 'fechaTexto', etiqueta: 'Inicio', ordenarPor: 'fecha' },
    { campo: 'finTexto', etiqueta: 'Fin', ordenarPor: 'fechaFin' },
    { campo: 'horario', etiqueta: 'Horario' },
    { campo: 'modalidad', etiqueta: 'Modalidad', chip: true },
    { campo: 'razon', etiqueta: 'Razón' },
    { campo: 'estatus', etiqueta: 'Estatus', chip: true, estiloChip: estiloEstatus },
    { campo: 'sesiones', etiqueta: 'Sesiones' }
];

const PANEL = {
    asesor: { titulo: 'Asesorías por asesor', singular: 'Asesor', detalle: (v) => `Asesorías de ${v}` },
    materia: { titulo: 'Asesorías por materia', singular: 'Materia', detalle: (v) => `Asesorías de ${v}` },
    estudiante: { titulo: 'Asesorías por estudiante', singular: 'Estudiante', detalle: (v) => `Asesorías de ${v}` },
    grupoTexto: { titulo: 'Asesorías por grupo', singular: 'Grupo', detalle: (v) => `Asesorías del grupo ${v}` },
    razon: { titulo: 'Asesorías por razón', singular: 'Razón', detalle: (v) => `Asesorías por razón: ${v}` }
};

const CONFIG = {
    estudiante: {
        titulo: 'Reporte por estudiante',
        descripcion: 'Elige un estudiante para ver todas sus asesorías en el semestre, o déjalo vacío para compararlos todos. Pulsa Buscar.',
        etiquetaCampo: 'Estudiante',
        placeholder: 'Todos los estudiantes (escribe un nombre para buscar)',
        carga: 'Cargando estudiantes...',
        sinOpciones: 'No se encontraron estudiantes',
        plural: 'Estudiantes',
        conAsesorias: 'Estudiantes con asesorías',
        etiquetaOpcion: (e) => (e.grupo ? `${e.nombre} · ${e.grupo}` : e.nombre),
        columnasGeneral: [
            { campo: 'nombre', etiqueta: 'Estudiante', alinear: 'left', principal: true },
            { campo: 'grupo', etiqueta: 'Grupo', alinear: 'left' },
            { campo: 'licenciatura', etiqueta: 'Licenciatura', chip: true },
            ...COLUMNAS_ASESORIAS_DE_ENTIDAD,
            { campo: 'materias', etiqueta: 'Materias' },
            { campo: 'asesores', etiqueta: 'Asesores' }
        ],
        paneles: ['materia', 'asesor', 'razon'],
        ocultarEnTabla: ['estudiante'],
        destacado: { titulo: 'Materia con más asesorías', campo: 'materia' },
        cuarta: { titulo: 'Asesores que lo atendieron', campo: 'asesor' }
    },
    grupo: {
        titulo: 'Reporte por grupo',
        descripcion: 'Elige un grupo para ver todas sus asesorías en el semestre, o déjalo vacío para compararlos todos. Pulsa Buscar.',
        etiquetaCampo: 'Grupo',
        placeholder: 'Todos los grupos (escribe un nombre para buscar)',
        carga: 'Cargando grupos...',
        sinOpciones: 'No se encontraron grupos',
        plural: 'Grupos',
        conAsesorias: 'Grupos con asesorías',
        // La licenciatura va en el texto porque dos licenciaturas pueden tener un grupo con el mismo nombre
        etiquetaOpcion: (e) => (e.licenciatura ? `${e.nombre} · ${e.licenciatura}` : e.nombre),
        columnasGeneral: [
            { campo: 'nombre', etiqueta: 'Grupo', alinear: 'left', principal: true },
            { campo: 'licenciatura', etiqueta: 'Licenciatura', chip: true },
            ...COLUMNAS_ASESORIAS_DE_ENTIDAD,
            { campo: 'estudiantes', etiqueta: 'Estudiantes' },
            { campo: 'materias', etiqueta: 'Materias' },
            { campo: 'asesores', etiqueta: 'Asesores' }
        ],
        paneles: ['materia', 'asesor', 'estudiante'],
        ocultarEnTabla: ['grupoTexto'],
        destacado: { titulo: 'Materia con más asesorías', campo: 'materia' },
        cuarta: { titulo: 'Estudiantes atendidos', campo: 'estudiante' }
    },
    licenciatura: {
        titulo: 'Reporte por licenciatura',
        descripcion: 'Elige una licenciatura para ver todas sus asesorías en el semestre, o déjala vacía para compararlas todas. Pulsa Buscar.',
        etiquetaCampo: 'Licenciatura',
        placeholder: 'Todas las licenciaturas (escribe un nombre para buscar)',
        carga: 'Cargando licenciaturas...',
        sinOpciones: 'No se encontraron licenciaturas',
        plural: 'Licenciaturas',
        conAsesorias: 'Licenciaturas con asesorías',
        etiquetaOpcion: (e) => e.nombre,
        columnasGeneral: [
            { campo: 'nombre', etiqueta: 'Licenciatura', alinear: 'left', principal: true },
            { campo: 'grupos', etiqueta: 'Grupos' },
            ...COLUMNAS_ASESORIAS_DE_ENTIDAD,
            { campo: 'estudiantes', etiqueta: 'Estudiantes' },
            { campo: 'materias', etiqueta: 'Materias' },
            { campo: 'asesores', etiqueta: 'Asesores' }
        ],
        paneles: ['grupoTexto', 'materia', 'asesor'],
        ocultarEnTabla: [],
        destacado: { titulo: 'Materia con más asesorías', campo: 'materia' },
        cuarta: { titulo: 'Estudiantes atendidos', campo: 'estudiante' }
    }
};

export default function ReporteAgrupado({ tipo }) {
    const config = CONFIG[tipo];

    // Lo que el administrador está eligiendo (no cambia el reporte hasta pulsar "Buscar")
    const [entidad, setEntidad] = useState(null);
    const [cicloId, setCicloId] = useState('');

    // Lo que se buscó por última vez (es lo que muestra el reporte y lo que lleva el PDF)
    const [filtrosAplicados, setFiltrosAplicados] = useState(null);

    const [opciones, setOpciones] = useState([]);
    const [ciclos, setCiclos] = useState([]);
    const [cargandoListas, setCargandoListas] = useState(true);

    // Resultado: sin nada elegido -> resumen de todos (filas); con uno elegido -> sus asesorías
    const [filas, setFilas] = useState([]);
    const [asesorias, setAsesorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [exportando, setExportando] = useState(false);

    const [detalle, setDetalle] = useState(null);
    const [detalleAbierto, setDetalleAbierto] = useState(false);

    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => setToast({ open: true, message, type });

    // Hace la consulta con los filtros dados y deja el resultado en pantalla
    const buscar = async (elegida, cicloElegido, listaCiclos) => {
        try {
            setCargando(true);

            if (elegida) {
                const data = await reportesService.obtenerAsesoriasAgrupado({ tipo, entidad: elegida, cicloId: cicloElegido });
                setAsesorias(data);
                setFilas([]);
            } else {
                const data = await reportesService.obtenerResumenAgrupado(tipo, cicloElegido);
                setFilas(data);
                setOpciones(data);
                setAsesorias([]);
            }

            setFiltrosAplicados({
                entidad: elegida,
                ciclo: (listaCiclos || ciclos).find((item) => item.id === cicloElegido) || null
            });
        } catch (error) {
            console.error(`Error al obtener el reporte por ${tipo}:`, error);
            setFilas([]);
            setAsesorias([]);
            showToast('Error al obtener el reporte', 'error');
        } finally {
            setCargando(false);
        }
    };

    // Lista de opciones del buscador para un semestre
    const cargarOpciones = async (cicloElegido) => {
        try {
            setCargandoListas(true);
            setOpciones(await reportesService.obtenerResumenAgrupado(tipo, cicloElegido));
        } catch (error) {
            console.error('Error al cargar la lista del buscador:', error);
            showToast('Error al cargar la lista', 'error');
        } finally {
            setCargandoListas(false);
        }
    };

    // Al entrar: se cargan los semestres y se hace una primera búsqueda (todos, semestre vigente)
    useEffect(() => {
        let cancelado = false;

        const iniciar = async () => {
            try {
                const lista = await reportesService.obtenerCiclos();
                if (cancelado) return;

                if (lista.length > 0) {
                    setCiclos(lista);
                    setCicloId(lista[0].id);
                    await buscar(null, lista[0].id, lista);
                } else {
                    setCargando(false);
                }
            } catch (error) {
                console.error('Error al cargar los semestres:', error);
                showToast('Error al cargar los semestres', 'error');
                setCargando(false);
            } finally {
                if (!cancelado) setCargandoListas(false);
            }
        };
        iniciar();

        return () => {
            cancelado = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Al cambiar de semestre, la lista del buscador cambia y lo elegido ya no vale
    const handleCiclo = (nuevo) => {
        setCicloId(nuevo);
        setEntidad(null);
        cargarOpciones(nuevo);
    };

    const handleBuscar = () => {
        if (cicloId === '') {
            showToast('Elige un semestre', 'info');
            return;
        }
        buscar(entidad, cicloId);
    };

    const esDetalle = Boolean(filtrosAplicados?.entidad);

    const textoFiltros = filtrosAplicados
        ? [
            `${config.etiquetaCampo}: ${filtrosAplicados.entidad ? config.etiquetaOpcion(filtrosAplicados.entidad) : 'Todos'}`,
            `Semestre: ${filtrosAplicados.ciclo?.nombre || '-'}`
        ]
        : [];

    const columnasAsesorias = useMemo(
        () => COLUMNAS_ASESORIAS.filter((col) => !config.ocultarEnTabla.includes(col.campo)),
        [config]
    );

    // Un desglose por cada panel del reporte (ej. por materia, por asesor...)
    const desgloses = useMemo(
        () => config.paneles.map((campo) => ({ campo, ...PANEL[campo], items: agrupar(asesorias, campo) })),
        [config, asesorias]
    );

    const resumen = useMemo(() => {
        if (!esDetalle) {
            return [
                { titulo: config.conAsesorias, valor: filas.filter((item) => item.total > 0).length },
                { titulo: 'Asesorías', valor: suma(filas, 'total') },
                { titulo: 'Completadas', valor: suma(filas, 'completadas') },
                { titulo: 'Sesiones', valor: suma(filas, 'sesiones') }
            ];
        }

        const contar = (estatus) => asesorias.filter((item) => item.estatus === estatus).length;
        const sesiones = suma(asesorias, 'sesiones');
        const mayor = agrupar(asesorias, config.destacado.campo)[0];
        const distintos = new Set(asesorias.map((item) => item[config.cuarta.campo])).size;

        return [
            {
                titulo: 'Asesorías totales',
                valor: asesorias.length,
                detalle: `${contar('En curso')} en curso · ${contar('Completada')} completadas · ${contar('Cancelada')} canceladas`
            },
            // TODO: usar las horas reales cuando el backend las entregue (aquí se estima 1 hora por sesión)
            { titulo: 'Sesiones impartidas', valor: sesiones, detalle: `${sesiones} h aproximadas` },
            {
                titulo: config.destacado.titulo,
                valor: mayor?.etiqueta || '-',
                detalle: mayor ? `${mayor.valor} asesorías` : undefined
            },
            { titulo: config.cuarta.titulo, valor: distintos }
        ];
    }, [config, esDetalle, filas, asesorias]);

    const nombreSeleccion = filtrosAplicados?.entidad?.nombre || '';

    // Ventana con las asesorías de un renglón de un desglose, sin repetir la columna que ya es el filtro
    const handleDetalle = (desglose, item) => {
        setDetalle({
            titulo: desglose.detalle(item.etiqueta),
            subtitulo: `${item.valor} asesorías · ${nombreSeleccion}`,
            columnas: columnasAsesorias.filter((col) => col.campo !== desglose.campo),
            rows: asesorias.filter((a) => a[desglose.campo] === item.clave)
        });
        setDetalleAbierto(true);
    };

    const hayDatos = esDetalle ? asesorias.length > 0 : filas.length > 0;

    const handleExportarPdf = async () => {
        if (!hayDatos) {
            showToast('No hay datos para exportar', 'info');
            return;
        }

        const secciones = esDetalle
            ? [
                ...desgloses.map((d) => ({
                    titulo: d.titulo,
                    columnas: [{ campo: 'etiqueta', etiqueta: d.singular }, { campo: 'valor', etiqueta: 'Asesorías' }],
                    rows: d.items
                })),
                { titulo: 'Detalle de asesorías', columnas: columnasAsesorias, rows: asesorias }
            ]
            : [{ titulo: config.plural, columnas: config.columnasGeneral, rows: filas }];

        try {
            setExportando(true);
            await exportarPdf({ titulo: config.titulo, filtros: textoFiltros, resumen, secciones });
            showToast('PDF generado correctamente', 'success');
        } catch (error) {
            if (error?.message === PDF_NO_DISPONIBLE) {
                showToast('La exportación a PDF estará disponible próximamente', 'info');
            } else {
                console.error('Error al exportar el PDF:', error);
                showToast('No se pudo exportar el PDF', 'error');
            }
        } finally {
            setExportando(false);
        }
    };

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-transparent px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold">{config.titulo}</p>
                <p className="text-sm text-gray-600">{config.descripcion}</p>
            </div>

            {/* Filtros: en celular van apilados */}
            <div className="w-full flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:gap-4">
                <div className="w-full min-w-0 lg:flex-1">
                    <Autocomplete
                        fullWidth
                        size="small"
                        openOnFocus
                        options={opciones}
                        value={entidad}
                        onChange={(event, nueva) => setEntidad(nueva)}
                        getOptionLabel={config.etiquetaOpcion}
                        getOptionKey={(option) => option.key}
                        isOptionEqualToValue={(option, value) => option.key === value.key}
                        loading={cargandoListas}
                        loadingText={config.carga}
                        noOptionsText={config.sinOpciones}
                        sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF' } }}
                        renderInput={(params) => campoConLupa(params, config.etiquetaCampo, config.placeholder)}
                    />
                </div>

                <TextField
                    select
                    label="Semestre"
                    size="small"
                    value={cicloId}
                    onChange={(e) => handleCiclo(e.target.value)}
                    disabled={ciclos.length === 0}
                    sx={{ width: { xs: '100%', lg: 280 }, backgroundColor: '#FFFFFF', flexShrink: 0 }}
                >
                    {ciclos.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.nombre}
                        </MenuItem>
                    ))}
                </TextField>

                <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleBuscar}
                    disabled={cargando || cargandoListas}
                    sx={{
                        borderRadius: '5px',
                        textTransform: 'none',
                        backgroundColor: AZUL,
                        '&:hover': { backgroundColor: AZUL_OSCURO },
                        flexShrink: 0,
                        width: { xs: '100%', lg: 'auto' }
                    }}
                >
                    Buscar
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<PictureAsPdfOutlinedIcon />}
                    onClick={handleExportarPdf}
                    disabled={cargando || exportando}
                    sx={{
                        borderRadius: '5px',
                        textTransform: 'none',
                        color: '#C62828',
                        borderColor: '#C62828',
                        backgroundColor: '#FFFFFF',
                        '&:hover': { borderColor: '#8E1B1B', backgroundColor: 'rgba(198, 40, 40, 0.06)' },
                        flexShrink: 0,
                        width: { xs: '100%', lg: 'auto' }
                    }}
                >
                    Exportar PDF
                </Button>
            </div>

            <div className="w-full flex flex-1 flex-col gap-4 pb-5">
                {cargando ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <CircularProgress sx={{ color: AZUL }} />
                        <p className="text-sm text-gray-600">Cargando reporte...</p>
                    </div>
                ) : (
                    <>
                        {textoFiltros.length > 0 && <p className="text-sm text-gray-600">{textoFiltros.join(' · ')}</p>}

                        {!esDetalle ? (
                            /* ---------- Sin nada elegido: comparación de todos ---------- */
                            <>
                                <ResumenReporte items={resumen} />
                                <TablaReporte
                                    columnas={config.columnasGeneral}
                                    rows={filas}
                                    ordenInicial={{ campo: 'total', direccion: 'desc' }}
                                    anchoMinimo={1100}
                                    textoVacio={config.sinOpciones}
                                />
                            </>
                        ) : asesorias.length === 0 ? (
                            <p className="text-gray-500">
                                {nombreSeleccion} no tiene asesorías en el semestre elegido.
                            </p>
                        ) : (
                            /* ---------- Uno elegido: todas sus asesorías ---------- */
                            <>
                                <ResumenReporte items={resumen} />

                                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {desgloses.map((d) => (
                                        <PanelReporte
                                            key={d.campo}
                                            titulo={d.titulo}
                                            subtitulo={`Haz clic en un renglón para ver su detalle`}
                                        >
                                            <BarrasReporte items={d.items} onItemClick={(item) => handleDetalle(d, item)} />
                                        </PanelReporte>
                                    ))}
                                </div>

                                <p className="text-base font-bold text-gray-900 mt-2">Todas las asesorías</p>
                                <TablaReporte
                                    columnas={columnasAsesorias}
                                    rows={asesorias}
                                    ordenInicial={{ campo: 'fechaTexto', direccion: 'desc' }}
                                    anchoMinimo={1200}
                                    textoVacio="No hay asesorías"
                                />
                            </>
                        )}
                    </>
                )}
            </div>

            <ModalDetalleAsesorias
                open={detalleAbierto}
                onClose={() => setDetalleAbierto(false)}
                titulo={detalle?.titulo}
                subtitulo={detalle?.subtitulo}
                columnas={detalle?.columnas}
                rows={detalle?.rows}
            />

            <ToastNotification
                open={toast.open}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}
