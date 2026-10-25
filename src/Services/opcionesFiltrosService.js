import api from "./api"; // 1: tu instancia de axios (revisa que la ruta sea la de tu api.js)

// 2: Laravel a veces envuelve la lista en { data: [...] } y a veces la manda directa.
//    Esta función acepta las dos formas y siempre devuelve un arreglo.
const comoLista = (respuesta) => {
    const cuerpo = respuesta.data;
    if (Array.isArray(cuerpo)) return cuerpo;      // 3: vino directa: [...]
    if (Array.isArray(cuerpo?.data)) return cuerpo.data; // 4: vino envuelta: { data: [...] }
    return [];                                     // 5: cualquier otra cosa, lista vacía
};

// 6: convierte un elemento del backend al formato { valor, etiqueta } que usan los selects
const aOpcion = (item) => ({
    valor: item.id ?? item.value ?? item.valor,                 // 7: id numérico o valor del enum
    etiqueta: item.etiqueta ?? item.nombre ?? item.label ?? String(item.id), // 8: texto visible
});

export const traerOpcionesFiltros = async () => {
    // 9: las dos peticiones salen al mismo tiempo, no una después de otra
    const [materiasRes, catalogosRes] = await Promise.all([
        api.get("/estudiante/materias"), // 10: materias del estudiante (catálogo por rol)
        api.get("/catalogos"),           // 11: horarios, modalidades, razones
    ]);

    // 12: /catalogos puede venir con o sin "data"; tomamos el objeto con las listas
    const catalogos = catalogosRes.data?.data ?? catalogosRes.data ?? {};

    return {
        materias: comoLista(materiasRes).map(aOpcion),
        horarios: (catalogos.horarios ?? []).map(aOpcion),
        modalidades: (catalogos.modalidades ?? []).map(aOpcion),
        razones: (catalogos.razones ?? []).map(aOpcion),
    };
};