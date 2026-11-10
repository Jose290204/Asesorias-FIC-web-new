// rolAdministrador/services/reportesService.js
import api from '../../../../Services/api';

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

// 2026-10-27 -> 27/OCT/2026 (se toma solo la parte de la fecha para evitar desfases de zona horaria)
const formatearFecha = (valor) => {
    if (!valor) return '';
    const [anio, mes, dia] = String(valor).slice(0, 10).split('-');
    return `${dia}/${MESES[Number(mes) - 1] || mes}/${anio}`;
};

const quitarLicenciatura = (texto) => String(texto || '').replace(/^Licenciatura en /i, '');

// Texto de la columna "Fin" cuando la asesoría no tiene fecha de término
const LEYENDA_SIN_FIN = { 'En curso': 'En seguimiento', Cancelada: 'No concluyó' };

// Rutas del backend de los reportes por estudiante, grupo y licenciatura
const RUTAS_AGRUPADO = {
    estudiante: 'estudiantes',
    grupo: 'grupos',
    licenciatura: 'licenciaturas'
};

// Convierte los conteos del backend en los números que usa la UI
const contarEstatus = (item) => {
    const enCurso = Number(item.en_curso) || 0;
    const completadas = Number(item.completadas) || 0;
    const canceladas = Number(item.canceladas) || 0;

    return { enCurso, completadas, canceladas, total: enCurso + completadas + canceladas };
};

// Adapta un renglón del resumen por asesor a la forma que usa la UI
const adaptarResumenAsesor = (item) => ({
    id: item.id,
    nombre: item.nombre,
    tipo: item.tipo,
    solicitudes: Number(item.solicitudes) || 0,
    ...contarEstatus(item),
    sesiones: Number(item.sesiones) || 0
});

// Adapta un renglón del resumen por materia a la forma que usa la UI
const adaptarResumenMateria = (item) => ({
    id: item.id,
    nombre: item.nombre,
    licenciatura: quitarLicenciatura(item.licenciatura),
    solicitudes: Number(item.solicitudes) || 0,
    ...contarEstatus(item),
    asesores: Number(item.asesores) || 0,
    estudiantes: Number(item.estudiantes) || 0,
    sesiones: Number(item.sesiones) || 0
});

// Adapta un renglón del resumen por estudiante, grupo o licenciatura
const adaptarResumenAgrupado = (tipo) => (item) => ({
    key: `${tipo}-${item.id}`,
    id: item.id,
    nombre: item.nombre,
    grupo: item.grupo ?? '',
    grupos: Number(item.grupos) || 0,
    licenciatura: quitarLicenciatura(item.licenciatura),
    solicitudes: Number(item.solicitudes) || 0,
    ...contarEstatus(item),
    asesores: Number(item.asesores) || 0,
    materias: Number(item.materias) || 0,
    estudiantes: Number(item.estudiantes) || 0,
    sesiones: Number(item.sesiones) || 0
});

// Adapta una asesoría del reporte a la forma que usa la UI
const adaptarAsesoria = (item) => {
    const licenciaturaCorta = quitarLicenciatura(item.licenciatura);
    const fin = item.fecha_fin ?? null;

    return {
        id: item.id,
        materia: item.materia,
        estudiante: item.estudiante,
        grupo: item.grupo,
        grupoTexto: licenciaturaCorta ? `${item.grupo} · ${licenciaturaCorta}` : item.grupo,
        fecha: String(item.fecha_inicio).slice(0, 10), // para ordenar
        fechaTexto: formatearFecha(item.fecha_inicio), // para mostrar
        fechaFin: fin ? String(fin).slice(0, 10) : '', // para ordenar ('' si aún no termina)
        finTexto: fin ? formatearFecha(fin) : LEYENDA_SIN_FIN[item.estatus] || 'Sin fecha',
        horario: item.horario,
        modalidad: item.modalidad,
        razon: item.razon,
        estatus: item.estatus,
        sesiones: Number(item.sesiones) || 0
    };
};

// Asesoría con el nombre del asesor (reportes por materia, estudiante, grupo y licenciatura)
const adaptarAsesoriaConAsesor = (item) => ({
    ...adaptarAsesoria(item),
    asesor: item.asesor,
    grupoNombre: item.grupo,
    licenciatura: quitarLicenciatura(item.licenciatura)
});

const ordenarPorNombre = (a, b) => a.nombre.localeCompare(b.nombre, 'es');

export const reportesService = {
    // Semestres (ciclos escolares) para el filtro de los reportes: { id, nombre, periodo, vigente }
    obtenerCiclos: async () => {
        const response = await api.get('/admin/ciclos');
        return response.data.data;
    },

    // Lista de asesores (par + disciplinares) para el buscador: { key, id, tipo, nombre }
    // El resumen del backend ya trae a todos los asesores de la facultad, con o sin actividad
    obtenerAsesores: async () => {
        const ciclos = await reportesService.obtenerCiclos();
        if (ciclos.length === 0) return [];

        const response = await api.get('/admin/reportes/asesores', { params: { ciclo_id: ciclos[0].id } });
        return response.data.data
            .map((item) => ({
                key: `asesor-${item.id}`,
                id: item.id,
                tipo: item.tipo,
                nombre: item.nombre
            }))
            .sort(ordenarPorNombre);
    },

    // Resumen de todos los asesores en un semestre (un renglón por asesor)
    obtenerResumenAsesores: async (cicloId) => {
        const response = await api.get('/admin/reportes/asesores', { params: { ciclo_id: cicloId } });
        return response.data.data.map(adaptarResumenAsesor);
    },

    // Todas las asesorías de un asesor en un semestre; de ellas la pantalla calcula materias, grupos y totales
    // asesor: { id }
    obtenerAsesoriasDeAsesor: async ({ asesor, cicloId }) => {
        const response = await api.get(`/admin/reportes/asesores/${asesor.id}/asesorias`, {
            params: { ciclo_id: cicloId }
        });
        return response.data.data.map(adaptarAsesoria);
    },

    // Lista de materias para el buscador: { key, id, nombre, licenciatura }
    // El resumen del backend ya trae todas las materias de la facultad, con o sin actividad
    obtenerMaterias: async () => {
        const ciclos = await reportesService.obtenerCiclos();
        if (ciclos.length === 0) return [];

        const response = await api.get('/admin/reportes/materias', { params: { ciclo_id: ciclos[0].id } });
        return response.data.data
            .map((item) => ({
                key: `materia-${item.id}`,
                id: item.id,
                nombre: item.nombre,
                licenciatura: item.licenciatura || ''
            }))
            .sort(ordenarPorNombre);
    },

    // Resumen de todas las materias en un semestre (un renglón por materia)
    obtenerResumenMaterias: async (cicloId) => {
        const response = await api.get('/admin/reportes/materias', { params: { ciclo_id: cicloId } });
        return response.data.data.map(adaptarResumenMateria);
    },

    // Todas las asesorías de una materia en un semestre; de ellas la pantalla calcula asesores, grupos y totales
    // materia: { id }
    obtenerAsesoriasDeMateria: async ({ materia, cicloId }) => {
        const response = await api.get(`/admin/reportes/materias/${materia.id}/asesorias`, {
            params: { ciclo_id: cicloId }
        });
        return response.data.data.map(adaptarAsesoriaConAsesor);
    },

    // Resumen del semestre: un renglón por estudiante, grupo o licenciatura. tipo: 'estudiante' | 'grupo' | 'licenciatura'
    obtenerResumenAgrupado: async (tipo, cicloId) => {
        const response = await api.get(`/admin/reportes/${RUTAS_AGRUPADO[tipo]}`, { params: { ciclo_id: cicloId } });
        return response.data.data.map(adaptarResumenAgrupado(tipo));
    },

    // Todas las asesorías de un estudiante, grupo o licenciatura en un semestre; la pantalla calcula de ellas los desgloses
    // entidad: un renglón del resumen (trae id y nombre)
    obtenerAsesoriasAgrupado: async ({ tipo, entidad, cicloId }) => {
        const response = await api.get(`/admin/reportes/${RUTAS_AGRUPADO[tipo]}/${entidad.id}/asesorias`, {
            params: { ciclo_id: cicloId }
        });
        return response.data.data.map(adaptarAsesoriaConAsesor);
    }
};
