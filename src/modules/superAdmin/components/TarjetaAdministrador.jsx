import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from '@mui/material';

const estiloEstatus = {
  activo: { backgroundColor: '#E6F4EA', color: '#1B5E20' },
  pendiente: { backgroundColor: '#FFF4E0', color: '#8A5A00' },
  inactivo: { backgroundColor: '#F1F3F4', color: '#5F6368' },
};

// Versión móvil de una fila de la tabla de administradores.
// Mismo diseño que las demás tarjetas del admin: borde azul, datos y tres botones:
// Editar y Desactivar/Activar en dos columnas, y Eliminar a todo lo ancho debajo.
// Solo muestra; las acciones las maneja quien la usa (la vista).
export default function TarjetaAdministrador({ administrador, siglasFacultad, onEditar, onCambiarEstado, onEliminar }) {
  const { id, nombreCompleto, correo, estatus } = administrador;
  const inactivo = estatus === 'inactivo';

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: '400px',
        background: '#FFFFFF',
        borderLeft: '20px solid #08338F',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.20)',
      }}
    >
      <CardContent sx={{ padding: '24px 24px 15px' }}>
        <Typography sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', marginBottom: '16px' }}>
          {nombreCompleto}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Box sx={{ display: 'flex', color: '#08338F', mt: '1px', flexShrink: 0 }}>
              <MailOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere', minWidth: 0 }}>
              {correo}
            </Typography>
          </Box>

          {/* Chips: facultad, estado e identificador */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mt: '4px' }}>
            <Chip size="small" label={siglasFacultad} sx={{ backgroundColor: '#E8EEF9', color: '#08338F', fontWeight: 600 }} />
            <Chip size="small" label={estatus.toUpperCase()} sx={{ ...estiloEstatus[estatus], fontWeight: 600 }} />
            <Chip
              size="small"
              variant="outlined"
              label={`Administrador #${id}`}
              sx={{ borderColor: '#BDBDBD', color: '#555555', fontWeight: 600 }}
            />
          </Box>
        </Box>
      </CardContent>

      {/* Botones: dos columnas iguales (Editar con borde, Desactivar/Activar con relleno) y Eliminar debajo */}
      <CardActions
        sx={{
          padding: '0px 24px 20px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          '& > :not(:first-of-type)': { marginLeft: 0 },
        }}
      >
        <Button
          variant="outlined"
          sx={{
            minHeight: 40,
            color: '#8A6D2B',
            borderColor: '#C49E0D',
            borderRadius: '5px',
            textTransform: 'none',
            '&:hover': { borderColor: '#8A6D2B', backgroundColor: 'rgba(196, 158, 13, 0.08)' },
          }}
          startIcon={<EditOutlinedIcon />}
          onClick={() => onEditar(administrador)}
        >
          Editar
        </Button>
        {/* Verde = activo (botón Desactivar); rojo = inactivo (botón Activar) */}
        <Button
          variant="contained"
          color={inactivo ? 'error' : 'success'}
          sx={{ minHeight: 40, color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
          startIcon={<PowerSettingsNewIcon />}
          onClick={() => onCambiarEstado(administrador)}
        >
          {inactivo ? 'Activar' : 'Desactivar'}
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ gridColumn: '1 / -1', minHeight: 40, borderRadius: '5px', textTransform: 'none' }}
          startIcon={<DeleteOutlinedIcon />}
          onClick={() => onEliminar(administrador)}
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
}
