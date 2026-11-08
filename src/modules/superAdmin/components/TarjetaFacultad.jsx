import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LoginIcon from '@mui/icons-material/Login';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from '@mui/material';

function Dato({ valor, etiqueta }) {
  return (
    <Box sx={{ textAlign: 'center', flex: 1 }}>
      <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#08338F' }}>{valor}</Typography>
      <Typography sx={{ fontSize: '12px', color: '#5F6368' }}>{etiqueta}</Typography>
    </Box>
  );
}

// Tarjeta de una facultad en el panel del super admin.
// Solo muestra; las acciones las maneja la vista.
export default function TarjetaFacultad({ facultad, onEntrar, onEditar, onCambiarEstado }) {
  const { nombre, siglas, activa, administradores, asesores, estudiantes, asesorias } = facultad;

  return (
    <Card
      sx={{
        width: '100%',
        background: '#FFFFFF',
        borderLeft: '20px solid',
        borderLeftColor: activa ? '#08338F' : '#9AA0A6',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.20)',
      }}
    >
      <CardContent sx={{ padding: '24px 24px 12px' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={siglas} size="small" sx={{ bgcolor: '#E8EEF9', color: '#08338F', fontWeight: 700 }} />
          <Chip
            label={activa ? 'ACTIVA' : 'INACTIVA'}
            size="small"
            sx={activa ? { bgcolor: '#E6F4EA', color: '#1B5E20' } : { bgcolor: '#F1F3F4', color: '#5F6368' }}
          />
        </Box>

        <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#000', lineHeight: 1.2, overflowWrap: 'anywhere', mb: 2 }}>
          {nombre}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Dato valor={administradores} etiqueta="Admins" />
          <Dato valor={asesores} etiqueta="Asesores" />
          <Dato valor={estudiantes} etiqueta="Estudiantes" />
          <Dato valor={asesorias} etiqueta="Asesorías" />
        </Box>
      </CardContent>

      <CardActions sx={{ padding: '0 24px 20px', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<LoginIcon />}
          onClick={() => onEntrar(facultad)}
          sx={{ textTransform: 'none', bgcolor: '#08338F' }}
        >
          Entrar al panel
        </Button>
        <Button variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => onEditar(facultad)} sx={{ textTransform: 'none' }}>
          Editar
        </Button>
        <Button
          variant="text"
          color={activa ? 'error' : 'success'}
          startIcon={<PowerSettingsNewIcon />}
          onClick={() => onCambiarEstado(facultad)}
          sx={{ textTransform: 'none' }}
        >
          {activa ? 'Desactivar' : 'Activar'}
        </Button>
      </CardActions>
    </Card>
  );
}
