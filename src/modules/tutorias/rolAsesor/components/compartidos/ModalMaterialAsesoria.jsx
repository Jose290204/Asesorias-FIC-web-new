import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

import { mensajesDeError } from '../../../../../Services/errores';
import {
    descargarMaterial,
    eliminarMaterial,
    MATERIAL_EXTENSIONES,
    MATERIAL_MAX_ARCHIVOS,
    MATERIAL_MAX_MB,
    subirMaterial,
    traerMaterial
} from '../../../../../Services/materialAsesorService';
import useMediaQuery from '@mui/material/useMediaQuery';

// En celular se piden por separado: un selector que mezcla imágenes y documentos abre solo la galería de fotos en Android,
// así que los documentos (sin imágenes en la lista) abren el explorador de archivos y las fotos abren la galería.
// "application/*" hace que Android abra el explorador de archivos con todos los documentos visibles (sin fotos);
// los tipos permitidos se validan por extensión al elegir (validarArchivos)
const ACCEPT_DOCUMENTOS = 'application/*';
const ACCEPT_FOTOS = 'image/jpeg,image/png';

const getFileIcon = (tipo) => {
    if (tipo?.includes('pdf')) return <PictureAsPdfIcon color="error" />;
    return <InsertDriveFileIcon color="primary" />;
};

// 276969 -> "270.5 KB"
const formatearTamano = (bytes) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Avisa antes de subir lo que el backend rechazaría (el backend lo vuelve a validar)
const validarArchivos = (archivos) => {
    if (archivos.length > MATERIAL_MAX_ARCHIVOS) {
        return `Solo se pueden subir ${MATERIAL_MAX_ARCHIVOS} archivos a la vez.`;
    }
    for (const archivo of archivos) {
        const extension = archivo.name.split('.').pop().toLowerCase();
        if (!MATERIAL_EXTENSIONES.includes(extension)) {
            return `"${archivo.name}" no es un tipo permitido (PDF, Word, PowerPoint, Excel, JPG, PNG o ZIP).`;
        }
        if (archivo.size > MATERIAL_MAX_MB * 1024 * 1024) {
            return `"${archivo.name}" pesa más de ${MATERIAL_MAX_MB} MB.`;
        }
    }
    return null;
};

// Modal de material de una asesoría. Cada acción (subir, descargar, eliminar) se hace al momento
// contra la API; no hay botón "Guardar". data es la asesoría (usa data.id).
// soloLectura: sin subir ni eliminar (por ejemplo, en una asesoría cancelada).
// acciones: { subir, eliminar } para usar otras rutas (el administrador usa /admin/...);
// por defecto son las del asesor. Listar y descargar siempre usan las rutas compartidas.
export default function ModalMaterialAsesoria({ open, onClose, data, soloLectura = false, showToast, acciones }) {
    const subir = acciones?.subir ?? subirMaterial;
    const eliminar = acciones?.eliminar ?? eliminarMaterial;
    const esCelular = useMediaQuery('(max-width:599.95px)');
    const [lista, setLista] = useState([]);
    // Id de la asesoría cuya lista ya llegó (sirve para saber si todavía se está cargando)
    const [cargadoDe, setCargadoDe] = useState(null);
    const [subiendo, setSubiendo] = useState(false);
    const [archivoAEliminar, setArchivoAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    const asesoriaId = data?.id;
    const cargando = Boolean(open && asesoriaId && cargadoDe !== asesoriaId);

    // Carga el material de la asesoría cada vez que se abre el modal
    useEffect(() => {
        if (!open || !asesoriaId) return undefined;

        let cancelado = false;

        traerMaterial(asesoriaId)
            .then((material) => {
                if (cancelado) return;
                setLista(material);
                setCargadoDe(asesoriaId);
            })
            .catch((error) => {
                if (cancelado) return;
                setCargadoDe(asesoriaId);
                showToast?.(mensajesDeError(error)[0], 'error');
            });

        return () => {
            cancelado = true;
        };
    }, [open, asesoriaId, showToast]);

    const handleSubir = async (event) => {
        const archivos = Array.from(event.target.files);
        event.target.value = null;
        if (archivos.length === 0) return;

        const problema = validarArchivos(archivos);
        if (problema) {
            showToast?.(problema, 'error');
            return;
        }

        setSubiendo(true);
        try {
            const creados = await subir(asesoriaId, archivos);
            // La respuesta trae solo los archivos nuevos: se ponen arriba de la lista
            setLista((prev) => [...creados, ...prev]);
            showToast?.(creados.length === 1 ? 'Archivo subido correctamente' : 'Archivos subidos correctamente', 'success');
        } catch (error) {
            showToast?.(mensajesDeError(error)[0], 'error');
        } finally {
            setSubiendo(false);
        }
    };

    const handleDescargar = async (archivo) => {
        try {
            await descargarMaterial(archivo.id, archivo.nombre);
        } catch (error) {
            showToast?.(mensajesDeError(error)[0], 'error');
        }
    };

    const handleConfirmarEliminacion = async () => {
        if (!archivoAEliminar) return;

        setEliminando(true);
        try {
            await eliminar(archivoAEliminar.id);
            setLista((prev) => prev.filter((item) => item.id !== archivoAEliminar.id));
            showToast?.('Archivo eliminado correctamente', 'success');
            setArchivoAEliminar(null);
        } catch (error) {
            showToast?.(mensajesDeError(error)[0], 'error');
        } finally {
            setEliminando(false);
        }
    };

    return (
        <>
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
                fullScreen={esCelular}
                sx={{
                    '& .MuiPaper-root': esCelular ? { borderRadius: 0 } : {
                        width: '550px',
                        maxWidth: '550px',
                        height: '520px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Material: {data?.materia || 'Asesoría'}
                    {data?.estudiante && (
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', fontWeight: 'normal' }}>
                            Alumno: {data.estudiante}
                        </Typography>
                    )}
                </DialogTitle>

                <DialogContent dividers sx={{ overflowY: 'auto' }}>
                    {!soloLectura && (
                        esCelular ? (
                            <Box className="flex flex-col items-center gap-3 border-2 border-dashed border-gray-300 rounded-lg p-5 bg-gray-50" sx={{ mb: 2 }}>
                                {subiendo ? (
                                    <>
                                        <CircularProgress size={32} />
                                        <Typography variant="body2" color="textSecondary">Subiendo...</Typography>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="body2" color="textSecondary" align="center">
                                            Elige qué quieres subir
                                        </Typography>
                                        <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
                                            <Button component="label" variant="contained" startIcon={<InsertDriveFileIcon />} sx={{ flex: 1, textTransform: 'none', backgroundColor: '#08338F' }}>
                                                Documento
                                                <input type="file" hidden multiple onChange={handleSubir} accept={ACCEPT_DOCUMENTOS} />
                                            </Button>
                                            <Button component="label" variant="outlined" startIcon={<PhotoLibraryOutlinedIcon />} sx={{ flex: 1, textTransform: 'none', color: '#08338F', borderColor: '#08338F' }}>
                                                Foto
                                                <input type="file" hidden multiple onChange={handleSubir} accept={ACCEPT_FOTOS} />
                                            </Button>
                                        </Stack>
                                    </>
                                )}
                                <Typography variant="caption" color="textSecondary" align="center">
                                    Hasta {MATERIAL_MAX_ARCHIVOS} archivos de {MATERIAL_MAX_MB} MB (PDF, Word, PowerPoint, Excel, JPG, PNG, ZIP)
                                </Typography>
                            </Box>
                        ) : (
                            <Box className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors" sx={{ mb: 2 }}>
                                <input
                                    type="file"
                                    id="file-material-input"
                                    onChange={handleSubir}
                                    className="hidden"
                                    multiple
                                    disabled={subiendo}
                                    accept={MATERIAL_EXTENSIONES.map((e) => `.${e}`).join(',')}
                                />
                                <label
                                    htmlFor="file-material-input"
                                    className="cursor-pointer flex flex-col items-center gap-2 w-full text-center"
                                >
                                    {subiendo ? (
                                        <CircularProgress size={32} />
                                    ) : (
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    )}
                                    <Typography variant="body2" color="textSecondary">
                                        {subiendo ? 'Subiendo...' : 'Haz clic para seleccionar o cargar un documento'}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Hasta {MATERIAL_MAX_ARCHIVOS} archivos de {MATERIAL_MAX_MB} MB (PDF, Word, PowerPoint, Excel, JPG, PNG, ZIP)
                                    </Typography>
                                </label>
                            </Box>
                        )
                    )}

                    {cargando ? (
                        <Box className="flex justify-center py-6"><CircularProgress size={28} /></Box>
                    ) : lista.length === 0 ? (
                        <Typography color="text.secondary" align="center" mt={2} mb={2}>
                            No hay archivos disponibles.
                        </Typography>
                    ) : (
                        <List disablePadding sx={{ mb: 2 }}>
                            {lista.map((archivo) => (
                                <ListItem
                                    key={archivo.id}
                                    sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', mb: 1, py: 0.5 }}
                                    secondaryAction={
                                        <Stack direction="row" spacing={0.5}>
                                            <Tooltip title="Descargar">
                                                <IconButton color="primary" size="small" onClick={() => handleDescargar(archivo)}>
                                                    <DownloadIcon />
                                                </IconButton>
                                            </Tooltip>

                                            {!soloLectura && (
                                                <Tooltip title="Eliminar archivo">
                                                    <IconButton color="error" size="small" onClick={() => setArchivoAEliminar(archivo)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Stack>
                                    }
                                >
                                    <ListItemIcon>{getFileIcon(archivo.tipo)}</ListItemIcon>
                                    <ListItemText
                                        primary={archivo.nombre}
                                        secondary={[formatearTamano(archivo.tamano), archivo.subido_por].filter(Boolean).join(' · ')}
                                        sx={{ pr: 10 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 1.5, gap: 1 }}>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmar eliminación */}
            <Dialog
                open={Boolean(archivoAEliminar)}
                onClose={() => setArchivoAEliminar(null)}
                sx={{ '& .MuiPaper-root': { width: '420px', borderRadius: '12px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminar archivo</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        ¿Estás seguro de que deseas eliminar el archivo <strong>{archivoAEliminar?.nombre}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={() => setArchivoAEliminar(null)}>
                        Cancelar
                    </Button>
                    <Button variant="contained" color="error" onClick={handleConfirmarEliminacion} disabled={eliminando}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
