import { useState } from 'react';

import TablaAsesores from '../asesores/TablaAsesores';
import ModalInfoAsesorPar from './modales/ModalInfoAsesorPar';
import ModalQuitarAsesorPar from './modales/ModalQuitarAsesorPar';

// rows: la página actual que entregó la API (la búsqueda, el filtro y la paginación los maneja la vista).
// onQuitar(asesor) y onGuardarDisponibilidad(asesor, cuerpo): regresan una promesa con true si salió bien y false
// si falló; la vista es quien avisa del resultado con su toast.
// Un asesor par es un estudiante con rol de asesor: no tiene botón de editar porque sus datos personales
// se editan en Estudiantes.
export default function TablaAsesoresPar({ rows = [], onQuitar, onGuardarDisponibilidad }) {
    // Se guarda solo el id: el asesor se busca en la lista actual para que, al recargarla
    // (por ejemplo tras guardar su disponibilidad), el modal abierto muestre los datos nuevos
    const [seleccionadoId, setSeleccionadoId] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalQuitarOpen, setModalQuitarOpen] = useState(false);

    const seleccionado = rows.find((r) => r.id === seleccionadoId) ?? null;

    const abrir = (setOpen) => (row) => {
        setSeleccionadoId(row.id);
        setOpen(true);
    };

    return (
        <>
            <TablaAsesores
                rows={rows}
                onInfo={abrir(setModalInfoOpen)}
                onBaja={abrir(setModalQuitarOpen)}
                textoBaja="Quitar rol"
                textoVacio="No se encontraron asesores par"
                etiquetaId="Asesor par"
            />

            <ModalInfoAsesorPar
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={seleccionado}
                onGuardarDisponibilidad={onGuardarDisponibilidad}
            />

            <ModalQuitarAsesorPar
                open={modalQuitarOpen}
                onClose={() => setModalQuitarOpen(false)}
                onConfirm={() => onQuitar?.(seleccionado)}
                data={seleccionado}
            />
        </>
    );
}
