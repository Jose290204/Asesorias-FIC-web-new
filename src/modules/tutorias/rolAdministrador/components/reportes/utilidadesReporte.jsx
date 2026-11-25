// rolAdministrador/components/reportes/utilidadesReporte.jsx
// Piezas que comparten los reportes que tienen buscador, resumen y barras.
// TODO: usar estas mismas piezas en ReportePorAsesor.jsx para quitar la copia que tiene

import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

// Suma un campo numérico de una lista de filas
export const suma = (rows, campo) => rows.reduce((total, row) => total + (row[campo] || 0), 0);

// Cuenta las filas por un campo y las ordena de mayor a menor: [{ clave, etiqueta, valor }]
export const agrupar = (rows, campo) => {
    const conteo = new Map();
    rows.forEach((item) => conteo.set(item[campo], (conteo.get(item[campo]) || 0) + 1));

    return [...conteo.entries()]
        .map(([etiqueta, valor]) => ({ clave: etiqueta, etiqueta, valor }))
        .sort((a, b) => b.valor - a.valor || a.etiqueta.localeCompare(b.etiqueta, 'es'));
};

// Campo de texto de un Autocomplete con la lupa a la izquierda (igual que el de Crear Asesoría)
export const campoConLupa = (params, label, placeholder) => {
    const inputProps = params.slotProps?.input ?? params.InputProps;
    return (
        <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            slotProps={{
                ...params.slotProps,
                input: {
                    ...inputProps,
                    startAdornment: (
                        <>
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                            {inputProps?.startAdornment}
                        </>
                    )
                }
            }}
        />
    );
};

// Tiempo mínimo (ms) que se muestra el spinner al buscar, para que no parpadee cuando la consulta es rápida
export const TIEMPO_MINIMO_CARGA = 800;

// Espera lo que falte para completar el tiempo mínimo, contado desde `inicio` (Date.now())
export const esperarTiempoMinimo = (inicio, minimo = TIEMPO_MINIMO_CARGA) => {
    const falta = minimo - (Date.now() - inicio);
    return falta > 0 ? new Promise((resolve) => setTimeout(resolve, falta)) : Promise.resolve();
};
