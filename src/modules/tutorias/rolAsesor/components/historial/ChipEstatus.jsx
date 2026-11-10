import Chip from '@mui/material/Chip';

// El historial son asesorías cerradas: completadas o canceladas
const ESTILO_ESTATUS = {
    completada: { label: 'Completada', color: '#2E7D32', fondo: '#E8F5E9' },
    cancelada: { label: 'Cancelada', color: '#C62828', fondo: '#FDECEA' }
};

export default function ChipEstatus({ estatus }) {
    const estilo = ESTILO_ESTATUS[estatus] ?? { label: estatus, color: '#555555', fondo: '#F3F4F6' };
    return (
        <Chip
            size="small"
            label={estilo.label}
            sx={{ backgroundColor: estilo.fondo, color: estilo.color, fontWeight: 600, fontSize: '12.5px' }}
        />
    );
}
