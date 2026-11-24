import * as XLSX from 'xlsx';
import api from './api';

// Columnas de la plantilla (hoja "Asesores"), en este orden (el mismo del formulario de alta)
const COLUMNAS = ['nombre', 'apellido_paterno', 'apellido_materno', 'correo', 'numero_cuenta', 'num_cel', 'password'];

// Límites: el backend acepta hasta 1000 filas por validación y se crean de 25 en 25 (el hash de la contraseña tarda)
export const MAX_FILAS_CARGA_ASESORES = 1000;
const TAMANO_LOTE = 25;

// Lee la hoja "Asesores" (o la primera si no existe) y regresa las filas con datos como
// { fila (número de renglón en Excel), nombre, ..., password }. Lanza Error con un mensaje claro si no es la plantilla.
export const leerExcelAsesores = async (archivo) => {
  const libro = XLSX.read(await archivo.arrayBuffer(), { type: 'array' });
  const hoja = libro.Sheets.Asesores ?? libro.Sheets[libro.SheetNames[0]];
  // raw:false = todo llega como texto (así no se pierden ceros ni se vuelve número la cuenta)
  const matriz = XLSX.utils.sheet_to_json(hoja, { header: 1, raw: false, defval: '' });

  const encabezados = (matriz[0] ?? []).slice(0, COLUMNAS.length).map((c) => String(c).trim().toLowerCase());
  if (COLUMNAS.some((c, i) => encabezados[i] !== c)) {
    throw new Error(`El archivo no es la plantilla. Los encabezados deben ser: ${COLUMNAS.join(', ')}.`);
  }

  const filas = [];
  matriz.slice(1).forEach((renglon, i) => {
    const fila = { fila: i + 2 };
    COLUMNAS.forEach((c, j) => {
      fila[c] = String(renglon[j] ?? '').trim();
    });
    if (COLUMNAS.some((c) => fila[c] !== '')) filas.push(fila);
  });

  if (filas.length === 0) throw new Error('El archivo no tiene asesores.');
  if (filas.length > MAX_FILAS_CARGA_ASESORES) {
    throw new Error(`El archivo tiene ${filas.length} asesores; el máximo es ${MAX_FILAS_CARGA_ASESORES} por carga.`);
  }
  return filas;
};

// POST /admin/asesores-disciplinares/carga con confirmar:false. No crea nada: solo valida todo el archivo.
// Responde { total, validas, con_errores, filas: [{ fila, asesor, errores: [] }] } (solo las filas con error)
export const validarCargaAsesores = async (filas) => {
  const { data } = await api.post('/admin/asesores-disciplinares/carga', { filas, confirmar: false });
  return data.data;
};

// Crea los asesores de las filas, de 25 en 25. onProgreso(hechas, total) se llama después de cada lote.
// Regresa { creados, errores: [{ fila, asesor, errores }] } (errores = lo que falló al crear)
export const confirmarCargaAsesores = async (filas, onProgreso) => {
  let creados = 0;
  const errores = [];

  for (let i = 0; i < filas.length; i += TAMANO_LOTE) {
    const lote = filas.slice(i, i + TAMANO_LOTE);
    const { data } = await api.post('/admin/asesores-disciplinares/carga', { filas: lote, confirmar: true });
    creados += data.data.creados;
    errores.push(...data.data.filas);
    onProgreso?.(Math.min(i + TAMANO_LOTE, filas.length), filas.length);
  }

  return { creados, errores };
};
