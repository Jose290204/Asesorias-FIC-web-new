import { useState } from 'react';

import TablaAsesores from '../asesores/TablaAsesores';
import ModalAsesorDisciplinar from './modales/ModalAsesorDisciplinar';
import ModalEliminarAsesorDisciplinar from './modales/ModalEliminarAsesorDisciplinar';

// rows: la página actual que entregó la API (la búsqueda, el filtro y la paginación los maneja la vista).
// onUpdate(asesor, formulario), onDelete(asesor) y onGuardarDisponibilidad(asesor, cuerpo): regresan una promesa
// con true si salió bien y false si falló; la vista es quien avisa del resultado con su toast.
export default function TablaAsesoresDisciplinares({ rows = [], onUpdate, onDelete, onGuardarDisponibilidad }) {
    // Se guarda solo el id: el asesor se busca en la lista actual para que, al recargarla
    // (por ejemplo tras guardar su disponibilidad), el modal abierto muestre los datos nuevos
    const [seleccionadoId, setSeleccionadoId] = useState(null);
    const [modalInfoOpen, setModalInfoOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [modalEliminarOpen, setModalEliminarOpen] = useState(false);

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
                onEditar={abrir(setModalEditarOpen)}
                onBaja={abrir(setModalEliminarOpen)}
                textoBaja="Dar de baja"
                textoVacio="No se encontraron asesores disciplinares"
                etiquetaId="Asesor"
            />

            {/* Información: todo bloqueado */}
            <ModalAsesorDisciplinar
                modo="info"
                open={modalInfoOpen}
                onClose={() => setModalInfoOpen(false)}
                data={seleccionado}
            />

            {/* Editar: datos y disponibilidad */}
            <ModalAsesorDisciplinar
                modo="editar"
                open={modalEditarOpen}
                onClose={() => setModalEditarOpen(false)}
                data={seleccionado}
                onSave={onUpdate}
                onGuardarDisponibilidad={onGuardarDisponibilidad}
            />

            <ModalEliminarAsesorDisciplinar
                open={modalEliminarOpen}
                onClose={() => setModalEliminarOpen(false)}
                onConfirm={() => onDelete?.(seleccionado)}
                data={seleccionado}
            />
        </>
    );
}
