import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    LinearProgress,
    Typography
} from '@mui/material';
import { useState } from 'react';
import EncabezadoModal from '../../compartidos/EncabezadoModal';
import { ESTILO_BOTON_SECUNDARIO, ESTILO_BOTON_VERDE, ICONO, paperModal } from '../../compartidos/estilosAdmin';
import { mensajesDeError } from '../../../../../../Services/errores';
import {
    confirmarCargaEstudiantes,
    leerExcelEstudiantes,
    validarCargaEstudiantes
} from '../../../../../../Services/cargaEstudiantesService';


// Tiempo mínimo que se muestra cada paso: con pocos alumnos el servidor responde tan rápido
// que la barra de progreso casi no se alcanza a ver
const MINIMO_REVISION_MS = 1500;
const MINIMO_CREACION_MS = 2500;
const PAUSA_AL_TERMINAR_MS = 500;

const pausa = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

// Espera a que termine la promesa y también a que pase el tiempo mínimo
const conDuracionMinima = async (promesa, ms) => {
    const [resultado] = await Promise.all([promesa, pausa(ms)]);
    return resultado;
};

/**
 * Carga masiva de estudiantes desde la plantilla de Excel, en tres pasos:
 *  1. elegir el archivo (se lee y se valida en el servidor, sin crear nada),
 *  2. revisar el resumen y los errores por renglón,
 *  3. confirmar: se crean los alumnos válidos (los que tienen error no se crean).
 *
 * Props:
 *  - onTerminado: se llama al cerrar si se creó al menos un alumno (para recargar la lista)
 */
export default function ModalCargaEstudiantes({ open, onClose, onTerminado }) {
    const [archivo, setArchivo] = useState(null);
    const [filas, setFilas] = useState([]);
    const [revision, setRevision] = useState(null); // resultado de validar
    const [resultado, setResultado] = useState(null); // resultado de confirmar
    const [progreso, setProgreso] = useState(null); // { hechas, total } mientras se crea
    const [trabajando, setTrabajando] = useState(false);
    const [error, setError] = useState('');

    const reiniciar = () => {
        setArchivo(null);
        setFilas([]);
        setRevision(null);
        setResultado(null);
        setProgreso(null);
        setTrabajando(false);
        setError('');
    };

    const cerrar = () => {
        if (trabajando) return; // no se cierra a media carga
        if (resultado?.creados > 0) onTerminado?.();
        reiniciar();
        onClose();
    };

    const handleArchivo = async (e) => {
        const elegido = e.target.files?.[0];
        e.target.value = ''; // permite volver a elegir el mismo archivo después de corregirlo
        if (!elegido) return;

        reiniciar();
        setArchivo(elegido);
        setTrabajando(true);
        try {
            const [leidas, validacion] = await conDuracionMinima(
                leerExcelEstudiantes(elegido).then(async (filasLeidas) => [
                    filasLeidas,
                    await validarCargaEstudiantes(filasLeidas)
                ]),
                MINIMO_REVISION_MS
            );
            setFilas(leidas);
            setRevision(validacion);
        } catch (err) {
            setError(err?.response ? mensajesDeError(err)[0] : err.message || 'No se pudo leer el archivo.');
        } finally {
            setTrabajando(false);
        }
    };

    const handleConfirmar = async () => {
        document.activeElement?.blur();
        setTrabajando(true);
        setError('');
        // Solo se mandan las filas sin error; el servidor las vuelve a validar al crear
        const conError = new Set(revision.filas.map((f) => f.fila));
        const validas = filas.filter((f) => !conError.has(f.fila));
        setProgreso({ hechas: 0, total: validas.length });
        try {
            const final = await conDuracionMinima(
                confirmarCargaEstudiantes(validas, (hechas, total) => setProgreso({ hechas, total })),
                MINIMO_CREACION_MS
            );
            // La barra llega al 100% y se queda un momento antes de mostrar el resultado
            setProgreso({ hechas: validas.length, total: validas.length });
            await pausa(PAUSA_AL_TERMINAR_MS);
            setResultado(final);
        } catch (err) {
            setError(mensajesDeError(err)[0]);
        } finally {
            setTrabajando(false);
        }
    };

    const filasConError = resultado ? resultado.errores : revision?.filas ?? [];

    return (
        <Dialog
            open={Boolean(open)}
            onClose={cerrar}
            disableRestoreFocus
            sx={paperModal(520)}
        >
            <EncabezadoModal
                icono={<UploadFileOutlinedIcon sx={ICONO} />}
                titulo="Cargar estudiantes"
                subtitulo="Desde la plantilla de Excel"
                tono="verde"
                onClose={trabajando ? undefined : cerrar}
            />

            <DialogContent
                dividers
                sx={{
                    py: 2.5,
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr)',
                    alignContent: 'start',
                    gap: 2,
                    overflowX: 'hidden',
                    '& .MuiAlert-message': { minWidth: 0, overflowWrap: 'anywhere' }
                }}
            >
                {/* Paso 1: elegir archivo (se oculta al terminar) */}
                {!resultado && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #C8D3EA', borderRadius: '12px', p: 3, backgroundColor: '#F7F9FD' }}>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            id="file-excel-estudiantes"
                            onChange={handleArchivo}
                            disabled={trabajando}
                            className="hidden"
                        />
                        <label htmlFor="file-excel-estudiantes" className="cursor-pointer flex flex-col items-center gap-2">
                            <Box sx={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: '#E6ECF8', color: '#08338F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <UploadFileOutlinedIcon />
                            </Box>
                            <Typography variant="body2" color="textSecondary" align="center">
                                {archivo ? archivo.name : 'Haz clic para elegir la plantilla de estudiantes (.xlsx)'}
                            </Typography>
                        </label>
                    </Box>
                )}

                {/* Plantilla en blanco (está en public/plantillas) */}
                {!resultado && !progreso && (
                    <Button
                        component="a"
                        href={`${import.meta.env.BASE_URL}plantillas/plantilla_estudiantes.xlsx`}
                        download="plantilla_estudiantes.xlsx"
                        startIcon={<FileDownloadOutlinedIcon />}
                        disabled={trabajando}
                        sx={{ justifySelf: 'center', textTransform: 'none', color: '#2E7D32', fontWeight: 600 }}
                    >
                        Descargar plantilla de Excel
                    </Button>
                )}

                {trabajando && !progreso && (
                    <>
                        <LinearProgress />
                        <Typography variant="body2" color="textSecondary" align="center">
                            Revisando el archivo...
                        </Typography>
                    </>
                )}

                {error && <Alert severity="error">{error}</Alert>}

                {/* Paso 2: resumen de la revisión */}
                {revision && !resultado && !progreso && (
                    <Alert severity={revision.validas > 0 ? (revision.con_errores > 0 ? 'warning' : 'success') : 'error'}>
                        {revision.total} renglones revisados: <strong>{revision.validas} listos para crear</strong>
                        {revision.con_errores > 0 && <>, <strong>{revision.con_errores} con errores</strong> (no se crearán)</>}.
                    </Alert>
                )}

                {/* Progreso de la creación */}
                {progreso && !resultado && (
                    <>
                        <LinearProgress
                            variant="determinate"
                            value={progreso.total ? (progreso.hechas / progreso.total) * 100 : 0}
                        />
                        <Typography variant="body2" color="textSecondary" align="center">
                            Creando alumnos... {progreso.hechas} de {progreso.total}. No cierres esta ventana.
                        </Typography>
                    </>
                )}

                {/* Paso 3: resultado final */}
                {resultado && (
                    <Alert severity={resultado.errores.length > 0 ? 'warning' : 'success'}>
                        Se crearon <strong>{resultado.creados}</strong> estudiantes
                        {resultado.errores.length > 0 && <>; <strong>{resultado.errores.length}</strong> no se pudieron crear</>}.
                    </Alert>
                )}

                {/* Errores por renglón (los números son los renglones de Excel) */}
                {filasConError.length > 0 && (!progreso || resultado) && (
                    <Box sx={{ maxHeight: 260, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1.5 }}>
                        {filasConError.map((f) => (
                            <Box key={f.fila} sx={{ mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    Renglón {f.fila}{f.estudiante ? ` · ${f.estudiante}` : ''}
                                </Typography>
                                {f.errores.map((m) => (
                                    <Typography key={m} variant="body2" color="error">
                                        • {m}
                                    </Typography>
                                ))}
                            </Box>
                        ))}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={cerrar} disabled={trabajando} sx={ESTILO_BOTON_SECUNDARIO}>
                    {resultado ? 'Cerrar' : 'Cancelar'}
                </Button>
                {!resultado && (
                    <Button
                        variant="contained"
                        sx={ESTILO_BOTON_VERDE}
                        disabled={trabajando || !revision || revision.validas === 0}
                        onClick={handleConfirmar}
                    >
                        {revision?.validas ? `Crear ${revision.validas} estudiantes` : 'Crear estudiantes'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
