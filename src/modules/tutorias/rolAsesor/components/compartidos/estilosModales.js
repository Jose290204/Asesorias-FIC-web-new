// Estilos que comparten los modales del asesor

// Modal grande (formularios): ancho fijo de 550px y alto máximo del 90% de la pantalla
export const PAPER_MODAL = {
    '& .MuiPaper-root': {
        width: '550px',
        maxWidth: '90vw',
        maxHeight: '90dvh',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        p: 1.5
    }
};

// Modal chico de confirmación
export const PAPER_CONFIRMACION = {
    '& .MuiPaper-root': {
        width: '450px',
        borderRadius: '12px',
        p: 1
    }
};

// Campos que se muestran pero no se pueden modificar: fondo gris, sin cursor al hacer clic
export const CAMPO_BLOQUEADO = {
    sx: {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#F3F4F6',
            cursor: 'not-allowed',
            '& fieldset': { borderColor: '#E0E0E0' },
            '&:hover fieldset': { borderColor: '#E0E0E0' }
        },
        '& .MuiInputBase-input': { pointerEvents: 'none', caretColor: 'transparent', color: '#6B7280' },
        '& .MuiInputLabel-root': { color: '#6B7280' }
    },
    slotProps: { input: { readOnly: true }, htmlInput: { tabIndex: -1 } }
};
