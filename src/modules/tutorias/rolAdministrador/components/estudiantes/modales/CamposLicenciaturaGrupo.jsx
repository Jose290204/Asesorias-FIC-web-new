import { MenuItem, TextField } from '@mui/material';
import { useMemo } from 'react';

import { catalogoService } from '../../../services/catalogoService';

// Altura máxima del menú de las listas desplegables, para que no se desborden
const MENU_LISTA = { slotProps: { paper: { sx: { maxHeight: 240 } } } };

/**
 * Lista de licenciatura y lista de grupo que dependen una de la otra:
 * los grupos mostrados son los de la licenciatura elegida, y al cambiar de licenciatura el grupo se limpia.
 * Recibe `children` para poner otro campo (por ejemplo el promedio) al lado del grupo.
 *
 * Props:
 *  - licenciatura, grupo: valores actuales
 *  - onChange: recibe los campos que cambiaron, por ejemplo { licenciatura, grupo: '' }
 *  - required, mostrarErrores: marcan la licenciatura como obligatoria y muestran el error si está vacía
 *    (el grupo no es obligatorio porque hay licenciaturas sin grupos en el catálogo)
 */
export default function CamposLicenciaturaGrupo({
    licenciatura = '',
    grupo = '',
    onChange,
    required = false,
    mostrarErrores = false,
    children
}) {
    // TODO: reemplazar por la consulta real de catálogos al backend
    const { licenciaturas, grupos } = useMemo(() => {
        try {
            const catalogos = catalogoService.getCatalogos();
            return { licenciaturas: catalogos.licenciaturas || [], grupos: catalogos.grupos || [] };
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
            return { licenciaturas: [], grupos: [] };
        }
    }, []);

    // La licenciatura del estudiante puede venir con otras mayúsculas; se empareja con la del catálogo
    const licenciaturaCatalogo = licenciaturas.find(
        (item) => item.licenciatura.toUpperCase() === String(licenciatura).toUpperCase()
    );

    // Opciones de licenciatura (si el valor actual no está en el catálogo se agrega para poder mostrarlo)
    const opcionesLicenciatura = licenciaturas.map((item) => item.licenciatura);
    if (licenciatura && !licenciaturaCatalogo) opcionesLicenciatura.unshift(licenciatura);
    const valorLicenciatura = licenciaturaCatalogo?.licenciatura ?? licenciatura;

    // Grupos de la licenciatura elegida (si el grupo actual no está en la lista se agrega para poder mostrarlo)
    const opcionesGrupo = licenciaturaCatalogo
        ? grupos.filter((item) => item.id_licenciatura === licenciaturaCatalogo.id_licenciatura).map((item) => item.grupo)
        : [];
    if (grupo && !opcionesGrupo.includes(grupo)) opcionesGrupo.unshift(grupo);

    const sinLicenciatura = !licenciatura;
    const sinGrupos = !sinLicenciatura && opcionesGrupo.length === 0;

    const handleLicenciatura = (e) => {
        const nueva = e.target.value;
        const nuevaCatalogo = licenciaturas.find((item) => item.licenciatura === nueva);
        const gruposNuevos = nuevaCatalogo
            ? grupos.filter((item) => item.id_licenciatura === nuevaCatalogo.id_licenciatura).map((item) => item.grupo)
            : [];

        // El grupo se conserva solo si también existe en la licenciatura nueva
        onChange?.({ licenciatura: nueva, grupo: gruposNuevos.includes(grupo) ? grupo : '' });
    };

    return (
        <>
            <TextField
                select
                label="Licenciatura"
                size="small"
                fullWidth
                required={required}
                value={valorLicenciatura}
                onChange={handleLicenciatura}
                error={mostrarErrores && required && sinLicenciatura}
                helperText={mostrarErrores && required && sinLicenciatura ? 'Campo obligatorio' : ''}
                slotProps={{ select: { MenuProps: MENU_LISTA } }}
            >
                {opcionesLicenciatura.map((item) => (
                    <MenuItem key={item} value={item} sx={{ whiteSpace: 'normal' }}>
                        {item}
                    </MenuItem>
                ))}
            </TextField>

            <div className="flex gap-4">
                <TextField
                    select
                    label="Grupo"
                    size="small"
                    sx={{ flex: 1 }}
                    value={grupo}
                    onChange={(e) => onChange?.({ grupo: e.target.value })}
                    disabled={sinLicenciatura || sinGrupos}
                    helperText={
                        sinLicenciatura
                            ? 'Elige primero la licenciatura'
                            : sinGrupos
                                ? 'Sin grupos para esta licenciatura'
                                : ''
                    }
                    slotProps={{ select: { MenuProps: MENU_LISTA } }}
                >
                    {opcionesGrupo.map((item) => (
                        <MenuItem key={item} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </TextField>

                {children}
            </div>
        </>
    );
}