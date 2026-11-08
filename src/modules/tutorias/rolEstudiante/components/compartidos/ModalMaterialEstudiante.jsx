import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
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
    Tooltip,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

import { mensajesDeError } from '../../../../../Services/errores';
import { descargarMaterial, traerMaterial } from '../../../../../Services/materialAsesorService';
import useMediaQuery from '@mui/material/useMediaQuery';

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

// Material de una asesoría para el estudiante: solo consulta y descarga (el asesor es quien sube y borra).
// data es la asesoría (usa data.id).
export default function ModalMaterialEstudiante({ open, onClose, data, showToast }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    const [lista, setLista] = useState([]);
    // Id de la asesoría cuya lista ya llegó (sirve para saber si todavía se está cargando)
    const [cargadoDe, setCargadoDe] = useState(null);

    const asesoriaId = data?.id;
    const cargando = Boolean(open && asesoriaId && cargadoDe !== asesoriaId);

    // Carga el material cada vez que se abre el modal
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

    // El endpoint exige sesión: el archivo se baja como blob y se guarda con su nombre original
    const handleDescargar = async (archivo) => {
        try {
            await descargarMaterial(archivo.id, archivo.nombre);
        } catch (error) {
            showToast?.(mensajesDeError(error)[0], 'error');
        }
    };

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullScreen={esCelular}
            sx={{
                '& .MuiPaper-root': esCelular ? { borderRadius: 0 } : {
                    width: '550px',
                    maxWidth: '90vw',
                    height: '480px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                Material: {data?.materia || 'Asesoría'}
                {data?.asesor && (
                    <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', fontWeight: 'normal' }}>
                        Asesor: {data.asesor}
                    </Typography>
                )}
            </DialogTitle>

            <DialogContent dividers sx={{ overflowY: 'auto' }}>
                {cargando ? (
                    <Box className="flex justify-center py-6"><CircularProgress size={28} /></Box>
                ) : lista.length === 0 ? (
                    <Typography color="text.secondary" align="center" mt={2} mb={2}>
                        Tu asesor todavía no ha subido material.
                    </Typography>
                ) : (
                    <List disablePadding sx={{ mb: 2 }}>
                        {lista.map((archivo) => (
                            <ListItem
                                key={archivo.id}
                                sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', mb: 1, py: 0.5 }}
                                secondaryAction={
                                    <Tooltip title="Descargar">
                                        <IconButton color="primary" size="small" onClick={() => handleDescargar(archivo)}>
                                            <DownloadIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                            >
                                <ListItemIcon>{getFileIcon(archivo.tipo)}</ListItemIcon>
                                <ListItemText
                                    primary={archivo.nombre}
                                    secondary={formatearTamano(archivo.tamano)}
                                    sx={{ pr: 6 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 1.5 }}>
                <Button variant="outlined" color="secondary" onClick={onClose}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
