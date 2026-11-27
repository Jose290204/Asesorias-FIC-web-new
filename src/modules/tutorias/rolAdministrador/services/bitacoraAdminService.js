
import api from '../../../../Services/api';
import { GRUPOS_ACCIONES } from '../../../superAdmin/services/bitacoraService';

// Grupos que solo ocurren desde el panel del super admin: no tiene caso filtrar por ellos aquí
const GRUPOS_SOLO_SUPERADMIN = ['Facultades', 'Administradores'];

export const GRUPOS_ACCIONES_ADMIN = GRUPOS_ACCIONES.filter((g) => !GRUPOS_SOLO_SUPERADMIN.includes(g.grupo));

// API -> vistas. usuario null = lo hizo el sistema (por ejemplo, el rechazo automático por cupo)
const aFormatoRegistro = (r) => ({
    id: r.id,
    fecha: r.fecha,
    usuario: r.usuario ?? 'Sistema',
    accion: r.accion,
    entidad: r.entidad ?? '—',
    detalle: r.detalle ?? '',
    ip: r.ip ?? ''
});

// `page` empieza en 1 (como Laravel). Los filtros vacíos no se mandan.
export async function listarBitacoraAdmin({ accion = '', buscar = '', desde = '', hasta = '', page = 1, porPagina = 10 } = {}) {
    const params = { page, per_page: porPagina };
    if (accion) params.accion = accion;
    if (buscar.trim()) params.buscar = buscar.trim();
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;

    const { data } = await api.get('/admin/bitacora', { params });
    return { registros: data.data.map(aFormatoRegistro), total: data.meta.total };
}
