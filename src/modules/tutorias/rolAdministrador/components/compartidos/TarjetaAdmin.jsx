import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// Línea con ícono, etiqueta en negritas y valor. Si no hay valor, no se muestra.
function LineaDato({ icono, etiqueta, children }) {
    if (!children) return null;

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Box sx={{ display: 'flex', color: '#08338F', mt: '1px', flexShrink: 0 }}>{icono}</Box>
            <Typography sx={{ fontSize: '15px', color: '#333333', overflowWrap: 'anywhere', minWidth: 0 }}>
                <span className="font-bold">{etiqueta}: </span>
                {children}
            </Typography>
        </Box>
    );
}

// Tarjeta base del administrador (versión móvil de las filas de las tablas).
//  - franja: color de la franja de arriba (el del estatus, o azul si no hay)
//  - titulo: lo principal (materia, nombre...)
//  - pastilla: { label, color, fondo } del estatus (opcional)
//  - onInfo: si se pasa, muestra el botón de información arriba a la derecha
//  - encabezadoDerecha: otro control arriba a la derecha (por ejemplo un menú ⋮) en lugar del de información
//  - lineas: [{ icono, etiqueta, valor }] solo lo esencial; el resto va en el modal de información
//  - acciones: botones de abajo (opcional), en dos columnas iguales
export default function TarjetaAdmin({ franja = '#08338F', titulo, subtitulo, pastilla, onInfo, encabezadoDerecha, lineas = [], acciones }) {
    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: '400px',
                height: '100%',
                background: '#FFFFFF',
                border: '1px solid #E3E8F2',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0px 2px 10px rgba(8, 51, 143, 0.08)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0px 10px 24px rgba(8, 51, 143, 0.16)'
                }
            }}
        >
            <Box sx={{ height: '5px', backgroundColor: franja }} />

            <Box
                sx={{
                    padding: '16px 22px',
                    background: 'linear-gradient(180deg, #F4F7FD 0%, #FFFFFF 100%)',
                    borderBottom: '1px solid #EEF1F7'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            title={titulo}
                            sx={{ fontSize: '18px', fontWeight: '700', color: '#000000', lineHeight: 1.2, overflowWrap: 'anywhere', pt: '2px' }}
                        >
                            {titulo}
                        </Typography>
                        {subtitulo && (
                            <Typography sx={{ fontSize: '13px', color: '#6A6A6A', mt: '3px', overflowWrap: 'anywhere' }}>
                                {subtitulo}
                            </Typography>
                        )}
                    </Box>

                    {encabezadoDerecha}

                    {onInfo && (
                        <Tooltip title="Información">
                            <IconButton
                                size="small"
                                aria-label="Ver información"
                                onClick={onInfo}
                                sx={{ flexShrink: 0, mr: '-8px', mt: '-4px', color: '#08338F' }}
                            >
                                <InfoOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                {pastilla && (
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            mt: '10px',
                            px: '10px',
                            py: '2px',
                            borderRadius: '999px',
                            border: `1px solid ${pastilla.color}`,
                            backgroundColor: pastilla.fondo ?? '#FFFFFF'
                        }}
                    >
                        <FiberManualRecordIcon sx={{ fontSize: 12, color: pastilla.color }} />
                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: pastilla.color, lineHeight: 1.4 }}>
                            {pastilla.label}
                        </Typography>
                    </Box>
                )}
            </Box>

            <CardContent sx={{ flex: 1, padding: '18px 22px 12px 22px', '&:last-child': { paddingBottom: '12px' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {lineas.map((l) => (
                        <LineaDato key={l.etiqueta} icono={l.icono} etiqueta={l.etiqueta}>{l.valor}</LineaDato>
                    ))}
                </Box>
            </CardContent>

            {acciones && (
                <CardActions
                    sx={{
                        padding: '6px 22px 20px 22px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        // CardActions mete margen izquierdo a los botones; aquí lo anulamos por el grid
                        '& > :not(:first-of-type)': { marginLeft: 0 }
                    }}
                >
                    {acciones}
                </CardActions>
            )}
        </Card>
    );
}
