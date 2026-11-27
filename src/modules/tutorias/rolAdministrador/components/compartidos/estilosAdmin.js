// Estilos del diseño nuevo que comparten las vistas, tarjetas y modales del administrador

// Degradados de los botones
export const DEGRADADO_AZUL = 'linear-gradient(135deg, #1E4DB7 0%, #08338F 55%, #052466 100%)';
export const DEGRADADO_AZUL_HOVER = 'linear-gradient(135deg, #08338F 0%, #052466 100%)';
export const DEGRADADO_VERDE = 'linear-gradient(135deg, #43A047 0%, #2E7D32 55%, #1B5E20 100%)';
export const DEGRADADO_VERDE_HOVER = 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)';

// Botón principal de una vista ("Crear ...", "Cargar ..."): el de escritorio y el flotante del celular
export const ESTILO_BOTON_CREAR = {
    textTransform: 'none',
    fontWeight: 700,
    letterSpacing: '0.3px',
    color: '#ffffff',
    background: DEGRADADO_AZUL,
    boxShadow: '0 4px 12px rgba(8, 51, 143, 0.45)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    '&:hover': {
        background: DEGRADADO_AZUL_HOVER,
        boxShadow: '0 6px 16px rgba(5, 36, 102, 0.55)',
        transform: 'translateY(-1px)'
    },
    '&:active': { transform: 'translateY(0)', boxShadow: '0 2px 6px rgba(5, 36, 102, 0.5)' }
};

// Botón de confirmar dentro de un modal (azul)
export const ESTILO_BOTON_AZUL = {
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 700,
    background: DEGRADADO_AZUL,
    boxShadow: '0 4px 12px rgba(8, 51, 143, 0.35)',
    '&:hover': { background: DEGRADADO_AZUL_HOVER },
    '&.Mui-disabled': { background: '#E0E0E0', boxShadow: 'none', color: '#9E9E9E' }
};

// Botón de confirmar dentro de un modal (verde)
export const ESTILO_BOTON_VERDE = {
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 700,
    background: DEGRADADO_VERDE,
    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.35)',
    '&:hover': { background: DEGRADADO_VERDE_HOVER },
    '&.Mui-disabled': { background: '#E0E0E0', boxShadow: 'none', color: '#9E9E9E' }
};

// Botón secundario de un modal (Cancelar, Volver)
export const ESTILO_BOTON_SECUNDARIO = { borderRadius: '8px', textTransform: 'none' };

// Botón "Cerrar" de los modales de información
export const ESTILO_BOTON_CERRAR = { backgroundColor: '#08338F', '&:hover': { backgroundColor: '#062568' } };

// Título pequeño que separa las secciones de un modal
export const ETIQUETA_SECCION = {
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '#6A6A6A',
    mb: 1.5
};

export const ICONO = { fontSize: 20 };

// Ventana de información o formulario mediano
export const paperModal = (ancho = 520) => ({
    '& .MuiPaper-root': {
        width: `${ancho}px`,
        maxWidth: '90vw',
        maxHeight: '90dvh',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        p: 1.5
    }
});

// Ventana en celular: pantalla completa
export const PAPER_MODAL_CELULAR = { '& .MuiPaper-root': { borderRadius: 0 } };
