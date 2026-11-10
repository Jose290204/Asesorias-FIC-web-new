import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import ChipAccion from './ChipAccion';

// Versión móvil de una fila de la bitácora. Solo muestra.
export default function TarjetaBitacora({ registro, siglasFacultad, fecha }) {
  const { accion, entidad, detalle, usuario, ip } = registro;

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: '400px',
        background: '#FFFFFF',
        borderLeft: '20px solid #08338F',
        borderRadius: '5px',
        boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.20)',
      }}
    >
      <CardContent sx={{ padding: '20px 24px !important' }}>
        <Box sx={{ mb: 1 }}><ChipAccion accion={accion} /></Box>

        <Typography sx={{ fontSize: '17px', fontWeight: 700, color: '#000', lineHeight: 1.2, overflowWrap: 'anywhere' }}>
          {entidad}
        </Typography>
        {detalle && (
          <Typography sx={{ fontSize: '14px', color: '#555', mt: 0.5, overflowWrap: 'anywhere' }}>{detalle}</Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', mt: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
            <PersonOutlinedIcon sx={{ fontSize: 18, color: '#08338F' }} />
            <Typography sx={{ fontSize: '14px' }}>{usuario}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
            <AccessTimeIcon sx={{ fontSize: 18, color: '#08338F' }} />
            <Typography sx={{ fontSize: '14px' }}>{fecha}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mt: 1.5 }}>
          {siglasFacultad && <Chip size="small" label={siglasFacultad} sx={{ backgroundColor: '#E8EEF9', color: '#08338F', fontWeight: 600 }} />}
          {ip && <Chip size="small" variant="outlined" label={`IP ${ip}`} sx={{ borderColor: '#BDBDBD', color: '#555', fontWeight: 600 }} />}
        </Box>
      </CardContent>
    </Card>
  );
}
