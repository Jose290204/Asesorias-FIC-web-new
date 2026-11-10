import { Chip } from '@mui/material';
import { ACCIONES } from '../services/bitacoraService';

const TONOS = {
  verde: { backgroundColor: '#E6F4EA', color: '#1B5E20' },
  azul: { backgroundColor: '#E8EEF9', color: '#08338F' },
  naranja: { backgroundColor: '#FFF4E0', color: '#8A5A00' },
  rojo: { backgroundColor: '#FDECEA', color: '#B3261E' },
  gris: { backgroundColor: '#F1F3F4', color: '#5F6368' },
};

// Chip con el nombre de la acción y un color según su tipo (crear, editar, borrar...)
export default function ChipAccion({ accion }) {
  const { etiqueta, tono } = ACCIONES[accion] ?? { etiqueta: accion, tono: 'gris' };
  return <Chip size="small" label={etiqueta} sx={{ ...TONOS[tono], fontWeight: 600 }} />;
}
