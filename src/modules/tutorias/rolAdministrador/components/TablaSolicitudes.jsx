import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

// Datos adaptados a la nueva estructura de la imagen
const rows = [
    { id: 1, materia: "Programacion orientada en objetos", estudiante: "Crisoforo Ahuelican Ahuejote", asesor: "Jenifer Guadalupe Tizoc Lopez", fecha: "25/08/2026", horario: "9:00 - 10:00 AM" },
    { id: 2, materia: "Programacion orientada en objetos", estudiante: "Crisoforo Ahuelican Ahuejote", asesor: "Jenifer Guadalupe Tizoc Lopez", fecha: "25/08/2026", horario: "9:00 - 10:00 AM" },
    { id: 3, materia: "Programacion orientada en objetos", estudiante: "Crisoforo Ahuelican Ahuejote", asesor: "Jenifer Guadalupe Tizoc Lopez", fecha: "25/08/2026", horario: "9:00 - 10:00 AM" },
    { id: 4, materia: "Programacion orientada en objetos", estudiante: "Crisoforo Ahuelican Ahuejote", asesor: "Jenifer Guadalupe Tizoc Lopez", fecha: "25/08/2026", horario: "9:00 - 10:00 AM" },
];

export default function TablaSolicitudes() {
    const handleInfo = (id) => console.log('Info id:', id);
    const handleEditar = (id) => console.log('Editar id:', id);
    const handleEliminar = (id) => console.log('Eliminar id:', id);

    return (
        <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
                p: 2.5,
                borderRadius: '12px',
                borderColor: '#e0e0e0',
                width: '100%',
                margin: 'auto'
            }}
        >
            <Table
                sx={{

                    borderCollapse: 'separate',
                    borderSpacing: '0 10px'
                }}
                aria-label="tabla de usuarios"
            >
                <TableHead>
                    <TableRow sx={{ '& th': { border: 0, fontWeight: 'bold', color: '#1a1a1a', pb: 1 } }}>
                        <TableCell align="center" sx={{ width: '60px' }}>Id</TableCell>
                        <TableCell align="left">Materia</TableCell>
                        <TableCell align="left">Estudiante</TableCell>
                        <TableCell align="left">Asesor</TableCell>
                        <TableCell align="left">Fecha</TableCell>
                        <TableCell align="left">Horario</TableCell>
                        <TableCell align="left">Modalidad</TableCell>
                        <TableCell sx={{ width: '220px' }} align='center'>Acciones</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row, index) => {
                        const isEven = index % 2 === 0;
                        const backgroundColor = isEven ? '#f4f5f7' : '#dbe2ea';

                        return (
                            <TableRow
                                key={row.id}
                                sx={{
                                    backgroundColor: backgroundColor,
                                    '& td': { border: 0, py: 1.5 },
                                    '& td:first-of-type': {
                                        borderTopLeftRadius: '8px',
                                        borderBottomLeftRadius: '8px'
                                    },
                                    '& td:last-child': {
                                        borderTopRightRadius: '8px',
                                        borderBottomRightRadius: '8px'
                                    },
                                }}
                            >
                                <TableCell align="center">{row.id}</TableCell>
                                <TableCell align="left">{row.estudiante}</TableCell>
                                <TableCell align="left">{row.asesor}</TableCell>
                                <TableCell align="left">{row.fecha}</TableCell>
                                <TableCell align="left">{row.horario}</TableCell>
                                <TableCell align="left">{row.modalidad}</TableCell>
                                <TableCell align="left">{row.fecha}</TableCell>
                                <TableCell align='center'>
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="Información">
                                            <IconButton color="primary" onClick={() => handleInfo(row.id)}>
                                                <InfoIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Material adicional">
                                            <IconButton sx={{ color: '#cbcf0a' }} onClick={() => handleInfo(row.id)}>
                                                <MenuBookIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Aprobar asesoría">
                                            <IconButton color="success" onClick={() => handleAprobar(row.id)}>
                                                <CheckCircleIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Eliminar">
                                            <IconButton color="error" onClick={() => handleEliminar(row.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}