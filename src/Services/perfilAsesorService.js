import api from './api';

// GET /asesor/perfil: datos del asesor y sus estadísticas
// (estadisticas: { completadas, en_curso, pendientes_por_responder })
export const traerPerfilAsesor = async () => {
  const { data } = await api.get('/asesor/perfil');
  return data.data;
};
