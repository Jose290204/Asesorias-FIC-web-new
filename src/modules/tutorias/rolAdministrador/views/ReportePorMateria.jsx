// rolAdministrador/views/ReportePorMateria.jsx
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

// Columnas del reporte general (un renglón por materia)
const COLUMNAS_GENERAL = [
    { campo: 'nombre', etiqueta: 'Materia', alinear: 'left', principal: true },
    { campo: 'licenciatura', etiqueta: 'Licenciatura', chip: true },
    { campo: 'solicitudes', etiqueta: 'Solicitudes' },
    { campo: 'enCurso', etiqueta: 'En curso' },
    { campo: 'completadas', etiqueta: 'Completadas' },
    { campo: 'canceladas', etiqueta: 'Canceladas' },
    { campo: 'total', etiqueta: 'Total asesorías' },
    { campo: 'asesores', etiqueta: 'Asesores' },
    { campo: 'estudiantes', etiqueta: 'Estudiantes' }
];

// Columnas del detalle de una materia (un renglón por asesoría)
const COLUMNAS_ASESORIAS = [
    { campo: 'asesor', etiqueta: 'Asesor', alinear: 'left', principal: true },
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

// "Licenciatura en Informática" -> "Informática" (para que el nombre de la materia no salga larguísimo)
const licenciaturaCorta = (texto) => String(texto || '').replace(/^Licenciatura en /i, '');

// Texto de una materia en el buscador; incluye la licenciatura porque dos licenciaturas pueden tener la misma materia
const etiquetaMateria = (materia) =>
    materia.licenciatura ? `${materia.nombre} · ${licenciaturaCorta(materia.licenciatura)}` : materia.nombre;

export default function ReportePorMateria() {
    // Lo que el administrador está eligiendo (no cambia el reporte hasta pulsar "Buscar")
    const [materia, setMateria] = useState(null);
    const [cicloId, setCicloId] = useState('');

    // Lo que se buscó por última vez (es lo que muestra el reporte y lo que lleva el PDF)
    const [filtrosAplicados, setFiltrosAplicados] = useState(null);

    const [materias, setMaterias] = useState([]);
    const [ciclos, setCiclos] = useState([]);
    const [cargandoListas, setCargandoListas] = useState(true);

    // Resultado: sin materia elegida -> resumen de todas (filas); con materia -> sus asesorías
    const [filas, setFilas] = useState([]);
    const [asesorias, setAsesorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [exportando, setExportando] = useState(false);

    // Ventana con el detalle de un asesor o un grupo
    const [detalle, setDetalle] = useState(null);
    const [detalleAbierto, setDetalleAbierto] = useState(false);

    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => setToast({ open: true, message, type });

    // Hace la consulta con los filtros dados y deja el resultado en pantalla
    const buscar = async (materiaElegida, cicloElegido, listaCiclos) => {
        try {
            setCargando(true);

            if (materiaElegida) {
                const data = await reportesService.obtenerAsesoriasDeMateria({
                    materia: materiaElegida,
                    cicloId: cicloElegido
                });
                setAsesorias(data);
                setFilas([]);
            } else {
                const data = await reportesService.obtenerResumenMaterias(cicloElegido);
                setFilas(data);
                setAsesorias([]);
            }

            setFiltrosAplicados({
                materia: materiaElegida,
                ciclo: (listaCiclos || ciclos).find((item) => item.id === cicloElegido) || null
            });
        } catch (error) {
            console.error('Error al obtener el reporte por materia:', error);
            setFilas([]);
            setAsesorias([]);
            showToast('Error al obtener el reporte', 'error');
        } finally {
            setCargando(false);
        }
    };

    // Al entrar: se cargan materias y semestres, y se hace una primera búsqueda (todas las materias, semestre vigente)
    useEffect(() => {
        let cancelado = false;

        const iniciar = async () => {
            const [resCiclos, resMaterias] = await Promise.allSettled([
                reportesService.obtenerCiclos(),
                reportesService.obtenerMaterias()
            ]);
            if (cancelado) return;

            if (resMaterias.status === 'fulfilled') {
                setMaterias(resMaterias.value);
            } else {
                console.error('Error al cargar materias:', resMaterias.reason);
                showToast('Error al cargar la lista de materias', 'error');
            }
            setCargandoListas(false);

            if (resCiclos.status === 'fulfilled' && resCiclos.value.length > 0) {
                const lista = resCiclos.value;
                setCiclos(lista);
                setCicloId(lista[0].id);
                buscar(null, lista[0].id, lista);
            } else {
                console.error('Error al cargar los semestres:', resCiclos.reason);
                showToast('Error al cargar los semestres', 'error');
                setCargando(false);
            }
        };
        iniciar();

        return () => {
            cancelado = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleBuscar = () => {
        if (cicloId === '') {
            showToast('Elige un semestre', 'info');
            return;
        }
        buscar(materia, cicloId);
    };

    const esDetalle = Boolean(filtrosAplicados?.materia);

    // Texto de los filtros aplicados (sale en la pantalla y en el PDF)
    const textoFiltros = filtrosAplicados
        ? [
            `Materia: ${filtrosAplicados.materia ? etiquetaMateria(filtrosAplicados.materia) : 'Todas'}`,
            `Semestre: ${filtrosAplicados.ciclo?.nombre || '-'}`
        ]
        : [];

    // Cálculos del detalle de una materia, a partir de sus asesorías
    const porAsesor = useMemo(() => agrupar(asesorias, 'asesor'), [asesorias]);
    const porGrupo = useMemo(() => agrupar(asesorias, 'grupoTexto'), [asesorias]);
    const porRazon = useMemo(() => agrupar(asesorias, 'razon'), [asesorias]);

    const resumen = useMemo(() => {
        if (!esDetalle) {
            return [
                { titulo: 'Materias con asesorías', valor: filas.filter((item) => item.total > 0).length },
                { titulo: 'Asesorías', valor: suma(filas, 'total') },
                { titulo: 'Completadas', valor: suma(filas, 'completadas') },
                { titulo: 'Sesiones', valor: suma(filas, 'sesiones') }
            ];
        }

        const contar = (estatus) => asesorias.filter((item) => item.estatus === estatus).length;
        const sesiones = suma(asesorias, 'sesiones');
        const estudiantes = new Set(asesorias.map((item) => item.estudiante)).size;

        return [
            {
                titulo: 'Asesorías totales',
                valor: asesorias.length,
                detalle: `${contar('En curso')} en curso · ${contar('Completada')} completadas · ${contar('Cancelada')} canceladas`
            },
            // TODO: usar las horas reales cuando el backend las entregue (aquí se estima 1 hora por sesión)
            { titulo: 'Sesiones impartidas', valor: sesiones, detalle: `${sesiones} h aproximadas` },
            {
                titulo: 'Asesor con más asesorías',
                valor: porAsesor[0]?.etiqueta || '-',
                detalle: porAsesor[0] ? `${porAsesor[0].valor} asesorías` : undefined
            },
            { titulo: 'Estudiantes atendidos', valor: estudiantes }
        ];
    }, [esDetalle, filas, asesorias, porAsesor]);

    const abrirDetalle = (config) => {
        setDetalle(config);
        setDetalleAbierto(true);
    };

    // Detalle de un asesor: sus asesorías de esta materia, sin repetir la columna de asesor
    const handleDetalleAsesor = (item) =>
        abrirDetalle({
            titulo: `Asesorías de ${item.etiqueta}`,
            subtitulo: `${item.valor} asesorías · ${filtrosAplicados?.materia?.nombre || ''}`,
            columnas: COLUMNAS_ASESORIAS.filter((col) => col.campo !== 'asesor'),
            rows: asesorias.filter((a) => a.asesor === item.clave)
        });

    // Detalle de un grupo: sus asesorías, sin repetir la columna de grupo
    const handleDetalleGrupo = (item) =>
        abrirDetalle({
            titulo: `Asesorías del grupo ${item.etiqueta}`,
            subtitulo: `${item.valor} asesorías · ${filtrosAplicados?.materia?.nombre || ''}`,
            columnas: COLUMNAS_ASESORIAS.filter((col) => col.campo !== 'grupoTexto'),
            rows: asesorias.filter((a) => a.grupoTexto === item.clave)
        });

    // Detalle de una razón (parcial, ordinario, etc.): sus asesorías, sin repetir la columna de razón
    const handleDetalleRazon = (item) =>
        abrirDetalle({
            titulo: `Asesorías por razón: ${item.etiqueta}`,
            subtitulo: `${item.valor} asesorías · ${filtrosAplicados?.materia?.nombre || ''}`,
            columnas: COLUMNAS_ASESORIAS.filter((col) => col.campo !== 'razon'),
            rows: asesorias.filter((a) => a.razon === item.clave)
        });

    const hayDatos = esDetalle ? asesorias.length > 0 : filas.length > 0;

    const handleExportarPdf = async () => {
        if (!hayDatos) {
            showToast('No hay datos para exportar', 'info');
            return;
        }

        const secciones = esDetalle
            ? [
                { titulo: 'Asesorías por asesor', columnas: [{ campo: 'etiqueta', etiqueta: 'Asesor' }, { campo: 'valor', etiqueta: 'Asesorías' }], rows: porAsesor },
                { titulo: 'Asesorías por grupo', columnas: [{ campo: 'etiqueta', etiqueta: 'Grupo' }, { campo: 'valor', etiqueta: 'Asesorías' }], rows: porGrupo },
                { titulo: 'Asesorías por razón', columnas: [{ campo: 'etiqueta', etiqueta: 'Razón' }, { campo: 'valor', etiqueta: 'Asesorías' }], rows: porRazon },
                { titulo: 'Detalle de asesorías', columnas: COLUMNAS_ASESORIAS, rows: asesorias }
            ]
            : [{ titulo: 'Materias', columnas: COLUMNAS_GENERAL, rows: filas }];

        try {
            setExportando(true);
            await exportarPdf({ titulo: 'Reporte por materia', filtros: textoFiltros, resumen, secciones });
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
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-[#F4F7FC] px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold">Reporte por materia</p>
                <p className="text-sm text-gray-600">
                    Elige una materia para ver todas sus asesorías en el semestre, o déjala vacía para compararlas todas. Pulsa Buscar.
                </p>
            </div>

            {/* Filtros: en celular van apilados */}
            <div className="w-full flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:gap-4">
                {/* Buscador de materia: al hacer clic se despliega la lista y al escribir se filtra */}
                <div className="w-full min-w-0 lg:flex-1">
                    <Autocomplete
                        fullWidth
                        size="small"
                        openOnFocus
                        options={materias}
                        value={materia}
                        onChange={(event, nueva) => setMateria(nueva)}
                        getOptionLabel={etiquetaMateria}
                        getOptionKey={(option) => option.key}
                        isOptionEqualToValue={(option, value) => option.key === value.key}
                        loading={cargandoListas}
                        loadingText="Cargando materias..."
                        noOptionsText="No se encontraron materias"
                        sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF' } }}
                        renderInput={(params) => campoConLupa(params, 'Materia', 'Todas las materias (escribe un nombre para buscar)')}
                    />
                </div>

                <TextField
                    select
                    label="Semestre"
                    size="small"
                    value={cicloId}
                    onChange={(e) => setCicloId(e.target.value)}
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
                        {/* Filtros con los que se hizo la última búsqueda */}
                        {textoFiltros.length > 0 && (
                            <p className="text-sm text-gray-600">{textoFiltros.join(' · ')}</p>
                        )}

                        {!esDetalle ? (
                            /* ---------- Sin materia elegida: comparación de todas ---------- */
                            <>
                                <ResumenReporte items={resumen} />
                                <TablaReporte
                                    columnas={COLUMNAS_GENERAL}
                                    rows={filas}
                                    ordenInicial={{ campo: 'total', direccion: 'desc' }}
                                    anchoMinimo={1100}
                                    textoVacio="No se encontraron materias"
                                />
                            </>
                        ) : asesorias.length === 0 ? (
                            /* ---------- Materia elegida sin asesorías en el semestre ---------- */
                            <p className="text-gray-500">
                                {filtrosAplicados.materia.nombre} no tiene asesorías en el semestre elegido.
                            </p>
                        ) : (
                            /* ---------- Materia elegida: todas sus asesorías ---------- */
                            <>
                                <ResumenReporte items={resumen} />

                                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                    <PanelReporte
                                        titulo="Asesorías por asesor"
                                        subtitulo="Haz clic en un asesor para ver su detalle"
                                    >
                                        <BarrasReporte items={porAsesor} onItemClick={handleDetalleAsesor} />
                                    </PanelReporte>

                                    <PanelReporte
                                        titulo="Asesorías por grupo"
                                        subtitulo="Haz clic en un grupo para ver su detalle"
                                    >
                                        <BarrasReporte items={porGrupo} onItemClick={handleDetalleGrupo} />
                                    </PanelReporte>

                                    <PanelReporte
                                        titulo="Asesorías por razón"
                                        subtitulo="Haz clic en una razón para ver su detalle"
                                    >
                                        <BarrasReporte items={porRazon} onItemClick={handleDetalleRazon} />
                                    </PanelReporte>
                                </div>

                                <p className="text-base font-bold text-gray-900 mt-2">Todas las asesorías de la materia</p>
                                <TablaReporte
                                    columnas={COLUMNAS_ASESORIAS}
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
