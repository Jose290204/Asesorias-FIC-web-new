import api from './api';

// GET /dias-inhabiles (?desde=YYYY-MM-DD&hasta=YYYY-MM-DD, máx. 400 días)
// Vacaciones y suspensiones de la facultad del usuario (las generales de la UAS y las propias de su facultad):
// [{ fecha_inicio, fecha_fin, tipo: 'vacaciones' | 'suspension', motivo }]
// Los fines de semana no vienen aquí: se descartan por ser sábado o domingo.
export const traerDiasInhabiles = async ({ desde, hasta }) => {
  const { data } = await api.get('/dias-inhabiles', { params: { desde, hasta } });
  return data.data;
};
