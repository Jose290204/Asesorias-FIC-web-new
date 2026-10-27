import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useEffect, useState } from 'react';
import ModalConfirmarEliminarMaterial from './ModalConfirmarEliminarMaterial';

// Texto corto para mostrar el tipo de archivo (en vez del mime_type largo)
const etiquetaTipoArchivo = (archivo) => {
    const mime = archivo?.mime_type || '';
    if (mime.includes('pdf')) return 'PDF';
    if (mime.includes('word')) return 'Word';
    if (mime.includes('sheet') || mime.includes('excel')) return 'Excel';
    if (mime.includes('presentation') || mime.includes('powerpoint')) return 'PowerPoint';
    if (mime.startsWith('image/')) return 'Imagen';

    const extension = String(archivo?.nombre_archivo || '').split('.').pop();
    return extension && extension !== archivo?.nombre_archivo ? extension.toUpperCase() : 'Archivo';
};

// --- 4. MODAL MATERIAL ADICIONAL ---
export default function ModalMaterialAdicional({ open, onClose, data, onSave, showToast }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const [listaMateriales, setListaMateriales] = useState([]);
    const [initialMateriales, setInitialMateriales] = useState([]);
    const [archivoAEliminar, setArchivoAEliminar] = useState(null);
    const [modalConfirmEliminarOpen, setModalConfirmEliminarOpen] = useState(false);

    // Carga el material de la asesoría seleccionada cada vez que se abre el modal
    // y guarda una copia inicial para saber si hubo cambios
    useEffect(() => {
        if (!open) return;
        const materialInicial = data?.material_adicional ?? data?.raw?.material_adicional ?? [];
        setListaMateriales(materialInicial);
        setInitialMateriales(materialInicial);
    }, [data, open]);

    // Hay cambios si se agregó o eliminó algún archivo (se comparan por id_material).
    // Si agregas un archivo y luego lo eliminas, vuelve a contar como "sin cambios".
    const isModified =
        listaMateriales.length !== initialMateriales.length ||
        listaMateriales.some(
            (archivo) => !initialMateriales.some((inicial) => inicial.id_material === archivo.id_material)
        );

    const getFileIcon = (mimeType) => {
        if (mimeType?.includes('pdf')) return <PictureAsPdfIcon color="error" />;
        return <InsertDriveFileIcon color="primary" />;
    };

    const handleOpenConfirmEliminar = (archivo) => {
        setArchivoAEliminar(archivo);
        setModalConfirmEliminarOpen(true);
    };

    const handleConfirmarEliminacion = () => {
        if (archivoAEliminar) {
            setListaMateriales((prev) =>
                prev.filter((item) => item.id_material !== archivoAEliminar.id_material)
            );
        }
        setModalConfirmEliminarOpen(false);
        setArchivoAEliminar(null);
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const nuevosArchivos = files.map((file, index) => ({
            id_material: Date.now() + index,
            nombre_archivo: file.name,
            mime_type: file.type || 'application/octet-stream',
            url_archivo: URL.createObjectURL(file)
        }));

        setListaMateriales((prev) => [...prev, ...nuevosArchivos]);
        event.target.value = null;
    };

    const handleSave = () => {
        if (!isModified) return;
        if (onSave) onSave(listaMateriales);
        if (showToast) showToast('Material adicional guardado correctamente', 'success');
        onClose();
    };

    // Persona de la asesoría: el asesor ve al alumno; el administrador ve al estudiante
    const persona = data?.estudiante || data?.alumno;

    return (
        <>
            <Dialog
                open={Boolean(open)}
                onClose={onClose}
                fullScreen={esCelular}
                sx={{
                    '& .MuiPaper-root': esCelular
                        ? { borderRadius: 0 }
                        : {
                            width: '550px',
                            maxWidth: 'calc(100vw - 32px)',
                            height: '520px',
                            maxHeight: 'calc(100dvh - 32px)',
                            borderRadius: '12px',
                            p: 1
                        }
                }}
            >
                {/* Encabezado: materia y persona */}
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem', overflowWrap: 'anywhere' }}>
                    Material: {data?.materia || 'Asesoría'}
                    {persona && (
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', fontWeight: 'normal' }}>
                            Alumno: {persona}
                        </Typography>
                    )}
                </DialogTitle>

                <DialogContent dividers sx={{ overflowY: 'auto' }}>
                    {/* Primero los archivos que ya hay */}
                    {listaMateriales.length === 0 ? (
                        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                            No hay archivos disponibles.
                        </Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {listaMateriales.map((archivo) => (
                                <Box
                                    key={archivo.id_material}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        p: 1.25
                                    }}
                                >
                                    <Box sx={{ display: 'flex', flexShrink: 0 }}>{getFileIcon(archivo.mime_type)}</Box>

                                    {/* Nombre y tipo: el nombre largo se corta con "…" y no empuja los botones */}
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography noWrap title={archivo.nombre_archivo} sx={{ fontSize: '14.5px', fontWeight: 600 }}>
                                            {archivo.nombre_archivo}
                                        </Typography>
                                        <Typography noWrap sx={{ fontSize: '12px', color: 'text.secondary' }}>
                                            {etiquetaTipoArchivo(archivo)}
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                                        <Tooltip title="Descargar / Abrir">
                                            <IconButton
                                                component="a"
                                                href={archivo.url_archivo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                color="primary"
                                                size="small"
                                                aria-label="Descargar o abrir archivo"
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Eliminar archivo">
                                            <IconButton
                                                color="error"
                                                size="small"
                                                aria-label="Eliminar archivo"
                                                onClick={() => handleOpenConfirmEliminar(archivo)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Después, el botón para agregar más */}
                    <Button
                        component="label"
                        variant="outlined"
                        fullWidth
                        startIcon={<AddOutlinedIcon />}
                        sx={{
                            mt: 2,
                            minHeight: 44,
                            textTransform: 'none',
                            borderStyle: 'dashed',
                            borderRadius: '8px'
                        }}
                    >
                        Agregar archivos
                        <input type="file" hidden multiple onChange={handleFileUpload} />
                    </Button>
                </DialogContent>

                {/* Pie: dos botones del mismo ancho en celular */}
                <DialogActions
                    sx={{
                        p: 1.5,
                        gap: 1,
                        pb: esCelular ? 'calc(12px + env(safe-area-inset-bottom))' : 1.5,
                        '& > button': { flex: esCelular ? 1 : 'none', minHeight: 40 }
                    }}
                >
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cerrar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={!isModified}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <ModalConfirmarEliminarMaterial
                open={modalConfirmEliminarOpen}
                onClose={() => setModalConfirmEliminarOpen(false)}
                onConfirm={handleConfirmarEliminacion}
                nombreArchivo={archivoAEliminar?.nombre_archivo || ''}
            />
        </>
    );
}