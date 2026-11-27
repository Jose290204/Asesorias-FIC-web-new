import CloseIcon from '@mui/icons-material/Close';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
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

// Ícono del archivo dentro de un cuadrito: rojo para PDF, azul para los demás
const iconoArchivo = (tipo) => {
    const esPdf = tipo?.includes('pdf');
    return (
        <Box
            sx={{
                width: 40,
                height: 40,
                flexShrink: 0,
                borderRadius: '10px',
                backgroundColor: esPdf ? '#FDECEC' : '#E6ECF8',
                color: esPdf ? '#C62828' : '#08338F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {esPdf ? <PictureAsPdfOutlinedIcon /> : <InsertDriveFileOutlinedIcon />}
        </Box>
    );
};

// Estilos de los botones de la zona de subida en celular
const BOTON_AZUL = {
    flex: 1,
    textTransform: 'none',
    fontWeight: 700,
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #1E4DB7 0%, #08338F 55%, #052466 100%)',
    boxShadow: '0 4px 12px rgba(8, 51, 143, 0.35)',
    '&:hover': { background: 'linear-gradient(135deg, #08338F 0%, #052466 100%)' }
};

// Círculo con la nube de subida
const ICONO_SUBIDA = (
    <Box
        sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundColor: '#E6ECF8',
            color: '#08338F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    >
        <CloudUploadOutlinedIcon sx={{ fontSize: 28 }} />
    </Box>
);

// Zona punteada donde se sueltan o eligen los archivos
const ZONA_SUBIDA = {
    border: '2px dashed #B8C6E6',
    borderRadius: '12px',
    backgroundColor: '#F7F9FD',
    mb: 2
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
                        maxWidth: '90vw',
                        minHeight: '420px',
                        maxHeight: '90dvh',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1.5
                    }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, pr: 7, display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            flexShrink: 0,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #1E4DB7 0%, #08338F 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <FolderOpenOutlinedIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1.2 }}>
                            Material
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px', overflowWrap: 'anywhere' }}>
                            {data?.materia || 'Asesoría'}
                            {data?.estudiante && ` · Alumno: ${data.estudiante}`}
                        </Typography>
                    </Box>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {!soloLectura && (
                        esCelular ? (
                            <Box className="flex flex-col items-center gap-3 p-5" sx={ZONA_SUBIDA}>
                                {subiendo ? (
                                    <>
                                        <CircularProgress size={32} />
                                        <Typography variant="body2" color="textSecondary">Subiendo...</Typography>
                                    </>
                                ) : (
                                    <>
                                        {ICONO_SUBIDA}
                                        <Typography variant="body2" color="textSecondary" align="center">
                                            Elige qué quieres subir
                                        </Typography>
                                        <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
                                            <Button component="label" variant="contained" startIcon={<InsertDriveFileIcon />} sx={BOTON_AZUL}>
                                                Documento
                                                <input type="file" hidden multiple onChange={handleSubir} accept={ACCEPT_DOCUMENTOS} />
                                            </Button>
                                            <Button
                                                component="label"
                                                variant="outlined"
                                                startIcon={<PhotoLibraryOutlinedIcon />}
                                                sx={{ flex: 1, textTransform: 'none', fontWeight: 700, borderRadius: '8px', color: '#08338F', borderColor: '#08338F' }}
                                            >
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
                            <Box
                                className="flex flex-col items-center justify-center p-6 transition-colors"
                                sx={{ ...ZONA_SUBIDA, '&:hover': { backgroundColor: '#EEF3FB', borderColor: '#08338F' } }}
                            >
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
                                    {subiendo ? <CircularProgress size={32} /> : ICONO_SUBIDA}
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#08338F' }}>
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
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', textAlign: 'center', py: 3 }}>
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: '50%',
                                    backgroundColor: '#F1F4FA',
                                    color: '#9AA7C4',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <FolderOpenOutlinedIcon sx={{ fontSize: 34 }} />
                            </Box>
                            <Typography sx={{ fontWeight: 700, color: '#333333' }}>
                                Aún no hay material
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                No hay archivos disponibles.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {lista.map((archivo) => (
                                <Box
                                    key={archivo.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        p: '12px 14px',
                                        borderRadius: '12px',
                                        backgroundColor: '#F7F9FD',
                                        border: '1px solid #EEF1F7'
                                    }}
                                >
                                    {iconoArchivo(archivo.tipo)}

                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography title={archivo.nombre} noWrap sx={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>
                                            {archivo.nombre}
                                        </Typography>
                                        <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                                            {[formatearTamano(archivo.tamano), archivo.subido_por].filter(Boolean).join(' · ')}
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={0.75} sx={{ flexShrink: 0 }}>
                                        <Tooltip title="Descargar">
                                            <IconButton
                                                size="small"
                                                aria-label={`Descargar ${archivo.nombre}`}
                                                onClick={() => handleDescargar(archivo)}
                                                sx={{ color: '#08338F', backgroundColor: '#E6ECF8', '&:hover': { backgroundColor: '#D5DFF3' } }}
                                            >
                                                <DownloadIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        {!soloLectura && (
                                            <Tooltip title="Eliminar archivo">
                                                <IconButton
                                                    size="small"
                                                    aria-label={`Eliminar ${archivo.nombre}`}
                                                    onClick={() => setArchivoAEliminar(archivo)}
                                                    sx={{ color: '#C62828', backgroundColor: '#FDECEC', '&:hover': { backgroundColor: '#F9D6D6' } }}
                                                >
                                                    <DeleteOutlineOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={onClose} sx={{ backgroundColor: '#08338F', '&:hover': { backgroundColor: '#062568' } }}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmar eliminación */}
            <Dialog
                open={Boolean(archivoAEliminar)}
                onClose={() => setArchivoAEliminar(null)}
                sx={{ '& .MuiPaper-root': { width: '420px', maxWidth: '90vw', borderRadius: '16px', p: 1.5 } }}
            >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            flexShrink: 0,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #E04848 0%, #C42525 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <DeleteOutlineOutlinedIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1.2 }}>
                            Eliminar archivo
                        </Typography>
                        <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '2px' }}>
                            Esta acción no se puede deshacer
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
                        ¿Estás seguro de que deseas eliminar el archivo <strong>{archivoAEliminar?.nombre}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button variant="outlined" color="inherit" onClick={() => setArchivoAEliminar(null)} sx={{ borderRadius: '8px', textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmarEliminacion}
                        disabled={eliminando}
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
