import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import {
    Avatar,
    Box,
    IconButton,
    Paper,
    Slide,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

// --- CHAT DEL ESTUDIANTE CON EL ASESOR ---
// Celular: pantalla completa, estilo WhatsApp (cabecera arriba, mensajes con scroll, barra para escribir abajo).
// Tablet / escritorio: ventana flotante anclada abajo a la derecha, sin fondo oscuro.
// Mensajes: { id, texto, propio } -> propio: true (mensajes del estudiante) va a la derecha en azul.

const COLOR_PRINCIPAL = '#08338F';

// Conversación de prueba (quítala cuando conectes el chat real)
const MENSAJES_DEMO = [
    { id: 1, texto: '¿Buenas tardes maestro, me podría mandar el link?', propio: true },
    { id: 2, texto: 'Buenas tardes, claro que si ahorita te lo mando', propio: false },
    { id: 3, texto: 'www.zoom.com/j/123456', propio: false },
    { id: 4, texto: 'Muchas gracias maestro', propio: true }
];

export default function ModalChatAsesoriaEstudiante({ open, onClose, data, onSendMessage, showToast }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState('');
    const panelRef = useRef(null);
    const listaRef = useRef(null);

    // Al cambiar de conversación se cargan sus mensajes (data.mensajes o la conversación de prueba)
    useEffect(() => {
        setMensajes(data?.mensajes ?? MENSAJES_DEMO);
        setTexto('');
    }, [data?.id]);

    // Baja al último mensaje al abrir el chat o al llegar/enviar un mensaje
    useEffect(() => {
        if (listaRef.current) {
            listaRef.current.scrollTop = listaRef.current.scrollHeight;
        }
    }, [mensajes, open]);

    // En celular el chat mide lo que realmente se ve (visualViewport): así, al salir el teclado,
    // la barra para escribir queda pegada encima del teclado y no tapada.
    useEffect(() => {
        const panel = panelRef.current;
        const vv = window.visualViewport;
        if (!open || !panel || !esCelular || !vv) return undefined;

        const ajustar = () => {
            panel.style.height = `${vv.height}px`;
            panel.style.top = `${vv.offsetTop}px`;
            if (listaRef.current) listaRef.current.scrollTop = listaRef.current.scrollHeight;
        };

        ajustar();
        vv.addEventListener('resize', ajustar);
        vv.addEventListener('scroll', ajustar);
        return () => {
            vv.removeEventListener('resize', ajustar);
            vv.removeEventListener('scroll', ajustar);
            panel.style.height = '';
            panel.style.top = '';
        };
    }, [open, esCelular]);

    const handleEnviar = async () => {
        const contenido = texto.trim();
        if (!contenido) return;

        const nuevoMensaje = { id: Date.now(), texto: contenido, propio: true };
        setMensajes((prev) => [...prev, nuevoMensaje]);
        setTexto('');

        try {
            if (onSendMessage) await onSendMessage(data, nuevoMensaje);
        } catch (error) {
            // Si falla el envío se quita el mensaje, se devuelve el texto al campo y se avisa con un toast
            setMensajes((prev) => prev.filter((mensaje) => mensaje.id !== nuevoMensaje.id));
            setTexto(contenido);
            if (showToast) showToast('No se pudo enviar el mensaje', 'error');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleEnviar();
        }
    };

    // En esta vista el estudiante chatea con el asesor
    const nombreAsesor = data?.asesor || data?.raw?.asesor_nombre || '';

    return (
        <Slide direction="up" in={Boolean(open)} mountOnEnter unmountOnExit>
            <Paper
                ref={panelRef}
                role="dialog"
                aria-label="Chat"
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
                {/* Encabezado */}
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

                    {esCelular && (
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#EBD9B4', color: '#8A6D2B', fontWeight: 'bold' }}>
                            {nombreAsesor ? nombreAsesor.charAt(0) : 'A'}
                        </Avatar>
                    )}

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography noWrap sx={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.2 }}>
                            {esCelular ? nombreAsesor || 'Chat' : 'Chat'}
                        </Typography>
                        {!esCelular && (
                            <Typography noWrap sx={{ fontSize: '12px', opacity: 0.85 }}>
                                {nombreAsesor}
                            </Typography>
                        )}
                    </Box>

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
                        gap: 1,
                        backgroundColor: esCelular ? '#F0F2F5' : '#ffffff'
                    }}
                >
                    {mensajes.length === 0 ? (
                        <Typography sx={{ color: '#666666', fontSize: '14px', textAlign: 'center', mt: 4 }}>
                            Aún no hay mensajes.
                        </Typography>
                    ) : (
                        mensajes.map((mensaje) => (
                            <Box
                                key={mensaje.id}
                                sx={{
                                    alignSelf: mensaje.propio ? 'flex-end' : 'flex-start',
                                    maxWidth: esCelular ? '80%' : '85%',
                                    px: 1.75,
                                    py: 1.1,
                                    borderRadius: '12px',
                                    backgroundColor: mensaje.propio ? COLOR_PRINCIPAL : '#ffffff',
                                    border: mensaje.propio ? 'none' : '1px solid #e6e6e6',
                                    color: mensaje.propio ? '#ffffff' : '#333333',
                                    fontSize: '14px',
                                    lineHeight: 1.4,
                                    wordBreak: 'break-word'
                                }}
                            >
                                {mensaje.texto}
                            </Box>
                        ))
                    )}
                </Box>

                {/* Barra para escribir (fija abajo) */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.5,
                        py: 1.25,
                        pb: esCelular ? 'calc(10px + env(safe-area-inset-bottom))' : 1.25,
                        borderTop: '1px solid #e0e0e0',
                        backgroundColor: '#ffffff',
                        flexShrink: 0
                    }}
                >
                    <TextField
                        autoFocus={!esCelular}
                        fullWidth
                        size="small"
                        placeholder="Escribe..."
                        autoComplete="off"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        onKeyDown={handleKeyDown}
                        slotProps={{
                            input: {
                                sx: {
                                    borderRadius: '999px',
                                    backgroundColor: '#F3F3F3',
                                    px: 1,
                                    '& fieldset': { border: 'none' }
                                }
                            }
                        }}
                    />
                    <IconButton
                        aria-label="Enviar mensaje"
                        onClick={handleEnviar}
                        disabled={!texto.trim()}
                        sx={{ color: COLOR_PRINCIPAL }}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Slide>
    );
}