// Estilos que comparten las tablas del asesor (los mismos de las tablas del administrador)

// Contenedor de la tabla: tarjeta blanca con esquinas redondeadas
export const ESTILO_PAPER_TABLA = {
    width: '100%',
    borderRadius: '12px',
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(16, 24, 40, 0.06)'
};

// Encabezado de la tabla: azul sólido, letras chicas, mayúsculas y en negritas
export const ESTILO_ENCABEZADO = {
    backgroundColor: '#244B91',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    borderBottom: 0,
    py: 1.75,
    whiteSpace: 'nowrap'
};

// Fila del encabezado (aplica el estilo a cada celda y da margen a la primera y a la última)
export const ESTILO_FILA_ENCABEZADO = {
    '& th': ESTILO_ENCABEZADO,
    '& th:first-of-type': { pl: 3 },
    '& th:last-child': { pr: 3 }
};

// Fila de datos
export const ESTILO_FILA = {
    '& td': {
        color: '#1F2937',
        fontSize: '14.5px',
        borderBottom: '1px solid #EEF1F6',
        py: 1.75
    },
    '& td:first-of-type': { pl: 3 },
    '& td:last-child': { pr: 3 },
    '&:hover': { backgroundColor: '#EAF0FB !important' },
    '&:last-child td': { borderBottom: 0 }
};

// Botón de acción redondo y suave: ícono con su color y fondo tenue al pasar el mouse
export const estiloAccion = (color, fondo) => ({
    color,
    '&:hover': { backgroundColor: fondo },
    '&.Mui-disabled': { color: '#C4C9D4' }
});
