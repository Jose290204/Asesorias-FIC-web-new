// Estilos compartidos de los modales rediseñados (mismo lenguaje visual que el menú, el login y el footer):
// encabezado azul con línea dorada, campos suaves, botón principal dorado y pie claro.

export const FONDO_ENCABEZADO = 'linear-gradient(90deg, #2a529b 0%, #244B91 55%, #1c3a75 100%)';
const DEGRADADO_DORADO = 'linear-gradient(135deg, #e0b63a, #D4A017 55%, #bf8f12)';

// Papel del Dialog. En celular va a pantalla completa y sin esquinas.
export const paperModal = (esCelular, ancho = '520px') => ({
  '& .MuiPaper-root': esCelular
    ? { borderRadius: 0 }
    : {
        width: ancho,
        maxWidth: '92vw',
        maxHeight: '90vh',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(18, 42, 136, 0.28)',
      },
});

// Franja azul de arriba con el título y la línea dorada
export const encabezadoModal = {
  m: 0,
  pl: 3,
  pr: 7,
  py: 2,
  color: '#fff',
  fontWeight: 700,
  fontSize: '1.15rem',
  background: FONDO_ENCABEZADO,
  borderBottom: '3px solid #D4A017',
};

export const botonCerrarEncabezado = {
  position: 'absolute',
  right: 12,
  top: 12,
  color: 'rgba(255,255,255,0.85)',
  '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.14)' },
};

// El DialogContent normal pierde su padding-top pegado al título: se lo devolvemos
export const contenidoModal = {
  px: 3,
  pb: 2,
  '.MuiDialogTitle-root + &': { pt: 3 },
};

// Pie con los botones
export const accionesModal = {
  px: 3,
  py: 2,
  gap: 1,
  backgroundColor: '#f8fafc',
  borderTop: '1px solid #e2e8f0',
};

// Botón principal (Confirmar, Aplicar...)
export const botonDorado = {
  background: DEGRADADO_DORADO,
  color: '#fff',
  fontWeight: 700,
  textTransform: 'none',
  borderRadius: '8px',
  px: 3,
  boxShadow: '0 6px 16px rgba(212, 160, 23, 0.4)',
  transition: 'all 0.2s',
  '&:hover': {
    background: DEGRADADO_DORADO,
    transform: 'translateY(-1px)',
    boxShadow: '0 8px 20px rgba(212, 160, 23, 0.5)',
  },
  '&.Mui-disabled': { background: '#cbd5e1', color: '#fff', boxShadow: 'none' },
};

// Botón secundario (Cancelar, Cerrar)
export const botonSecundario = {
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: '8px',
  color: '#475569',
  borderColor: '#cbd5e1',
  '&:hover': { borderColor: '#244B91', backgroundColor: 'rgba(36, 75, 145, 0.06)' },
};

// Campos de formulario: fondo suave, esquinas de 8 px y foco azul. Va en el contenedor de los campos
export const campoModal = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    '&.Mui-focused fieldset': { borderColor: '#244B91' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#244B91' },
};
