import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
    Dialog,
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

// Ícono según el tipo de archivo
const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return <PictureAsPdfIcon color="error" />;
    return <InsertDriveFileIcon color="primary" />;
};

/**
 * Modal de material adicional de una asesoría (rol estudiante). Solo consulta y descarga.
 *
 * Props:
 *  - open, onClose
 *  - data: la asesoría. Lee data.material_adicional (o data.raw?.material_adicional):
 *          [{ id_material, nombre_archivo, mime_type, url_archivo }]
 */
export default function ModalMaterialEstudiante({ open, onClose, data }) {
    const listaMateriales = data?.material_adicional ?? data?.raw?.material_adicional ?? [];

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    width: '550px',
                    maxWidth: '90vw',
                    maxHeight: '90dvh',
                    borderRadius: '12px',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem', pr: 6 }}>
                Material: {data?.materia || 'Asesoría'}
                {data?.asesor && (
                    <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', fontWeight: 'normal' }}>
                        Asesor: {data.asesor}
                    </Typography>
                )}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ overflowY: 'auto', pb: 6 }}>
                {listaMateriales.length === 0 ? (
                    <Typography color="text.secondary" align="center" my={2}>
                        No hay archivos disponibles.
                    </Typography>
                ) : (
                    <List disablePadding>
                        {listaMateriales.map((archivo) => (
                            <ListItem
                                key={archivo.id_material}
                                sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    mb: 1,
                                    py: 0.5
                                }}
                                secondaryAction={
                                    <Tooltip title="Descargar / Abrir">
                                        <IconButton
                                            component="a"
                                            href={archivo.url_archivo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            color="primary"
                                            size="small"
                                        >
                                            <DownloadIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>{getFileIcon(archivo.mime_type)}</ListItemIcon>
                                <ListItemText
                                    primary={archivo.nombre_archivo}
                                    sx={{ pr: 4, wordBreak: 'break-word' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
}