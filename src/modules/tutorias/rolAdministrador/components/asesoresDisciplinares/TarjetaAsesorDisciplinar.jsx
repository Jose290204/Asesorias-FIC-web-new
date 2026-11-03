import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

// Colores del chip de estado: verde para ACTIVO y gris para cualquier otro
const estiloEstado = (estado) =>
    String(estado).toUpperCase() === 'ACTIVO'
        ? { backgroundColor: '#E6F4EA', color: '#1B5E20' }
        : { backgroundColor: '#F1F3F4', color: '#5F6368' };

// Línea con ícono y texto (correo, teléfono, número de cuenta)
function LineaDato({ icono, texto }) {
    if (!texto) return null;

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Box sx={{ display: 'flex', color: '#08338F', mt: '1px', flexShrink: 0 }}>{icono}</Box>
            <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere', minWidth: 0 }}>
                {texto}
            </Typography>
        </Box>
    );
}

// Versión móvil de una fila de la tabla de asesores disciplinares.
// Mismo diseño que las demás tarjetas del admin: borde azul, datos y dos botones (Información y Eliminar).
// Solo muestra; las acciones las maneja quien la usa (TablaAsesoresDisciplinares).
export default function TarjetaAsesorDisciplinar({ row, onInfo, onEliminar }) {
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
                boxShadow: '0px 4px 12.3px rgba(0, 0, 0, 0.20)'
            }}
        >
            <CardContent sx={{ padding: '24px 24px 15px' }}>
                <Typography sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', marginBottom: '16px' }}>
                    {row.nombre}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <LineaDato icono={<MailOutlinedIcon sx={{ fontSize: 20 }} />} texto={row.correo} />
                    <LineaDato icono={<PhoneOutlinedIcon sx={{ fontSize: 20 }} />} texto={row.telefono} />
                    <LineaDato icono={<BadgeOutlinedIcon sx={{ fontSize: 20 }} />} texto={row.numeroCuenta} />

                    {/* Chips: estado e identificador */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mt: '4px' }}>
                        {row.estado && (
                            <Chip
                                size="small"
                                label={row.estado}
                                sx={{ ...estiloEstado(row.estado), fontWeight: 600 }}
                            />
                        )}
                        <Chip
                            size="small"
                            variant="outlined"
                            label={`Asesor #${row.id}`}
                            sx={{ borderColor: '#BDBDBD', color: '#555555', fontWeight: 600 }}
                        />
                    </Box>
                </Box>
            </CardContent>

            {/* Botones: dos columnas iguales; Información con borde y Eliminar con relleno */}
            <CardActions
                sx={{
                    padding: '0px 24px 20px 24px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    // CardActions mete margen izquierdo a los botones; aquí se anula por el grid
                    '& > :not(:first-of-type)': { marginLeft: 0 }
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
                        '&:hover': { borderColor: '#8A6D2B', backgroundColor: 'rgba(196, 158, 13, 0.08)' }
                    }}
                    startIcon={<InfoOutlinedIcon />}
                    onClick={(e) => onInfo(row, e)}
                >
                    Información
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    sx={{ minHeight: 40, color: '#ffffff', borderRadius: '5px', textTransform: 'none' }}
                    startIcon={<DeleteOutlinedIcon />}
                    onClick={(e) => onEliminar(row, e)}
                >
                    Eliminar
                </Button>
            </CardActions>
        </Card>
    );
}