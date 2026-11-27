import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box, Button } from '@mui/material';

import { MATERIAL_EXTENSIONES } from '../../../../../Services/materialAsesorService';

// En celular se piden por separado (igual que en Material): "application/*" abre el explorador de archivos
// y las fotos abren la galería. Los tipos permitidos se validan por extensión al elegir (validarEvidencias).
const ACCEPT_DOCUMENTOS = 'application/*';
const ACCEPT_FOTOS = 'image/jpeg,image/png';
const ACCEPT_TODO = MATERIAL_EXTENSIONES.map((e) => `.${e}`).join(',');

// Botón(es) para elegir archivos. onElegir(event) recibe el evento del input.
// Celular: tres botones (Documento, Foto de la galería y Cámara para tomarla al momento). Resto: uno solo.
export default function SelectorEvidencias({ onElegir, esCelular, deshabilitado = false, texto = 'Agregar evidencia' }) {
    const estilo = { textTransform: 'none', fontWeight: 600, borderRadius: '8px', minHeight: 36 };

    if (esCelular) {
        // Tres botones iguales con el ícono arriba y el texto abajo: caben aunque la tarjeta sea angosta
        const estiloCel = {
            ...estilo,
            minHeight: 56,
            minWidth: 0,
            px: 0.5,
            py: 1,
            flexDirection: 'column',
            gap: '2px',
            fontSize: '12px',
            lineHeight: 1.2,
            '& .MuiSvgIcon-root': { fontSize: 22 },
        };

        return (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1, width: '100%' }}>
                <Button component="label" variant="outlined" disabled={deshabilitado} sx={estiloCel}>
                    <InsertDriveFileOutlinedIcon />
                    Documento
                    <input type="file" hidden multiple accept={ACCEPT_DOCUMENTOS} onChange={onElegir} />
                </Button>
                <Button component="label" variant="outlined" disabled={deshabilitado} sx={estiloCel}>
                    <PhotoLibraryOutlinedIcon />
                    Galería
                    <input type="file" hidden multiple accept={ACCEPT_FOTOS} onChange={onElegir} />
                </Button>
                {/* capture abre la cámara directo; toma una foto por vez */}
                <Button component="label" variant="outlined" disabled={deshabilitado} sx={estiloCel}>
                    <PhotoCameraOutlinedIcon />
                    Cámara
                    <input type="file" hidden accept={ACCEPT_FOTOS} capture="environment" onChange={onElegir} />
                </Button>
            </Box>
        );
    }

    return (
        <Button component="label" variant="outlined" size="small" disabled={deshabilitado} startIcon={<AttachFileIcon />} sx={estilo}>
            {texto}
            <input type="file" hidden multiple accept={ACCEPT_TODO} onChange={onElegir} />
        </Button>
    );
}
