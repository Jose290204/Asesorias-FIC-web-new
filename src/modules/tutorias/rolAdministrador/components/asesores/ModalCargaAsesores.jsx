import CloseIcon from '@mui/icons-material/Close';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    Typography
} from '@mui/material';
import { useState } from 'react';
import { mensajesDeError } from '../../../../../Services/errores';
import {
    confirmarCargaAsesores,
    leerExcelAsesores,
    validarCargaAsesores
} from '../../../../../Services/cargaAsesoresService';

const VERDE = '#2e7d32';
const VERDE_OSCURO = '#1b5e20';

// Tiempo mínimo que se muestra cada paso: con pocos asesores el servidor responde tan rápido
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
 * Carga masiva de asesores disciplinares desde la plantilla de Excel, en tres pasos:
 *  1. elegir el archivo (se lee y se valida en el servidor, sin crear nada),
 *  2. revisar el resumen y los errores por renglón,
 *  3. confirmar: se crean los asesores válidos (los que tienen error no se crean).
 *
 * Props:
 *  - onTerminado: se llama al cerrar si se creó al menos un asesor (para recargar la lista)
 */
export default function ModalCargaAsesores({ open, onClose, onTerminado }) {
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
                leerExcelAsesores(elegido).then(async (filasLeidas) => [
                    filasLeidas,
                    await validarCargaAsesores(filasLeidas)
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
                confirmarCargaAsesores(validas, (hechas, total) => setProgreso({ hechas, total })),
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
            sx={{ '& .MuiPaper-root': { width: '520px', maxWidth: '92vw', borderRadius: '12px', p: 1.5 } }}
        >
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
                Cargar asesores disciplinares desde Excel
                <IconButton
                    aria-label="Cerrar"
                    onClick={cerrar}
                    disabled={trabajando}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (t) => t.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    py: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    overflowX: 'hidden',
                    '& .MuiAlert-message': { minWidth: 0, overflowWrap: 'anywhere' }
                }}
            >
                {/* Paso 1: elegir archivo (se oculta al terminar) */}
                {!resultado && (
                    <Box className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            id="file-excel-asesores"
                            onChange={handleArchivo}
                            disabled={trabajando}
                            className="hidden"
                        />
                        <label htmlFor="file-excel-asesores" className="cursor-pointer flex flex-col items-center gap-2">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <Typography variant="body2" color="textSecondary" align="center">
                                {archivo ? archivo.name : 'Haz clic para elegir la plantilla de asesores (.xlsx)'}
                            </Typography>
                        </label>
                    </Box>
                )}

                {/* Plantilla en blanco (está en public/plantillas) */}
                {!resultado && !progreso && (
                    <Button
                        component="a"
                        href={`${import.meta.env.BASE_URL}plantillas/plantilla_asesores.xlsx`}
                        download="plantilla_asesores.xlsx"
                        startIcon={<FileDownloadOutlinedIcon />}
                        disabled={trabajando}
                        sx={{ alignSelf: 'center', textTransform: 'none', color: VERDE, fontWeight: 600 }}
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
                            Creando asesores... {progreso.hechas} de {progreso.total}. No cierres esta ventana.
                        </Typography>
                    </>
                )}

                {/* Paso 3: resultado final */}
                {resultado && (
                    <Alert severity={resultado.errores.length > 0 ? 'warning' : 'success'}>
                        Se crearon <strong>{resultado.creados}</strong> asesores
                        {resultado.errores.length > 0 && <>; <strong>{resultado.errores.length}</strong> no se pudieron crear</>}.
                    </Alert>
                )}

                {/* Errores por renglón (los números son los renglones de Excel) */}
                {filasConError.length > 0 && (!progreso || resultado) && (
                    <Box sx={{ maxHeight: 260, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1.5 }}>
                        {filasConError.map((f) => (
                            <Box key={f.fila} sx={{ mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    Renglón {f.fila}{f.asesor ? ` · ${f.asesor}` : ''}
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
                <Button variant="outlined" color="inherit" onClick={cerrar} disabled={trabajando}>
                    {resultado ? 'Cerrar' : 'Cancelar'}
                </Button>
                {!resultado && (
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: VERDE, '&:hover': { backgroundColor: VERDE_OSCURO } }}
                        disabled={trabajando || !revision || revision.validas === 0}
                        onClick={handleConfirmar}
                    >
                        {revision?.validas ? `Crear ${revision.validas} asesores` : 'Crear asesores'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
