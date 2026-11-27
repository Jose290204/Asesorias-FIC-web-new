import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';

import InputBuscar from '../../../../../../components/ui/InputBuscar';
import EncabezadoModal from '../../compartidos/EncabezadoModal';
import { ESTILO_BOTON_AZUL, ESTILO_BOTON_SECUNDARIO, PAPER_MODAL_CELULAR, paperModal } from '../../compartidos/estilosAdmin';
import { mensajesDeError } from '../../../../../../Services/errores';
import { traerCandidatosParAdmin } from '../../../../../../Services/asesoresAdminService';

/**
 * Asignar un Asesor Par: se elige a un estudiante activo que todavía no es asesor y se le agrega el rol
 * de asesor (sigue siendo estudiante). La API solo ofrece candidatos válidos, entregados de 10 en 10:
 * para encontrar a alguien más se escribe en el buscador.
 *
 * Props:
 *  - open, onClose
 *  - onAsignar: recibe el estudiante elegido y regresa una promesa con true si se asignó (el modal se cierra)
 *    o false si falló (el modal sigue abierto; el aviso lo da quien lo usa)
 *  - showToast: (mensaje, tipo) solo para avisar si no se pudieron cargar los candidatos
 */
export default function ModalAsignarAsesorPar({ open, onClose, onAsignar, showToast }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    // Lo que se escribe en el buscador, y el texto que ya se mandó a la API (con una pausa al escribir)
    const [busqueda, setBusqueda] = useState('');
    const [buscar, setBuscar] = useState('');

    const [candidatos, setCandidatos] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // Al abrir, todo empieza limpio
    useEffect(() => {
        if (!open) return;

        setBusqueda('');
        setBuscar('');
        setSeleccionado(null);
        setGuardando(false);
    }, [open]);

    // Al dejar de escribir 400 ms se busca en la API
    useEffect(() => {
        const temporizador = setTimeout(() => setBuscar(busqueda.trim()), 400);
        return () => clearTimeout(temporizador);
    }, [busqueda]);

    // Se piden los candidatos al abrir y cada vez que cambia la búsqueda
    useEffect(() => {
        if (!open) return undefined;

        let cancelado = false;
        setCargando(true);

        traerCandidatosParAdmin({ buscar })
            .then((lista) => {
                if (!cancelado) setCandidatos(lista);
            })
            .catch((err) => {
                console.error('Error al obtener los candidatos a asesor par:', err);
                if (!cancelado) {
                    setCandidatos([]);
                    showToast?.(mensajesDeError(err)[0], 'error');
                }
            })
            .finally(() => {
                if (!cancelado) setCargando(false);
            });

        return () => {
            cancelado = true;
        };
        // showToast se omite a propósito para no volver a cargar la lista si cambia su referencia
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, buscar]);

    const handleConfirmar = async () => {
        if (!seleccionado) return;

        setGuardando(true);
        document.activeElement?.blur();

        const asignado = await onAsignar?.(seleccionado);

        setGuardando(false);
        if (asignado) onClose();
    };

    const handleCloseModal = () => {
        document.activeElement?.blur();
        onClose();
    };

    return (
        <Dialog
            open={Boolean(open)}
            onClose={handleCloseModal}
            fullScreen={esCelular}
            disableRestoreFocus
            sx={esCelular ? PAPER_MODAL_CELULAR : paperModal(550)}
        >
            <EncabezadoModal
                icono={<GroupAddOutlinedIcon />}
                titulo="Asignar asesor par"
                subtitulo="Elige al estudiante que tendrá el rol"
                onClose={handleCloseModal}
            />

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Busca y selecciona al estudiante que pasará a tener el rol de Asesor Par. Seguirá siendo estudiante.
                </Typography>

                {/* El buscador compartido trae su propio ancho máximo; aquí se deja a todo el ancho */}
                <Box sx={{ width: '100%', '& > div': { maxWidth: 'none' } }}>
                    <InputBuscar
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre, correo o número de cuenta..."
                    />
                </Box>

                <Box
                    sx={{
                        maxHeight: esCelular ? 'none' : '280px',
                        overflowY: 'auto',
                        border: '1px solid #E3E8F2',
                        borderRadius: '12px',
                        backgroundColor: '#F7F9FD'
                    }}
                >
                    {cargando ? (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ p: 3 }}>
                            Buscando estudiantes...
                        </Typography>
                    ) : candidatos.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ p: 3 }}>
                            No hay estudiantes disponibles para asignar.
                        </Typography>
                    ) : (
                        candidatos.map((est) => {
                            const activo = seleccionado?.id === est.id;

                            return (
                                <Box
                                    key={est.id}
                                    onClick={() => setSeleccionado(est)}
                                    sx={{
                                        p: 1.5,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 1,
                                        borderBottom: '1px solid #EEF1F6',
                                        borderLeft: activo ? '4px solid #08338F' : '4px solid transparent',
                                        backgroundColor: activo ? '#E6ECF8' : 'transparent',
                                        '&:hover': { backgroundColor: '#E6ECF8' },
                                        '&:last-child': { borderBottom: 0 }
                                    }}
                                >
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography sx={{ fontWeight: 600, fontSize: '14px', overflowWrap: 'anywhere' }}>
                                            {est.nombre}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {[est.licenciatura, est.grupo, est.numeroCuenta].filter(Boolean).join(' · ')}
                                        </Typography>
                                    </Box>

                                    {activo && (
                                        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#08338F', flexShrink: 0 }}>
                                            Seleccionado
                                        </Typography>
                                    )}
                                </Box>
                            );
                        })
                    )}
                </Box>

                {candidatos.length >= 10 && (
                    <Typography variant="caption" color="text.secondary">
                        Se muestran los primeros 10. Escribe en el buscador para encontrar a otro estudiante.
                    </Typography>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2,
                    pt: 1.5,
                    justifyContent: 'flex-end',
                    gap: 1,
                    pb: esCelular ? 'calc(16px + env(safe-area-inset-bottom))' : 2,
                    '& > button': { flex: esCelular ? 1 : 'none', minHeight: 40 }
                }}
            >
                <Button variant="outlined" color="inherit" onClick={handleCloseModal} sx={ESTILO_BOTON_SECUNDARIO}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    disabled={!seleccionado || guardando}
                    sx={ESTILO_BOTON_AZUL}
                    onClick={handleConfirmar}
                >
                    Asignar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
