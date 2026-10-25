import api from "./api";

export const crearSolicitud = async ({ asesorId, materiaId, horarioId, fecha, modalidad, razon, nota }) => {
    const { data } = await api.post("/estudiante/solicitudes", {
        asesor_id: asesorId,
        materia_id: materiaId,
        horario_id: horarioId,
        fecha,
        modalidad,
        razon,
        nota: nota || undefined,
    });
    return data.data;
};