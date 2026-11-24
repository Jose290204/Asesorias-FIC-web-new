import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Button from '@mui/material/Button';

import { ESTILO_BOTON_AZUL, ESTILO_BOTON_SECUNDARIO, ICONO } from '../compartidos/estilosAdmin';
import TarjetaAdmin from '../compartidos/TarjetaAdmin';

// Versión móvil de una fila de la tabla de estudiantes: solo lo esencial.
// El correo y el teléfono están en el modal de información.
// Solo muestra; las acciones las maneja quien la usa (TablaEstudiantes).
export default function TarjetaEstudiante({ row, onInfo, onEditar, onEliminar }) {
    return (
        <TarjetaAdmin
            titulo={row.nombre}
            onInfo={(e) => onInfo(row, e)}
            lineas={[
                { icono: <BadgeOutlinedIcon sx={ICONO} />, etiqueta: 'Cuenta', valor: row.numeroCuenta },
                { icono: <SchoolOutlinedIcon sx={ICONO} />, etiqueta: 'Licenciatura', valor: row.licenciatura },
                { icono: <GroupsOutlinedIcon sx={ICONO} />, etiqueta: 'Grupo', valor: row.grupo }
            ]}
            acciones={
                <>
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{ ...ESTILO_BOTON_SECUNDARIO, minHeight: 40 }}
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        onClick={(e) => onEliminar(row, e)}
                    >
                        Dar de baja
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ ...ESTILO_BOTON_AZUL, minHeight: 40 }}
                        startIcon={<EditOutlinedIcon />}
                        onClick={(e) => onEditar(row, e)}
                    >
                        Editar
                    </Button>
                </>
            }
        />
    );
}
