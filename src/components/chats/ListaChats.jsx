import DoneAllIcon from '@mui/icons-material/DoneAll';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { Avatar, Badge, Box, ButtonBase, Typography } from '@mui/material';

// Hora si el mensaje es de hoy, "Ayer", o la fecha corta (como la lista de WhatsApp)
const etiquetaHora = (iso) => {
    if (!iso) return '';
    const fecha = new Date(iso);
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    if (fecha.toDateString() === hoy.toDateString()) {
        return fecha.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });
    }
    if (fecha.toDateString() === ayer.toDateString()) return 'Ayer';
    return fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

// Lista de conversaciones: una tarjeta por asesoría. La usan el asesor y el estudiante.
// Arriba: nombre de la otra persona y la hora del último mensaje. Luego la materia y el inicio.
// Abajo: el último mensaje y, a la derecha, el globito con los mensajes sin leer.
// Una conversación con mensajes sin leer lleva una franja azul a la izquierda y el texto más marcado.
// campoNombre: qué campo trae el nombre de la otra persona ('estudiante' para el asesor, 'asesor' para el estudiante).
// onAbrir(asesoria) abre el chat.
export default function ListaChats({ asesorias = [], onAbrir, campoNombre = 'estudiante' }) {
    return (
        <Box
            component="ul"
            sx={{
                listStyle: 'none',
                m: 0,
                p: 0,
                width: '100%',
                maxWidth: '760px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}
        >
            {asesorias.map((asesoria) => {
                const sinLeer = asesoria.mensajes_sin_leer > 0;
                const ultimo = asesoria.ultimo_mensaje;

                return (
                    <li key={asesoria.id}>
                        <ButtonBase
                            onClick={(e) => onAbrir(asesoria, e)}
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: '14px',
                                textAlign: 'left',
                                px: { xs: 2, sm: 2.5 },
                                py: '14px',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E3E8F2',
                                borderLeft: `4px solid ${sinLeer ? '#08338F' : '#E3E8F2'}`,
                                borderRadius: '16px',
                                boxShadow: '0px 2px 10px rgba(8, 51, 143, 0.08)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0px 8px 20px rgba(8, 51, 143, 0.14)'
                                }
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 52,
                                    height: 52,
                                    bgcolor: '#EBD9B4',
                                    color: '#8A6D2B',
                                    fontSize: '22px',
                                    fontWeight: 'bold',
                                    border: '3px solid #FFFFFF',
                                    boxShadow: '0 0 0 2px #D9C48F',
                                    flexShrink: 0
                                }}
                            >
                                {(asesoria[campoNombre] || '?').charAt(0).toUpperCase()}
                            </Avatar>

                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                {/* Nombre y hora del último mensaje */}
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                    <Typography
                                        noWrap
                                        sx={{ flex: 1, fontSize: '16px', fontWeight: sinLeer ? 800 : 700, color: '#111827' }}
                                    >
                                        {asesoria[campoNombre]}
                                    </Typography>
                                    {ultimo && (
                                        <Typography
                                            sx={{
                                                flexShrink: 0,
                                                fontSize: '12px',
                                                fontWeight: sinLeer ? 700 : 400,
                                                color: sinLeer ? '#08338F' : '#6B7280'
                                            }}
                                        >
                                            {etiquetaHora(ultimo.fecha)}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Materia (etiqueta) e inicio de la asesoría */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: '4px', minWidth: 0 }}>
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            minWidth: 0,
                                            px: '8px',
                                            py: '1px',
                                            borderRadius: '999px',
                                            backgroundColor: '#EEF3FB',
                                            color: '#08338F'
                                        }}
                                    >
                                        <MenuBookOutlinedIcon sx={{ fontSize: 14, flexShrink: 0 }} />
                                        <Typography noWrap sx={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.6 }}>
                                            {asesoria.materia}
                                        </Typography>
                                    </Box>
                                    <Typography noWrap sx={{ fontSize: '12px', color: '#6B7280', flexShrink: 0 }}>
                                        Inicio: {asesoria.fecha_inicio_formateada}
                                    </Typography>
                                </Box>

                                {/* Último mensaje (con palomitas si lo escribió el usuario) y globito de sin leer */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '6px' }}>
                                    <Typography
                                        noWrap
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '14px',
                                            fontWeight: sinLeer ? 600 : 400,
                                            color: sinLeer ? '#111827' : '#4B5563'
                                        }}
                                    >
                                        {ultimo ? (
                                            <>
                                                {ultimo.propio && <DoneAllIcon sx={{ fontSize: 16, color: '#9CA3AF', flexShrink: 0 }} />}
                                                <span className="truncate">{ultimo.texto}</span>
                                            </>
                                        ) : (
                                            <span className="italic text-gray-400">Aún no hay mensajes</span>
                                        )}
                                    </Typography>

                                    {sinLeer && (
                                        <Badge
                                            badgeContent={asesoria.mensajes_sin_leer}
                                            max={99}
                                            color="primary"
                                            sx={{
                                                flexShrink: 0,
                                                mr: 1.5,
                                                '& .MuiBadge-badge': {
                                                    position: 'static',
                                                    transform: 'none',
                                                    backgroundColor: '#08338F'
                                                }
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </ButtonBase>
                    </li>
                );
            })}
        </Box>
    );
}
