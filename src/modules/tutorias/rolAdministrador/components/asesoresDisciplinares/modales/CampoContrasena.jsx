import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';

/**
 * Campo de contraseña con botón para mostrar u ocultar lo escrito.
 * Recibe las mismas props que un TextField de MUI (label, value, onChange, error, helperText, required...).
 */
export default function CampoContrasena(props) {
    const [visible, setVisible] = useState(false);

    return (
        <TextField
            size="small"
            fullWidth
            autoComplete="new-password"
            {...props}
            type={visible ? 'text' : 'password'}
            slotProps={{
                ...props.slotProps,
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                edge="end"
                                aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                onClick={() => setVisible((prev) => !prev)}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                {visible ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                            </IconButton>
                        </InputAdornment>
                    )
                }
            }}
        />
    );
}