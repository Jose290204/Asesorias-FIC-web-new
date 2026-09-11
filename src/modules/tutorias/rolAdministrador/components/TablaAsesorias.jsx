import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

function createData(id, materia, estudiante, asesor, inicio, horario) {
    return { id, materia, estudiante, asesor, inicio, horario };
}

const rows = [
    createData(1, "Taller integrador", "Leslie Mayram Barrera Rodriguez", "Jenifer Guadalupe Tizoc Lopez", "25/08/2026", "9:00 - 10:00 AM"),
    createData(2, "Matematicas discretas", "Leslie Mayram Barrera Rodriguez", "Jenifer Guadalupe Tizoc Lopez", "25/08/2026", "9:00 - 10:00 AM"),
    createData(3, "Lenguajes de programacion", "Leslie Mayram Barrera Rodriguez", "Jenifer Guadalupe Tizoc Lopez", "25/08/2026", "9:00 - 10:00 AM"),
    createData(4, "Sistemas distribuidos", "Leslie Mayram Barrera Rodriguez", "Jenifer Guadalupe Tizoc Lopez", "25/08/2026", "9:00 - 10:00 AM"),
];

export default function TablaAsesorias() {

    //Acciones temporale spara los botones de acciones
    const handleInfo = (id) => console.log('Info de:', id);
    const handleAprobar = (id) => console.log('Aprobar id:', id);
    const handleEliminar = (id) => console.log('Eliminar id:', id);

    return (
        <TableContainer
            component={Paper}
            variant='outlined'
            sx={{
                p: 2.5,
                borderRadius: '12px',
                borderColor: '#e0e0e0',
                width: '100%',
                boxSizing: 'border-box'
            }}
        >

            <Table
                sx={{
                    minWidth: 500,
                    borderCollapse: 'separate',
                    borderSpacing: '0 10px'
                }}
            >

                <TableHead>
                    <TableRow sx={{ '& th': { border: 0, fontWeight: 'bold', color: '#1a1a1a', pb: 1 } }}>
                        <TableCell sx={{ width: '60px' }} align='center' >ID</TableCell>
                        <TableCell align='left'>Materia</TableCell>
                        <TableCell align='left'>Estudiante</TableCell>
                        <TableCell align='left'>Asesor</TableCell>
                        <TableCell align='center'>Inicio</TableCell>
                        <TableCell align='center'>Horario</TableCell>
                        <TableCell sx={{ width: '180px' }} align='center'>Acciones</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={row.id}
                            sx={{
                                backgroundColor: index % 2 === 0 ? '#f4f5f7' : '#dbe2ea',
                                '& td': { border: 0, py: 1.5 },
                                '& td:first-of-type': { borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' },
                                '& td:last-child': { borderTopRightRadius: '8px', borderBottomRightRadius: '8px' },
                            }}
                        >
                            <TableCell align='center'>{row.id}</TableCell>
                            <TableCell align='left'>{row.materia}</TableCell>
                            <TableCell align='left'>{row.estudiante}</TableCell>
                            <TableCell align='left'>{row.asesor}</TableCell>
                            <TableCell align='center'>{row.inicio}</TableCell>
                            <TableCell align='center'>{row.horario}</TableCell>
                            <TableCell align='center'>
                                <Stack direction="row" spacing={1.5} justifyContent="center">
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
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

}

