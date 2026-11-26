// rolAdministrador/components/reportes/BotonExportar.jsx
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { ESTILO_BOTON_SECUNDARIO } from '../compartidos/estilosAdmin';

/**
 * Botón "Exportar" que al pulsarlo despliega las opciones Excel y PDF.
 * onExportar recibe 'excel' o 'pdf'. Con `exportando` muestra el spinner mientras se genera el archivo.
 */
export default function BotonExportar({ onExportar, disabled = false, exportando = false }) {
    const [ancla, setAncla] = useState(null);

    const elegir = (formato) => {
        setAncla(null);
        onExportar(formato);
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={exportando ? <CircularProgress size={16} color="inherit" /> : undefined}
                endIcon={exportando ? undefined : <KeyboardArrowDownIcon />}
                onClick={(e) => setAncla(e.currentTarget)}
                disabled={disabled || exportando}
                sx={{
                    ...ESTILO_BOTON_SECUNDARIO,
                    minHeight: 40,
                    flexShrink: 0,
                    width: { xs: '100%', lg: 'auto' }
                }}
            >
                {exportando ? 'Exportando...' : 'Exportar'}
            </Button>

            {/* El menú mide al menos lo mismo que el botón (en celular el botón ocupa todo el ancho) */}
            <Menu
                disableScrollLock
                anchorEl={ancla}
                open={Boolean(ancla)}
                onClose={() => setAncla(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{ paper: { sx: { mt: 0.5, borderRadius: '12px', border: '1px solid #E3E8F2', minWidth: Math.max(ancla?.offsetWidth ?? 0, 160) } } }}
            >
                <MenuItem onClick={() => elegir('excel')} sx={{ minHeight: 44 }}>
                    <ListItemIcon><TableChartOutlinedIcon fontSize="small" sx={{ color: '#1D7A46' }} /></ListItemIcon>
                    Excel
                </MenuItem>
                <MenuItem onClick={() => elegir('pdf')} sx={{ minHeight: 44 }}>
                    <ListItemIcon><PictureAsPdfOutlinedIcon fontSize="small" sx={{ color: '#C62828' }} /></ListItemIcon>
                    PDF
                </MenuItem>
            </Menu>
        </>
    );
}
