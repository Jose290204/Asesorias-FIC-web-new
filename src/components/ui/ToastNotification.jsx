
import { Alert, Snackbar } from '@mui/material';

/**
 * Toast / Alerta global tipo barra alargada.
 * 
 * @param {boolean} open - Controla si se muestra el toast.
 * @param {function} onClose - Función para cerrar el toast.
 * @param {string} message - Mensaje a mostrar.
 * @param {'info' | 'success' | 'error'} type -
 *   'info' = Azul (Guardar / Aplicar cambios)
 *   'success' = Verde (Confirmar / Aprobar)
 *   'error' = Rojo (Eliminar / Cancelar)
 */
export function ToastNotification({ open, onClose, message, type = 'info' }) {
    // Definición de colores según el tipo de acción
    const colors = {
        info: '#1976d2',    // Azul
        success: '#43a047', // Verde
        error: '#e53935'     // Rojo
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={2500}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{ bottom: { xs: 16, sm: 24 }, width: '98%', maxWidth: '1100px' }}
        >
            <Alert
                onClose={onClose}
                icon={false} // Sin ícono para lograr el estilo de barra plana llena
                sx={{
                    width: '100%',
                    backgroundColor: colors[type] || colors.info,
                    color: '#ffffff',
                    borderRadius: '6px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    py: 1,
                    px: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& .MuiAlert-message': {
                        p: 0,
                        width: '100%'
                    },
                    '& .MuiAlert-action': {
                        color: '#ffffff',
                        pt: 0
                    }
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}

export default ToastNotification;