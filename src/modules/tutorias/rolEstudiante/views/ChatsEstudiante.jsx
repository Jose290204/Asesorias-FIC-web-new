import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InputBuscar from '../../../../components/ui/InputBuscar';
import ToastNotification from '../../../../components/ui/ToastNotification';
import TituloVista from '../../../../components/ui/TituloVista';
import { encontrarAsesoriaEnCurso, traerAsesorias } from '../../../../Services/asesoriasEstudianteService';
import { mensajesDeError } from '../../../../Services/errores';
import ListaChats from '../../../../components/chats/ListaChats';
import ModalChatAsesoriaEstudiante from '../components/compartidos/ModalChatAsesoriaEstudiante';

// Chats del estudiante: una conversación por cada asesoría en curso.
// Al tocar una se abre el mismo modal de chat que ya se usa en "Asesorías en curso".
export default function ChatsEstudiante() {
    const location = useLocation();
    const navigate = useNavigate();
    // Lo que se escribe en el buscador, y el texto que ya se mandó a la API (con una pausa al escribir)
    const [busqueda, setBusqueda] = useState('');
    const [buscar, setBuscar] = useState('');

    // La API pagina de 10 en 10
    const [pagina, setPagina] = useState(1);
    const [meta, setMeta] = useState(null);

    const [asesorias, setAsesorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [chatAbierto, setChatAbierto] = useState(false);
    const [seleccionada, setSeleccionada] = useState(null);

    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });
    const showToast = useCallback((message, type = 'info') => {
        setToast({ open: true, message, type });
    }, []);

    // Al dejar de escribir 400 ms se busca en la API y se vuelve a la página 1
    useEffect(() => {
        const temporizador = setTimeout(() => {
            setBuscar(busqueda.trim());
            setPagina(1);
        }, 400);
        return () => clearTimeout(temporizador);
    }, [busqueda]);

    // silencioso = recarga sin quitar la lista (la usa el refresco automático)
    const cargar = useCallback(async ({ silencioso = false } = {}) => {
        try {
            if (!silencioso) setLoading(true);
            setError(false);

            const { asesorias: lista, meta: metaNueva } = await traerAsesorias({ estatus: 'en_curso', buscar, page: pagina, orden: 'mensaje' });

            if (lista.length === 0 && pagina > 1) {
                setPagina(pagina - 1);
                return;
            }

            setAsesorias(lista);
            setMeta(metaNueva);
        } catch (err) {
            console.error('Error al cargar chats', err);
            if (!silencioso) {
                setError(true);
                showToast(mensajesDeError(err)[0], 'error');
            }
        } finally {
            setLoading(false);
        }
    }, [buscar, pagina, showToast]);

    useEffect(() => {
        cargar();
    }, [cargar]);

    // Cada 20 s se refresca la lista (solo con la pestaña a la vista): los globitos se actualizan solos
    useEffect(() => {
        const intervalo = setInterval(() => {
            if (!document.hidden) cargar({ silencioso: true });
        }, 20000);
        return () => clearInterval(intervalo);
    }, [cargar]);

    // Si se llega desde el aviso de un mensaje, se abre esa conversación.
    // El estado de la navegación se limpia para que al recargar la página no se vuelva a abrir.
    useEffect(() => {
        const id = Number(location.state?.abrirChat);
        if (!id) return;

        navigate(location.pathname, { replace: true, state: null });

        encontrarAsesoriaEnCurso(id)
            .then((asesoria) => {
                if (asesoria) {
                    setSeleccionada(asesoria);
                    setChatAbierto(true);
                    setAsesorias((prev) => prev.map((a) => (a.id === asesoria.id ? { ...a, mensajes_sin_leer: 0 } : a)));
                } else {
                    showToast('Esa conversación ya no está disponible.', 'info');
                }
            })
            .catch(() => showToast('No se pudo abrir la conversación.', 'error'));
    }, [location.state, location.pathname, navigate, showToast]);

    // Lo que se ve en el chat queda leído: se quita el globito de esa conversación
    const marcarLeido = (id) =>
        setAsesorias((prev) => prev.map((a) => (a.id === id ? { ...a, mensajes_sin_leer: 0 } : a)));

    const handleAbrir = (asesoria, event) => {
        event?.currentTarget?.blur();
        setSeleccionada(asesoria);
        setChatAbierto(true);
        marcarLeido(asesoria.id);
    };

    const handleCerrar = () => {
        setChatAbierto(false);
        marcarLeido(seleccionada?.id);
    };

    const total = meta?.total ?? asesorias.length;

    return (
        <div className="min-h-[calc(100dvh-3.5rem)] w-full bg-transparent px-4 py-8 md:px-17 md:py-10 flex flex-col items-start gap-6 md:gap-8">
            <TituloVista
                titulo="Chats"
                subtitulo={!loading && !error ? `${total} ${total === 1 ? 'conversación' : 'conversaciones'}${buscar ? ' encontradas' : ''}` : null}
            />

            <div className="w-full">
                <InputBuscar
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por materia o asesor..."
                />
            </div>

            <div className="w-full flex flex-1 flex-col pb-5">
                {loading ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <CircularProgress sx={{ color: '#244B91' }} />
                        <p className="text-sm text-gray-600">Cargando chats...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-20">
                        <p className="text-sm text-gray-600">No se pudieron cargar los chats.</p>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => cargar()}
                            sx={{ textTransform: 'none', borderRadius: '5px', backgroundColor: '#244B91' }}
                        >
                            Reintentar
                        </Button>
                    </div>
                ) : asesorias.length === 0 ? (
                    <p className="py-10 text-center text-sm text-gray-600">
                        {buscar ? 'No se encontraron chats.' : 'No tienes chats: aparecen cuando tienes asesorías en curso.'}
                    </p>
                ) : (
                    <>
                        <ListaChats asesorias={asesorias} onAbrir={handleAbrir} campoNombre="asesor" />

                        {meta && meta.last_page > 1 && (
                            <div className="mt-6 flex w-full max-w-[760px] justify-center">
                                <Pagination count={meta.last_page} page={pagina} onChange={(_, nueva) => setPagina(nueva)} />
                            </div>
                        )}
                    </>
                )}
            </div>

            <ModalChatAsesoriaEstudiante
                open={chatAbierto}
                onClose={handleCerrar}
                data={seleccionada}
                showToast={showToast}
            />

            <ToastNotification
                open={toast.open}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}
