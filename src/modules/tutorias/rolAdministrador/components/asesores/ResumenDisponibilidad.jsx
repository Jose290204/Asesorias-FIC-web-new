import { Box, Chip, Typography } from '@mui/material';

// Muestra lo que imparte un asesor (materias, horarios por día y modalidades) en solo lectura.
// disponibilidad: formato de aFormatoDisponibilidad (asesoresAdminService).
export default function ResumenDisponibilidad({ disponibilidad }) {
    if (!disponibilidad || disponibilidad.vacia) {
        return (
            <Typography variant="body2" sx={{ color: '#6B7280', fontStyle: 'italic' }}>
                Aún no tiene disponibilidad completa (materias, horarios y modalidad). Mientras tanto no aparecerá
                para los estudiantes.
            </Typography>
        );
    }

    const diasConHorarios = disponibilidad.horariosPorDia.filter((d) => d.horarios.length > 0);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', mb: 0.5 }}>MATERIAS</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {disponibilidad.materias.map((m) => (
                        <Chip
                            key={m.id}
                            size="small"
                            label={m.nombre}
                            sx={{
                                height: 'auto',
                                py: 0.25,
                                backgroundColor: '#E8EEF9',
                                color: '#08338F',
                                fontWeight: 600,
                                '& .MuiChip-label': { whiteSpace: 'normal', overflowWrap: 'anywhere' }
                            }}
                        />
                    ))}
                </Box>
            </Box>

            <Box>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', mb: 0.5 }}>MODALIDADES</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {disponibilidad.modalidades.map((m) => (
                        <Chip
                            key={m.valor}
                            size="small"
                            label={m.etiqueta}
                            sx={{ backgroundColor: '#E6F2E7', color: '#1b5e20', fontWeight: 600 }}
                        />
                    ))}
                </Box>
            </Box>

            <Box>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', mb: 0.5 }}>HORARIOS</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {diasConHorarios.map((d) => (
                        <Typography key={d.dia} sx={{ fontSize: '14px', color: '#1F2937' }}>
                            <strong>{d.etiqueta}:</strong> {d.horarios.map((h) => h.etiqueta).join(', ')}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
