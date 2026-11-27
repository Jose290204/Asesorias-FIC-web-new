import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
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
import { Fragment, useEffect, useRef, useState } from 'react';
import TextoConEnlaces from '../../../../../components/ui/TextoConEnlaces';
import useChatAsesoria from '../../../../../hooks/useChatAsesoria';

// --- CHAT DEL ESTUDIANTE CON EL ASESOR ---
// Celular: pantalla completa, estilo WhatsApp (cabecera arriba, mensajes con scroll, barra para escribir abajo).
// Tablet / escritorio: ventana flotante anclada abajo a la derecha, sin fondo oscuro.
// Mensajes: { id, texto, propio } -> propio: true (mensajes del estudiante) va a la derecha en azul.

// Hora del mensaje ("1:48 p.m."); el día va aparte, en el separador de la conversación
const formatearHora = (iso) =>
    iso ? new Date(iso).toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' }) : '';

// Etiqueta del separador de día: "Hoy", "Ayer" o "8 nov" (con el año si no es el actual)
const etiquetaDiaChat = (iso) => {
    const fecha = new Date(iso);
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);
    if (fecha.toDateString() === hoy.toDateString()) return 'Hoy';
    if (fecha.toDateString() === ayer.toDateString()) return 'Ayer';
    const opciones = { day: 'numeric', month: 'short' };
    if (fecha.getFullYear() !== hoy.getFullYear()) opciones.year = 'numeric';
    return fecha.toLocaleDateString('es-MX', opciones).replace('.', '');
};

// Dos fechas ISO caen en el mismo día (hora local del dispositivo)
const mismoDia = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

export default function ModalChatAsesoriaEstudiante({ open, onClose, data, showToast }) {
    const esCelular = useMediaQuery('(max-width:599.95px)');
    const [texto, setTexto] = useState('');
    const panelRef = useRef(null);
    const listaRef = useRef(null);

    // Mensajes reales: carga inicial, consulta periódica y envío (ver hooks/useChatAsesoria.js)
    const enCurso = data?.estatus === 'en_curso';
    const { mensajes, cargando, errorCarga, leidosHasta, enviar } = useChatAsesoria({
        asesoriaId: data?.id,
        abierto: Boolean(open),
        enCurso,
        showToast
    });

    // Al cambiar de conversación se limpia lo que estaba escrito
    useEffect(() => {
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

        setTexto('');
        // Si falla, el hook quita el mensaje y avisa con un toast; aquí se devuelve el texto al campo
        const enviado = await enviar(contenido);
        if (!enviado) setTexto(contenido);
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
                            borderRadius: '14px 14px 0 0'
                        })
                }}
            >
                {/* Encabezado: mismo degradado y filo dorado que la cabecera de la app */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        px: esCelular ? 1 : 2,
                        py: 1.25,
                        background: 'linear-gradient(180deg, #2a529b 0%, #244B91 55%, #162f66 100%)',
                        borderBottom: '2px solid #d4b03c',
                        color: '#ffffff',
                        flexShrink: 0
                    }}
                >
                    {esCelular && (
                        <IconButton aria-label="Volver" onClick={onClose} size="small" sx={{ color: 'inherit' }}>
                            <ArrowBackIcon />
                        </IconButton>
                    )}

                    <Avatar sx={{ width: 40, height: 40, bgcolor: '#EBD9B4', color: '#8A6D2B', fontWeight: 'bold', boxShadow: '0 0 0 2px rgba(255,255,255,0.35)' }}>
                        {nombreAsesor ? nombreAsesor.charAt(0).toUpperCase() : 'A'}
                    </Avatar>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography noWrap sx={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.2 }}>
                            {nombreAsesor || 'Chat'}
                        </Typography>
                        <Typography noWrap sx={{ fontSize: '12px', opacity: 0.85 }}>
                            {data?.materia || 'Chat de la asesoría'}
                            {!enCurso && ' · Finalizada'}
                        </Typography>
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
                        px: { xs: 1.5, sm: 2 },
                        py: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.75,
                        background: 'linear-gradient(180deg, #EEF2F9 0%, #E6ECF6 100%)'
                    }}
                >
                    {cargando || errorCarga || mensajes.length === 0 ? (
                        <Box sx={{ m: 'auto', textAlign: 'center', px: 3, color: errorCarga ? '#B42318' : '#6B7280' }}>
                            {!cargando && !errorCarga && (
                                <ChatBubbleOutlinedIcon sx={{ fontSize: 44, color: '#08338F', opacity: 0.25, mb: 1 }} />
                            )}
                            <Typography sx={{ fontSize: '14px', color: 'inherit' }}>
                                {cargando
                                    ? 'Cargando mensajes...'
                                    : errorCarga || (enCurso ? 'Aún no hay mensajes. Escribe el primero.' : 'No hubo mensajes en esta asesoría.')}
                            </Typography>
                        </Box>
                    ) : (
                        mensajes.map((mensaje, i) => {
                            // Separador cuando cambia el día (el primer mensaje siempre lo lleva)
                            const nuevoDia =
                                mensaje.fecha && (i === 0 || !mensajes[i - 1].fecha || !mismoDia(mensajes[i - 1].fecha, mensaje.fecha));

                            return (
                                <Fragment key={mensaje.id}>
                                    {nuevoDia && (
                                        <Box
                                            sx={{
                                                alignSelf: 'center',
                                                my: 0.75,
                                                px: 1.5,
                                                py: 0.4,
                                                borderRadius: '999px',
                                                backgroundColor: 'rgba(8, 51, 143, 0.10)',
                                                color: '#08338F',
                                                fontSize: '12px',
                                                fontWeight: 600
                                            }}
                                        >
                                            {etiquetaDiaChat(mensaje.fecha)}
                                        </Box>
                                    )}

                                    <Box
                                        sx={{
                                            alignSelf: mensaje.propio ? 'flex-end' : 'flex-start',
                                            maxWidth: esCelular ? '82%' : '80%',
                                            px: 1.75,
                                            pt: 1.1,
                                            pb: 0.9,
                                            // Esquina "de cola" hacia quien lo dijo, como en WhatsApp
                                            borderRadius: mensaje.propio ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                            background: mensaje.propio
                                                ? 'linear-gradient(135deg, #2a529b 0%, #08338F 100%)'
                                                : '#ffffff',
                                            border: mensaje.propio ? 'none' : '1px solid #E3E8F0',
                                            boxShadow: '0 1px 2px rgba(16, 24, 40, 0.10)',
                                            color: mensaje.propio ? '#ffffff' : '#1F2937',
                                            fontSize: '14px',
                                            lineHeight: 1.45,
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        <TextoConEnlaces texto={mensaje.texto} propio={mensaje.propio} />
                                        {/* Hora; en los mensajes propios, una palomita (enviado) o dos azules (leído) */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                                gap: 0.5,
                                                mt: 0.5,
                                                fontSize: '11px',
                                                lineHeight: 1,
                                                opacity: mensaje.propio ? 0.85 : 0.6
                                            }}
                                        >
                                            {formatearHora(mensaje.fecha)}
                                            {/* Como WhatsApp: ✓ enviando · ✓✓ gris llegó al servidor · ✓✓ azul ya lo leyeron */}
                                            {mensaje.propio &&
                                                (typeof mensaje.id !== 'number' ? (
                                                    <DoneIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
                                                ) : mensaje.id <= leidosHasta ? (
                                                    <DoneAllIcon sx={{ fontSize: 16, color: '#7FD0FF' }} />
                                                ) : (
                                                    <DoneAllIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
                                                ))}
                                        </Box>
                                    </Box>
                                </Fragment>
                            );
                        })
                    )}
                </Box>

                {/* Barra para escribir (fija abajo) */}
                {enCurso ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 1.5,
                            py: 1.25,
                            pb: esCelular ? 'calc(10px + env(safe-area-inset-bottom))' : 1.25,
                            borderTop: '1px solid #DDE3EC',
                            backgroundColor: '#ffffff',
                            flexShrink: 0
                        }}
                    >
                        <TextField
                            autoFocus={!esCelular}
                            fullWidth
                            size="small"
                            placeholder="Escribe un mensaje..."
                            autoComplete="off"
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                            onKeyDown={handleKeyDown}
                            slotProps={{
                                input: {
                                    sx: {
                                        borderRadius: '999px',
                                        backgroundColor: '#F1F4F9',
                                        px: 1.5,
                                        '& fieldset': { border: '1px solid transparent', transition: 'border-color .15s' },
                                        '&:hover fieldset': { borderColor: '#C9D3E3' },
                                        '&.Mui-focused fieldset': { borderColor: '#08338F !important', borderWidth: '1px !important' }
                                    }
                                }
                            }}
                        />
                        <IconButton
                            aria-label="Enviar mensaje"
                            onClick={handleEnviar}
                            disabled={!texto.trim()}
                            sx={{
                                width: 42,
                                height: 42,
                                flexShrink: 0,
                                color: '#ffffff',
                                background: 'linear-gradient(135deg, #2a529b 0%, #08338F 100%)',
                                boxShadow: '0 2px 6px rgba(8, 51, 143, 0.35)',
                                '&:hover': { background: 'linear-gradient(135deg, #1B3A73 0%, #08338F 100%)' },
                                '&.Mui-disabled': { color: '#ffffff', background: '#C5CCD8', boxShadow: 'none' }
                            }}
                        >
                            <SendIcon sx={{ fontSize: 20, ml: '2px' }} />
                        </IconButton>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            px: 1.5,
                            py: 1.25,
                            pb: esCelular ? 'calc(10px + env(safe-area-inset-bottom))' : 1.25,
                            borderTop: '1px solid #DDE3EC',
                            backgroundColor: '#ffffff',
                            textAlign: 'center',
                            flexShrink: 0
                        }}
                    >
                        <Typography sx={{ color: '#666666', fontSize: '13px' }}>
                            Esta asesoría ya terminó. El chat es solo de lectura.
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Slide>
    );
}