
// Colores de las etiquetas (chips) de los reportes: fondo suave y letra del mismo tono.

const GRIS = { backgroundColor: '#F1F3F4', color: '#5F6368' };

const ESTATUS = {
    'En curso': { backgroundColor: '#FFF4E5', color: '#8A5A00' },
    Completada: { backgroundColor: '#E6F4EA', color: '#1B5E20' },
    Cancelada: { backgroundColor: '#FDECEA', color: '#B71C1C' }
};

const TIPO_ASESOR = {
    Disciplinar: { backgroundColor: '#FFF8E1', color: '#8A6D2B' },
    Par: { backgroundColor: '#E0F2F1', color: '#00695C' }
};

export const estiloEstatus = (valor) => ESTATUS[valor] || GRIS;
export const estiloTipoAsesor = (valor) => TIPO_ASESOR[valor] || GRIS;