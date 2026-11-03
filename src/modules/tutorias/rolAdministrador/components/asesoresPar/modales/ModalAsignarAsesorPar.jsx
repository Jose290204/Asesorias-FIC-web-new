import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import InputBuscar from '../../../../../../components/ui/InputBuscar';
import { getEstudiantes } from '../../../services/estudianteService';

/**
 * Cambio de rol: elige un estudiante para asignarlo como Asesor Par.
 * Solo aparecen estudiantes activos que todavía no son asesores par.
 *
 * Props:
 *  - open, onClose
 *  - asesoresActuales: lista de asesores par actuales (para excluir a los que ya lo son)
 *  - onAsignar: recibe el estudiante elegido y realiza el cambio de rol
 *  - showToast: (mensaje, tipo) para avisar el resultado
 */
export default function ModalAsignarAsesorPar({ open, onClose, asesoresActuales = [], onAsignar, showToast }) {
    // Celular: pantalla completa. Resto: ventana centrada.
    const esCelular = useMediaQuery('(max-width:599.95px)');

    const [estudiantes, setEstudiantes] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // Al abrir se cargan los estudiantes; al cerrar se limpia el estado
    useEffect(() => {
        if (open) {
            setCargando(true);
            // TODO: reemplazar por la consulta real al backend (estudiantes que no tengan el rol de Asesor Par)
            getEstudiantes()
                .then((data) => setEstudiantes(data || []))
                .catch((error) => {
                    console.error('Error al obtener estudiantes:', error);
                    showToast?.('No se pudieron cargar los estudiantes', 'error');
                })
                .finally(() => setCargando(false));
        } else {
            setBusqueda('');
            setSeleccionado(null);
            setGuardando(false);
        }
        // showToast se omite a propósito para no volver a cargar la lista si cambia su referencia
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Candidatos: activos, sin repetir y que no sean ya asesores par (se comparan por número de cuenta)
    const candidatos = useMemo(() => {
        const yaAsesores = new Set(asesoresActuales.map((a) => String(a.numeroCuenta)));
        const vistos = new Set();

        return estudiantes.filter((est) => {
            const cuenta = String(est.numeroCuenta);
            if (String(est.estado).toUpperCase() !== 'ACTIVO') return false;
            if (yaAsesores.has(cuenta) || vistos.has(cuenta)) return false;
            vistos.add(cuenta);
            return true;
        });
    }, [estudiantes, asesoresActuales]);

    const texto = busqueda.toLowerCase().trim();
    const candidatosFiltrados = candidatos.filter((est) => {
        if (!texto) return true;
        return (
            (est.nombre || '').toLowerCase().includes(texto) ||
            String(est.numeroCuenta || '').toLowerCase().includes(texto) ||
            (est.licenciatura || '').toLowerCase().includes(texto)
        );
    });

    const handleConfirmar = async () => {
        if (!seleccionado) return;

        try {
            setGuardando(true);
            document.activeElement?.blur();
            await onAsignar?.(seleccionado);
            showToast?.(`${seleccionado.nombre} ahora es Asesor Par`, 'success');
            onClose();
        } catch (error) {
            console.error('Error al asignar el rol de asesor par:', error);
            showToast?.('No se pudo asignar el rol', 'error');
        } finally {
            setGuardando(false);
        }
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
            sx={{
                '& .MuiPaper-root': esCelular
                    ? { borderRadius: 0 }
                    : {
                        width: '550px',
                        maxWidth: '90vw',
                        maxHeight: '90dvh',
                        borderRadius: '12px',
                        p: 1.5
                    }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, pr: 7, fontWeight: 'bold', fontSize: '1.2rem' }}>
                Asignar Asesor Par
                <IconButton
                    aria-label="close"
                    onClick={handleCloseModal}
                    sx={{ position: 'absolute', right: 12, top: 12, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2.5 }}>
                <Typography variant="body2" color="text.secondary">
                    Busca y selecciona al estudiante que pasará a tener el rol de Asesor Par.
                </Typography>

                {/* El buscador compartido trae su propio ancho máximo; aquí se deja a todo el ancho */}
                <Box sx={{ width: '100%', '& > div': { maxWidth: 'none' } }}>
                    <InputBuscar
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre, cuenta o licenciatura..."
                    />
                </Box>

                <Box
                    sx={{
                        maxHeight: esCelular ? 'none' : '280px',
                        overflowY: 'auto',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px'
                    }}
                >
                    {cargando ? (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ p: 3 }}>
                            Cargando estudiantes...
                        </Typography>
                    ) : candidatosFiltrados.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ p: 3 }}>
                            No hay estudiantes disponibles para asignar.
                        </Typography>
                    ) : (
                        candidatosFiltrados.map((est) => {
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
                                        borderLeft: activo ? '4px solid #244B91' : '4px solid transparent',
                                        backgroundColor: activo ? '#EAF0FB' : 'transparent',
                                        '&:hover': { backgroundColor: '#EAF0FB' },
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
                                        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#244B91', flexShrink: 0 }}>
                                            Seleccionado
                                        </Typography>
                                    )}
                                </Box>
                            );
                        })
                    )}
                </Box>
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
                <Button variant="outlined" color="inherit" onClick={handleCloseModal}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    disabled={!seleccionado || guardando}
                    sx={{
                        backgroundColor: '#244B91',
                        '&:hover': { backgroundColor: '#1B3A73' },
                        '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' }
                    }}
                    onClick={handleConfirmar}
                >
                    Asignar
                </Button>
            </DialogActions>
        </Dialog>
    );
}