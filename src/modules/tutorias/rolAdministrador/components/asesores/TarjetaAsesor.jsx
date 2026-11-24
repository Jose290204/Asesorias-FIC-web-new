import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import Button from '@mui/material/Button';

import { ESTILO_BOTON_AZUL, ESTILO_BOTON_SECUNDARIO, ICONO } from '../compartidos/estilosAdmin';
import TarjetaAdmin from '../compartidos/TarjetaAdmin';

// Estatus de la disponibilidad: verde cuando ya la armó y ámbar cuando falta
const LISTA = { label: 'Disponibilidad lista', color: '#2E7D32', fondo: '#E8F5E9' };
const PENDIENTE = { label: 'Sin disponibilidad', color: '#B26A00', fondo: '#FFF4D6' };

// Versión móvil de una fila de la tabla de asesores (disciplinares y par): solo lo esencial.
// El teléfono y el resto de los datos están en el modal de información.
// Solo muestra; las acciones las maneja quien la usa (TablaAsesores).
// onEditar es opcional: los asesores par no se editan aquí (sus datos personales se editan en Estudiantes).
export default function TarjetaAsesor({ row, onInfo, onEditar, onBaja, textoBaja = 'Dar de baja' }) {
    const estatus = row.disponibilidad.vacia ? PENDIENTE : LISTA;

    return (
        <TarjetaAdmin
            franja={estatus.color}
            titulo={row.nombre}
            pastilla={estatus}
            onInfo={(e) => onInfo(row, e)}
            lineas={[
                { icono: <MailOutlinedIcon sx={ICONO} />, etiqueta: 'Correo', valor: row.correo },
                { icono: <BadgeOutlinedIcon sx={ICONO} />, etiqueta: 'Cuenta', valor: row.numeroCuenta }
            ]}
            acciones={
                <>
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{ ...ESTILO_BOTON_SECUNDARIO, minHeight: 40, ...(onEditar ? {} : { gridColumn: '1 / -1' }) }}
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        onClick={(e) => onBaja(row, e)}
                    >
                        {textoBaja}
                    </Button>
                    {onEditar && (
                        <Button
                            variant="contained"
                            sx={{ ...ESTILO_BOTON_AZUL, minHeight: 40 }}
                            startIcon={<EditOutlinedIcon />}
                            onClick={(e) => onEditar(row, e)}
                        >
                            Editar
                        </Button>
                    )}
                </>
            }
        />
    );
}
