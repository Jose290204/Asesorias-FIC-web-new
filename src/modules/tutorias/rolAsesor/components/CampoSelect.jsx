import { TextField } from '@mui/material';
import { useRef, useState } from 'react';

// Select cuya lista desplegable mide lo mismo que el campo (con scroll interno y texto largo en varias líneas).
// Es el mismo que usan los modales de crear y editar asesoría.
export default function CampoSelect({ children, ...props }) {
    const campoRef = useRef(null);
    const [ancho, setAncho] = useState(undefined);

    return (
        <TextField
            select
            ref={campoRef}
            {...props}
            slotProps={{
                select: {
                    // Se mide el campo justo antes de abrir la lista
                    onOpen: () => setAncho(campoRef.current?.offsetWidth),
                    MenuProps: {
                        slotProps: {
                            paper: { sx: { maxHeight: 240, width: ancho, maxWidth: ancho } }
                        }
                    }
                }
            }}
        >
            {children}
        </TextField>
    );
}
