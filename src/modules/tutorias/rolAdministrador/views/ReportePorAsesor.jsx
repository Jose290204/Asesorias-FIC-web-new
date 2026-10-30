
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';
import ToastNotification from '../../../../components/ui/ToastNotification';
import BarrasReporte from '../components/reportes/BarrasReporte';
import { estiloEstatus, estiloTipoAsesor } from '../components/reportes/estilosReporte';
import { exportarPdf, PDF_NO_DISPONIBLE } from '../components/reportes/exportarPdf';
import ModalDetalleAsesorias from '../components/reportes/ModalDetalleAsesorias';
import PanelReporte from '../components/reportes/PanelReporte';
import ResumenReporte from '../components/reportes/ResumenReporte';
import TablaReporte from '../components/reportes/TablaReporte';
import { reportesService } from '../services/reportesService';

const AZUL = '#244B91';
const AZUL_OSCURO = '#1B3A73';

// Columnas del reporte general (un renglón por asesor)
const COLUMNAS_GENERAL = [
    { campo: 'nombre', etiqueta: 'Asesor', alinear: 'left', principal: true },
    { campo: 'tipo', etiqueta: 'Tipo', chip: true, estiloChip: estiloTipoAsesor },
    { campo: 'solicitudes', etiqueta: 'Solicitudes' },
    { campo: 'enCurso', etiqueta: 'En curso' },
    { campo: 'completadas', etiqueta: 'Completadas' },
    { campo: 'canceladas', etiqueta: 'Canceladas' },
    { campo: 'total', etiqueta: 'Total asesorías' },
    { campo: 'sesiones', etiqueta: 'Sesiones' }
];

// Columnas del detalle de un asesor (un renglón por asesoría)
const COLUMNAS_ASESORIAS = [
    { campo: 'materia', etiqueta: 'Materia', alinear: 'left', principal: true },
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

const suma = (rows, campo) => rows.reduce((total, row) => total + (row[campo] || 0), 0);

// Cuenta las asesorías por un campo y las ordena de mayor a menor: [{ clave, etiqueta, valor }]
const agrupar = (asesorias, campo) => {
    const conteo = new Map();
    asesorias.forEach((item) => conteo.set(item[campo], (conteo.get(item[campo]) || 0) + 1));

    return [...conteo.entries()]
        .map(([etiqueta, valor]) => ({ clave: etiqueta, etiqueta, valor }))
        .sort((a, b) => b.valor - a.valor || a.etiqueta.localeCompare(b.etiqueta, 'es'));
};

// Campo de texto del buscador de asesor, con la lupa a la izquierda (igual que el de Crear Asesoría)
const campoConLupa = (params, label, placeholder) => {
    const inputProps = params.slotProps?.input ?? params.InputProps;
    return (
        <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            slotProps={{
                ...params.slotProps,
                input: {
                    ...inputProps,
                    startAdornment: (
                        <>
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                            {inputProps?.startAdornment}
                        </>
                    )
                }
            }}
        />
    );
};

export default function ReportePorAsesor() {
    // Lo que el administrador está eligiendo (no cambia el reporte hasta pulsar "Buscar")
    const [asesor, setAsesor] = useState(null);
    const [cicloId, setCicloId] = useState('');

    // Lo que se buscó por última vez (es lo que muestra el reporte y lo que lleva el PDF)
    const [filtrosAplicados, setFiltrosAplicados] = useState(null);

    const [asesores, setAsesores] = useState([]);
    const [ciclos, setCiclos] = useState([]);
    const [cargandoListas, setCargandoListas] = useState(true);

    // Resultado: sin asesor elegido -> resumen de todos (filas); con asesor -> sus asesorías
    const [filas, setFilas] = useState([]);
    const [asesorias, setAsesorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [exportando, setExportando] = useState(false);

    // Ventana con el detalle de una materia o un grupo
    const [detalle, setDetalle] = useState(null);
    const [detalleAbierto, setDetalleAbierto] = useState(false);

    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => setToast({ open: true, message, type });

    // Hace la consulta con los filtros dados y deja el resultado en pantalla
    const buscar = async (asesorElegido, cicloElegido, listaCiclos) => {
        try {
            setCargando(true);

            if (asesorElegido) {
                const data = await reportesService.obtenerAsesoriasDeAsesor({
                    asesor: asesorElegido,
                    cicloId: cicloElegido
                });
                setAsesorias(data);
                setFilas([]);
            } else {
                const data = await reportesService.obtenerResumenAsesores(cicloElegido);
                setFilas(data);
                setAsesorias([]);
            }

            setFiltrosAplicados({
                asesor: asesorElegido,
                ciclo: (listaCiclos || ciclos).find((item) => item.id === cicloElegido) || null
            });
        } catch (error) {
            console.error('Error al obtener el reporte por asesor:', error);
            setFilas([]);
            setAsesorias([]);
            showToast('Error al obtener el reporte', 'error');
        } finally {
            setCargando(false);
        }
    };

    // Al entrar: se cargan asesores y semestres, y se hace una primera búsqueda (todos los asesores, semestre vigente)
    useEffect(() => {
        let cancelado = false;

        const iniciar = async () => {
            const [resCiclos, resAsesores] = await Promise.allSettled([
                reportesService.obtenerCiclos(),
                reportesService.obtenerAsesores()
            ]);
            if (cancelado) return;

            if (resAsesores.status === 'fulfilled') {
                setAsesores(resAsesores.value);
            } else {
                console.error('Error al cargar asesores:', resAsesores.reason);
                showToast('Error al cargar la lista de asesores', 'error');
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
        buscar(asesor, cicloId);
    };

    const esDetalle = Boolean(filtrosAplicados?.asesor);

    // Texto de los filtros aplicados (sale en la pantalla y en el PDF)
    const textoFiltros = filtrosAplicados
        ? [
            `Asesor: ${filtrosAplicados.asesor?.nombre || 'Todos'}`,
            `Semestre: ${filtrosAplicados.ciclo?.nombre || '-'}`
        ]
        : [];

    // Cálculos del detalle de un asesor, a partir de sus asesorías
    const porMateria = useMemo(() => agrupar(asesorias, 'materia'), [asesorias]);
    const porGrupo = useMemo(() => agrupar(asesorias, 'grupoTexto'), [asesorias]);

    const resumen = useMemo(() => {
        if (!esDetalle) {
            return [
                { titulo: 'Asesores con actividad', valor: filas.filter((item) => item.total > 0).length },
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
                titulo: 'Materia con más asesorías',
                valor: porMateria[0]?.etiqueta || '-',
                detalle: porMateria[0] ? `${porMateria[0].valor} asesorías` : undefined
            },
            { titulo: 'Estudiantes atendidos', valor: estudiantes }
        ];
    }, [esDetalle, filas, asesorias, porMateria]);

    const abrirDetalle = (config) => {
        setDetalle(config);
        setDetalleAbierto(true);
    };

    // Detalle de una materia: sus asesorías, sin repetir la columna de materia
    const handleDetalleMateria = (item) =>
        abrirDetalle({
            titulo: `Asesorías de ${item.etiqueta}`,
            subtitulo: `${item.valor} asesorías · ${filtrosAplicados?.asesor?.nombre || ''}`,
            columnas: COLUMNAS_ASESORIAS.filter((col) => col.campo !== 'materia'),
            rows: asesorias.filter((a) => a.materia === item.clave)
        });

    // Detalle de un grupo: sus asesorías, sin repetir la columna de grupo
    const handleDetalleGrupo = (item) =>
        abrirDetalle({
            titulo: `Asesorías del grupo ${item.etiqueta}`,
            subtitulo: `${item.valor} asesorías · ${filtrosAplicados?.asesor?.nombre || ''}`,
            columnas: COLUMNAS_ASESORIAS.filter((col) => col.campo !== 'grupoTexto'),
            rows: asesorias.filter((a) => a.grupoTexto === item.clave)
        });

    const hayDatos = esDetalle ? asesorias.length > 0 : filas.length > 0;

    const handleExportarPdf = async () => {
        if (!hayDatos) {
            showToast('No hay datos para exportar', 'info');
            return;
        }

        const secciones = esDetalle
            ? [
                { titulo: 'Asesorías por materia', columnas: [{ campo: 'etiqueta', etiqueta: 'Materia' }, { campo: 'valor', etiqueta: 'Asesorías' }], rows: porMateria },
                { titulo: 'Asesorías por grupo', columnas: [{ campo: 'etiqueta', etiqueta: 'Grupo' }, { campo: 'valor', etiqueta: 'Asesorías' }], rows: porGrupo },
                { titulo: 'Detalle de asesorías', columnas: COLUMNAS_ASESORIAS, rows: asesorias }
            ]
            : [{ titulo: 'Asesores', columnas: COLUMNAS_GENERAL, rows: filas }];

        try {
            setExportando(true);
            await exportarPdf({ titulo: 'Reporte por asesor', filtros: textoFiltros, resumen, secciones });
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
                <p className="text-2xl font-bold">Reporte por asesor</p>
                <p className="text-sm text-gray-600">
                    Elige un asesor para ver todo lo que ha hecho en el semestre, o déjalo vacío para compararlos a todos. Pulsa Buscar.
                </p>
            </div>

            {/* Filtros: en celular van apilados */}
            <div className="w-full flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:gap-4">
                {/* Buscador de asesor: al hacer clic se despliega la lista y al escribir se filtra */}
                <div className="w-full min-w-0 lg:flex-1">
                    <Autocomplete
                        fullWidth
                        size="small"
                        openOnFocus
                        options={asesores}
                        value={asesor}
                        onChange={(event, nuevo) => setAsesor(nuevo)}
                        getOptionLabel={(option) => option.nombre}
                        getOptionKey={(option) => option.key}
                        isOptionEqualToValue={(option, value) => option.key === value.key}
                        loading={cargandoListas}
                        loadingText="Cargando asesores..."
                        noOptionsText="No se encontraron asesores"
                        sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF' } }}
                        renderInput={(params) => campoConLupa(params, 'Asesor', 'Todos los asesores (escribe un nombre para buscar)')}
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
                            /* ---------- Sin asesor elegido: comparación de todos ---------- */
                            <>
                                <ResumenReporte items={resumen} />
                                <TablaReporte
                                    columnas={COLUMNAS_GENERAL}
                                    rows={filas}
                                    ordenInicial={{ campo: 'total', direccion: 'desc' }}
                                    textoVacio="No se encontraron asesores"
                                />
                            </>
                        ) : asesorias.length === 0 ? (
                            /* ---------- Asesor elegido sin asesorías en el semestre ---------- */
                            <p className="text-gray-500">
                                {filtrosAplicados.asesor.nombre} no tiene asesorías en el semestre elegido.
                            </p>
                        ) : (
                            /* ---------- Asesor elegido: todo lo que hizo ---------- */
                            <>
                                <ResumenReporte items={resumen} />

                                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <PanelReporte
                                        titulo="Asesorías por materia"
                                        subtitulo="Haz clic en una materia para ver su detalle"
                                    >
                                        <BarrasReporte items={porMateria} onItemClick={handleDetalleMateria} />
                                    </PanelReporte>

                                    <PanelReporte
                                        titulo="Asesorías por grupo"
                                        subtitulo="Haz clic en un grupo para ver su detalle"
                                    >
                                        <BarrasReporte items={porGrupo} onItemClick={handleDetalleGrupo} />
                                    </PanelReporte>
                                </div>

                                <p className="text-base font-bold text-gray-900 mt-2">Todas las asesorías del semestre</p>
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