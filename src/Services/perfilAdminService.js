import api from './api';

// GET /admin/perfil: datos del administrador y los contadores de su facultad
// (estadisticas: { asesorias_en_curso, solicitudes_pendientes, usuarios_activos })
export const traerPerfilAdmin = async () => {
  const { data } = await api.get('/admin/perfil');
  return data.data;
};
