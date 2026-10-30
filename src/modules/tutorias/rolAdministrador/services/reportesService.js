// rolAdministrador/services/reportesService.js
import api from '../../../../Services/api';
import {
    ASESORES_REPORTE_PRUEBA,
    ASESORIAS_REPORTE_PRUEBA,
    CICLOS_REPORTE_PRUEBA,
    MATERIAS_REPORTE_PRUEBA,
    USAR_DATOS_PRUEBA_ADMIN
} from '../datosPrueba';
import { getAsesoresDisciplinares } from './asesoresDisciplinaresService';
import { getAsesoresPar } from './asesoresParService';

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

// 2026-10-27 -> 27/OCT/2026 (se toma solo la parte de la fecha para evitar desfases de zona horaria)
const formatearFecha = (valor) => {
    if (!valor) return '';
    const [anio, mes, dia] = String(valor).slice(0, 10).split('-');
    return `${dia}/${MESES[Number(mes) - 1] || mes}/${anio}`;
};

// Quita acentos, espacios repetidos y mayúsculas para comparar nombres ("José Ángel" == "Jose Angel")
const normalizar = (texto) =>
    String(texto ?? '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

const desplazarDias = (fechaIso, dias) => {
    const fecha = new Date(`${String(fechaIso).slice(0, 10)}T00:00:00Z`);
    fecha.setUTCDate(fecha.getUTCDate() + dias);
    return fecha.toISOString().slice(0, 10);
};

// Adapta un renglón del resumen por asesor a la forma que usa la UI
const adaptarResumenAsesor = (item) => {
    const enCurso = Number(item.en_curso) || 0;
    const completadas = Number(item.completadas) || 0;
    const canceladas = Number(item.canceladas) || 0;

    return {
        id: item.id,
        nombre: item.nombre,
        tipo: item.tipo,
        solicitudes: Number(item.solicitudes) || 0,
        enCurso,
        completadas,
        canceladas,
        total: enCurso + completadas + canceladas,
        sesiones: Number(item.sesiones) || 0
    };
};

// Texto de la columna "Fin" cuando la asesoría no tiene fecha de término
const LEYENDA_SIN_FIN = { 'En curso': 'En seguimiento', Cancelada: 'No concluyó' };

// Adapta una asesoría del reporte a la forma que usa la UI
const adaptarAsesoria = (item) => {
    const licenciaturaCorta = String(item.licenciatura || '').replace(/^Licenciatura en /i, '');
    // TODO: confirmar con el backend el nombre del campo de término (fecha_fin o finalizada_en)
    const fin = item.fecha_fin ?? item.finalizada_en ?? null;

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

// Adapta una materia del catálogo a la forma que usa el buscador
const adaptarMateria = (item) => ({
    key: `materia-${item.id}`,
    id: item.id,
    nombre: item.nombre,
    licenciatura: item.licenciatura || '',
    semestre: item.semestre
});

// Adapta un renglón del resumen por materia a la forma que usa la UI
const adaptarResumenMateria = (item) => {
    const enCurso = Number(item.en_curso) || 0;
    const completadas = Number(item.completadas) || 0;
    const canceladas = Number(item.canceladas) || 0;

    return {
        id: item.id,
        nombre: item.nombre,
        licenciatura: String(item.licenciatura || '').replace(/^Licenciatura en /i, ''),
        solicitudes: Number(item.solicitudes) || 0,
        enCurso,
        completadas,
        canceladas,
        total: enCurso + completadas + canceladas,
        asesores: Number(item.asesores) || 0,
        estudiantes: Number(item.estudiantes) || 0,
        sesiones: Number(item.sesiones) || 0
    };
};

// Asesoría de una materia: igual que la de un asesor, pero con el nombre del asesor
const adaptarAsesoriaDeMateria = (item) => ({ ...adaptarAsesoria(item), asesor: item.asesor });

// Asesorías de prueba de un semestre. El anterior simula otros datos para probar el cambio de filtro.
const asesoriasPrueba = (cicloId) => {
    if (cicloId !== CICLOS_REPORTE_PRUEBA[1].id) return ASESORIAS_REPORTE_PRUEBA;

    return ASESORIAS_REPORTE_PRUEBA.filter((_, i) => i % 10 < 7).map((item) => ({
        ...item,
        estatus: item.estatus === 'En curso' ? 'Completada' : item.estatus,
        fecha_inicio: desplazarDias(item.fecha_inicio, -200),
        // las que estaban en curso se vuelven completadas y reciben fecha de término
        fecha_fin: item.fecha_fin
            ? desplazarDias(item.fecha_fin, -200)
            : item.estatus === 'En curso'
                ? desplazarDias(item.fecha_inicio, -190)
                : null
    }));
};

export const reportesService = {
    // Semestres (ciclos escolares) para el filtro de los reportes
    obtenerCiclos: async () => {
        if (USAR_DATOS_PRUEBA_ADMIN) return CICLOS_REPORTE_PRUEBA;

        // TODO: confirmar la ruta y el formato cuando exista el endpoint de admin en el backend
        const response = await api.get('/admin/ciclos');
        return response.data.data;
    },

    // Lista de asesores (par + disciplinares) para el buscador: { key, id, tipo, nombre }
    obtenerAsesores: async () => {
        const [resPar, resDisciplinares] = await Promise.allSettled([getAsesoresPar(), getAsesoresDisciplinares()]);

        // Si fallan las dos fuentes no hay nada que mostrar
        if (resPar.status === 'rejected' && resDisciplinares.status === 'rejected') {
            throw resPar.reason;
        }

        const pares = resPar.status === 'fulfilled'
            ? resPar.value.map((item) => ({
                key: `par-${item.id}`,
                id: item.id,
                tipo: 'Par',
                nombre: item.asesor ?? item.nombre
            }))
            : [];

        const disciplinares = resDisciplinares.status === 'fulfilled'
            ? resDisciplinares.value.map((item) => ({
                key: `disciplinar-${item.id}`,
                id: item.id,
                tipo: 'Disciplinar',
                nombre: item.nombre
            }))
            : [];

        // Sin nombres repetidos y en orden alfabético
        const vistos = new Set();
        return [...pares, ...disciplinares]
            .filter((item) => {
                const clave = normalizar(item.nombre);
                if (!clave || vistos.has(clave)) return false;
                vistos.add(clave);
                return true;
            })
            .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    },

    // Resumen de todos los asesores en un semestre (un renglón por asesor)
    obtenerResumenAsesores: async (cicloId) => {
        if (USAR_DATOS_PRUEBA_ADMIN) {
            const asesorias = asesoriasPrueba(cicloId);

            return ASESORES_REPORTE_PRUEBA.map((asesor) => {
                const propias = asesorias.filter((item) => item.asesor_id === asesor.id);
                const contar = (estatus) => propias.filter((item) => item.estatus === estatus).length;

                return adaptarResumenAsesor({
                    ...asesor,
                    solicitudes: propias.length ? propias.length + 2 : 0,
                    en_curso: contar('En curso'),
                    completadas: contar('Completada'),
                    canceladas: contar('Cancelada'),
                    sesiones: propias.reduce((total, item) => total + item.sesiones, 0)
                });
            });
        }

        // TODO: confirmar la ruta y el formato cuando exista el endpoint de admin en el backend
        const response = await api.get('/admin/reportes/asesores', { params: { ciclo_id: cicloId } });
        return response.data.data.map(adaptarResumenAsesor);
    },

    // Todas las asesorías de un asesor en un semestre; de ellas la pantalla calcula materias, grupos y totales
    // asesor: { id, tipo, nombre }
    obtenerAsesoriasDeAsesor: async ({ asesor, cicloId }) => {
        if (USAR_DATOS_PRUEBA_ADMIN) {
            const nombre = normalizar(asesor.nombre);
            return asesoriasPrueba(cicloId)
                .filter((item) => normalizar(item.asesor) === nombre)
                .map(adaptarAsesoria);
        }

        // TODO: confirmar la ruta y los parámetros cuando exista el endpoint de admin en el backend
        const response = await api.get(`/admin/reportes/asesores/${asesor.id}/asesorias`, {
            params: { ciclo_id: cicloId, tipo: asesor.tipo }
        });
        return response.data.data.map(adaptarAsesoria);
    },

    // Lista de materias para el buscador: { key, id, nombre, licenciatura, semestre }
    obtenerMaterias: async () => {
        if (USAR_DATOS_PRUEBA_ADMIN) {
            return MATERIAS_REPORTE_PRUEBA.map(adaptarMateria).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
        }

        // TODO: confirmar que GET /materias entrega todas las materias de la facultad (no paginadas)
        const response = await api.get('/materias');
        return response.data.data.map(adaptarMateria).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    },

    // Resumen de todas las materias en un semestre (un renglón por materia)
    obtenerResumenMaterias: async (cicloId) => {
        if (USAR_DATOS_PRUEBA_ADMIN) {
            const asesorias = asesoriasPrueba(cicloId);

            return MATERIAS_REPORTE_PRUEBA.map((materia) => {
                const nombre = normalizar(materia.nombre);
                const propias = asesorias.filter((item) => normalizar(item.materia) === nombre);
                const contar = (estatus) => propias.filter((item) => item.estatus === estatus).length;

                return adaptarResumenMateria({
                    ...materia,
                    solicitudes: propias.length ? propias.length + 2 : 0,
                    en_curso: contar('En curso'),
                    completadas: contar('Completada'),
                    canceladas: contar('Cancelada'),
                    asesores: new Set(propias.map((item) => item.asesor_id)).size,
                    estudiantes: new Set(propias.map((item) => item.estudiante)).size,
                    sesiones: propias.reduce((total, item) => total + item.sesiones, 0)
                });
            });
        }

        // TODO: confirmar la ruta y el formato cuando exista el endpoint de admin en el backend
        const response = await api.get('/admin/reportes/materias', { params: { ciclo_id: cicloId } });
        return response.data.data.map(adaptarResumenMateria);
    },

    // Todas las asesorías de una materia en un semestre; de ellas la pantalla calcula asesores, grupos y totales
    // materia: { id, nombre, licenciatura }
    obtenerAsesoriasDeMateria: async ({ materia, cicloId }) => {
        if (USAR_DATOS_PRUEBA_ADMIN) {
            const nombre = normalizar(materia.nombre);
            return asesoriasPrueba(cicloId)
                .filter((item) => normalizar(item.materia) === nombre)
                .map(adaptarAsesoriaDeMateria);
        }

        // TODO: confirmar la ruta y los parámetros cuando exista el endpoint de admin en el backend
        const response = await api.get(`/admin/reportes/materias/${materia.id}/asesorias`, {
            params: { ciclo_id: cicloId }
        });
        return response.data.data.map(adaptarAsesoriaDeMateria);
    }
};