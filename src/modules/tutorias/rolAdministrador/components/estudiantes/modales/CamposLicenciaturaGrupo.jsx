import { MenuItem, TextField } from '@mui/material';
import { useMemo } from 'react';

import { useCatalogos } from '../../../../../../context/CatalogosContext';

// Altura máxima del menú de las listas desplegables, para que no se desborden
const MENU_LISTA = { slotProps: { paper: { sx: { maxHeight: 240 } } } };

/**
 * Lista de licenciatura y lista de grupo que dependen una de la otra, con los datos de la facultad
 * (vienen de GET /catalogos): los grupos mostrados son los de la licenciatura elegida,
 * y al cambiar de licenciatura el grupo se limpia si no pertenece a la nueva.
 *
 * Props:
 *  - licenciaturaId, grupoId: valores actuales ('' si no hay)
 *  - onChange: recibe los dos valores, { licenciaturaId, grupoId }
 *  - mostrarErrores: muestra "Campo obligatorio" en el grupo si está vacío (el grupo es obligatorio)
 *  - soloLectura: muestra los valores sin dejar cambiarlos
 */
export default function CamposLicenciaturaGrupo({
    licenciaturaId = '',
    grupoId = '',
    onChange,
    mostrarErrores = false,
    soloLectura = false
}) {
    const { catalogos } = useCatalogos();

    const licenciaturas = useMemo(() => catalogos?.licenciaturas ?? [], [catalogos]);
    const grupos = useMemo(() => catalogos?.grupos ?? [], [catalogos]);

    // Grupos de la licenciatura elegida
    const gruposVisibles = useMemo(
        () => grupos.filter((g) => g.licenciatura_id === licenciaturaId),
        [grupos, licenciaturaId]
    );

    const sinLicenciatura = !licenciaturaId;
    const sinGrupos = !sinLicenciatura && gruposVisibles.length === 0;
    const grupoVacio = !grupoId;

    const handleLicenciatura = (e) => {
        const nueva = e.target.value;
        const sigueValido = grupos.some((g) => g.id === grupoId && g.licenciatura_id === nueva);
        onChange?.({ licenciaturaId: nueva, grupoId: sigueValido ? grupoId : '' });
    };

    return (
        <>
            <TextField
                select
                label="Licenciatura"
                size="small"
                fullWidth
                required={!soloLectura}
                disabled={soloLectura}
                value={licenciaturaId}
                onChange={handleLicenciatura}
                error={mostrarErrores && sinLicenciatura}
                helperText={mostrarErrores && sinLicenciatura ? 'Campo obligatorio' : ''}
                slotProps={{ select: { MenuProps: MENU_LISTA } }}
            >
                {licenciaturas.map((item) => (
                    <MenuItem key={item.id} value={item.id} sx={{ whiteSpace: 'normal' }}>
                        {item.nombre}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                select
                label="Grupo"
                size="small"
                fullWidth
                required={!soloLectura}
                value={grupoId}
                onChange={(e) => onChange?.({ licenciaturaId, grupoId: e.target.value })}
                disabled={soloLectura || sinLicenciatura || sinGrupos}
                error={mostrarErrores && !sinLicenciatura && !sinGrupos && grupoVacio}
                helperText={
                    soloLectura
                        ? ''
                        : sinLicenciatura
                        ? 'Elige primero la licenciatura'
                        : sinGrupos
                            ? 'Sin grupos para esta licenciatura'
                            : mostrarErrores && grupoVacio
                                ? 'Campo obligatorio'
                                : ''
                }
                slotProps={{ select: { MenuProps: MENU_LISTA } }}
            >
                {gruposVisibles.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        {/* Un mismo nombre de grupo puede existir en presencial y en virtual */}
                        {item.modalidad === 'virtual' ? `${item.nombre} (virtual)` : item.nombre}
                    </MenuItem>
                ))}
            </TextField>
        </>
    );
}
