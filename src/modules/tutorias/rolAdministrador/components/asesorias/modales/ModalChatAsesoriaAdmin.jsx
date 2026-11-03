import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
    Avatar,
    Box,
    Chip,
    IconButton,
    Paper,
    Slide,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

// --- CHAT DE UNA ASESORÍA, VISTO POR EL ADMINISTRADOR (SOLO LECTURA) ---
// Celular: pantalla completa. Tablet / escritorio: ventana flotante abajo a la derecha.
// No hay barra para escribir: el administrador solo puede leer la conversación.
// Mensajes: { id, texto, autor } -> autor: 'estudiante' (derecha, azul) o 'asesor' (izquierda, blanco).

const COLOR_PRINCIPAL = '#08338F';

// Conversación de prueba (quítala cuando conectes el chat real)
const MENSAJES_DEMO = [
    { id: 1, texto: '¿Buenas tardes maestro, me podría mandar el link?', autor: 'estudiante' },
    { id: 2, texto: 'Buenas tardes, claro que si ahorita te lo mando', autor: 'asesor' },
    { id: 3, texto: 'www.zoom.com/j/123456', autor: 'asesor' },
    { id: 4, texto: 'Muchas gracias maestro', autor: 'estudiante' }
];

export default function ModalChatAsesoriaAdmin({ open, onClose, data }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    const [mensajes, setMensajes] = useState([]);
    const listaRef = useRef(null);

    // Al cambiar de conversación se cargan sus mensajes (data.mensajes o la conversación de prueba)
    useEffect(() => {
        setMensajes(data?.mensajes ?? MENSAJES_DEMO);
    }, [data?.id, data?.mensajes]);

    // Baja al último mensaje al abrir el chat
    useEffect(() => {
        if (listaRef.current) {
            listaRef.current.scrollTop = listaRef.current.scrollHeight;
        }
    }, [mensajes, open]);

    const nombreEstudiante = data?.estudiante || data?.raw?.estudiante_nombre || 'Estudiante';
    const nombreAsesor = data?.asesor || data?.raw?.asesor_nombre || 'Asesor';

    return (
        <Slide direction="up" in={Boolean(open)} mountOnEnter unmountOnExit>
            <Paper
                role="dialog"
                aria-label="Chat de la asesoría"
                elevation={8}
                sx={{
                    position: 'fixed',
                    zIndex: (theme) => theme.zIndex.modal,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    // Celular: pantalla completa. Resto: ventana flotante abajo a la derecha.
                    ...(esCelular
                        ? { top: 0, left: 0, width: '100vw', height: '100dvh', borderRadius: 0 }
                        : {
                            bottom: 0,
                            right: 24,
                            width: 580,
                            maxWidth: 'calc(100vw - 48px)',
                            height: 620,
                            maxHeight: 'calc(100dvh - 32px)',
                            borderRadius: '12px 12px 0 0'
                        })
                }}
            >
                {/* Encabezado: quiénes conversan y aviso de solo lectura */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: esCelular ? 1 : 2,
                        py: 1.25,
                        backgroundColor: COLOR_PRINCIPAL,
                        color: '#ffffff',
                        flexShrink: 0
                    }}
                >
                    {esCelular && (
                        <IconButton aria-label="Volver" onClick={onClose} size="small" sx={{ color: 'inherit' }}>
                            <ArrowBackIcon />
                        </IconButton>
                    )}

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography noWrap sx={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.2 }}>
                            {data?.materia || 'Chat de la asesoría'}
                        </Typography>
                        <Typography noWrap sx={{ fontSize: '12px', opacity: 0.85 }}>
                            {nombreEstudiante} · {nombreAsesor}
                        </Typography>
                    </Box>

                    <Chip
                        size="small"
                        icon={<VisibilityOutlinedIcon sx={{ fontSize: 16, color: 'inherit !important' }} />}
                        label="Solo lectura"
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.18)',
                            color: '#ffffff',
                            fontWeight: 600,
                            flexShrink: 0
                        }}
                    />

                    {!esCelular && (
                        <IconButton aria-label="Cerrar chat" onClick={onClose} size="small" sx={{ color: 'inherit' }}>
                            <CloseIcon />
                        </IconButton>
                    )}
                </Box>

                {/* Mensajes: lo único que hace scroll */}
                <Box
                    ref={listaRef}
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        p: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.25,
                        backgroundColor: esCelular ? '#F0F2F5' : '#ffffff'
                    }}
                >
                    {mensajes.length === 0 ? (
                        <Typography sx={{ color: '#666666', fontSize: '14px', textAlign: 'center', mt: 4 }}>
                            Aún no hay mensajes.
                        </Typography>
                    ) : (
                        mensajes.map((mensaje) => {
                            const esEstudiante = mensaje.autor === 'estudiante';
                            const nombre = esEstudiante ? nombreEstudiante : nombreAsesor;

                            return (
                                <Box
                                    key={mensaje.id}
                                    sx={{
                                        alignSelf: esEstudiante ? 'flex-end' : 'flex-start',
                                        maxWidth: esCelular ? '80%' : '85%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: esEstudiante ? 'flex-end' : 'flex-start',
                                        gap: 0.25
                                    }}
                                >
                                    {/* Quién escribió el mensaje */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 0.5 }}>
                                        <Avatar
                                            sx={{
                                                width: 18,
                                                height: 18,
                                                fontSize: 11,
                                                fontWeight: 'bold',
                                                bgcolor: esEstudiante ? '#E8EEF9' : '#EBD9B4',
                                                color: esEstudiante ? COLOR_PRINCIPAL : '#8A6D2B'
                                            }}
                                        >
                                            {nombre.charAt(0)}
                                        </Avatar>
                                        <Typography noWrap sx={{ fontSize: '11.5px', fontWeight: 600, color: '#555555', maxWidth: 200 }}>
                                            {nombre} · {esEstudiante ? 'Estudiante' : 'Asesor'}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            px: 1.75,
                                            py: 1.1,
                                            borderRadius: '12px',
                                            backgroundColor: esEstudiante ? COLOR_PRINCIPAL : '#ffffff',
                                            border: esEstudiante ? 'none' : '1px solid #e6e6e6',
                                            color: esEstudiante ? '#ffffff' : '#333333',
                                            fontSize: '14px',
                                            lineHeight: 1.4,
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {mensaje.texto}
                                    </Box>
                                </Box>
                            );
                        })
                    )}
                </Box>

                {/* En lugar de la barra para escribir: aviso fijo abajo */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        px: 1.5,
                        py: 1.25,
                        pb: esCelular ? 'calc(10px + env(safe-area-inset-bottom))' : 1.25,
                        borderTop: '1px solid #e0e0e0',
                        backgroundColor: '#F7F8FA',
                        flexShrink: 0
                    }}
                >
                    <VisibilityOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                    <Typography sx={{ fontSize: '13px', color: '#6B7280', textAlign: 'center' }}>
                        Estás viendo esta conversación como administrador. No puedes enviar mensajes.
                    </Typography>
                </Box>
            </Paper>
        </Slide>
    );
}