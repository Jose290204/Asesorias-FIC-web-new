import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
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
    Tooltip,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

import { mensajesDeError } from '../../../../../Services/errores';
import { descargarMaterial, traerMaterial } from '../../../../../Services/materialAsesorService';
import useMediaQuery from '@mui/material/useMediaQuery';

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
                    minHeight: '380px',
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
                        {data?.asesor && ` · Asesor: ${data.asesor}`}
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
                {cargando ? (
                    <Box className="flex justify-center py-6"><CircularProgress size={28} /></Box>
                ) : lista.length === 0 ? (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', textAlign: 'center', py: 4 }}>
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
                            Tu asesor todavía no ha subido material.
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
                                        {formatearTamano(archivo.tamano)}
                                    </Typography>
                                </Box>

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
    );
}
